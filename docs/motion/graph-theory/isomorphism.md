---
layout: doc
title: 图的同构 · 教学动画
breadcrumb: 图的同构
description: 图的同构（Graph Isomorphism）交互式教学动画：从五边形到五角星的连续变形出发，观察邻接关系的不变性，逐步建立保持邻接关系的顶点双射，引入同构的严格定义，并用边数、度数序列、连通性等同构不变量判定非同构。适用于《离散数学》图论章节课堂演示与学生课后回顾。
head:
  - - meta
    - name: keywords
      content: 图的同构, Graph Isomorphism, 同构不变量, 度数序列, 连通性, 离散数学, 图论, 数学动画, 数学可视化, MatNoble
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@type": "LearningResource",
        "name": "图的同构 · 教学动画",
        "learningResourceType": "Interactive Animation",
        "educationalLevel": "Undergraduate",
        "about": { "@type": "Thing", "name": "Graph Isomorphism" },
        "teaches": [
          "图的几何表现与抽象连接结构的区别",
          "图同构的数学定义",
          "利用同构不变量判定非同构"
        ]
      }
sidebar: false
prev: false
next: false
---

# 图的同构 <span class="iso-sub">Graph Isomorphism</span>

<style>
/* 本页以 16:9 动画画布为主体：仅在当前页放宽 VitePress 默认正文宽度限制（688px → 1360px，
 * 右侧为本页目录 aside，正文实际宽约 1040px）。通过路由专属类 + :has() 限定作用范围，
 * SPA 切换到其他页面后不产生样式泄漏。 */
.VPDoc:has(.vp-doc._motion_graph-theory_isomorphism),
.VPDoc:has(.vp-doc._motion_graph-theory_isomorphism) .container,
.VPDoc:has(.vp-doc._motion_graph-theory_isomorphism) .content,
.VPDoc:has(.vp-doc._motion_graph-theory_isomorphism) .content-container {
  max-width: 1360px !important;
}
.vp-doc._motion_graph-theory_isomorphism {
  max-width: 1360px !important;
}
</style>

<style scoped>
.iso-sub {
  font-size: 0.5em;
  font-style: italic;
  font-weight: 500;
  color: var(--vp-c-text-3);
  margin-left: 0.6em;
}
.iso-notice {
  margin: 14px 0 4px;
  padding: 12px 18px;
  border-radius: 10px;
  border: 1px dashed rgba(217, 184, 117, 0.5);
  background: rgba(217, 184, 117, 0.06);
  font-size: 14.5px;
  color: var(--vp-c-text-2);
}
.iso-notice strong { color: var(--vp-c-text-1); }
kbd.iso-kbd {
  display: inline-block;
  min-width: 26px;
  padding: 2px 8px;
  text-align: center;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  border-bottom-width: 2.5px;
  background: var(--vp-c-bg-soft);
  font-family: var(--vp-font-family-mono);
  font-size: 0.86em;
}
</style>

<script setup>
import { defineAsyncComponent } from 'vue'
const GraphIsomorphism = defineAsyncComponent(() => import('../../components/math/motion/GraphIsomorphism.vue'))
</script>

<div class="iso-notice">
  <strong>课堂演示提示</strong>：动画默认内嵌在页面中，点击 <strong>⛶ 全屏</strong>（或按 <kbd class="iso-kbd">F</kbd>）后适合投影仪展示；
  点击动画区域任意位置后即可使用键盘控制，点击页面其他区域可交还键盘。动画也可以直接分享链接给学生课后回顾。
</div>

<GraphIsomorphism />

## 动画结构与教学目标

动画按认知规律分为五幕，共 31 个可回退的步骤，全程由教师控制推进节奏：

| 幕 | 内容 | 认知目标 |
| --- | --- | --- |
| 第一幕 · 形状变了，图变了吗 | 五边形连续变形为五角星，边不增删 | 区分图的几何表现与抽象连接结构 |
| 第二幕 · 寻找不变的结构 | 对照高亮顶点、邻居、关联边与度数 | 观察到邻接关系在变形下不变 |
| 第三幕 · 从重新编号到同构定义 | 逐步建立双射 f 并逐边验证 | 理解同构的定义：双射 + 邻接保持 |
| 第四幕 · 如何判断非同构 | 三组反例：边数、度数序列、连通性 | 学会用同构不变量证明非同构 |
| 第五幕 · 课堂总结 | 三条结论 + K₅ 生成子图思考题 | 巩固必要条件与充分条件的区别 |

学生观看并参与演示后，应当能够：

1. 理解图的几何表现与抽象连接结构之间的区别；
2. 复述图同构的数学定义；
3. 构造两个同构的图，并寻找保持邻接关系的顶点双射；
4. 利用同构不变量（边数、度数序列、连通性）判定两个图非同构；
5. 说明「度数序列相同」是同构的必要条件而非充分条件。

## 键盘与鼠标操作

| 操作 | 效果 |
| --- | --- |
| <kbd class="iso-kbd">→</kbd> / <kbd class="iso-kbd">←</kbd> | 下一步 / 上一步（准确恢复对应的数学状态） |
| <kbd class="iso-kbd">Space</kbd> | 推进当前演示（如第一幕的五边形 → 五角星连续变形） |
| <kbd class="iso-kbd">R</kbd> | 重新播放当前幕 |
| <kbd class="iso-kbd">F</kbd> / <kbd class="iso-kbd">Esc</kbd> | 进入 / 退出全屏 |
| 拖动滑杆 | 手动控制第一幕的变形进度 |
| 点击顶点 | 在第二幕中选择并高亮任意顶点，观察其邻接关系 |

键盘事件仅在动画处于焦点或全屏状态时生效，不会干扰页面的正常浏览。

## 教学建议

- **先现象后定义**：第一幕变形结束后保留观察时间，先让学生猜想「是不是同一个图」，再进入第二幕用邻接关系验证，最后才在第三幕给出形式化定义。
- **强调 ⇔ 的双向性**：第三幕第 7–8 步先确立「双射 + 边集恰好互映」，再推出非邻接关系也保持；第 8 步虚线演示的非邻接对应只是直观展示，而不是证明本身，避免学生把同构误解为只要求「边映到边」。
- **框定讨论范围**：本动画的定理与定义均针对无向简单图（无自环、无平行边）；有向图与多重图的同构定义需相应扩展，可作为课程延伸提及。
- **警惕必要条件陷阱**：第四幕第三组（P₅ 与 C₃ ∪ K₂）度数序列相同但非同构，务必配合第 9 步的警示框讲清必要条件与充分条件的区别；同时提醒：某个候选双射失败不等于不存在同构，即使上述常用同构不变量均相同，也不能直接断定同构。
- **课堂延伸**：第五幕思考题（K₅ 的至少 8 个两两非同构的生成子图）不给出答案，建议按边数分类讨论，可作为下一次课的引入。

## 相关资源

- 返回 [数学之形 · Math in Motion](/motion/) 栏目首页
- 配套课件：[离散数学 · 第 5.1 节 无向图与有向图的基本概念](/courses/discrete-math)（链接始终指向当前学期课程页，学期更新无需改动本页）
