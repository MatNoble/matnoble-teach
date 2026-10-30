import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import type { SiteConfig } from 'vitepress'

// 课件 PDF 的两种来源，VitePress 自带的 sitemap 都覆盖不到：
// 1. 存放在 R2、经 functions/pdf 伺服的课件：课程页在 <script setup> 中以
//    `CDN_BASE + '/x.pdf'` 的形式拼接链接，只能从 Markdown 源码里提取；
// 2. docs/public 下的静态 PDF（如 downloads/）：构建后会原样拷入 outDir，可直接扫描产物。
// 两者合并去重后生成独立的 sitemap-pdf.xml，并在 robots.txt 中引用。
//
// 不写 <lastmod>：R2 文件与 CI 检出时间都不是内容更新时间，
// 写一个编造的日期比不写更糟（搜索引擎会逐渐不信任该站点的 lastmod）。

const SITE_ORIGIN = 'https://teach.matnoble.top'

function walkFiles(dir: string, ext: string, out: string[] = []): string[] {
  let entries
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.vitepress') continue
      walkFiles(full, ext, out)
    } else if (entry.isFile() && entry.name.endsWith(ext)) {
      out.push(full)
    }
  }
  return out
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function collectR2PdfPaths(srcDir: string): Set<string> {
  const pdfPaths = new Set<string>()
  for (const file of walkFiles(srcDir, '.md')) {
    // 先剥掉 HTML 注释，避免把已注释下线的课件行扫进来
    const content = readFileSync(file, 'utf-8').replace(/<!--[\s\S]*?-->/g, '')

    // 形式一：CDN_BASE + '/1-1_sequence_limits.pdf'（同一文件只允许一个 CDN_BASE）
    const bases = [...new Set([...content.matchAll(/CDN_BASE\s*=\s*'([^']+)'/g)].map((m) => m[1]))]
    if (bases.length === 1) {
      for (const m of content.matchAll(/CDN_BASE\s*\+\s*'(\/[^']+\.pdf)'/g)) {
        pdfPaths.add(bases[0] + m[1])
      }
    }

    // 形式二：直接写死的 /pdf/ 绝对路径字面量
    for (const m of content.matchAll(/['"(](\/pdf\/[^'")\s]+\.pdf)/g)) {
      pdfPaths.add(m[1])
    }
  }
  return pdfPaths
}

function collectStaticPdfPaths(outDir: string): Set<string> {
  const pdfPaths = new Set<string>()
  for (const file of walkFiles(outDir, '.pdf')) {
    const rel = path.relative(outDir, file).split(path.sep).join('/')
    pdfPaths.add('/' + rel)
  }
  return pdfPaths
}

export async function genPdfSitemap(config: SiteConfig) {
  const pdfPaths = new Set<string>([
    ...collectR2PdfPaths(config.srcDir),
    ...collectStaticPdfPaths(config.outDir)
  ])

  const urls = [...pdfPaths].sort()
  const body = urls
    .map((p) => `  <url><loc>${escapeXml(SITE_ORIGIN + encodeURI(p))}</loc></url>`)
    .join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`

  writeFileSync(path.join(config.outDir, 'sitemap-pdf.xml'), xml)
  console.log(`[sitemap-pdf] wrote ${urls.length} PDF URLs to sitemap-pdf.xml`)
}
