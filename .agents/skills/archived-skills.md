# 归档 Skill 记录

以下 Skill 暂不启用：不安装到活跃 Skill 目录（`.agents/skills/`），不参与任务自动触发，
Agent 制作动画时无需读取其完整说明。此处仅记录来源、用途与暂不启用的原因，供后续需要时恢复。

## motion-showreel

- **来源**: <https://github.com/ConardLi/garden-skills/tree/main/skills/motion-showreel>
- **用途**: 生成动效展示卷（motion showreel）类的网页动效作品，偏重视觉展示与包装。
- **暂不启用原因**:
  1. 「数学之形」栏目面向课堂教学，数学思想优先于动画效果，不需要展示型动效包装；
  2. 其产出形态（作品集/展示页）与教学动画页面的认知节奏控制（分步推进、教师主导）不匹配；
  3. 减少上下文干扰，降低第一阶段开发复杂度。

## web-video-presentation

- **来源**: <https://github.com/ConardLi/garden-skills/tree/main/skills/web-video-presentation>
- **用途**: 网页视频化演示（带配音/录制导出的 video presentation）。
- **暂不启用原因**:
  1. 本栏目明确不需要 TTS、配音、背景音乐或视频导出，动画由教师在课堂上现场推进；
  2. 视频化工作流会显著增加构建与依赖复杂度，与「内容先行、轻量实现」的原则相悖。

## 恢复方式

若后续阶段确需启用，从上述来源获取最新版本，安装到 `.agents/skills/<skill-name>/`，
并在 `.agents/skills/README.md` 的「活跃 Skill」一节登记。
