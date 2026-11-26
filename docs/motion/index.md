---
layout: doc
title: 数学之形 · Math in Motion
breadcrumb: 数学之形
description: MatNoble「数学之形 Math in Motion」数学动画栏目：让抽象的数学结构，在运动中变得可见。面向大学数学课堂教学的交互式动画，配合投影演示与课后回顾，帮助学生理解抽象数学概念、结构关系与推理过程。
head:
  - - meta
    - name: keywords
      content: 数学动画, 数学可视化, 图论, 图的同构, 离散数学, 课堂教学, Math in Motion, MatNoble
sidebar: false
prev: false
next: false
---

# 数学之形

<style scoped>
.motion-hero {
  position: relative;
  overflow: hidden;
  margin: 10px 0 34px;
  padding: 46px 48px 42px;
  border-radius: 20px;
  border: 1px solid rgba(217, 184, 117, 0.28);
  background: linear-gradient(148deg, #18252e 0%, #131d26 58%, #101922 100%);
  color: #f0e6d2;
  display: flex;
  align-items: center;
  gap: 44px;
}
.motion-hero-icon { flex: none; display: block; }
.motion-hero-body { position: relative; z-index: 1; }
.motion-hero-brand {
  margin: 0 0 6px;
  font-size: 13px;
  letter-spacing: 0.42em;
  text-transform: uppercase;
  color: #a9b6be;
  font-family: var(--vp-font-family-base);
}
.motion-hero-name {
  margin: 0 0 4px;
  font-family: var(--vp-font-family-heading), serif;
  font-size: 40px;
  line-height: 1.2;
  color: #e8cf9a;
  letter-spacing: 0.04em;
}
.motion-hero-name .en {
  font-size: 26px;
  color: #d9b875;
  font-style: italic;
  margin-left: 14px;
}
.motion-hero-tagline {
  margin: 14px 0 0;
  font-size: 16.5px;
  line-height: 1.7;
  color: #a9b6be;
  max-width: 640px;
}
.motion-hero-tagline strong { color: #f0e6d2; font-weight: 600; }
@media (max-width: 720px) {
  .motion-hero { flex-direction: column; align-items: flex-start; gap: 24px; padding: 30px 26px; }
  .motion-hero-name { font-size: 30px; }
  .motion-hero-name .en { display: block; margin: 6px 0 0; }
}

.motion-subject { margin: 34px 0 14px; }
.motion-subject-title {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 16px;
}
.motion-subject-title h2 { margin: 0; padding: 0; border: 0; font-size: 22px; }
.motion-subject-title span { font-size: 13px; letter-spacing: 0.18em; color: var(--vp-c-text-3); text-transform: uppercase; }

.motion-card {
  display: flex;
  align-items: center;
  gap: 22px;
  padding: 22px 26px;
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
}
.motion-card:hover {
  border-color: rgba(217, 184, 117, 0.65);
  transform: translateY(-2px);
  box-shadow: 0 14px 34px -16px rgba(24, 37, 46, 0.4);
}
.motion-card-thumb {
  flex: none;
  width: 76px;
  height: 76px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #18252e;
}
.motion-card-body { flex: 1; min-width: 0; }
.motion-card-title {
  margin: 0 0 6px;
  font-size: 19px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.motion-card-title .en { font-weight: 500; font-size: 14px; color: #a08148; margin-left: 10px; font-style: italic; }
.motion-card-desc { margin: 0; font-size: 14.5px; line-height: 1.65; color: var(--vp-c-text-2); }
.motion-card-meta { flex: none; display: flex; gap: 8px; }
.motion-tag {
  padding: 4px 12px;
  font-size: 12.5px;
  border-radius: 999px;
  border: 1px solid rgba(217, 184, 117, 0.45);
  color: #a08148;
  background: rgba(217, 184, 117, 0.08);
  white-space: nowrap;
}
.motion-enter {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  border-radius: 10px;
  background: #d9b875;
  color: #18252e;
  font-size: 14.5px;
  font-weight: 700;
}
@media (max-width: 720px) {
  .motion-card { flex-wrap: wrap; }
  .motion-card-meta { order: 3; }
}
</style>

<div class="motion-hero">
  <svg
    class="motion-hero-icon"
    viewBox="0 0 128 128"
    width="128"
    height="128"
    role="img"
    aria-label="数学之形栏目图标：三个沿对角线依次平移重叠的金色正方形，对应顶点以金色虚线相连"
  >
    <rect x="4" y="4" width="120" height="120" rx="28" fill="#18252E" stroke="rgba(217,184,117,.35)" stroke-width="2" />
    <rect x="20" y="20" width="42" height="42" rx="5" fill="rgba(217,184,117,.05)" stroke="#8F7A4E" stroke-width="2.4" />
    <rect x="43" y="43" width="42" height="42" rx="5" fill="rgba(217,184,117,.09)" stroke="#C8A96B" stroke-width="2.4" />
    <rect x="66" y="66" width="42" height="42" rx="5" fill="rgba(217,184,117,.13)" stroke="#E8CF9A" stroke-width="2.8" />
    <line x1="62" y1="20" x2="85" y2="43" stroke="#D9B875" stroke-width="1.6" stroke-dasharray="4 5" opacity=".55" />
    <line x1="85" y1="43" x2="108" y2="66" stroke="#D9B875" stroke-width="1.6" stroke-dasharray="4 5" opacity=".55" />
    <line x1="20" y1="62" x2="43" y2="85" stroke="#D9B875" stroke-width="1.6" stroke-dasharray="4 5" opacity=".4" />
    <line x1="43" y1="85" x2="66" y2="108" stroke="#D9B875" stroke-width="1.6" stroke-dasharray="4 5" opacity=".4" />
  </svg>
  <div class="motion-hero-body">
    <p class="motion-hero-brand">MatNoble</p>
    <h2 class="motion-hero-name">数学之形<span class="en">Math in Motion</span></h2>
    <p class="motion-hero-tagline">
      <strong>让抽象的数学结构，在运动中变得可见。</strong>
      这里收录面向大学数学课堂的教学动画：教师逐步推进、课堂投影演示，同一个页面也可分享给学生课后回顾。
      数学思想优先于动画效果，认知过程优先于形式展示。
    </p>
  </div>
</div>

## 动画目录

<div class="motion-subject">
  <div class="motion-subject-title">
    <h2>图论</h2>
    <span>Graph Theory</span>
  </div>
  <a class="motion-card" href="./graph-theory/isomorphism">
    <span class="motion-card-thumb" aria-hidden="true">
      <svg viewBox="0 0 64 64" width="46" height="46">
        <polygon points="32,8 51.4,22.1 44,44.4 20,44.4 12.6,22.1" fill="none" stroke="#D9B875" stroke-width="2.6" />
        <polygon points="32,14 44.9,42 19.1,42" fill="none" stroke="#D9B875" stroke-width="2" stroke-dasharray="4 4" opacity=".8" />
        <circle cx="32" cy="8" r="3.4" fill="#E8CF9A" />
        <circle cx="51.4" cy="22.1" r="3.4" fill="#E8CF9A" />
        <circle cx="44" cy="44.4" r="3.4" fill="#E8CF9A" />
        <circle cx="20" cy="44.4" r="3.4" fill="#E8CF9A" />
        <circle cx="12.6" cy="22.1" r="3.4" fill="#E8CF9A" />
      </svg>
    </span>
    <span class="motion-card-body">
      <span class="motion-card-title">图的同构<span class="en">Graph Isomorphism</span></span>
      <span class="motion-card-desc">
        五边形如何变成五角星而「图不变」？从连续变形出发，寻找不变的结构，建立保持邻接关系的双射，
        再用同构不变量判定非同构。五幕递进，适合《离散数学》图论章节的课堂引入。
      </span>
    </span>
    <span class="motion-card-meta">
      <span class="motion-tag">5 幕 · 31 步</span>
      <span class="motion-tag">配套 5.1 节</span>
    </span>
    <span class="motion-enter">进入演示 →</span>
  </a>
</div>

## 关于本栏目

- **为课堂而生**：每次推进由教师主动触发，动画只负责把数学过程演清楚；支持键盘逐步控制与全屏投影。
- **先现象，后定义**：每个动画都从可观察的数学现象出发，逐步引出形式化定义，而不是先给定义再举例。
- **轻量实现**：全部动画基于 Vue + SVG + CSS 原生能力实现，无需安装任何插件。
- **持续积累**：栏目随教学进度逐步充实，优先保证每个动画的数学正确性与教学质量。

相关入口：[离散数学课程](/courses/discrete-math-2026-fall) · [教学讲义](/teaching/) · [数学工具](/tools/)
