<template>
  <div class="practice-card">
    <!-- 顶部紧凑卡片 Header -->
    <div class="card-header">
      <div class="header-left">
        <span class="task-badge">实操 {{ taskNo }}</span>
        <span class="task-title">{{ title }}</span>
        <span v-if="className" class="class-badge" :title="className">
          <svg class="file-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <code>{{ className }}</code>
        </span>
      </div>

      <div class="header-right">
        <button
          type="button"
          class="copy-btn"
          :class="{ copied }"
          @click="copyCode"
          :title="copied ? '已复制到剪贴板' : '点击复制代码模板'"
        >
          <span v-if="copied">已复制 ✅</span>
          <span v-else>复制模板代码 📋</span>
        </button>
      </div>
    </div>

    <!-- 核心模板代码展示区 -->
    <div class="code-container">
      <slot>
        <pre class="code-pre"><code>{{ templateCode }}</code></pre>
      </slot>
    </div>

    <!-- 仿真终端控制台（Terminal Preview）（仅在 outputText 非空时展示） -->
    <div v-if="hasOutput" class="terminal-container">
      <div class="terminal-bar">
        <div class="mac-dots" aria-hidden="true">
          <span class="dot dot-red" />
          <span class="dot dot-yellow" />
          <span class="dot dot-green" />
        </div>
        <div class="terminal-title">
          bash — java {{ cleanClassName }} (预期控制台输出)
        </div>
      </div>
      <div class="terminal-body">
        <pre class="terminal-pre"><code>{{ outputText.trim() }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue';

const props = defineProps({
  taskNo: {
    type: Number,
    default: 1,
  },
  title: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    default: '',
  },
  templateCode: {
    type: String,
    required: true,
  },
  outputText: {
    type: String,
    default: '',
  },
});

const copied = ref(false);
let copyTimer = null;

const cleanClassName = computed(() => {
  if (!props.className) return 'Program';
  return props.className.replace(/\.java$/i, '');
});

const hasOutput = computed(() => {
  return typeof props.outputText === 'string' && props.outputText.trim().length > 0;
});

const copyCode = async () => {
  const text = props.templateCode;
  if (!text) return;

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      triggerCopiedState();
      return;
    }
  } catch (err) {
    console.warn('[PracticeCard] navigator.clipboard.writeText failed, using fallback.', err);
  }

  // 降级复制机制
  try {
    if (typeof document !== 'undefined') {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (successful) {
        triggerCopiedState();
        return;
      }
    }
  } catch (err) {
    console.error('[PracticeCard] Fallback copy failed:', err);
  }
};

const triggerCopiedState = () => {
  copied.value = true;
  if (copyTimer) clearTimeout(copyTimer);
  copyTimer = setTimeout(() => {
    copied.value = false;
  }, 2000);
};

onBeforeUnmount(() => {
  if (copyTimer) {
    clearTimeout(copyTimer);
  }
});
</script>

<style scoped>
.practice-card {
  margin: 1.5rem 0;
  border-radius: 10px;
  background: var(--vp-c-bg, #ffffff);
  border: 1px solid var(--vp-c-divider, rgba(226, 232, 240, 0.8));
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.practice-card:hover {
  border-color: var(--vp-c-brand-1, #38bdf8);
}

:global(.dark) .practice-card {
  background: var(--vp-c-bg-soft, #161618);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.45);
}

/* 顶部紧凑 Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 12px;
  padding: 8px 14px;
  min-height: 42px;
  background: var(--vp-c-bg-mute, #f8fafc);
  border-bottom: 1px solid var(--vp-c-divider, rgba(226, 232, 240, 0.8));
}

:global(.dark) .card-header {
  background: #1b1f27;
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.task-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: 0.02em;
  color: #ffffff;
  background: #2563eb;
}

:global(.dark) .task-badge {
  background: #3b82f6;
}

.task-title {
  margin: 0 !important;
  padding: 0 !important;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--vp-c-text-1, #0f172a);
  line-height: 1.35;
  display: inline-flex;
  align-items: center;
}

:global(.dark) .task-title {
  color: #f1f5f9;
}

.class-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  color: var(--vp-c-text-2, #64748b);
  background: var(--vp-c-bg, #ffffff);
  border: 1px solid var(--vp-c-divider, rgba(226, 232, 240, 0.8));
  line-height: 1.3;
}

.class-badge code {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.75rem;
  padding: 0;
  background: transparent;
  color: inherit;
}

:global(.dark) .class-badge {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #94a3b8;
}

.file-icon {
  opacity: 0.7;
}

.header-right {
  display: flex;
  align-items: center;
}

.copy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 10px;
  height: 28px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--vp-c-divider, rgba(203, 213, 225, 0.8));
  background: var(--vp-c-bg, #ffffff);
  color: var(--vp-c-text-1, #334155);
  transition: all 0.15s ease;
  user-select: none;
}

.copy-btn:hover {
  border-color: var(--vp-c-brand-1, #38bdf8);
  color: var(--vp-c-brand-1, #0284c7);
  background: var(--vp-c-bg-soft, #f8fafc);
}

.copy-btn.copied {
  border-color: #16a34a;
  background: rgba(22, 163, 74, 0.08);
  color: #16a34a;
}

:global(.dark) .copy-btn {
  background: #21262d;
  border-color: rgba(255, 255, 255, 0.12);
  color: #c9d1d9;
}

:global(.dark) .copy-btn:hover {
  border-color: #38bdf8;
  color: #38bdf8;
  background: #30363d;
}

:global(.dark) .copy-btn.copied {
  border-color: #4ade80;
  background: rgba(74, 222, 128, 0.12);
  color: #4ade80;
}

/* 核心代码区 */
.code-container {
  background: var(--vp-code-block-bg, #f6f8fa);
  overflow-x: auto;
}

:global(.dark) .code-container {
  background: var(--vp-code-block-bg, #161618);
}

.code-pre {
  margin: 0 !important;
  padding: 0.85rem 1.1rem !important;
  background: transparent !important;
  color: var(--vp-c-text-1, #1e293b);
  font-family: var(--vp-font-family-mono, 'JetBrains Mono', 'Fira Code', Menlo, monospace);
  font-size: 0.86rem;
  line-height: 1.6;
  white-space: pre;
  word-break: normal;
  tab-size: 4;
}

:global(.dark) .code-pre {
  color: #e2e8f0;
}

.code-pre code {
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  padding: 0;
  background: transparent;
}

.code-container :deep(div[class*='language-']) {
  margin: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.code-container :deep(button.copy) {
  display: none !important; /* 隐藏 VitePress 自带的内嵌复制按钮，使用我们顶部的专属按钮 */
}

.code-container :deep(span.lang) {
  display: none !important; /* 隐藏右侧的小 lang 标识 */
}

.code-container :deep(pre) {
  margin: 0 !important;
  padding: 0.85rem 1.1rem !important;
  background: transparent !important;
  font-family: var(--vp-font-family-mono, 'JetBrains Mono', monospace) !important;
  font-size: 0.86rem !important;
  line-height: 1.6 !important;
}

/* 仿真终端区 */
.terminal-container {
  background: #f1f5f9;
  border-top: 1px solid #cbd5e1;
}

:global(.dark) .terminal-container {
  background: #080c12;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.terminal-bar {
  display: flex;
  align-items: center;
  height: 28px;
  padding: 0 10px;
  background: #e2e8f0;
  border-bottom: 1px solid #cbd5e1;
  position: relative;
  user-select: none;
}

:global(.dark) .terminal-bar {
  background: #111620;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.mac-dots {
  display: flex;
  align-items: center;
  gap: 5px;
  z-index: 2;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  display: inline-block;
}

.dot-red { background: #ff5f56; }
.dot-yellow { background: #ffbd2e; }
.dot-green { background: #27c93f; }

.terminal-title {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.72rem;
  color: #475569;
  pointer-events: none;
}

:global(.dark) .terminal-title {
  color: #8b949e;
}

.terminal-body {
  padding: 0.75rem 1.1rem;
  overflow-x: auto;
}

.terminal-pre {
  margin: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  color: #0f766e;
  font-family: var(--vp-font-family-mono, 'JetBrains Mono', 'Fira Code', Menlo, monospace);
  font-size: 0.84rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}

:global(.dark) .terminal-pre {
  color: #4ade80;
}

.terminal-pre code {
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  padding: 0;
  background: transparent;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 8px 10px;
  }

  .header-right {
    width: 100%;
  }

  .copy-btn {
    width: 100%;
  }

  .terminal-title {
    position: static;
    text-align: left;
    padding-left: 8px;
  }
}
</style>
