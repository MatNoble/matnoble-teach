# Java 课堂实践代码挖空系统实现计划 (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建 Java 课堂实践代码挖空生成系统，支持从本地 Java 源码自动提取挖空模板与预期终端输出，并在 VitePress 教学站以高质感 `PracticeCard.vue` 呈现，且与 PDF 课件发布状态保持同步。

**Architecture:** 
采用“源码单源注释标记 -> Node.js 提取生成器 -> VitePress Markdown 与 Vue 交互卡片”的数据流架构。源码中通过 `// <BLANK: hint>` 标记挖空核心、通过 `// <OUTPUT>` 标记终端预期输出；Node.js 脚本一键解析并生成各讲独立 Markdown 页面；前端使用具有现代暗黑质感的 `PracticeCard.vue` 提供一键复制模板到本地 IDE、Mac 仿真终端输出比对，网页端无参考答案。

**Tech Stack:** 
Node.js (ESM, `node:test`, `node:fs`), VitePress 1.x, Vue 3, Clipboard API, CSS 磨砂暗黑微光设计。

## Global Constraints

- **Git 规范**: 禁止在未得到用户明确指令的情况下执行 `git add`、`git commit` 或 `git push`。
- **无答案策略**: 网页端绝不渲染或包含参考答案，保留课堂现场演示空间。
- **发布同步**: 课堂实操入口只对已发布 PDF 的讲座开放，未发布讲座显示 `待开放 🔒`。
- **源码单源**: 原始 Java 文件必须保持本地可直接编译运行的能力，不破坏原有类结构与测试。
- **默认源码路径**: `/Users/matnoble/Documents/JG/02 PPT/Java程序设计/tex-university/code`。

---

### Task 1: 编写 Java 源码解析器模块与单元测试

**Files:**
- Create: `scripts/java-practice-parser.mjs`
- Test: `tests/java-practice-parser.test.mjs`

**Interfaces:**
- Produces: `parseJavaPracticeFile(fileContent, options)`
  - Input: `fileContent: string`, `options?: { className?: string }`
  - Output: `{ isTask: boolean, taskNo: number, title: string, description: string, templateCode: string, outputText: string, className: string }`

- [x] **Step 1: 编写失败的单元测试**

新建 `tests/java-practice-parser.test.mjs`，覆盖任务标题提取、Javadoc 描述提取、`<BLANK>` 替换为 TODO 模板、以及 `<OUTPUT>` 提取。

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseJavaPracticeFile } from '../scripts/java-practice-parser.mjs';

const sampleJava = `/**
 * 随堂实操任务 2：华氏度与摄氏度双向温度换算器
 * 公式: C = (F - 32) * 5 / 9
 * @author MatNoble
 */
public class TemperatureConverter {
    public static void main(String[] args) {
        double celsius = 26.5;
        // <BLANK: 摄氏度转华氏度 (注意必须使用浮点数除法 9.0 / 5.0)>
        double fahrenheit = celsius * 9.0 / 5.0 + 32.0;
        // </BLANK>
        System.out.printf("%.2f ℃\\n", celsius);
    }
}
// <OUTPUT>
// 26.50 ℃
// </OUTPUT>
`;

test('parseJavaPracticeFile correctly extracts metadata and blanks', () => {
  const result = parseJavaPracticeFile(sampleJava, { className: 'TemperatureConverter' });
  assert.equal(result.isTask, true);
  assert.equal(result.taskNo, 2);
  assert.equal(result.title, '华氏度与摄氏度双向温度换算器');
  assert.match(result.templateCode, /TODO: 【实操任务 2】/);
  assert.match(result.templateCode, /摄氏度转华氏度/);
  assert.equal(result.templateCode.includes('celsius * 9.0 / 5.0 + 32.0'), false);
  assert.equal(result.outputText.trim(), '26.50 ℃');
});
```

- [x] **Step 2: 运行测试并验证失败**

运行：`node --test tests/java-practice-parser.test.mjs`
预期结果：FAIL（模块 `java-practice-parser.mjs` 尚不存在）。

- [x] **Step 3: 实现解析器逻辑**

新建 `scripts/java-practice-parser.mjs`：

```javascript
/**
 * 解析单个 Java 文件中的实操任务、挖空标记与输出
 */
export function parseJavaPracticeFile(fileContent, options = {}) {
  const className = options.className || '';
  
  // 1. 匹配 Javadoc 中的任务信息：随堂实操任务 X：任务名称
  const taskRegex = /随堂实操任务\s*([0-9]+)\s*[：:]\s*([^\n\r*]+)/;
  const taskMatch = fileContent.match(taskRegex);
  
  const hasBlankTag = fileContent.includes('<BLANK');
  const isTask = Boolean(taskMatch || hasBlankTag);
  if (!isTask) {
    return { isTask: false };
  }

  const taskNo = taskMatch ? parseInt(taskMatch[1], 10) : 1;
  const title = taskMatch ? taskMatch[2].trim() : '随堂实践任务';

  // 2. 提取 <OUTPUT> ... </OUTPUT>
  let outputText = '';
  const outputRegex = /\/\/\s*<OUTPUT>([\s\S]*?)\/\/\s*<\/OUTPUT>/;
  const outputMatch = fileContent.match(outputRegex);
  if (outputMatch) {
    outputText = outputMatch[1]
      .split('\n')
      .map(line => line.replace(/^\s*\/\/\s?/, ''))
      .join('\n')
      .trim();
  }

  // 3. 处理 <BLANK: hint> ... </BLANK>
  let blankIndex = 1;
  let templateCode = fileContent
    .replace(outputRegex, '') // 模板代码中剥离 <OUTPUT> 注释块
    .replace(/\/\/\s*<BLANK(?::\s*([^>]+))?>([\s\S]*?)\/\/\s*<\/BLANK>/g, (match, hint) => {
      const hintText = hint ? hint.trim() : '请补全此处核心逻辑';
      const prompt = `        // ===== TODO: 【实操任务 ${taskNo} - 挖空 ${blankIndex++}】 =====\n        // 提示: ${hintText}\n        // \n        // ============================================`;
      return prompt;
    });

  return {
    isTask: true,
    taskNo,
    title,
    className,
    templateCode: templateCode.trim(),
    outputText
  };
}
```

- [x] **Step 4: 运行测试并验证通过**

运行：`node --test tests/java-practice-parser.test.mjs`
预期结果：PASS。

---

### Task 2: 编写多讲自动扫描与 Markdown 批量生成脚本

**Files:**
- Create: `scripts/sync-java-practice.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `parseJavaPracticeFile` from `scripts/java-practice-parser.mjs`
- Produces: Markdown files under `docs/courses/java-programming-2026-fall/practice/lecXX.md`

- [x] **Step 1: 编写 `sync-java-practice.mjs`**

脚本需要遍历 `/Users/matnoble/Documents/JG/02 PPT/Java程序设计/tex-university/code` 下的所有 `lec01` ~ `lec24` 文件夹，解析其中的 `.java` 文件，并将实操卡片写入对应的 `lecXX.md`。

```javascript
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseJavaPracticeFile } from './java-practice-parser.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const DEFAULT_CODE_DIR = '/Users/matnoble/Documents/JG/02 PPT/Java程序设计/tex-university/code';
const CODE_DIR = process.env.JAVA_CODE_DIR || DEFAULT_CODE_DIR;
const TARGET_DIR = path.resolve(ROOT_DIR, 'docs/courses/java-programming-2026-fall/practice');

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

export function generateLecturePracticeMarkdown(lecName, tasks) {
  const lecNum = parseInt(lecName.replace('lec', ''), 10);
  
  let md = `---
layout: doc
title: 第 ${lecNum} 讲 课堂实操任务
breadcrumb: 课堂实操 (第 ${lecNum} 讲)
---

<script setup>
import PracticeCard from '@components/PracticeCard.vue';
</script>

# 随堂实操任务清单 <span class="subtitle">第 ${lecNum} 讲</span>

> 💡 **操作指南**：点击每个任务右上角的 **“复制模板代码 📋”**，在您的 IDE（IntelliJ IDEA / VS Code）中打开对应类文件并补全核心代码。运行结果请参考下方的 **“预期控制台输出”** 进行自测比对。

[← 返回《Java程序设计》大纲](/courses/java-programming-2026-fall)

---

`;

  for (const task of tasks) {
    const safeTemplate = JSON.stringify(task.templateCode);
    const safeOutput = JSON.stringify(task.outputText || '');
    const safeTitle = JSON.stringify(task.title);
    const safeClassName = JSON.stringify(task.className);

    md += `<PracticeCard
  :task-no="${task.taskNo}"
  :title="${safeTitle}"
  :class-name="${safeClassName}"
  :template-code="${safeTemplate}"
  :output-text="${safeOutput}"
/>\n\n`;
  }

  return md;
}

export async function runSync() {
  if (!fs.existsSync(CODE_DIR)) {
    console.warn(`[sync:java] 警告: 源码目录不存在: ${CODE_DIR}，跳过同步。`);
    return;
  }

  const entries = fs.readdirSync(CODE_DIR, { withFileTypes: true });
  const lecDirs = entries
    .filter(e => e.isDirectory() && /^lec\d+$/i.test(e.name))
    .map(e => e.name)
    .sort();

  console.log(`[sync:java] 发现 ${lecDirs.length} 个讲座目录...`);

  let totalTasks = 0;
  for (const lec of lecDirs) {
    const lecPath = path.join(CODE_DIR, lec);
    const files = fs.readdirSync(lecPath).filter(f => f.endsWith('.java'));
    const tasks = [];

    for (const file of files) {
      const filePath = path.join(lecPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = parseJavaPracticeFile(content, { className: file });
      if (parsed.isTask) {
        tasks.push(parsed);
      }
    }

    if (tasks.length > 0) {
      tasks.sort((a, b) => a.taskNo - b.taskNo);
      const mdContent = generateLecturePracticeMarkdown(lec, tasks);
      const outFile = path.join(TARGET_DIR, `${lec}.md`);
      fs.writeFileSync(outFile, mdContent, 'utf-8');
      console.log(`[sync:java] 已生成 ${lec}.md (${tasks.length} 个实操任务)`);
      totalTasks += tasks.length;
    }
  }

  console.log(`[sync:java] 同步完成，共生成 ${totalTasks} 个实操任务！`);
}

if (process.argv[1] === __filename) {
  runSync();
}
```

- [x] **Step 2: 在 `package.json` 中配置快捷命令**

在 `scripts` 中增加 `"sync:java": "node scripts/sync-java-practice.mjs"`，并将 `npm run docs:markdown` 联动执行 `node scripts/sync-java-practice.mjs`。

- [x] **Step 3: 运行并验证脚本执行**

运行：`node scripts/sync-java-practice.mjs`
预期结果：输出 `[sync:java] 发现 24 个讲座目录...` 并成功生成有任务的 Markdown 文件。

---

### Task 3: 构建现代高质感前端组件 `PracticeCard.vue`

**Files:**
- Create: `docs/components/PracticeCard.vue`

**Interfaces:**
- Props:
  - `taskNo`: number
  - `title`: string
  - `className`: string
  - `templateCode`: string
  - `outputText`: string

- [ ] **Step 1: 编写 `PracticeCard.vue` 实现**

组件采用暗黑磨砂玻璃质感、Mac 终端仿真、以及 Clipboard 复制并伴随状态切换反馈。

```vue
<template>
  <div class="practice-card">
    <!-- Header -->
    <div class="card-header">
      <div class="header-left">
        <span class="task-badge">随堂实操 {{ taskNo }}</span>
        <h3 class="task-title">{{ title }}</h3>
        <span v-if="className" class="class-tag">{{ className }}</span>
      </div>
      <div class="header-right">
        <button class="btn-copy" @click="copyTemplate" :class="{ copied: isCopied }">
          <span v-if="isCopied">已复制 ✅</span>
          <span v-else>复制模板代码 📋</span>
        </button>
      </div>
    </div>

    <!-- Code Block with TODO guidance -->
    <div class="code-container">
      <div class="code-toolbar">
        <span class="toolbar-title">Java 模板代码 (留空待补全)</span>
      </div>
      <pre class="code-pre"><code>{{ templateCode }}</code></pre>
    </div>

    <!-- Mac Terminal Simulation (Expected Output) -->
    <div v-if="outputText" class="terminal-container">
      <div class="terminal-bar">
        <div class="mac-dots">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <div class="terminal-title">bash — java {{ className ? className.replace('.java', '') : 'Main' }} (预期控制台输出)</div>
      </div>
      <pre class="terminal-body">{{ outputText }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  taskNo: { type: Number, default: 1 },
  title: { type: String, required: true },
  className: { type: String, default: '' },
  templateCode: { type: String, required: true },
  outputText: { type: String, default: '' }
});

const isCopied = ref(false);

async function copyTemplate() {
  try {
    await navigator.clipboard.writeText(props.templateCode);
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error('复制失败:', err);
  }
}
</script>

<style scoped>
.practice-card {
  margin: 2rem 0;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: var(--vp-c-bg-mute);
  border-bottom: 1px solid var(--vp-c-divider);
  flex-wrap: wrap;
  gap: 0.75rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.task-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  background: #3b82f6;
  color: #fff;
  letter-spacing: 0.5px;
}

.task-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.class-tag {
  font-family: var(--vp-font-family-mono);
  font-size: 0.78rem;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.btn-copy {
  display: inline-flex;
  align-items: center;
  font-size: 0.82rem;
  font-weight: 500;
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-copy:hover {
  background: var(--vp-c-brand);
  color: #fff;
}

.btn-copy.copied {
  border-color: #10b981;
  background: #10b981;
  color: #fff;
}

.code-container {
  background: #1e1e2e;
  border-bottom: 1px solid var(--vp-c-divider);
}

.code-toolbar {
  padding: 0.4rem 1rem;
  font-size: 0.75rem;
  color: #a6adc8;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.code-pre {
  margin: 0;
  padding: 1rem 1.25rem;
  overflow-x: auto;
  color: #cdd6f4;
  font-family: var(--vp-font-family-mono);
  font-size: 0.88rem;
  line-height: 1.6;
}

.terminal-container {
  background: #11111b;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.terminal-bar {
  display: flex;
  align-items: center;
  padding: 0.45rem 0.9rem;
  background: #181825;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
}

.mac-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot-red { background: #ff5f56; }
.dot-yellow { background: #ffbd2e; }
.dot-green { background: #27c93f; }

.terminal-title {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.75rem;
  font-family: var(--vp-font-family-mono);
  color: #9399b2;
  pointer-events: none;
}

.terminal-body {
  margin: 0;
  padding: 0.9rem 1.25rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.84rem;
  line-height: 1.5;
  color: #a6e3a1;
  overflow-x: auto;
  white-space: pre-wrap;
}
</style>
```

---

### Task 4: 更新主大纲表格 (`docs/courses/java-programming-2026-fall.md`)

**Files:**
- Modify: `docs/courses/java-programming-2026-fall.md`

- [ ] **Step 1: 添加课堂实操列与状态控制**

在 `docs/courses/java-programming-2026-fall.md` 中：
1. 第一篇（已开放）对应行增加实操跳转按钮：
   - 比如 `lec01` ~ `lec08`：`[实操 💻](/courses/java-programming-2026-fall/practice/lec01)`
2. 第二篇至第四篇（未开放）对应行保留 `<span class="btn-lock">待开放 🔒</span>`。

- [ ] **Step 2: 添加相关样式支持**

确保 `.btn-practice` / `.btn-lock` 在大纲表格中排版对称工整。

---

### Task 5: 在 Java 源码中配置实操标记并全流程构建自检

**Files:**
- Modify: `/Users/matnoble/Documents/JG/02 PPT/Java程序设计/tex-university/code/lec01/CommWelcome.java`
- Modify: `/Users/matnoble/Documents/JG/02 PPT/Java程序设计/tex-university/code/lec02/TemperatureConverter.java`
- Modify: `/Users/matnoble/Documents/JG/02 PPT/Java程序设计/tex-university/code/lec04/DiscountCalculator.java`

- [ ] **Step 1: 在第一篇代表性文件中添加 `<BLANK>` 与 `<OUTPUT>` 标记**

以 `lec02/TemperatureConverter.java` 为例，标记摄氏度转华氏度公式及预期输出。

- [ ] **Step 2: 运行同步生成命令**

运行：`npm run sync:java`
验证 `docs/courses/java-programming-2026-fall/practice/` 下对应文件的生成情况。

- [ ] **Step 3: 运行全站构建验证**

运行：`npm run docs:build`
确保无 TypeScript/VitePress 打包警告与路由丢失错误。
