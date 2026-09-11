import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {
  generateLecturePracticeMarkdown,
  sortLectureTasks,
  runSync,
  LECTURE_ORDER
} from '../scripts/sync-java-practice.mjs';

test('generateLecturePracticeMarkdown generates standard markdown structure', () => {
  const mockTasks = [
    {
      isTask: true,
      taskNo: 1,
      title: '温度换算',
      className: 'TemperatureConverter.java',
      templateCode: 'public class TemperatureConverter {}',
      outputText: '26.50 ℃'
    },
    {
      isTask: true,
      taskNo: 2,
      title: '华氏度计算',
      className: 'Fahrenheit.java',
      templateCode: 'public class Fahrenheit {}',
      outputText: '79.70 ℉'
    }
  ];

  const md = generateLecturePracticeMarkdown('lec02', mockTasks);

  // 1. Frontmatter
  assert.match(md, /---\s*layout:\s*doc/);
  assert.match(md, /title:\s*第 2 讲 课堂实操任务/);
  assert.match(md, /breadcrumb:\s*课堂实操 \(第 2 讲\)/);

  // 2. Component import (全局注册后无需局部导入)
  assert.doesNotMatch(md, /import PracticeCard/);

  // 3. Navigation & Guide
  assert.match(md, /# 随堂实操任务清单 <span class="subtitle">第 2 讲<\/span>/);
  assert.match(md, /💡 \*\*操作指南\*\*/);
  assert.match(md, /\[← 返回《Java程序设计》大纲\]\(\/courses\/java-programming-2026-fall\)/);

  // 4. PracticeCard rendering
  assert.match(md, /<PracticeCard/);
  assert.match(md, /:task-no="1"/);
  assert.match(md, /:task-no="2"/);
  assert.match(md, /class-name="TemperatureConverter\.java"/);
  assert.match(md, /title="温度换算"/);
  assert.match(md, /template-code="public class TemperatureConverter \{\}"/);
  assert.match(md, /output-text="26\.50 ℃"/);
  assert.match(md, /```java[\s\S]*?public class TemperatureConverter \{\}[\s\S]*?```/);
  assert.match(md, /<\/PracticeCard>/);
});

test('sortLectureTasks respects predefined LECTURE_ORDER and fallback rules', () => {
  // 1. 测试 LECTURE_ORDER 经典顺序排序 (lec01 故意打乱顺序传入)
  const lec01Tasks = [
    { fileName: 'CommWelcome.java', hasBlank: true },
    { fileName: 'HelloWorld.java', hasBlank: false },
    { fileName: 'ArgsDemo.java', hasBlank: false }
  ];
  const sortedLec01 = sortLectureTasks('lec01', lec01Tasks);
  assert.deepEqual(
    sortedLec01.map(t => t.fileName),
    ['HelloWorld.java', 'ArgsDemo.java', 'CommWelcome.java']
  );

  // 2. 测试根据明确 rawTaskNo 升序排序
  const customTasks = [
    { fileName: 'TaskB.java', rawTaskNo: 2 },
    { fileName: 'TaskA.java', rawTaskNo: 1 }
  ];
  const sortedCustom = sortLectureTasks('customLec', customTasks);
  assert.deepEqual(
    sortedCustom.map(t => t.fileName),
    ['TaskA.java', 'TaskB.java']
  );

  // 3. 测试基础演示（无挖空）优先于综合实操（有挖空）
  const mixedTasks = [
    { fileName: 'ProjectTask.java', hasBlank: true },
    { fileName: 'DemoA.java', hasBlank: false }
  ];
  const sortedMixed = sortLectureTasks('unknownLec', mixedTasks);
  assert.deepEqual(
    sortedMixed.map(t => t.fileName),
    ['DemoA.java', 'ProjectTask.java']
  );
});

test('runSync scans directories, sorts tasks, renumbers sequentially, and outputs markdown files', async () => {
  const tempBase = fs.mkdtempSync(path.join(os.tmpdir(), 'java-sync-test-'));
  const mockCodeDir = path.join(tempBase, 'code');
  const mockTargetDir = path.join(tempBase, 'practice');

  fs.mkdirSync(path.join(mockCodeDir, 'lec01'), { recursive: true });
  fs.mkdirSync(path.join(mockCodeDir, 'lec02'), { recursive: true });
  fs.mkdirSync(path.join(mockCodeDir, 'lec03'), { recursive: true });

  // lec01: 单个任务
  const lec01Java = `/**
 * 随堂实操任务 1：Hello World 任务
 */
public class Hello {
    public static void main(String[] args) {
        // <BLANK: 输出问候>
        System.out.println("Hello");
        // </BLANK>
    }
}
// <OUTPUT>
// Hello
// </OUTPUT>
`;
  fs.writeFileSync(path.join(mockCodeDir, 'lec01', 'Hello.java'), lec01Java, 'utf-8');

  // lec02: 两个任务（创建顺序故意颠倒为 Task2 先、Task1 后）
  const lec02Task2 = `/**
 * 随堂实操任务 2：计算半径
 */
public class Circle {
    // <BLANK: 半径>
    double r = 1.0;
    // </BLANK>
}
`;
  const lec02Task1 = `/**
 * 随堂实操任务 1：计算周长
 */
public class Perimeter {
    // <BLANK: 周长>
    double p = 2.0;
    // </BLANK>
}
`;
  fs.writeFileSync(path.join(mockCodeDir, 'lec02', 'B_Circle.java'), lec02Task2, 'utf-8');
  fs.writeFileSync(path.join(mockCodeDir, 'lec02', 'A_Perimeter.java'), lec02Task1, 'utf-8');

  // lec03: 无挖空普通演示代码（如今也作为随堂实操题目收录）
  const lec03Normal = `public class NormalCode {
    public static void main(String[] args) {
        System.out.println("Normal");
    }
}
`;
  fs.writeFileSync(path.join(mockCodeDir, 'lec03', 'NormalCode.java'), lec03Normal, 'utf-8');

  // 执行同步
  const result = await runSync(mockCodeDir, mockTargetDir);

  assert.equal(result.totalTasks, 4);
  assert.deepEqual(result.generatedFiles, ['lec01.md', 'lec02.md', 'lec03.md']);

  // 验证 lec01.md 存在
  assert.equal(fs.existsSync(path.join(mockTargetDir, 'lec01.md')), true);
  // 验证 lec02.md 存在
  assert.equal(fs.existsSync(path.join(mockTargetDir, 'lec02.md')), true);
  // 验证 lec03.md 存在（普通代码也已作为实操任务收录）
  assert.equal(fs.existsSync(path.join(mockTargetDir, 'lec03.md')), true);

  // 验证 lec02.md 中的任务按 taskNo 排序与重编号（Task 1 在 Task 2 之前）
  const lec02Content = fs.readFileSync(path.join(mockTargetDir, 'lec02.md'), 'utf-8');
  const indexTask1 = lec02Content.indexOf(':task-no="1"');
  const indexTask2 = lec02Content.indexOf(':task-no="2"');
  assert.ok(indexTask1 !== -1 && indexTask2 !== -1);
  assert.ok(indexTask1 < indexTask2, '任务应按重新编号的 taskNo 升序排序');
  assert.match(lec02Content, /class-name="A_Perimeter\.java"/);
  assert.match(lec02Content, /class-name="B_Circle\.java"/);

  // 验证 lec03.md 内容
  const lec03Content = fs.readFileSync(path.join(mockTargetDir, 'lec03.md'), 'utf-8');
  assert.match(lec03Content, /:task-no="1"/);
  assert.match(lec03Content, /title="NormalCode"/);
  assert.match(lec03Content, /class-name="NormalCode\.java"/);

  // 清理临时文件
  fs.rmSync(tempBase, { recursive: true, force: true });
});

test('runSync handles non-existent code directory gracefully', async () => {
  const result = await runSync('/non-existent-path-' + Date.now());
  assert.equal(result.totalTasks, 0);
  assert.deepEqual(result.generatedFiles, []);
});
