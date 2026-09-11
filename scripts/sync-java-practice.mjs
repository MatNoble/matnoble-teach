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

/**
 * 经典从基础演练到综合实操的预定义推荐顺序表
 */
export const LECTURE_ORDER = {
  lec01: ['HelloWorld.java', 'ArgsDemo.java', 'CommWelcome.java'],
  lec02: ['DataTypeRangeDemo.java', 'TypeCastDemo.java', 'TemperatureConverter.java'],
  lec03: ['ScannerTrapDemo.java', 'RobustInputDemo.java', 'GradeEvaluationSystem.java'],
  lec04: ['BitmaskDemo.java', 'ModernSwitchDemo.java', 'DiscountCalculator.java'],
  lec05: ['MultiplicationTable.java', 'PrimeSieveDemo.java', 'NumberGuessGame.java'],
  lec06: ['ValuePassDemo.java', 'MethodOverloadDemo.java', 'RecursionDemo.java'],
  lec07: ['ArrayMemoryDemo.java', 'MatrixTransposeDemo.java', 'ScoreStatistics.java'],
  lec08: ['ArrayListDemo.java', 'BubbleSortDemo.java', 'StudentRosterManager.java']
};

/**
 * 对单讲内的实操任务进行排序
 * 排序逻辑：
 * 1. 优先遵循经典从基础演练到综合实操的合理顺序表；
 * 2. 若双方都有明确的 rawTaskNo 且不相同时，按明确任务编号升序排序；
 * 3. 基础演示（无挖空标记）排在前面，综合实操（有挖空标记）排在后面；
 * 4. 其它情况按文件名进行自然升序排序。
 *
 * @param {string} lec - 讲座标识（如 lec01）
 * @param {Array<object>} tasks - 任务列表
 * @returns {Array<object>} 排序后的任务列表
 */
export function sortLectureTasks(lec, tasks) {
  const orderList = LECTURE_ORDER[lec.toLowerCase()];

  return [...tasks].sort((a, b) => {
    // 1. 如果都在预定义经典顺序表中，按经典顺序排序
    if (orderList) {
      const idxA = orderList.indexOf(a.fileName || a.className);
      const idxB = orderList.indexOf(b.fileName || b.className);
      if (idxA !== -1 && idxB !== -1) {
        return idxA - idxB;
      }
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
    }

    // 2. 若有明确任务编号且不相同时，按任务编号排序
    if (a.rawTaskNo && b.rawTaskNo && a.rawTaskNo !== b.rawTaskNo) {
      return a.rawTaskNo - b.rawTaskNo;
    }

    // 3. 从基础演练到综合实操：无挖空的基础演示排前，有挖空的综合实操排后
    if (Boolean(a.hasBlank) !== Boolean(b.hasBlank)) {
      return a.hasBlank ? 1 : -1;
    }

    // 4. 自然排序（按文件名）
    const nameA = a.fileName || a.className || '';
    const nameB = b.fileName || b.className || '';
    return nameA.localeCompare(nameB, undefined, { numeric: true });
  });
}

/**
 * 对 HTML 属性值进行实体转义，并将换行符转为数值字符引用以避免 CommonMark HTML 块提前闭合
 *
 * @param {string} str - 原始字符串
 * @returns {string} 安全的 HTML 属性值
 */
export function escapeHtmlAttr(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '&#10;')
    .replace(/\r/g, '&#13;');
}

/**
 * 为单讲实操任务生成 Markdown 文档内容
 *
 * @param {string} lecName - 讲座目录名（如 lec01）
 * @param {Array<object>} tasks - 已解析、排序并重新编号的任务列表
 * @returns {string} Markdown 文本
 */
export function generateLecturePracticeMarkdown(lecName, tasks) {
  const lecNum = parseInt(lecName.replace(/[^0-9]/g, ''), 10);

  let md = `---
layout: doc
title: 第 ${lecNum} 讲 课堂实操任务
breadcrumb: 课堂实操 (第 ${lecNum} 讲)
---

# 随堂实操任务清单 <span class="subtitle">第 ${lecNum} 讲</span>

> 💡 **操作指南**：点击每个任务右上角的 **“复制模板代码 📋”**，在您的 IDE（IntelliJ IDEA / VS Code）中打开对应类文件并补全核心代码。运行结果请参考下方的 **“预期控制台输出”** 进行自测比对。

[← 返回《Java程序设计》大纲](/courses/java-programming-2026-fall)

---

`;

  for (const task of tasks) {
    const safeTitle = escapeHtmlAttr(task.title);
    const safeClassName = escapeHtmlAttr(task.className);
    const safeTemplate = escapeHtmlAttr(task.templateCode);
    const safeOutput = escapeHtmlAttr(task.outputText || '');

    md += `<PracticeCard
  :task-no="${task.taskNo}"
  title="${safeTitle}"
  class-name="${safeClassName}"
  template-code="${safeTemplate}"
  output-text="${safeOutput}"
>

\`\`\`java
${task.templateCode}
\`\`\`

</PracticeCard>\n\n`;
  }

  return md;
}

/**
 * 执行全量扫描与 Markdown 批量生成
 *
 * @param {string} [codeDirOverride] - 可选的源码目录覆盖（便于测试）
 * @param {string} [targetDirOverride] - 可选的目标生成目录覆盖（便于测试）
 * @returns {Promise<{ totalTasks: number, generatedFiles: string[] }>} 同步统计结果
 */
export async function runSync(codeDirOverride, targetDirOverride) {
  const scanDir = codeDirOverride || process.env.JAVA_CODE_DIR || CODE_DIR;
  const outDir = targetDirOverride || TARGET_DIR;

  if (!fs.existsSync(scanDir)) {
    console.warn(`[sync:java] 警告: 源码目录不存在: ${scanDir}，跳过同步。`);
    return { totalTasks: 0, generatedFiles: [] };
  }

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 获取有效讲座目录
  // 若 targetDirOverride 存在（测试环境），扫描所有 lecXX 目录；
  // 若为生产环境，从大纲 docs/courses/java-programming-2026-fall.md 读取当前已开放实操的讲座（如 lec01~lec08）
  const activeLecs = new Set();
  const syllabusPath = path.resolve(ROOT_DIR, 'docs/courses/java-programming-2026-fall.md');
  if (!targetDirOverride && fs.existsSync(syllabusPath)) {
    const syllabusContent = fs.readFileSync(syllabusPath, 'utf-8');
    const matches = syllabusContent.matchAll(/practice:\s*['"](lec\d+)['"]/g);
    for (const m of matches) {
      activeLecs.add(m[1].toLowerCase());
    }
  }

  const entries = fs.readdirSync(scanDir, { withFileTypes: true });
  const lecDirs = entries
    .filter(e => {
      if (!e.isDirectory() || !/^lec\d+$/i.test(e.name)) return false;
      if (activeLecs.size > 0 && !activeLecs.has(e.name.toLowerCase())) {
        return false;
      }
      return true;
    })
    .map(e => e.name)
    .sort((a, b) => {
      const numA = parseInt(a.replace(/[^0-9]/g, ''), 10);
      const numB = parseInt(b.replace(/[^0-9]/g, ''), 10);
      return numA - numB;
    });

  console.log(`[sync:java] 发现 ${lecDirs.length} 个讲座目录...`);

  let totalTasks = 0;
  const generatedFiles = [];

  for (const lec of lecDirs) {
    const lecPath = path.join(scanDir, lec);
    const files = fs.readdirSync(lecPath)
      .filter(f => f.endsWith('.java'))
      .sort();

    const tasks = [];

    for (const file of files) {
      const filePath = path.join(lecPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = parseJavaPracticeFile(content, { className: file });
      if (parsed.isTask) {
        parsed.fileName = file;
        tasks.push(parsed);
      }
    }

    if (tasks.length > 0) {
      // 1. 讲内实操排序
      const sortedTasks = sortLectureTasks(lec, tasks);

      // 2. 该讲内实操任务顺次重新编号 (1, 2, 3...)
      sortedTasks.forEach((task, index) => {
        const newTaskNo = index + 1;
        task.taskNo = newTaskNo;
        // 同步更新模板中的 TODO 编号提示
        task.templateCode = task.templateCode.replace(/【实操任务 \d+/g, `【实操任务 ${newTaskNo}`);
      });

      const mdContent = generateLecturePracticeMarkdown(lec, sortedTasks);
      const outFile = path.join(outDir, `${lec}.md`);
      fs.writeFileSync(outFile, mdContent, 'utf-8');
      console.log(`[sync:java] 已生成 ${lec}.md (${sortedTasks.length} 个实操任务)`);
      totalTasks += sortedTasks.length;
      generatedFiles.push(`${lec}.md`);
    }
  }

  console.log(`[sync:java] 同步完成，共生成 ${totalTasks} 个实操任务！`);
  return { totalTasks, generatedFiles };
}

if (process.argv[1] === __filename) {
  runSync();
}
