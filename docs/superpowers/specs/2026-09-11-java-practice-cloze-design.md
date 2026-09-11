# Java 课堂实践代码挖空系统设计规范 (Design Spec)

- **课程**: 《Java 程序设计》(2026 秋季学期)
- **目标工程**: `matnoble-teach` 教学站
- **代码源目录**: `/Users/matnoble/Documents/JG/02 PPT/Java程序设计/tex-university/code`
- **日期**: 2026-09-11
- **状态**: Approved (待实施)

---

## 1. 背景与教学目标

在《Java 程序设计》课程中，随堂敲写完整代码存在两大痛点：
1. **时间浪费**：课堂上老师或学生从头敲样板代码（导包、类名、控制台排版打印）会挤占大量讲授和思考时间；
2. **思维惰性**：直接给完整源码又会导致学生机械复制粘贴并直接运行，无法达到锻炼核心编程思维的目的。

本系统旨在建立一套**“源码单源维护、核心逻辑挖空、一键复制代码模板至 IDE、高仿终端输出对照、课堂无参考答案保持悬念”**的教学实操闭环体系。实操内容与各讲 PDF 课件同步发布上线。

---

## 2. 核心教学与交互准则

1. **IDE 深度联动**：
   - 网页提供语法高亮的挖空代码视图。
   - 提供专属“一键复制模板代码”按钮，学生一键复制后直接粘贴进个人常用 IDE (IntelliJ IDEA / Eclipse / VS Code) 中完成补全与编译运行。
2. **终端输出直观对照**：
   - 每个任务卡片下方展示预期控制台输出（Terminal Output），方便学生对照验证算法正确性。
3. **无答案策略（保持课堂悬念）**：
   - 网页端**完全不展示参考实现**，不设答案折叠面板；
   - 由任课教师在课堂上现场演示、启发与公布解法。
4. **与 PDF 课件同步发布**：
   - 大纲表格中，只有已发布对应讲座 PDF（如第一篇）时，对应讲的课堂实操才同步开放（显示为 `实操 💻`），尚未开放的讲座显示为 `待开放 🔒`。

---

## 3. 源码标记规范 (Java Annotation Syntax)

在原始完整 Java 源码中添加轻量级注释标记。源码在本地依然保持完整的编译与调试能力。

### 3.1 核心挖空标记
```java
// <BLANK: 提示说明文本>
原始需要被挖空的核心代码（单行或多行）
// </BLANK>
```

### 3.2 预期输出标记 (可选/推荐)
```java
// <OUTPUT>
// =========================================
//             温标换算结果            
// -----------------------------------------
//   * 摄氏度 (Celsius)    : 26.50 ℃
//   * 华氏度 (Fahrenheit) : 79.70 ℉
// =========================================
// </OUTPUT>
```

### 3.3 转换效果示范
原始代码：
```java
double celsius = 26.5;
// <BLANK: 摄氏度转华氏度公式 (注意使用浮点数除法 9.0 / 5.0)>
double fahrenheit = celsius * 9.0 / 5.0 + 32.0;
// </BLANK>
```
生成给学生的代码模板：
```java
double celsius = 26.5;
// ===== TODO: 【实操任务 1】请在此补全代码 =====
// 提示: 摄氏度转华氏度公式 (注意使用浮点数除法 9.0 / 5.0)
// 
// ============================================
```

---

## 4. 自动化同步管线 (`scripts/sync-java-practice.mjs`)

编写自动化构建脚本，负责扫描、提取并生成教学站文档。

### 4.1 脚本职责
1. **目录扫描**：遍历 `/Users/matnoble/Documents/JG/02 PPT/Java程序设计/tex-university/code` 下的所有 `lec01` ~ `lec24` 目录；
2. **任务提取**：
   - 解析包含 `随堂实操任务` 或带有 `<BLANK:` 标记的 `.java` 文件；
   - 从 Javadoc 中提取任务编号、任务名称、说明描述；
   - 提取 `<OUTPUT>` 中的控制台运行输出；
   - 剔除 `<BLANK>` 中的敏感实现，生成带标准注释引导的挖空模板代码；
3. **页面生成**：
   - 在 `docs/courses/java-programming-2026-fall/practice/lecXX.md` 生成对应的 Markdown 页面；
   - 引入 `<PracticeCard />` 组件渲染各个实操任务。
4. **工程命令与生命周期集成**：
   - 在 `package.json` 添加 `sync:java`: `node scripts/sync-java-practice.mjs`；
   - 挂载至 `npm run docs:markdown` 与 `npm run docs:build`，确保构建时内容始终自洽。

---

## 5. 前端交互组件 (`docs/components/PracticeCard.vue`)

设计符合现代典雅美术馆画廊风的高质感实操组件：

### 5.1 组件结构与视觉设计
* **Header**：
  * 左侧：`随堂实操 X` 胶囊徽标 + 任务标题 + 源码类名标签（如 `TemperatureConverter.java`）；
  * 右侧：**复制模板代码 📋** 按钮，点击触发剪贴板写入并播放 `已复制 ✅` 动画。
* **Code Block**：
  * 深色磨砂底色，等宽代码字体，对留空区域提供清晰可辨的 TODO 视觉指引。
* **Terminal Simulation (预期输出)**：
  * 仿 Mac 控制台窗口，包含红黄绿三色圆点，标题栏显示 `bash — java <ClassName>`；
  * 等宽字体输出控制台预期排版。

---

## 6. 站点架构与页面路由

### 6.1 文件结构
```text
docs/
├── components/
│   └── PracticeCard.vue                     # 实操卡片组件
├── courses/
│   ├── java-programming-2026-fall.md        # 主大纲页面（增加实操列）
│   └── java-programming-2026-fall/
│       └── practice/
│           ├── lec01.md                     # 第 1 讲实操任务
│           ├── lec02.md                     # 第 2 讲实操任务
│           └── ...
scripts/
└── sync-java-practice.mjs                   # 自动解析与同步脚本
```

### 6.2 大纲联动与发布控制
在 `docs/courses/java-programming-2026-fall.md` 中，根据当前课件的发布状态，对应实操列呈现：
- 已发布讲（如第一篇 lec01~lec08）：`[实操 💻](/courses/java-programming-2026-fall/practice/lec01)`
- 未发布讲（如第二篇及以后）：`<span class="btn-lock">待开放 🔒</span>`

---

## 7. 验证与质量保证

1. **编译自检**：执行 `npm run sync:java` 成功生成所有对应 markdown 页面；
2. **语法高亮自检**：执行 `npm run docs:build` 确保 VitePress 页面打包无报错，代码块正常渲染；
3. **剪贴板自检**：点击卡片上的“复制模板代码”，粘贴至本地 IDEA，能正常编译且挖空提示完整。
