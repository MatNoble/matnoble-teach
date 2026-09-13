# MatNoble Teach (教学站)

![VitePress](https://img.shields.io/badge/VitePress-1.0-646CFF?style=flat&logo=vite&logoColor=white)
![Cloudflare Pages](https://img.shields.io/badge/Deployment-Cloudflare%20Pages-F38020?style=flat&logo=cloudflare&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-Passing-success?style=flat&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

> **Mathematics as the Core. Education as the Mission.**
> 专注于大学数学与计算机专业课程教学、互动课件、实验平台与备考工具。

This is the source code for the academic teaching platform of **MatNoble** ([teach.matnoble.top](https://teach.matnoble.top)).

## ✨ Features

### 🎓 Courses & Educational Resources
- **Advanced Mathematics (高等数学 / 微积分)**: 课件精讲、万能微分公式法、微分积分直观解析、期末复习汇总。
- **Linear Algebra (线性代数)**: 初等变换法、克莱姆法则、二次型与矩阵标准形。
- **Discrete Mathematics (离散数学)**: 命题逻辑、图论导论、代数结构。
- **Java Programming (Java 程序设计)**: 实验大纲、课后实战与填空练习自动同步系统。
- **MATLAB Scientific Computing**: 科学计算、数据可视化与图形界面开发。

### 🛠️ Interactive Teaching Tools
- **Elementary Functions Lab**: 初等函数图形与性质交互实验室（支持参数动态调节）。
- **Space Geometry Lab**: 3D 空间解析几何实验室（基于 Three.js）。
- **DI-Method Tool**: 微积分分部积分表格法（DI Method）自动化交互求解。
- **Memorize Assistant**: 数学公式记忆助手与间隔重复复习。

### 🔄 Reactive Engagement & Shared Theme
- **Reactive Social Sharing**: 基于 `useShare` composable 的客户端响应式分享，彻底解决 SPA 单页切换后分享链接滞后问题。
- **Waline Comments**: 针对课程与工具页面的实时互动讨论，路由切换时自动刷新上下文。
- **Cross-Repository Theme Synchronization**: 与主站 `matnoble-portal` 保持共享组件与样式绝对一致（`scripts/sync-shared-theme.mjs`）。

## 🛠️ Tech Stack

- **Framework**: [VitePress](https://vitepress.dev/) (Vue 3 + Vite)
- **Math Rendering**: KaTeX + MathJax 3
- **3D Graphics**: Three.js
- **Styling**: Custom CSS variables + CSS3 Transitions
- **Deployment**: Cloudflare Pages

## 🚀 Local Development & Scripts

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run docs:dev
   ```
   Access at `http://localhost:5174`. Includes built-in RSS middleware.

3. **Run automated tests**:
   ```bash
   npm test
   ```
   Runs unit tests and validates shared theme synchronization with `matnoble-portal`.

4. **Theme synchronization**:
   ```bash
   # Check if shared theme components match matnoble-portal
   npm run check:theme

   # Bi-directionally synchronize newer theme files
   npm run sync:theme
   ```

5. **Sync Java practice labs**:
   ```bash
   npm run sync:java
   ```

6. **Build for production**:
   ```bash
   npm run docs:build
   ```

## 📂 Project Structure

```text
matnoble-teach/
├── docs/
│   ├── .vitepress/
│   │   ├── config.ts       # Main configuration (SEO, Head, Nav, dev middleware)
│   │   ├── genFeed.ts      # RSS & Atom feed generator
│   │   └── theme/          # Custom theme customization
│   │       ├── components/ # Vue components (Logo, Share, Comment, FollowSection)
│   │       ├── composables/# Shared composables (useShare.ts)
│   │       └── styles/     # Global styles & variables (base.css, custom.css)
│   ├── courses/            # Courseware (Calculus, Linear Algebra, Discrete Math, Java, MATLAB)
│   ├── teaching/           # Pedagogical methods and notes
│   ├── tools/              # Interactive educational tools (3D Lab, DI-Method, Functions)
│   ├── public/             # Static assets
│   └── index.md            # Teaching hub home page
├── functions/              # Cloudflare Pages Functions
├── scripts/                # Sync & automation scripts (sync-shared-theme.mjs, sync-java-practice.mjs)
├── tests/                  # Automated tests (theme sync tests, etc.)
├── AGENTS.md               # AI coding assistant guidelines & workflows
├── package.json
└── wrangler.jsonc
```

## ✉️ Contact

- **Email**: [me@matnoble.top](mailto:me@matnoble.top)
- **GitHub**: [matnoble](https://github.com/matnoble)
- **Website**: [teach.matnoble.top](https://teach.matnoble.top)

## 📄 License

MIT © [MatNoble](https://github.com/matnoble)
