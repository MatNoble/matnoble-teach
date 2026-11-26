# 项目级 Agent Skills

本仓库的项目级 Skill 统一放在 `.agents/skills/<skill-name>/`，每个目录至少包含一份上游 `SKILL.md`。
Agent（ZCode / Claude Code 等）在此仓库内制作幻灯片或数学动画前，应先阅读对应 Skill 的说明。

## 活跃 Skill

### html-ppt

- **来源**: <https://github.com/lewislulu/html-ppt-skill>（commit `fd16290`，2026-09-14）
- **用途**: HTML PPT Studio —— 静态 HTML 演示文稿的排版、视觉层次、动画组织、全屏课堂演示、
  键盘控制、分步推进与逐步揭示的参考规范。
- **引入方式**: 本仓库仅引入其说明文档（`SKILL.md`、`README.md`、`README.zh-CN.md`、`references/*.md`），
  **未**引入 `templates/` 与 `assets/` 运行时。
- **在本仓库的使用边界**（见 `docs/motion/` 数学之形栏目）:
  - 学习其 **设计方法**：固定 16:9 设计画布等比缩放、token 化配色、分步推进的键盘运行时、
    逐步揭示（progressive reveal）而非自动播放。
  - **不要**把 HTML PPT Studio 运行时（runtime.js / fx / themes）强制嵌入 VitePress 站点。
  - 站内数学动画用 Vue 3 + SVG + CSS 实现（参考
    `docs/components/math/motion/GraphIsomorphism.vue`）。
  - 仅当用户明确要求产出**独立静态 HTML 幻灯片文件**时，才按 SKILL.md 的安装说明
    （`npx skills add https://github.com/lewislulu/html-ppt-skill`）获取完整模板与资源。

## 归档 Skill

见 [archived-skills.md](./archived-skills.md)。归档 Skill 不安装、不参与自动触发。
