---
layout: page
title: 大学数学与工程计算教学平台
breadcrumb: 教学首页
titleTemplate: false
description: MatNoble 教学中心：大学数学（离散数学、高等数学、线性代数、经济数学）与工程计算精品课件、章节大纲、3D互动几何实验与课堂工具。
head:
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "MatNoble 教学中心",
        "url": "https://teach.matnoble.top",
        "description": "大学数学与工程计算教学平台，提供离散数学、高等数学、线性代数等精品课件与 3D 可视化教学工具。"
      }
---

<script setup>
import { defineAsyncComponent } from 'vue'

const HighFidelityHero = defineAsyncComponent(() => import('./.vitepress/theme/components/HighFidelityHero.vue'))
const CourseList = defineAsyncComponent(() => import('./.vitepress/theme/components/CourseList.vue'))
const KnowledgeGraph = defineAsyncComponent(() => import('./.vitepress/theme/components/KnowledgeGraph.vue'))
</script>

<HighFidelityHero 
  name="MatNoble"
  text="教学中心"
  tagline="以数学直觉为引领，用计算与代码重构科学视野"
  :actions="[
    { theme: 'brand', text: '进入课程中心', link: '/courses/' },
    { theme: 'alt', text: '3D 空间几何实验室', link: '/teaching/space-geometry-lab' }
  ]"
/>

<div class="teach-hub-container">

<section class="teach-section">
  <div class="section-header">
    <h2 class="section-title">
      主讲课程与课件大纲
      <span class="section-subtitle">Courses & Syllabi</span>
    </h2>
    <p class="section-desc">当前学期最新章节课件下载与历史学期课程结课归档。</p>
  </div>
  
  <CourseList />
</section>

<section class="teach-section">
  <div class="section-header">
    <h2 class="section-title">
      深度直觉与交互实验
      <span class="section-subtitle">Visual Labs & Intuition</span>
    </h2>
    <p class="section-desc">将抽象的数学定义具象化为直观的几何形体与动态算法演示。</p>
  </div>

  <div class="cards-grid">
    <a href="/teaching/space-geometry-lab" class="hub-card">
      <div class="card-tag">Three.js 3D</div>
      <div class="card-title">空间解析几何 3D 实验室</div>
      <div class="card-desc">在三维坐标系中实时旋转观察平面的空间截面、二次曲面与旋转单叶双曲面。</div>
      <div class="card-arrow">进入实验 →</div>
    </a>
    <a href="/teaching/linear-algebra/cramers-rule" class="hub-card">
      <div class="card-tag">Geometric Intuition</div>
      <div class="card-title">克拉默法则几何演示</div>
      <div class="card-desc">通过二维与三维平行多面体的体积变形，直观理解行列式求解线性方程组的本质。</div>
      <div class="card-arrow">阅读演示 →</div>
    </a>
    <a href="/teaching/derivative-method" class="hub-card">
      <div class="card-tag">Calculus Method</div>
      <div class="card-title">微分万能公式</div>
      <div class="card-desc">利用一阶微分形式不变性，将链式法则化繁为简为框框逐层微分法。</div>
      <div class="card-arrow">查看精要 →</div>
    </a>
  </div>
</section>

<section class="teach-section">
  <div class="section-header">
    <h2 class="section-title">
      课堂与学习工具
      <span class="section-subtitle">Pedagogical Tools</span>
    </h2>
    <p class="section-desc">专为课堂教学、阶段测验与公式复习打造的高效轻量级工具。</p>
  </div>

  <div class="cards-grid">
    <a href="/tools/countdown" class="hub-card">
      <div class="card-tag">Classroom Tool</div>
      <div class="card-title">全屏课堂倒计时</div>
      <div class="card-desc">适用于课堂随堂练习、小组讨论与阶段测验的优雅全屏计时器。</div>
      <div class="card-arrow">打开计时器 →</div>
    </a>
    <a href="/tools/di-method" class="hub-card">
      <div class="card-tag">Interactive Solver</div>
      <div class="card-title">DI 表格积分法演示</div>
      <div class="card-desc">快速搞定分部积分，表格化推演求导列与积分列的交替法则。</div>
      <div class="card-arrow">交互体验 →</div>
    </a>
    <a href="/tools/memorize" class="hub-card">
      <div class="card-tag">LaTeX Spaced Repetition</div>
      <div class="card-title">Memorize 公式闪卡</div>
      <div class="card-desc">支持 LaTeX 实时渲染的高等数学核心公式间隔重复记忆工具。</div>
      <div class="card-arrow">开始复习 →</div>
    </a>
  </div>
</section>

<section class="teach-section">
  <div class="section-header">
    <h2 class="section-title">
      教学内容地图
      <span class="section-subtitle">Knowledge Graph</span>
    </h2>
    <p class="section-desc">可交互的数学知识星图，点击节点探索离散数学、微积分与线性代数子领域。</p>
  </div>

  <KnowledgeGraph />
</section>

<section class="teach-section">
  <div class="instructor-card">
    <div class="instructor-avatar">
      <img src="/logo.svg" alt="MatNoble" width="44" height="44" />
    </div>
    <div class="instructor-info">
      <div class="instructor-title">主讲教师 · MatNoble</div>
      <div class="instructor-bio">高校数学教师与独立开发者，主讲《离散数学》《微积分》《线性代数》等本科核心数学课程。用程序生成可交互的数学世界，让每一条公式都有具象的几何直觉。</div>
      <div class="instructor-actions">
        <a href="https://matnoble.top/about" class="inst-btn primary">关于教师 ↗</a>
        <a href="https://matnoble.top/" class="inst-btn secondary">个人门户主站 ↗</a>
        <a href="https://blog.matnoble.top" class="inst-btn secondary">技术博客 ↗</a>
      </div>
    </div>
  </div>
</section>

</div>

<style scoped>
.teach-hub-container {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 1.5rem 4rem;
}

.teach-section {
  margin-top: 3.5rem;
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin: 0 0 0.5rem;
  border-top: none;
  padding-top: 0;
}

.section-subtitle {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.section-desc {
  font-size: 0.9375rem;
  color: var(--vp-c-text-2);
  margin: 0;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}

.hub-card {
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  text-decoration: none;
  transition: all 0.2s ease;
}

.hub-card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.card-tag {
  display: inline-block;
  align-self: flex-start;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  margin-bottom: 0.75rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.card-desc {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  flex-grow: 1;
  margin-bottom: 1rem;
}

.card-arrow {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-brand-1);
}

/* 教师简介卡片 */
.instructor-card {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  margin-top: 1rem;
}

.instructor-avatar {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.instructor-info {
  flex-grow: 1;
}

.instructor-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 0.4rem;
}

.instructor-bio {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
}

.instructor-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.inst-btn {
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 0.35rem 0.85rem;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.inst-btn.primary {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border: 1px solid rgba(77, 132, 196, 0.25);
}

.inst-btn.primary:hover {
  background: var(--vp-c-brand-1);
  color: #ffffff;
}

.inst-btn.secondary {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}

.inst-btn.secondary:hover {
  color: var(--vp-c-text-1);
}

@media (max-width: 640px) {
  .instructor-card {
    flex-direction: column;
  }
}
</style>
