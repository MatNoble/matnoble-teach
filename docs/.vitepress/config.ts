import { defineConfig } from "vitepress";
import webfontDl from "vite-plugin-webfont-dl";
import { genFeed } from "./genFeed";
import { VitePWA } from "vite-plugin-pwa";

const SITE_ORIGIN = "https://teach.matnoble.top";
const SITE_DESCRIPTION =
  "MatNoble 教学中心：大学数学（离散数学、高等数学、线性代数、经济数学）与工程计算精品课件、章节大纲、3D互动几何实验与课堂工具。";

const ROUTE_LABELS: Record<string, string> = {
  "courses": "课程中心",
  "courses/discrete-math-2026-fall": "离散数学 (2026秋季)",
  "courses/discrete-math-2026-spring": "离散数学 (2026春季归档)",
  "courses/java-programming-2026-fall": "Java程序设计 (2026秋季)",
  "courses/advanced-math-2-2026-spring": "高等数学(A)II (2026春季归档)",
  "courses/economic-math-2-2026-spring": "经济数学II (2026春季归档)",
  "courses/matlab": "MATLAB 编程与实践",
  "courses/matlab/basics": "MATLAB 基础与矩阵操作",
  "courses/matlab/conventions": "M 文件与函数规范",
  "courses/matlab/project-calculator": "矩阵计算器项目",
  "courses/matlab/project-gui": "GUI 矩阵计算器项目",
  "courses/matlab/project-cv": "电子时钟数码管识别",
  "teaching": "教学目录",
  "teaching/calculus": "微积分",
  "teaching/linear-algebra": "线性代数",
  "teaching/linear-algebra/cramers-rule": "克拉默法则",
  "teaching/linear-algebra/elementary-transformations": "初等变换",
  "teaching/linear-algebra/matrix-normal-form": "矩阵化简",
  "teaching/space-geometry-lab": "空间解析几何 3D 实验室",
  "tools": "数学工具",
  "tools/countdown": "课堂倒计时",
  "tools/di-method": "DI 表格积分法",
  "tools/memorize": "间隔重复记忆",
};

const REDIRECT_ROUTES = new Set([
  "/courses/discrete-math",
  "/courses/java-programming",
  "/courses/advanced-math-2",
  "/courses/economic-math-2",
]);

const DIRECTORY_ROUTES = new Set(["courses", "teaching", "tools"]);

function canonicalUrl(relativePath: string): string {
  if (relativePath === "index.md") return `${SITE_ORIGIN}/`;

  const withoutExtension = relativePath.replace(/\.md$/, "");
  if (withoutExtension.endsWith("/index")) {
    return `${SITE_ORIGIN}/${withoutExtension.replace(/index$/, "")}`;
  }

  return `${SITE_ORIGIN}/${withoutExtension}`;
}

function isIndexableUrl(url: string): boolean {
  const pathname = new URL(url, SITE_ORIGIN).pathname;
  return !(
    pathname === "/404" ||
    pathname === "/404.html" ||
    REDIRECT_ROUTES.has(pathname) ||
    pathname.startsWith("/agents/") ||
    pathname.startsWith("/public/") ||
    pathname.startsWith("/.well-known/")
  );
}

function routePath(relativePath: string): string {
  if (relativePath === "index.md") return "";

  const withoutExtension = relativePath.replace(/\.md$/, "");
  if (withoutExtension.endsWith("/index")) {
    return withoutExtension.replace(/\/index$/, "");
  }

  return withoutExtension;
}

function markdownMirrorUrl(relativePath: string): string {
  const route = routePath(relativePath);
  return `${SITE_ORIGIN}/.well-known/markdown/${route || "index"}.md`;
}

function breadcrumbItemUrl(route: string): string {
  const trailingSlash = DIRECTORY_ROUTES.has(route) ? "/" : "";
  return `${SITE_ORIGIN}/${route}${trailingSlash}`;
}

export default defineConfig({
  lang: "zh-CN",
  title: "MatNoble 教学中心",
  titleTemplate: ":title | MatNoble 教学中心",
  description: SITE_DESCRIPTION,

  markdown: {
    math: true,
  },

  router: {
    prefetchLinks: false,
  },

  buildEnd: genFeed,
  srcExclude: [
    "agents/**/*.md",
    "audits/**/*.md",
    "public/**/*.md",
    "superpowers/**/*.md",
  ],

  vite: {
    server: {
      proxy: {
        "^/(r2-assets)/.*": {
          target: "https://teach.matnoble.top",
          changeOrigin: true,
          headers: {
            Referer: "https://teach.matnoble.top",
            Origin: "https://teach.matnoble.top",
          },
        },
        "^/pdf/.*": {
          target: "https://teach.matnoble.top",
          changeOrigin: true,
          headers: {
            Referer: "https://teach.matnoble.top",
            Origin: "https://teach.matnoble.top",
          },
        },
      },
    },
    ssr: {
      noExternal: ["three", "@waline/client"],
    },
    optimizeDeps: {
      include: ["three", "medium-zoom", "video.js"],
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        external: [
          /^\/p\/.*/,
          /^\/pdf\/.*/,
          /^\/r2-assets\/.*/
        ],
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/three")) {
              return "vendor-three";
            }
            if (id.includes("node_modules/video.js") || id.includes("node_modules/videojs")) {
              return "vendor-videojs";
            }
            if (id.includes("node_modules/katex")) {
              return "vendor-katex";
            }
          }
        }
      }
    },
    plugins: [
      webfontDl([
        "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@400;500;600;700&display=swap",
      ]),
      VitePWA({
        outDir: ".vitepress/dist",
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "logo.svg", "apple-touch-icon.png", "icon-192.png", "icon-512.png"],
        manifest: {
          name: "MatNoble 教学中心",
          short_name: "MatNoble 教学",
          description: "大学数学与工程计算精品教学平台，包含离散数学、微积分等课程与讲义。",
          theme_color: "#ffffff",
          background_color: "#ffffff",
          display: "standalone",
          start_url: "/",
          icons: [
            {
              src: "/icon-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/icon-512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "/icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "/logo.svg",
              sizes: "any",
              type: "image/svg+xml",
              purpose: "any",
            },
          ],
          shortcuts: [
            {
              name: "课程中心",
              short_name: "课程",
              url: "/courses/",
              icons: [{ src: "/icon-192.png", sizes: "192x192" }],
            },
            {
              name: "教学讲义",
              short_name: "讲义",
              url: "/teaching/",
              icons: [{ src: "/icon-192.png", sizes: "192x192" }],
            },
            {
              name: "数学工具",
              short_name: "工具",
              url: "/tools/",
              icons: [{ src: "/icon-192.png", sizes: "192x192" }],
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
        workbox: {
          globPatterns: ["**/*.{css,js,html,svg,png,ico,txt,woff2}"],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "google-fonts-stylesheets",
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts-webfonts",
                cacheableResponse: { statuses: [0, 200] },
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
              },
            },
            {
              urlPattern: /^https:\/\/lf6-cdn-tos\.bytecdntp\.com\/.*/i,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "cdn-mathjax",
                cacheableResponse: { statuses: [0, 200] },
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
          ],
        },
      }),
    ],
  },

  sitemap: {
    hostname: SITE_ORIGIN,
    lastmodDateOnly: true,
    xmlns: {
      news: false,
      video: true,
      image: true,
      xhtml: true,
    },
    transformItems: (items) => {
      return items.filter((item) => isIndexableUrl(item.url));
    },
  },

  themeConfig: {
    siteTitle: false,
    nav: [
      { text: "课程中心", link: "/courses/" },
      { text: "教学讲义", link: "/teaching/" },
      { text: "数学工具", link: "/tools/" },
      { text: "主讲教师", link: "https://matnoble.top/about" },
      { text: "个人门户", link: "https://matnoble.top/" },
    ],

    sidebar: [],
    socialLinks: [],

    footer: {
      message: '<a href="https://matnoble.top/">个人门户</a> · <a href="/courses/">课程中心</a> · <a href="/teaching/">教学讲义</a> · <a href="/tools/">数学工具</a> · <a href="https://blog.matnoble.top">技术博客</a><br>以数学构建逻辑，用技术驱动学习。<br>主讲教师：<a href="https://matnoble.top/about">MatNoble</a> | Copyright © 2025-2026 MatNoble',
      copyright: "",
    },

    outline: {
      label: "本页目录",
      level: [2, 3],
    },
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "回到顶部",
    darkModeSwitchLabel: "外观",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",

    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },

    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: "搜索教学资源",
                buttonAriaLabel: "搜索教学资源",
              },
              modal: {
                noResultsText: "无法找到相关结果",
                resetButtonTitle: "清除查询条件",
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                  closeText: "关闭",
                },
              },
            },
          },
        },
      },
    },

    lastUpdated: {
      text: "最后更新于",
      formatOptions: {
        dateStyle: "full",
        timeStyle: "short",
      },
    },
  },

  lastUpdated: true,
  cleanUrls: true,

  transformHead: ({ pageData }) => {
    const url = canonicalUrl(pageData.relativePath);

    const siteTitle = "MatNoble 教学中心";
    const pageTitle = pageData.title;
    const title = pageTitle ? `${pageTitle} | ${siteTitle}` : siteTitle;

    const description = pageData.description || SITE_DESCRIPTION;

    const image = pageData.frontmatter.image || "/social-card.png";
    const imageUrl = image.startsWith("http")
      ? image
      : `https://teach.matnoble.top${image.startsWith('/') ? '' : '/'}${image}`;

    const schemas: any[] = [];

    // 1. BreadcrumbList Schema
    const breadcrumbs = [];
    breadcrumbs.push({
      "@type": "ListItem",
      "position": 1,
      "name": "教学首页",
      "item": "https://teach.matnoble.top/"
    });

    const pageRoutePath = routePath(pageData.relativePath);
    const pathSegments = pageRoutePath ? pageRoutePath.split("/") : [];
    if (pathSegments.length > 0) {
      pathSegments.forEach((segment, index) => {
        const currentRoute = pathSegments.slice(0, index + 1).join("/");
        const isLast = index === pathSegments.length - 1;
        const name =
          (isLast && pageData.frontmatter.breadcrumb) ||
          ROUTE_LABELS[currentRoute] ||
          segment.replace(/-/g, " ");
        breadcrumbs.push({
          "@type": "ListItem",
          "position": index + 2,
          "name": name,
          "item": breadcrumbItemUrl(currentRoute)
        });
      });
    }
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs
    });

    // 2. Course Schema
    if (pageData.frontmatter.structuredData?.course) {
      const course = pageData.frontmatter.structuredData.course;
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Course",
        "name": course.name,
        "description": course.description,
        "provider": {
          "@type": "Organization",
          "name": course.provider,
          "sameAs": "https://teach.matnoble.top"
        }
      });
    } else if (
      pageData.relativePath.startsWith("courses/") &&
      pageData.relativePath !== "courses/index.md" &&
      !REDIRECT_ROUTES.has("/" + pageData.relativePath.replace(/\.md$/, ""))
    ) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Course",
        "name": pageTitle || title,
        "description": description,
        "url": url,
        "inLanguage": "zh-CN",
        "provider": {
          "@type": "Person",
          "@id": "https://matnoble.top/#person",
          "name": "MatNoble",
          "sameAs": "https://matnoble.top"
        },
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "blended",
          "inLanguage": "zh-CN"
        }
      });
    }

    // 3. Dynamic Keywords & Robots handling
    const keywords = pageData.frontmatter.keywords || "大学数学, 离散数学, 微积分, 线性代数, 经济数学, 课件下载, MatNoble";
    const robots = pageData.frontmatter.robots || "index, follow, max-image-preview:large";

    return [
      ["link", { rel: "canonical", href: url }],
      ["link", { rel: "alternate", type: "text/markdown", href: markdownMirrorUrl(pageData.relativePath) }],
      ["meta", { name: "robots", content: robots }],
      ["meta", { name: "author", content: "MatNoble" }],
      ["meta", { name: "keywords", content: keywords }],
      // Open Graph
      ["meta", { property: "og:locale", content: "zh_CN" }],
      ["meta", { property: "og:url", content: url }],
      ["meta", { property: "og:title", content: title }],
      ["meta", { property: "og:description", content: description }],
      ["meta", { property: "og:image", content: imageUrl }],
      ["meta", { property: "og:image:width", content: "1200" }],
      ["meta", { property: "og:image:height", content: "630" }],
      ["meta", { property: "og:image:type", content: "image/png" }],
      // Twitter Card
      ["meta", { name: "twitter:url", content: url }],
      ["meta", { name: "twitter:title", content: title }],
      ["meta", { name: "twitter:description", content: description }],
      ["meta", { name: "twitter:image", content: imageUrl }],
      ["meta", { name: "twitter:card", content: "summary_large_image" }],
      ["meta", { name: "twitter:site", content: "@MatNoble" }],
      ["meta", { name: "twitter:creator", content: "@MatNoble" }],
      // JSON-LD Scripts
      ...schemas.map(schema => ["script", { type: "application/ld+json" }, JSON.stringify(schema)])
    ] as any;
  },

  head: [
    [
      "script",
      {},
      `window.MathJax = {
        options: { skipHtmlTags: ['script','noscript','style','textarea','pre'] },
        loader: { load: ['[tex]/physics'] },
        chtml: {
          scale: 1.15,
          minScale: 0.9,
          mtextInheritFont: true,
          merrorInheritFont: true,
          displayAlign: 'center',
          displayIndent: '0',
          fontURL: 'https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/mathjax/3.2.0/es5/output/chtml/fonts/stix2'
        },
        tex: {
          packages: {'[+]': ['physics']},
          inlineMath: [['$','$']],
          displayMath: [['$$','$$']],
          processEscapes: true
        }
      };`
    ],
    [
      "script",
      {
        id: "MathJax-script",
        async: "true",
        src: "https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/mathjax/3.2.0/es5/tex-mml-chtml.js",
      },
    ],
    ["link", { rel: "icon", href: "/logo.svg", type: "image/svg+xml" }],
    ["link", { rel: "alternate icon", href: "/favicon.ico" }],
    ["link", { rel: "apple-touch-icon", href: "/apple-touch-icon.png" }],
    ["link", { rel: "manifest", href: "/manifest.webmanifest" }],
    ["meta", { name: "theme-color", media: "(prefers-color-scheme: light)", content: "#ffffff" }],
    ["meta", { name: "theme-color", media: "(prefers-color-scheme: dark)", content: "#121214" }],
    ["meta", { name: "mobile-web-app-capable", content: "yes" }],
    ["meta", { name: "apple-mobile-web-app-status-bar-style", content: "default" }],
    ['meta', { name: 'referrer', content: 'strict-origin-when-cross-origin' }],
    ["meta", { property: "og:site_name", content: "MatNoble 教学中心" }],
    ["meta", { property: "og:type", content: "website" }],
    [
      "script",
      { type: "application/ld+json" },
      JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "EducationalOrganization",
            "@id": "https://teach.matnoble.top/#organization",
            "name": "MatNoble 教学中心",
            "url": "https://teach.matnoble.top",
            "logo": "https://teach.matnoble.top/logo.svg",
            "parentOrganization": {
              "@type": "EducationalOrganization",
              "@id": "https://matnoble.top/#organization",
              "name": "MatNoble",
              "url": "https://matnoble.top"
            },
            "founder": {
              "@type": "Person",
              "@id": "https://matnoble.top/#person",
              "name": "MatNoble",
              "jobTitle": "University Mathematics Lecturer",
              "url": "https://matnoble.top/about"
            },
            "sameAs": [
              "https://matnoble.top",
              "https://blog.matnoble.top",
              "https://speak.matnoble.top",
              "https://album.matnoble.top",
              "https://github.com/matnoble"
            ]
          },
          {
            "@type": "WebSite",
            "@id": "https://teach.matnoble.top/#website",
            "url": "https://teach.matnoble.top",
            "name": "MatNoble 教学中心",
            "description": SITE_DESCRIPTION,
            "publisher": { "@id": "https://matnoble.top/#person" },
            "inLanguage": "zh-CN"
          }
        ]
      })
    ],
  ],
});
