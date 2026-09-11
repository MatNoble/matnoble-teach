/**
 * 解析单个 Java 文件中的实操任务、挖空标记与预期输出
 *
 * @param {string} fileContent - Java 源码内容
 * @param {object} [options] - 配置选项
 * @param {string} [options.className] - 外部指定的类名或文件名（如 TemperatureConverter.java）
 * @param {number} [options.taskNo] - 指定任务编号
 * @returns {object} 解析结果
 */
export function parseJavaPracticeFile(fileContent, options = {}) {
  if (typeof fileContent !== 'string' || !fileContent.trim()) {
    return { isTask: false };
  }

  // 1. 提取 className
  let className = options.className || '';
  if (!className) {
    const publicClassMatch = fileContent.match(/public\s+(?:final\s+|abstract\s+)?(?:class|interface)\s+([A-Za-z0-9_$]+)/);
    const anyClassMatch = fileContent.match(/(?:final\s+|abstract\s+)?(?:class|interface)\s+([A-Za-z0-9_$]+)/);
    className = (publicClassMatch && publicClassMatch[1]) || (anyClassMatch && anyClassMatch[1]) || '';
  }

  // 2. 标题与任务编号提取增强
  let title = '';
  let taskNo = options.taskNo || null;
  let rawTaskNo = null;

  // a. 优先匹配 Javadoc 中的任务信息：随堂实操任务 X：任务名称
  const taskRegex = /随堂实操任务\s*([0-9]+)\s*[：:]\s*([^\n\r*]+)/;
  const taskMatch = fileContent.match(taskRegex);

  if (taskMatch) {
    rawTaskNo = parseInt(taskMatch[1], 10);
    if (!taskNo) {
      taskNo = rawTaskNo;
    }
    title = taskMatch[2].trim();
  }

  // b. 若未显式写“随堂实操任务”，提取 Javadoc 第一行有效描述
  if (!title) {
    const javadocMatch = fileContent.match(/\/\*\*([\s\S]*?)\*\//);
    if (javadocMatch) {
      const lines = javadocMatch[1].split(/\r?\n/);
      for (const line of lines) {
        const cleaned = line.replace(/^[ \t]*\*+[ \t]?/, '').trim();
        if (cleaned && !cleaned.startsWith('@')) {
          title = cleaned;
          break;
        }
      }
    }
  }

  // c. 若无 Javadoc 描述，回退到类名或文件名
  if (!title) {
    const fallbackName = options.className
      ? options.className.replace(/\.java$/i, '')
      : className;
    title = fallbackName || 'Java 实操任务';
  }

  if (!taskNo) {
    taskNo = 1;
  }

  // 3. 提取 <OUTPUT> ... </OUTPUT>
  let outputText = '';
  const outputRegex = /[ \t]*\/\/\s*<OUTPUT>([\s\S]*?)\/\/\s*<\/OUTPUT>[ \t]*\r?\n?/g;
  const outputMatch = fileContent.match(/\/\/\s*<OUTPUT>([\s\S]*?)\/\/\s*<\/OUTPUT>/);
  if (outputMatch) {
    outputText = outputMatch[1]
      .split(/\r?\n/)
      .map(line => line.replace(/^[ \t]*\/\/\s?/, ''))
      .join('\n')
      .trim();
  }

  // 4. 处理 <BLANK: hint> ... </BLANK>
  // 模板代码中首先剥离 <OUTPUT> 注释块
  let templateCode = fileContent.replace(outputRegex, '');

  const hasBlankTag = fileContent.includes('<BLANK');
  if (hasBlankTag) {
    const blankTagMatches = fileContent.match(/\/\/\s*<BLANK/g) || [];
    const totalBlanks = blankTagMatches.length;
    let blankIndex = 1;

    templateCode = templateCode.replace(
      /([ \t]*)\/\/\s*<BLANK(?::\s*([^>]+))?>([\s\S]*?)\/\/\s*<\/BLANK>/g,
      (match, indent, hint) => {
        const hintText = hint ? hint.trim() : '请补全此处核心逻辑';
        const label = totalBlanks > 1
          ? `【实操任务 ${taskNo} - 挖空 ${blankIndex++}】`
          : `【实操任务 ${taskNo}】`;
        const prompt = `${indent}// ===== TODO: ${label}请在此补全代码 =====\n${indent}// 提示: ${hintText}\n${indent}// \n${indent}// ============================================`;
        return prompt;
      }
    );
  }

  return {
    isTask: true,
    taskNo,
    rawTaskNo,
    hasBlank: hasBlankTag,
    title,
    className,
    templateCode: templateCode.trim(),
    outputText
  };
}
