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
  assert.equal(result.className, 'TemperatureConverter');
});

test('parseJavaPracticeFile extracts className from source when options.className is omitted', () => {
  const result = parseJavaPracticeFile(sampleJava);
  assert.equal(result.className, 'TemperatureConverter');
});

test('parseJavaPracticeFile strips <OUTPUT> block from templateCode', () => {
  const result = parseJavaPracticeFile(sampleJava);
  assert.equal(result.templateCode.includes('<OUTPUT>'), false);
  assert.equal(result.templateCode.includes('</OUTPUT>'), false);
});

test('parseJavaPracticeFile handles multiple blanks with indexed TODO labels', () => {
  const multiBlankJava = `/**
 * 随堂实操任务 3: 双重运算
 */
public class MultiBlankDemo {
    public static void main(String[] args) {
        // <BLANK: 任务第1步>
        int a = 10;
        // </BLANK>
        // <BLANK: 任务第2步>
        int b = 20;
        // </BLANK>
    }
}
`;
  const result = parseJavaPracticeFile(multiBlankJava);
  assert.equal(result.isTask, true);
  assert.equal(result.taskNo, 3);
  assert.match(result.templateCode, /TODO: 【实操任务 3 - 挖空 1】/);
  assert.match(result.templateCode, /TODO: 【实操任务 3 - 挖空 2】/);
  assert.equal(result.templateCode.includes('int a = 10;'), false);
  assert.equal(result.templateCode.includes('int b = 20;'), false);
});

test('parseJavaPracticeFile handles BLANK without custom hint', () => {
  const defaultHintJava = `public class DefaultHintDemo {
    public static void main(String[] args) {
        // <BLANK>
        System.out.println("secret");
        // </BLANK>
    }
}
`;
  const result = parseJavaPracticeFile(defaultHintJava);
  assert.equal(result.isTask, true);
  assert.match(result.templateCode, /提示: 请补全此处核心逻辑/);
  assert.equal(result.templateCode.includes('"secret"'), false);
});

test('parseJavaPracticeFile extracts multi-line output with leading comments stripped', () => {
  const multilineOutputJava = `public class PrintDemo {
    public static void main(String[] args) {
        // <BLANK: 输出两行>
        System.out.println("Line 1");
        System.out.println("Line 2");
        // </BLANK>
    }
}
// <OUTPUT>
// ====================
// Line 1
// Line 2
// ====================
// </OUTPUT>
`;
  const result = parseJavaPracticeFile(multilineOutputJava);
  assert.equal(result.outputText, '====================\nLine 1\nLine 2\n====================');
});

test('parseJavaPracticeFile extracts title from Javadoc description when no task info is present', () => {
  const helloWorldJava = `/**
 * 经典 HelloWorld 程序
 * @author MatNoble
 */
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, Java World!");
    }
}
`;
  const result = parseJavaPracticeFile(helloWorldJava, { className: 'HelloWorld.java' });
  assert.equal(result.isTask, true);
  assert.equal(result.title, '经典 HelloWorld 程序');
  assert.equal(result.className, 'HelloWorld.java');
  assert.equal(result.hasBlank, false);
  assert.ok(result.templateCode.includes('System.out.println("Hello, Java World!");'));
});

test('parseJavaPracticeFile falls back to class name or filename when no Javadoc is present', () => {
  const plainJava = `public class ArgsDemo {
    public static void main(String[] args) {
        System.out.println("Args: " + args.length);
    }
}
`;
  const result = parseJavaPracticeFile(plainJava, { className: 'ArgsDemo.java' });
  assert.equal(result.isTask, true);
  assert.equal(result.title, 'ArgsDemo');
  assert.equal(result.className, 'ArgsDemo.java');
  assert.equal(result.hasBlank, false);
  assert.ok(result.templateCode.includes('System.out.println("Args: " + args.length);'));
});

test('parseJavaPracticeFile returns isTask: false for invalid or empty inputs', () => {
  assert.equal(parseJavaPracticeFile('').isTask, false);
  assert.equal(parseJavaPracticeFile('   \n  ').isTask, false);
  assert.equal(parseJavaPracticeFile(null).isTask, false);
  assert.equal(parseJavaPracticeFile(undefined).isTask, false);
  assert.equal(parseJavaPracticeFile(12345).isTask, false);
});
