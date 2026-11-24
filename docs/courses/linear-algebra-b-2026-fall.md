---
layout: doc
title: 线性代数(B) (2026秋季)
breadcrumb: 线性代数(B) (2026秋季)
description: 理工类专业核心必修课《线性代数(B)》（2026秋季学期）教学大纲、章节课件与授课讲义。涵盖行列式、矩阵运算、初等变换与线性方程组、向量组线性相关性。
keywords: 线性代数, 线性代数B, 教学大纲, 行列式, 行列式性质, 克拉默法则, 矩阵运算, 逆矩阵, 分块矩阵, 初等变换, 矩阵的秩, 线性方程组, 高斯消元法, 向量组相关性, 极大线性无关组, 基础解系, 线代课件, 课件下载, MatNoble
prev: false
next: false
---

<script setup>
const CDN_BASE = '/pdf/linear_algebra/2026-fall'
</script>

# 线性代数(B) <span class="subtitle">2026 秋季学期</span>

《线性代数(B)》是面向理工及经管类专业开设的核心专业必修课（32 理论学时，2 学分）。课程主体涵盖行列式、矩阵代数、矩阵初等变换与线性方程组求解、向量组的线性相关性与解的结构。教学注重建立几何直观与代数运算能力的融合，培养学生分析与解决实际工程数学问题的综合素养。本页面提供 2026 秋季学期授课课件下载，随教学进度逐步开放更新。

::: info 课程规划与教学参考
- **课程属性**：专业必修课 · 32 理论学时 · 2 学分（共 15 次理论课）
- **知识主线**：行列式 $\to$ 矩阵代数 $\to$ 初等变换与方程组 $\to$ 向量组相关性与解的结构
- **参考资料**：选用《线性代数》教材及《工程数学线性代数》（同济大学）、《线性代数》（北京大学）等优秀参考书
:::

::: tip 交互式教学工具配套
学习线性代数重在建立几何直观与变换认知。建议配合站内互动工具辅助理解：
- 📐 [克拉默法则面积与体积比值可视化](/teaching/linear-algebra/cramers-rule)
- 🔄 [矩阵初等行变换过程动态演示](/teaching/linear-algebra/elementary-transformations)
- 🧩 [矩阵化简阶梯形去冗余实验](/teaching/linear-algebra/matrix-normal-form)
:::

<p class="mobile-desktop-hint">建议使用电脑桌面端访问，以获得更佳的课件浏览与下载体验。</p>

---

## 章节大纲与课件下载

### 第 1 章：行列式

<table class="academic-table">
  <thead>
    <tr>
      <th style="width: 12%">章节</th>
      <th style="width: 73%">知识要点</th>
      <th style="width: 15%; text-align: center;">授课课件</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="chap-num">1.1</td>
      <td class="chap-title">行列式的概念与定义（矩阵概念引入，二阶、三阶与 $n$ 阶行列式计算）</td>
      <td class="download-cell"><a :href="CDN_BASE + '/1-1_Determinant_Definition.pdf'" target="_blank" rel="noopener" class="btn-dl">PDF 📂</a></td>
    </tr>
    <tr>
      <td class="chap-num">1.2</td>
      <td class="chap-title">行列式的性质（行列式基本性质，利用性质化简与计算）</td>
      <td class="download-cell"><a :href="CDN_BASE + '/1-2_Determinant_Properties.pdf'" target="_blank" rel="noopener" class="btn-dl">PDF 📂</a></td>
    </tr>
    <tr>
      <td class="chap-num">1.3</td>
      <td class="chap-title">行列式展开定理与计算技巧（按行/列展开、三角法、降阶法、箭型/行和相等型/加边法）</td>
      <td class="download-cell"><a :href="CDN_BASE + '/1-3_Determinant_Expansion.pdf'" target="_blank" rel="noopener" class="btn-dl">PDF 📂</a></td>
    </tr>
    <tr>
      <td class="chap-num">1.4</td>
      <td class="chap-title">范德蒙行列式与克拉默法则（范德蒙行列式、拉普拉斯定理、克拉默法则及齐次方程解判定）</td>
      <td class="download-cell"><a :href="CDN_BASE + '/1-4_Cramers_Rule.pdf'" target="_blank" rel="noopener" class="btn-dl">PDF 📂</a></td>
    </tr>
  </tbody>
</table>

### 第 2 章：矩阵及其运算

<table class="academic-table">
  <thead>
    <tr>
      <th style="width: 12%">章节</th>
      <th style="width: 73%">知识要点</th>
      <th style="width: 15%; text-align: center;">授课课件</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="chap-num">2.1</td>
      <td class="chap-title">矩阵的定义与代数运算（矩阵概念、加法、数乘、乘法、幂、转置与行列式乘积定理）</td>
      <td class="download-cell"><a :href="CDN_BASE + '/2-1_Matrix_Operations.pdf'" target="_blank" rel="noopener" class="btn-dl">PDF 📂</a></td>
    </tr>
    <tr>
      <td class="chap-num">2.2</td>
      <td class="chap-title">可逆矩阵与矩阵方程（逆矩阵概念与性质、可逆充要条件、伴随矩阵求逆与矩阵方程求解）</td>
      <td class="download-cell"><a :href="CDN_BASE + '/2-2_Inverse_Matrix.pdf'" target="_blank" rel="noopener" class="btn-dl">PDF 📂</a></td>
    </tr>
    <tr>
      <td class="chap-num">2.3</td>
      <td class="chap-title">分块矩阵及其运算（分块矩阵定义、运算法则与分块矩阵求逆）</td>
      <td class="download-cell"><a :href="CDN_BASE + '/2-3_Block_Matrix.pdf'" target="_blank" rel="noopener" class="btn-dl">PDF 📂</a></td>
    </tr>
  </tbody>
</table>

### 第 3 章：矩阵的初等变换与线性方程组

<table class="academic-table">
  <thead>
    <tr>
      <th style="width: 12%">章节</th>
      <th style="width: 73%">知识要点</th>
      <th style="width: 15%; text-align: center;">授课课件</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="chap-num">3.1</td>
      <td class="chap-title">矩阵的初等变换（初等变换定义、初等行变换求逆矩阵与求解矩阵方程）</td>
      <td class="download-cell"><a :href="CDN_BASE + '/3-1_Elementary_Transformations.pdf'" target="_blank" rel="noopener" class="btn-dl">PDF 📂</a></td>
    </tr>
    <tr>
      <td class="chap-num">3.2</td>
      <td class="chap-title">矩阵的秩（矩阵的秩定义、性质与行阶梯形求秩方法）</td>
      <td class="download-cell"><a :href="CDN_BASE + '/3-2_Matrix_Rank.pdf'" target="_blank" rel="noopener" class="btn-dl">PDF 📂</a></td>
    </tr>
    <tr>
      <td class="chap-num">3.3</td>
      <td class="chap-title">线性方程组的解（线性方程组解的判定定理、高斯消元法求解齐次与非齐次线性方程组）</td>
      <td class="download-cell"><a :href="CDN_BASE + '/3-3_Linear_Systems.pdf'" target="_blank" rel="noopener" class="btn-dl">PDF 📂</a></td>
    </tr>
  </tbody>
</table>

### 第 4 章：向量组的线性相关性

<table class="academic-table">
  <thead>
    <tr>
      <th style="width: 12%">章节</th>
      <th style="width: 73%">知识要点</th>
      <th style="width: 15%; text-align: center;">授课课件</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="chap-num">4.1</td>
      <td class="chap-title">向量组及其线性相关性（向量表示、向量等价、向量组线性相关与线性无关的判别）</td>
      <td class="download-cell"><span class="btn-lock">待更新 🔒</span></td>
    </tr>
    <tr>
      <td class="chap-num">4.2</td>
      <td class="chap-title">向量组的秩与极大无关组（向量组的秩定义、极大线性无关组求法及向量由极大无关组表示）</td>
      <td class="download-cell"><span class="btn-lock">待更新 🔒</span></td>
    </tr>
    <tr>
      <td class="chap-num">4.3</td>
      <td class="chap-title">线性方程组解的结构与基础解系（齐次与非齐次方程组解的性质与结构、基础解系与通解求解）</td>
      <td class="download-cell"><span class="btn-lock">待更新 🔒</span></td>
    </tr>
  </tbody>
</table>

<style scoped>
.subtitle {
  display: block;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--mn-text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: -10px;
  margin-bottom: 24px;
}

/* 高颜值学术表格样式 */
.academic-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 16px 0 32px;
  background: var(--vp-c-bg-soft);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: border-color 0.3s;
}

.dark .academic-table {
  background: rgba(22, 27, 34, 0.2);
  border-color: rgba(255, 255, 255, 0.04);
}

.academic-table th {
  background: rgba(56, 189, 248, 0.05) !important;
  color: var(--mn-text) !important;
  font-size: 0.88rem !important;
  font-weight: 700 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 14px 18px !important;
  border-bottom: 1.5px solid rgba(56, 189, 248, 0.15) !important;
}

.dark .academic-table th {
  background: rgba(56, 189, 248, 0.02) !important;
  border-bottom-color: rgba(56, 189, 248, 0.1) !important;
}

.academic-table td {
  padding: 14px 18px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03) !important;
  color: var(--mn-text-soft);
  font-size: 0.95rem !important;
  vertical-align: middle;
  transition: all 0.2s ease;
}

.dark .academic-table td {
  border-bottom-color: rgba(255, 255, 255, 0.02) !important;
}

.academic-table tr:last-child td {
  border-bottom: none !important;
}

.academic-table tr:hover td {
  background: rgba(56, 189, 248, 0.03);
  color: var(--mn-text);
}

.dark .academic-table tr:hover td {
  background: rgba(255, 255, 255, 0.01);
}

/* 章节号强调 */
.chap-num {
  font-family: var(--vp-font-family-mono);
  font-weight: 700;
  color: var(--mn-primary) !important;
}

.chap-title {
  font-weight: 500;
}

/* 高颜值下载徽章 */
.download-cell {
  text-align: center !important;
  padding: 8px 18px !important;
}

.btn-dl {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 20px;
  background: var(--mn-primary-soft);
  color: var(--mn-primary) !important;
  border: 1px solid var(--mn-primary-ring);
  text-decoration: none !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(56, 189, 248, 0.05);
}

.btn-dl:hover {
  background: var(--mn-primary);
  color: #ffffff !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--mn-primary-ring);
}

/* 暂未开放状态样式 */
.btn-lock {
  display: inline-flex;
  padding: 4px 12px;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--mn-text-muted);
  border: 1px dashed rgba(0, 0, 0, 0.12);
  border-radius: 20px;
  background: transparent;
}

.dark .btn-lock {
  border-color: rgba(255, 255, 255, 0.08);
}
</style>
