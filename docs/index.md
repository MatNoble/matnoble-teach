---
layout: page
title: MatNoble 教学中心 - 大学数学与工程计算教学平台
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
    { theme: 'brand', text: '当前开课与课件', link: '#active-courses' },
    { theme: 'alt', text: '探索知识星图', link: '#knowledge-graph' }
  ]"
/>

<div class="teach-hub-container">

<section id="active-courses" class="teach-section">
  <div class="section-header">
    <h2 class="section-title">
      当前主讲课程
      <span class="section-subtitle">Active Courses</span>
    </h2>
    <p class="section-desc">2026 秋季学期正在开课的专业核心课程大纲与课件直达。</p>
  </div>
  
  <CourseList :current-only="true" :hide-header="true" />

  <div class="archive-banner">
    <span class="archive-text">正在寻找往期课程讲义与练习题？</span>
    <a href="/courses/" class="archive-link">查看完整历史学期课程归档（2026 夏季 / 2026 春季 / MATLAB）→</a>
  </div>
</section>

<section id="knowledge-graph" class="teach-section">
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
  scroll-margin-top: 80px;
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

/* 历史归档引导条 */
.archive-banner {
  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
  background: var(--vp-c-bg-soft);
  border: 1px dashed var(--vp-c-border);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  transition: all 0.2s ease;
}

.archive-banner:hover {
  border-color: var(--vp-c-brand-1);
}

.archive-text {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.archive-link {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.archive-link:hover {
  text-decoration: underline;
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
