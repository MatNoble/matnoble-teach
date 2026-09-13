<template>
  <ClientOnly>
    <div 
      class="elem-lab-container" 
      ref="containerRef"
      :class="{ 'is-fullscreen': isFullscreen }"
    >
      <!-- 顶栏：分类选择与全局视口控制 -->
      <div class="lab-header">
        <div class="category-tabs">
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            class="cat-tab-btn"
            :class="{ active: currentCategory === cat.id }"
            @click="selectCategory(cat.id)"
          >
            {{ cat.name }}
          </button>
        </div>
        <div class="header-actions">
          <button class="action-btn" @click="resetViewport" title="重置坐标系视口">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            <span>重置视口</span>
          </button>
          <button class="action-btn" @click="toggleFullscreen" :title="isFullscreen ? '退出全屏' : '全屏展示'">
            <svg v-if="!isFullscreen" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
            </svg>
            <span>{{ isFullscreen ? '退出全屏' : '全屏' }}</span>
          </button>
        </div>
      </div>

      <!-- 主工作区：左侧交互坐标画布 + 右侧学术实验控制台 -->
      <div class="lab-workspace">
        <!-- 左侧画布主视口 -->
        <div class="canvas-wrapper" ref="canvasWrapperRef">
          <canvas 
            ref="canvasRef"
            @mousedown="onMouseDown"
            @mousemove="onMouseMove"
            @mouseup="onMouseUp"
            @mouseleave="onMouseLeave"
            @wheel.prevent="onWheel"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
          ></canvas>

          <!-- 画布内悬浮 HUD 状态卡片 -->
          <div class="canvas-floating-hud">
            <div class="hud-item formula-hud">
              <span class="hud-label">解析式</span>
              <div class="hud-katex" v-html="renderedShortFormula"></div>
            </div>
            <div class="hud-item probe-hud" v-if="enableProbe && hoveredPoint">
              <span class="hud-label">探针动点</span>
              <div class="hud-math-row" v-html="renderedProbePoint"></div>
              <div class="hud-math-row derivative" v-if="hoveredPoint.derivative !== null">
                <span v-html="renderedProbeDeriv"></span>
                <span class="mono-badge" :class="hoveredPoint.derivative > 0 ? 'inc' : (hoveredPoint.derivative < 0 ? 'dec' : 'stat')">
                  {{ hoveredPoint.derivative > 0 ? '单调递增' : (hoveredPoint.derivative < 0 ? '单调递减' : '驻点') }}
                </span>
              </div>
            </div>
          </div>

          <!-- 缩放控制浮标 -->
          <div class="zoom-controls">
            <button class="zoom-btn" @click="zoomStep(1.2)" title="放大">+</button>
            <button class="zoom-btn" @click="zoomStep(0.83)" title="缩小">−</button>
          </div>
        </div>

        <!-- 右侧学术控制面板 -->
        <div class="lab-sidebar">
          <!-- 1. 函数预设切换 -->
          <div class="sidebar-card">
            <div class="card-title">函数选择与参数</div>
            <div class="preset-pills">
              <button 
                v-for="preset in currentCategoryPresets" 
                :key="preset.id"
                class="preset-pill-btn"
                :class="{ active: currentPresetId === preset.id }"
                @click="selectPreset(preset.id)"
                v-html="renderKatex(preset.pillKatex || preset.shortKatex)"
              >
              </button>
            </div>

            <!-- 参数连续调节滑块 -->
            <div class="param-slider-group" v-if="activeParam">
              <div class="param-slider-header">
                <span class="param-label" v-html="renderKatex(activeParam.label)"></span>
                <span class="param-value">{{ paramValue.toFixed(2) }}</span>
              </div>
              <div class="slider-container">
                <input 
                  type="range" 
                  :min="activeParam.min" 
                  :max="activeParam.max" 
                  :step="activeParam.step" 
                  v-model.number="paramValue"
                  class="param-slider"
                />
                <div class="slider-marks-track">
                  <div 
                    v-for="m in sliderMarks" 
                    :key="m" 
                    class="mark-tick-wrap"
                    :style="{ left: calcMarkLeft(m) }"
                    @click="paramValue = m"
                  >
                    <div class="mark-pip"></div>
                    <span class="mark-val">{{ m }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. 基本特性观察器 (开关) -->
          <div class="sidebar-card">
            <div class="card-title">基本特性观察器</div>
            <div class="switch-grid">
              <label class="feature-toggle" :class="{ active: showDomain }">
                <input type="checkbox" v-model="showDomain" />
                <span class="toggle-indicator domain"></span>
                <div class="toggle-text">
                  <span class="text-title">定义域投影</span>
                  <span class="text-sub"><span v-html="renderKatex('x')"></span> 轴正交光影带与端点</span>
                </div>
              </label>

              <label class="feature-toggle" :class="{ active: showRange }">
                <input type="checkbox" v-model="showRange" />
                <span class="toggle-indicator range"></span>
                <div class="toggle-text">
                  <span class="text-title">值域投影</span>
                  <span class="text-sub"><span v-html="renderKatex('y')"></span> 轴正交水平投影带</span>
                </div>
              </label>

              <label class="feature-toggle" :class="{ active: showParity }">
                <input type="checkbox" v-model="showParity" />
                <span class="toggle-indicator parity"></span>
                <div class="toggle-text">
                  <span class="text-title">奇偶性动态验证</span>
                  <span class="text-sub">对称连线与重合变换</span>
                </div>
              </label>

              <label class="feature-toggle" :class="{ active: showBoundedness }">
                <input type="checkbox" v-model="showBoundedness" />
                <span class="toggle-indicator bound"></span>
                <div class="toggle-text">
                  <span class="text-title">有界性夹逼带</span>
                  <span class="text-sub"><span v-html="renderKatex('[-M, M]')"></span> 上下界隔离带</span>
                </div>
              </label>

              <label class="feature-toggle" :class="{ active: enableProbe }">
                <input type="checkbox" v-model="enableProbe" />
                <span class="toggle-indicator probe"></span>
                <div class="toggle-text">
                  <span class="text-title">切线与导数探针</span>
                  <span class="text-sub">动点跟随与单调性分析</span>
                </div>
              </label>

              <label class="feature-toggle" :class="{ active: showInverse }" v-if="currentData.inverse">
                <input type="checkbox" v-model="showInverse" />
                <span class="toggle-indicator inverse"></span>
                <div class="toggle-text">
                  <span class="text-title">反函数对偶 (<span v-html="renderKatex('y=x')"></span>)</span>
                  <span class="text-sub">对角镜像图像对照</span>
                </div>
              </label>
            </div>

            <!-- 奇偶性专属动效演示 -->
            <div class="parity-action-box" v-if="showParity">
              <button 
                class="btn-symmetry-play" 
                @click="playSymmetryAnimation" 
                :disabled="isAnimatingSymmetry"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                <span>{{ isAnimatingSymmetry ? '变换中...' : '演示对称重合变换' }}</span>
              </button>
              <div class="parity-hint">
                {{ parityDescription }}
              </div>
            </div>

            <!-- 有界性界限滑块 -->
            <div class="bound-slider-box" v-if="showBoundedness">
              <div class="bound-header">
                <span>界限参数 <span v-html="renderKatex('M')"></span>:</span>
                <strong>{{ boundM.toFixed(1) }}</strong>
              </div>
              <input type="range" min="0.5" max="6" step="0.1" v-model.number="boundM" class="param-slider mini" />
              <div class="bound-status" :class="isCurrentFunctionBounded ? 'bounded' : 'unbounded'">
                <span v-if="isCurrentFunctionBounded">
                  ✓ 满足 <span v-html="renderKatex('|f(x)| \\le M')"></span> (有界)
                </span>
                <span v-else>
                  ⚠ 曲线穿透边界 (无界)
                </span>
              </div>
            </div>
          </div>

          <!-- 3. 数学性质公理化阐释面板 -->
          <div class="sidebar-card math-properties-card">
            <div class="card-title">数学性质公理化阐释</div>
            
            <div class="prop-item">
              <span class="prop-badge">定义域 <span v-html="renderKatex('\\operatorname{dom}(f)')"></span></span>
              <div class="prop-math" v-html="renderedDomain"></div>
            </div>

            <div class="prop-item">
              <span class="prop-badge">值域 <span v-html="renderKatex('\\operatorname{ran}(f)')"></span></span>
              <div class="prop-math" v-html="renderedRange"></div>
            </div>

            <div class="prop-item">
              <span class="prop-badge">奇偶性 (Parity)</span>
              <div class="prop-math" v-html="renderedParity"></div>
            </div>

            <div class="prop-item">
              <span class="prop-badge">有界性 (Boundedness)</span>
              <div class="prop-math" v-html="renderedBoundedness"></div>
            </div>

            <div class="prop-item" v-if="currentData.asymptotesText">
              <span class="prop-badge">渐近线 (Asymptotes)</span>
              <div class="prop-math" v-html="renderedAsymptotes"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// -------------------------------------------------------------
// 1. 五大类基本初等函数分类与定义
// -------------------------------------------------------------
const categories = [
  { id: 'power', name: '幂函数' },
  { id: 'exp', name: '指数函数' },
  { id: 'log', name: '对数函数' },
  { id: 'trig', name: '三角函数' },
  { id: 'inv_trig', name: '反三角函数' }
];

const currentCategory = ref('power');
const currentPresetId = ref('power_1');

const paramValue = ref(2);
const boundM = ref(2.0);

// 开关初始状态：默认保持干净纯粹，避免开局图面杂乱
const showDomain = ref(false);
const showRange = ref(false);
const showParity = ref(false);
const showBoundedness = ref(false);
const enableProbe = ref(true);
const showInverse = ref(false);

const isFullscreen = ref(false);
const isAnimatingSymmetry = ref(false);
const symmetryProgress = ref(0);
let animationFrameId = null;

// 坐标系视口：初始缩放为 46 像素/单位
const view = ref({
  centerX: 0,
  centerY: 0,
  scale: 46
});

const containerRef = ref(null);
const canvasWrapperRef = ref(null);
const canvasRef = ref(null);
const hoveredPoint = ref(null);

// -------------------------------------------------------------
// 2. 函数数学模型库
// -------------------------------------------------------------
const functionPresets = {
  power: [
    {
      id: 'power_1',
      name: 'y = x',
      pillKatex: 'y = x',
      shortKatex: 'y = x',
      domainKatex: '\\operatorname{dom}(f) = \\mathbb{R} = (-\\infty, +\\infty)',
      rangeKatex: '\\operatorname{ran}(f) = \\mathbb{R} = (-\\infty, +\\infty)',
      domainMin: -Infinity,
      domainMax: Infinity,
      rangeMin: -Infinity,
      rangeMax: Infinity,
      parityType: 'odd',
      parityKatex: 'f(-x) = -x = -f(x) \\implies \\text{奇函数 (关于原点对称)}',
      boundednessKatex: '\\lim_{x\\to\\pm\\infty}|f(x)| = +\\infty \\implies \\text{无界函数}',
      isBounded: false,
      fn: (x) => x,
      df: () => 1,
      domainCheck: () => true
    },
    {
      id: 'power_2',
      name: 'y = x²',
      pillKatex: 'y = x^2',
      shortKatex: 'y = x^2',
      domainKatex: '\\operatorname{dom}(f) = \\mathbb{R}',
      rangeKatex: '\\operatorname{ran}(f) = [0, +\\infty)',
      domainMin: -Infinity,
      domainMax: Infinity,
      rangeMin: 0,
      rangeMax: Infinity,
      rangeMinClosed: true,
      parityType: 'even',
      parityKatex: 'f(-x) = (-x)^2 = x^2 = f(x) \\implies \\text{偶函数 (关于 } y \\text{ 轴对称)}',
      boundednessKatex: 'f(x) \\ge 0 \\text{ (下有界)}，\\lim_{x\\to\\pm\\infty} f(x) = +\\infty \\implies \\text{无上界}',
      isBounded: false,
      fn: (x) => x * x,
      df: (x) => 2 * x,
      domainCheck: () => true
    },
    {
      id: 'power_3',
      name: 'y = x³',
      pillKatex: 'y = x^3',
      shortKatex: 'y = x^3',
      domainKatex: '\\operatorname{dom}(f) = \\mathbb{R}',
      rangeKatex: '\\operatorname{ran}(f) = \\mathbb{R}',
      domainMin: -Infinity,
      domainMax: Infinity,
      rangeMin: -Infinity,
      rangeMax: Infinity,
      parityType: 'odd',
      parityKatex: 'f(-x) = (-x)^3 = -x^3 = -f(x) \\implies \\text{奇函数}',
      boundednessKatex: '\\lim_{x\\to\\pm\\infty}|f(x)| = +\\infty \\implies \\text{无界函数}',
      isBounded: false,
      fn: (x) => x * x * x,
      df: (x) => 3 * x * x,
      domainCheck: () => true
    },
    {
      id: 'power_sqrt',
      name: 'y = √x',
      pillKatex: 'y = \\sqrt{x}',
      shortKatex: 'y = \\sqrt{x}',
      domainKatex: '\\operatorname{dom}(f) = [0, +\\infty)',
      rangeKatex: '\\operatorname{ran}(f) = [0, +\\infty)',
      domainMin: 0,
      domainMax: Infinity,
      domainMinClosed: true,
      rangeMin: 0,
      rangeMax: Infinity,
      rangeMinClosed: true,
      parityType: 'none',
      parityKatex: '\\text{定义域不关于原点对称} \\implies \\text{非奇非偶}',
      boundednessKatex: 'f(x) \\ge 0 \\text{ (下有界 0)}，\\lim_{x\\to+\\infty} f(x) = +\\infty \\implies \\text{无上界}',
      isBounded: false,
      fn: (x) => (x >= 0 ? Math.sqrt(x) : NaN),
      df: (x) => (x > 0 ? 0.5 / Math.sqrt(x) : null),
      domainCheck: (x) => x >= 0
    },
    {
      id: 'power_cbrt',
      name: 'y = ³√x',
      pillKatex: 'y = \\sqrt[3]{x}',
      shortKatex: 'y = \\sqrt[3]{x}',
      domainKatex: '\\operatorname{dom}(f) = \\mathbb{R}',
      rangeKatex: '\\operatorname{ran}(f) = \\mathbb{R}',
      domainMin: -Infinity,
      domainMax: Infinity,
      rangeMin: -Infinity,
      rangeMax: Infinity,
      parityType: 'odd',
      parityKatex: 'f(-x) = \\sqrt[3]{-x} = -\\sqrt[3]{x} = -f(x) \\implies \\text{奇函数}',
      boundednessKatex: '\\lim_{x\\to\\pm\\infty}|f(x)| = +\\infty \\implies \\text{无界函数}',
      isBounded: false,
      fn: (x) => Math.sign(x) * Math.pow(Math.abs(x), 1 / 3),
      df: (x) => (x !== 0 ? (1 / 3) * Math.pow(Math.abs(x), -2 / 3) : null),
      domainCheck: () => true
    },
    {
      id: 'power_inv',
      name: 'y = 1/x',
      pillKatex: 'y = \\frac{1}{x}',
      shortKatex: 'y = \\frac{1}{x}',
      domainKatex: '\\operatorname{dom}(f) = \\mathbb{R} \\setminus \\{0\\} = (-\\infty, 0) \\cup (0, +\\infty)',
      rangeKatex: '\\operatorname{ran}(f) = \\mathbb{R} \\setminus \\{0\\}',
      parityType: 'odd',
      parityKatex: 'f(-x) = \\frac{1}{-x} = -\\frac{1}{x} = -f(x) \\implies \\text{奇函数}',
      boundednessKatex: '\\lim_{x\\to 0^\\pm} |f(x)| = +\\infty \\implies \\text{无界函数}',
      asymptotesText: '\\text{水平渐近线 } y = 0，\\text{铅直渐近线 } x = 0',
      isBounded: false,
      fn: (x) => (Math.abs(x) > 1e-5 ? 1 / x : NaN),
      df: (x) => (Math.abs(x) > 1e-5 ? -1 / (x * x) : null),
      domainCheck: (x) => Math.abs(x) > 1e-5,
      discontinuityX: [0]
    },
    {
      id: 'power_custom',
      name: 'y = x^α',
      pillKatex: 'y = x^\\alpha',
      shortKatex: 'y = x^\\alpha',
      domainKatex: '\\text{随 } \\alpha \\text{ 动态相变}',
      rangeKatex: '\\text{取决于 } \\alpha \\text{ 奇偶性与符号}',
      parityType: 'dynamic',
      parityKatex: '\\alpha \\text{ 为偶整数时为偶函数，为奇整数时为奇函数}',
      boundednessKatex: '\\text{随 } \\alpha \\text{ 变动}',
      isBounded: false,
      param: {
        label: '\\text{指数 } \\alpha',
        min: -3,
        max: 3,
        step: 0.25,
        default: 2,
        marks: [-3, -2, -1, 0, 1, 2, 3]
      },
      fn: (x, a) => {
        if (Math.abs(a) < 1e-6) return 1;
        if (a < 0 && Math.abs(x) < 1e-4) return NaN;
        if (x < 0) {
          const isInt = Math.abs(Math.round(a) - a) < 1e-4;
          if (isInt) return Math.pow(x, Math.round(a));
          return NaN;
        }
        return Math.pow(x, a);
      },
      df: (x, a) => (x > 0 ? a * Math.pow(x, a - 1) : null),
      domainCheck: (x, a) => {
        if (a < 0 && Math.abs(x) < 1e-4) return false;
        if (x < 0 && Math.abs(Math.round(a) - a) > 1e-4) return false;
        return true;
      }
    }
  ],

  exp: [
    {
      id: 'exp_e',
      name: 'y = e^x',
      pillKatex: 'y = e^x',
      shortKatex: 'y = e^x',
      domainKatex: '\\operatorname{dom}(f) = \\mathbb{R} = (-\\infty, +\\infty)',
      rangeKatex: '\\operatorname{ran}(f) = (0, +\\infty)',
      domainMin: -Infinity,
      domainMax: Infinity,
      rangeMin: 0,
      rangeMax: Infinity,
      rangeMinClosed: false,
      parityType: 'none',
      parityKatex: 'f(-x) = e^{-x} \\neq \\pm f(x) \\implies \\text{非奇非偶}',
      boundednessKatex: 'f(x) > 0 \\text{ (下有界 0)}，\\lim_{x\\to+\\infty} e^x = +\\infty \\implies \\text{无上界}',
      asymptotesText: '\\lim_{x\\to-\\infty} e^x = 0 \\implies \\text{水平渐近线 } y = 0',
      isBounded: false,
      inverse: { name: 'y = \\ln x', fn: (x) => (x > 0 ? Math.log(x) : NaN) },
      fn: (x) => Math.exp(x),
      df: (x) => Math.exp(x),
      domainCheck: () => true
    },
    {
      id: 'exp_2',
      name: 'y = 2^x',
      pillKatex: 'y = 2^x',
      shortKatex: 'y = 2^x',
      domainKatex: '\\operatorname{dom}(f) = \\mathbb{R}',
      rangeKatex: '\\operatorname{ran}(f) = (0, +\\infty)',
      domainMin: -Infinity,
      domainMax: Infinity,
      rangeMin: 0,
      rangeMax: Infinity,
      rangeMinClosed: false,
      parityType: 'none',
      parityKatex: '\\text{非奇非偶 (与 } 2^{-x} \\text{ 沿 } y \\text{ 轴对称)}',
      boundednessKatex: 'f(x) > 0 \\text{ (下有界 0)}，\\text{无上界}',
      asymptotesText: '\\text{水平渐近线 } y = 0 \\ (x \\to -\\infty)',
      isBounded: false,
      inverse: { name: 'y = \\log_2 x', fn: (x) => (x > 0 ? Math.log2(x) : NaN) },
      fn: (x) => Math.pow(2, x),
      df: (x) => Math.pow(2, x) * Math.LN2,
      domainCheck: () => true
    },
    {
      id: 'exp_half',
      name: 'y = (1/2)^x',
      pillKatex: 'y = (\\frac{1}{2})^x',
      shortKatex: 'y = \\left(\\frac{1}{2}\\right)^x',
      domainKatex: '\\operatorname{dom}(f) = \\mathbb{R}',
      rangeKatex: '\\operatorname{ran}(f) = (0, +\\infty)',
      domainMin: -Infinity,
      domainMax: Infinity,
      rangeMin: 0,
      rangeMax: Infinity,
      rangeMinClosed: false,
      parityType: 'none',
      parityKatex: '\\text{非奇非偶}',
      boundednessKatex: 'f(x) > 0 \\text{ (下有界 0)}，\\text{无上界}',
      asymptotesText: '\\lim_{x\\to+\\infty} (1/2)^x = 0 \\implies \\text{水平渐近线 } y = 0',
      isBounded: false,
      fn: (x) => Math.pow(0.5, x),
      df: (x) => Math.pow(0.5, x) * Math.log(0.5),
      domainCheck: () => true
    },
    {
      id: 'exp_custom',
      name: 'y = a^x',
      pillKatex: 'y = a^x',
      shortKatex: 'y = a^x',
      domainKatex: '\\operatorname{dom}(f) = \\mathbb{R}',
      rangeKatex: '\\operatorname{ran}(f) = (0, +\\infty)',
      parityType: 'none',
      parityKatex: 'a > 1 \\text{ 严格递增；} 0 < a < 1 \\text{ 严格递减}',
      boundednessKatex: 'f(x) > 0 \\text{ (下有界)}，\\text{无上界}',
      isBounded: false,
      param: {
        label: '\\text{底数 } a',
        min: 0.2,
        max: 4.0,
        step: 0.05,
        default: 2,
        marks: [0.2, 1, 2, 3, 4]
      },
      fn: (x, a) => Math.pow(a, x),
      df: (x, a) => Math.pow(a, x) * Math.log(a),
      domainCheck: () => true
    }
  ],

  log: [
    {
      id: 'log_e',
      name: 'y = ln x',
      pillKatex: 'y = \\ln x',
      shortKatex: 'y = \\ln x',
      domainKatex: '\\operatorname{dom}(f) = (0, +\\infty)',
      rangeKatex: '\\operatorname{ran}(f) = \\mathbb{R} = (-\\infty, +\\infty)',
      domainMin: 0,
      domainMax: Infinity,
      domainMinClosed: false,
      rangeMin: -Infinity,
      rangeMax: Infinity,
      parityType: 'none',
      parityKatex: '\\text{定义域为 } (0, +\\infty) \\text{ 不对称} \\implies \\text{非奇非偶}',
      boundednessKatex: '\\lim_{x\\to 0^+} \\ln x = -\\infty, \\lim_{x\\to+\\infty} \\ln x = +\\infty \\implies \\text{无界}',
      asymptotesText: '\\lim_{x\\to 0^+} \\ln x = -\\infty \\implies \\text{铅直渐近线 } x = 0',
      isBounded: false,
      inverse: { name: 'y = e^x', fn: (x) => Math.exp(x) },
      fn: (x) => (x > 0 ? Math.log(x) : NaN),
      df: (x) => (x > 0 ? 1 / x : null),
      domainCheck: (x) => x > 0
    },
    {
      id: 'log_2',
      name: 'y = log₂ x',
      pillKatex: 'y = \\log_2 x',
      shortKatex: 'y = \\log_2 x',
      domainKatex: '\\operatorname{dom}(f) = (0, +\\infty)',
      rangeKatex: '\\operatorname{ran}(f) = \\mathbb{R}',
      domainMin: 0,
      domainMax: Infinity,
      domainMinClosed: false,
      rangeMin: -Infinity,
      rangeMax: Infinity,
      parityType: 'none',
      parityKatex: '\\text{非奇非偶 (与 } 2^x \\text{ 沿 } y=x \\text{ 对称)}',
      boundednessKatex: '\\text{无界函数}',
      asymptotesText: '\\text{铅直渐近线 } x = 0',
      isBounded: false,
      inverse: { name: 'y = 2^x', fn: (x) => Math.pow(2, x) },
      fn: (x) => (x > 0 ? Math.log2(x) : NaN),
      df: (x) => (x > 0 ? 1 / (x * Math.LN2) : null),
      domainCheck: (x) => x > 0
    },
    {
      id: 'log_10',
      name: 'y = lg x',
      pillKatex: 'y = \\lg x',
      shortKatex: 'y = \\lg x',
      domainKatex: '\\operatorname{dom}(f) = (0, +\\infty)',
      rangeKatex: '\\operatorname{ran}(f) = \\mathbb{R}',
      domainMin: 0,
      domainMax: Infinity,
      domainMinClosed: false,
      rangeMin: -Infinity,
      rangeMax: Infinity,
      parityType: 'none',
      parityKatex: '\\text{非奇非偶}',
      boundednessKatex: '\\text{无界函数 (增长速率极其缓慢)}',
      asymptotesText: '\\text{铅直渐近线 } x = 0',
      isBounded: false,
      fn: (x) => (x > 0 ? Math.log10(x) : NaN),
      df: (x) => (x > 0 ? 1 / (x * Math.LN10) : null),
      domainCheck: (x) => x > 0
    },
    {
      id: 'log_custom',
      name: 'y = log_a x',
      pillKatex: 'y = \\log_a x',
      shortKatex: 'y = \\log_a x',
      domainKatex: '\\operatorname{dom}(f) = (0, +\\infty)',
      rangeKatex: '\\operatorname{ran}(f) = \\mathbb{R}',
      parityType: 'none',
      parityKatex: 'a > 1 \\text{ 单调增；} 0 < a < 1 \\text{ 单调减}',
      boundednessKatex: '\\text{无界函数}',
      asymptotesText: '\\text{铅直渐近线 } x = 0',
      isBounded: false,
      param: {
        label: '\\text{底数 } a',
        min: 0.2,
        max: 4.0,
        step: 0.05,
        default: 2,
        marks: [0.2, 1, 2, 3, 4]
      },
      fn: (x, a) => (x > 0 && Math.abs(a - 1) > 0.01 ? Math.log(x) / Math.log(a) : NaN),
      df: (x, a) => (x > 0 && Math.abs(a - 1) > 0.01 ? 1 / (x * Math.log(a)) : null),
      domainCheck: (x) => x > 0
    }
  ],

  trig: [
    {
      id: 'trig_sin',
      name: 'y = sin x',
      pillKatex: 'y = \\sin x',
      shortKatex: 'y = \\sin x',
      domainKatex: '\\operatorname{dom}(f) = \\mathbb{R}',
      rangeKatex: '\\operatorname{ran}(f) = [-1, 1]',
      domainMin: -Infinity,
      domainMax: Infinity,
      rangeMin: -1,
      rangeMax: 1,
      rangeMinClosed: true,
      rangeMaxClosed: true,
      parityType: 'odd',
      parityKatex: 'f(-x) = \\sin(-x) = -\\sin x = -f(x) \\implies \\text{奇函数 (原点对称)}',
      boundednessKatex: '\\forall x \\in \\mathbb{R}, |\\sin x| \\le 1 \\implies \\text{严格有界 (界限 } M = 1)',
      asymptotesText: '\\text{无渐近线，周期 } T = 2\\pi',
      isBounded: true,
      defaultM: 1.0,
      inverse: { name: 'y = \\arcsin x', fn: (x) => (Math.abs(x) <= 1 ? Math.asin(x) : NaN) },
      fn: (x) => Math.sin(x),
      df: (x) => Math.cos(x),
      domainCheck: () => true
    },
    {
      id: 'trig_cos',
      name: 'y = cos x',
      pillKatex: 'y = \\cos x',
      shortKatex: 'y = \\cos x',
      domainKatex: '\\operatorname{dom}(f) = \\mathbb{R}',
      rangeKatex: '\\operatorname{ran}(f) = [-1, 1]',
      domainMin: -Infinity,
      domainMax: Infinity,
      rangeMin: -1,
      rangeMax: 1,
      rangeMinClosed: true,
      rangeMaxClosed: true,
      parityType: 'even',
      parityKatex: 'f(-x) = \\cos(-x) = \\cos x = f(x) \\implies \\text{偶函数 (} y \\text{ 轴对称)}',
      boundednessKatex: '\\forall x \\in \\mathbb{R}, |\\cos x| \\le 1 \\implies \\text{严格有界 (界限 } M = 1)',
      asymptotesText: '\\text{无渐近线，周期 } T = 2\\pi',
      isBounded: true,
      defaultM: 1.0,
      fn: (x) => Math.cos(x),
      df: (x) => -Math.sin(x),
      domainCheck: () => true
    },
    {
      id: 'trig_tan',
      name: 'y = tan x',
      pillKatex: 'y = \\tan x',
      shortKatex: 'y = \\tan x',
      domainKatex: '\\operatorname{dom}(f) = \\{x \\in \\mathbb{R} \\mid x \\neq k\\pi + \\frac{\\pi}{2}\\}',
      rangeKatex: '\\operatorname{ran}(f) = \\mathbb{R}',
      parityType: 'odd',
      parityKatex: 'f(-x) = \\tan(-x) = -\\tan x = -f(x) \\implies \\text{奇函数}',
      boundednessKatex: '\\lim_{x\\to (k\\pi + \\frac{\\pi}{2})^\\pm} |\\tan x| = +\\infty \\implies \\text{无界函数}',
      asymptotesText: '\\text{周期性铅直渐近线 } x = k\\pi + \\frac{\\pi}{2} \\ (k \\in \\mathbb{Z})',
      isBounded: false,
      inverse: { name: 'y = \\arctan x', fn: (x) => Math.atan(x) },
      fn: (x) => {
        const cosVal = Math.cos(x);
        if (Math.abs(cosVal) < 1e-4) return NaN;
        const res = Math.tan(x);
        return Math.abs(res) < 30 ? res : NaN;
      },
      df: (x) => {
        const cosVal = Math.cos(x);
        return Math.abs(cosVal) > 1e-4 ? 1 / (cosVal * cosVal) : null;
      },
      domainCheck: (x) => Math.abs(Math.cos(x)) > 1e-3
    },
    {
      id: 'trig_cot',
      name: 'y = cot x',
      pillKatex: 'y = \\cot x',
      shortKatex: 'y = \\cot x',
      domainKatex: '\\operatorname{dom}(f) = \\{x \\in \\mathbb{R} \\mid x \\neq k\\pi, k \\in \\mathbb{Z}\\}',
      rangeKatex: '\\operatorname{ran}(f) = \\mathbb{R}',
      parityType: 'odd',
      parityKatex: 'f(-x) = \\cot(-x) = -\\cot x = -f(x) \\implies \\text{奇函数}',
      boundednessKatex: '\\text{无界函数}',
      asymptotesText: '\\text{铅直渐近线 } x = k\\pi \\ (k \\in \\mathbb{Z})',
      isBounded: false,
      fn: (x) => {
        const sinVal = Math.sin(x);
        if (Math.abs(sinVal) < 1e-4) return NaN;
        const res = 1 / Math.tan(x);
        return Math.abs(res) < 30 ? res : NaN;
      },
      df: (x) => {
        const sinVal = Math.sin(x);
        return Math.abs(sinVal) > 1e-4 ? -1 / (sinVal * sinVal) : null;
      },
      domainCheck: (x) => Math.abs(Math.sin(x)) > 1e-3
    }
  ],

  inv_trig: [
    {
      id: 'inv_asin',
      name: 'y = arcsin x',
      pillKatex: 'y = \\arcsin x',
      shortKatex: 'y = \\arcsin x',
      domainKatex: '\\operatorname{dom}(f) = [-1, 1]',
      rangeKatex: '\\operatorname{ran}(f) = [-\\frac{\\pi}{2}, \\frac{\\pi}{2}]',
      domainMin: -1,
      domainMax: 1,
      domainMinClosed: true,
      domainMaxClosed: true,
      rangeMin: -Math.PI / 2,
      rangeMax: Math.PI / 2,
      rangeMinClosed: true,
      rangeMaxClosed: true,
      parityType: 'odd',
      parityKatex: 'f(-x) = \\arcsin(-x) = -\\arcsin x = -f(x) \\implies \\text{奇函数}',
      boundednessKatex: '|\\arcsin x| \\le \\frac{\\pi}{2} \\approx 1.571 \\implies \\text{严格有界}',
      asymptotesText: '\\text{无渐近线，端点 } x = \\pm 1 \\text{ 处切线铅直}',
      isBounded: true,
      defaultM: Math.PI / 2,
      parametricFn: (t) => ({ x: Math.sin(t), y: t }),
      tRange: [-Math.PI / 2, Math.PI / 2],
      curveEndpoints: [
        { x: -1, y: -Math.PI / 2 },
        { x: 1, y: Math.PI / 2 }
      ],
      fn: (x) => (Math.abs(x) <= 1 ? Math.asin(x) : NaN),
      df: (x) => (Math.abs(x) < 1 ? 1 / Math.sqrt(1 - x * x) : null),
      domainCheck: (x) => Math.abs(x) <= 1
    },
    {
      id: 'inv_acos',
      name: 'y = arccos x',
      pillKatex: 'y = \\arccos x',
      shortKatex: 'y = \\arccos x',
      domainKatex: '\\operatorname{dom}(f) = [-1, 1]',
      rangeKatex: '\\operatorname{ran}(f) = [0, \\pi]',
      domainMin: -1,
      domainMax: 1,
      domainMinClosed: true,
      domainMaxClosed: true,
      rangeMin: 0,
      rangeMax: Math.PI,
      rangeMinClosed: true,
      rangeMaxClosed: true,
      parityType: 'none',
      parityKatex: 'f(-x) + f(x) = \\pi \\implies \\text{非奇非偶 (关于点 } (0, \\frac{\\pi}{2}) \\text{ 中心对称)}',
      boundednessKatex: '0 \\le \\arccos x \\le \\pi \\approx 3.142 \\implies \\text{严格有界}',
      asymptotesText: '\\text{无渐近线}',
      isBounded: true,
      defaultM: Math.PI,
      parametricFn: (t) => ({ x: Math.cos(t), y: t }),
      tRange: [0, Math.PI],
      curveEndpoints: [
        { x: -1, y: Math.PI },
        { x: 1, y: 0 }
      ],
      fn: (x) => (Math.abs(x) <= 1 ? Math.acos(x) : NaN),
      df: (x) => (Math.abs(x) < 1 ? -1 / Math.sqrt(1 - x * x) : null),
      domainCheck: (x) => Math.abs(x) <= 1
    },
    {
      id: 'inv_atan',
      name: 'y = arctan x',
      pillKatex: 'y = \\arctan x',
      shortKatex: 'y = \\arctan x',
      domainKatex: '\\operatorname{dom}(f) = \\mathbb{R}',
      rangeKatex: '\\operatorname{ran}(f) = (-\\frac{\\pi}{2}, \\frac{\\pi}{2})',
      domainMin: -Infinity,
      domainMax: Infinity,
      rangeMin: -Math.PI / 2,
      rangeMax: Math.PI / 2,
      rangeMinClosed: false,
      rangeMaxClosed: false,
      parityType: 'odd',
      parityKatex: 'f(-x) = \\arctan(-x) = -\\arctan x = -f(x) \\implies \\text{奇函数}',
      boundednessKatex: '|\\arctan x| < \\frac{\\pi}{2} \\implies \\text{严格有界 (界限 } M = \\frac{\\pi}{2})',
      asymptotesText: '\\lim_{x\\to\\pm\\infty} \\arctan x = \\pm\\frac{\\pi}{2} \\implies \\text{水平渐近线 } y = \\pm\\frac{\\pi}{2}',
      isBounded: true,
      defaultM: Math.PI / 2,
      fn: (x) => Math.atan(x),
      df: (x) => 1 / (1 + x * x),
      domainCheck: () => true
    },
    {
      id: 'inv_acot',
      name: 'y = arccot x',
      pillKatex: 'y = \\operatorname{arccot} x',
      shortKatex: 'y = \\operatorname{arccot} x',
      domainKatex: '\\operatorname{dom}(f) = \\mathbb{R}',
      rangeKatex: '\\operatorname{ran}(f) = (0, \\pi)',
      domainMin: -Infinity,
      domainMax: Infinity,
      rangeMin: 0,
      rangeMax: Math.PI,
      rangeMinClosed: false,
      rangeMaxClosed: false,
      parityType: 'none',
      parityKatex: '\\operatorname{arccot}(-x) = \\pi - \\operatorname{arccot} x \\implies \\text{非奇非偶}',
      boundednessKatex: '0 < \\operatorname{arccot} x < \\pi \\implies \\text{严格有界}',
      asymptotesText: '\\lim_{x\\to+\\infty} = 0, \\lim_{x\\to-\\infty} = \\pi \\implies \\text{水平渐近线 } y = 0 \\text{ 与 } y = \\pi',
      isBounded: true,
      defaultM: Math.PI,
      fn: (x) => Math.PI / 2 - Math.atan(x),
      df: (x) => -1 / (1 + x * x),
      domainCheck: () => true
    }
  ]
};

// -------------------------------------------------------------
// 3. 计算属性与 KaTeX 渲染辅助
// -------------------------------------------------------------
function renderKatex(tex, display = false) {
  if (!tex) return '';
  try {
    return katex.renderToString(tex, {
      displayMode: display,
      throwOnError: false
    });
  } catch (e) {
    return tex;
  }
}

const currentCategoryPresets = computed(() => {
  return functionPresets[currentCategory.value] || [];
});

const currentData = computed(() => {
  const list = currentCategoryPresets.value;
  return list.find((item) => item.id === currentPresetId.value) || list[0];
});

const activeParam = computed(() => currentData.value?.param || null);

const isCurrentFunctionBounded = computed(() => {
  return currentData.value?.isBounded || false;
});

const parityDescription = computed(() => {
  if (currentData.value.parityType === 'even') {
    return '偶函数：图像关于 y 轴对称。沿 y 轴对折后，两侧曲线完全重合。';
  } else if (currentData.value.parityType === 'odd') {
    return '奇函数：图像关于原点中心对称。绕原点旋转 180° 后，与原曲线完全重合。';
  } else {
    return '非奇非偶：图像不具备轴对称或中心对称特性，变换后产生残差。';
  }
});

const renderedShortFormula = computed(() => renderKatex(currentData.value.shortKatex, false));
const renderedDomain = computed(() => renderKatex(currentData.value.domainKatex, true));
const renderedRange = computed(() => renderKatex(currentData.value.rangeKatex, true));
const renderedParity = computed(() => renderKatex(currentData.value.parityKatex, true));
const renderedBoundedness = computed(() => renderKatex(currentData.value.boundednessKatex, true));
const renderedAsymptotes = computed(() => renderKatex(currentData.value.asymptotesText, true));

const renderedProbePoint = computed(() => {
  if (!hoveredPoint.value) return '';
  const x = hoveredPoint.value.x;
  const y = hoveredPoint.value.y;
  if (currentCategory.value === 'trig') {
    const piRatio = x / Math.PI;
    const piStr = Math.abs(piRatio) < 1e-3 ? '0' : `${piRatio.toFixed(2)}\\pi`;
    return renderKatex(`x_0 = ${x.toFixed(2)} \\approx ${piStr},\\quad f(x_0) = ${y.toFixed(2)}`, false);
  } else if (currentCategory.value === 'inv_trig') {
    const piRatio = y / Math.PI;
    const piStr = Math.abs(piRatio) < 1e-3 ? '0' : `${piRatio.toFixed(2)}\\pi`;
    return renderKatex(`x_0 = ${x.toFixed(2)},\\quad f(x_0) = ${y.toFixed(2)} \\approx ${piStr}`, false);
  }
  return renderKatex(`x_0 = ${x.toFixed(2)},\\quad f(x_0) = ${y.toFixed(2)}`, false);
});

const renderedProbeDeriv = computed(() => {
  if (!hoveredPoint.value || hoveredPoint.value.derivative === null) return '';
  const d = hoveredPoint.value.derivative.toFixed(3);
  return renderKatex(`f'(x_0) = ${d}`, false);
});

const sliderMarks = computed(() => {
  if (!activeParam.value) return [];
  return activeParam.value.marks || [];
});

function calcMarkLeft(m) {
  if (!activeParam.value) return '0%';
  const min = activeParam.value.min;
  const max = activeParam.value.max;
  const p = Math.max(0, Math.min(1, (m - min) / (max - min)));
  return `calc(8px + ${p} * (100% - 16px))`;
}

// -------------------------------------------------------------
// 4. 事件响应与切换
// -------------------------------------------------------------
function selectCategory(catId) {
  currentCategory.value = catId;
  const presets = functionPresets[catId];
  if (presets && presets.length > 0) {
    selectPreset(presets[0].id);
  }
}

function selectPreset(presetId) {
  currentPresetId.value = presetId;
  const target = functionPresets[currentCategory.value]?.find((p) => p.id === presetId);
  if (target) {
    if (target.param) {
      paramValue.value = target.param.default;
    }
    if (target.defaultM) {
      boundM.value = target.defaultM;
    } else {
      boundM.value = 2.0;
    }
  }
  hoveredPoint.value = null;
  resetSymmetryAnimation();
  nextTick(redraw);
}

function resetViewport() {
  view.value.centerX = 0;
  view.value.centerY = 0;
  if (currentCategory.value === 'trig') {
    view.value.scale = 50;
  } else if (currentCategory.value === 'inv_trig') {
    view.value.scale = 80;
  } else {
    view.value.scale = 46;
  }
  redraw();
}

function zoomStep(factor) {
  view.value.scale = Math.max(18, Math.min(220, view.value.scale * factor));
  redraw();
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
  nextTick(() => {
    handleResize();
  });
}

function playSymmetryAnimation() {
  if (isAnimatingSymmetry.value) return;
  isAnimatingSymmetry.value = true;
  symmetryProgress.value = 0;
  const startTime = performance.now();
  const duration = 1200;

  function step(time) {
    const elapsed = time - startTime;
    const p = Math.min(1, elapsed / duration);
    symmetryProgress.value = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    redraw();

    if (p < 1) {
      animationFrameId = requestAnimationFrame(step);
    } else {
      setTimeout(() => {
        const backStart = performance.now();
        function stepBack(t2) {
          const e2 = t2 - backStart;
          const p2 = Math.min(1, e2 / 800);
          symmetryProgress.value = 1 - (p2 < 0.5 ? 2 * p2 * p2 : 1 - Math.pow(-2 * p2 + 2, 2) / 2);
          redraw();
          if (p2 < 1) {
            animationFrameId = requestAnimationFrame(stepBack);
          } else {
            isAnimatingSymmetry.value = false;
            symmetryProgress.value = 0;
            redraw();
          }
        }
        animationFrameId = requestAnimationFrame(stepBack);
      }, 600);
    }
  }
  animationFrameId = requestAnimationFrame(step);
}

function resetSymmetryAnimation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  isAnimatingSymmetry.value = false;
  symmetryProgress.value = 0;
}

// -------------------------------------------------------------
// 5. 坐标系转换与高清 Canvas 渲染
// -------------------------------------------------------------
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let viewStartX = 0;
let viewStartY = 0;

function toScreenX(mathX, width) {
  return width / 2 + (mathX - view.value.centerX) * view.value.scale;
}

function toScreenY(mathY, height) {
  return height / 2 - (mathY - view.value.centerY) * view.value.scale;
}

function toMathX(screenX, width) {
  return (screenX - width / 2) / view.value.scale + view.value.centerX;
}

function toMathY(screenY, height) {
  return (height / 2 - screenY) / view.value.scale + view.value.centerY;
}

function handleResize() {
  const canvas = canvasRef.value;
  const wrapper = canvasWrapperRef.value;
  if (!canvas || !wrapper) return;

  const rect = wrapper.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;

  redraw();
}

function redraw() {
  const canvas = canvasRef.value;
  if (!canvas || !canvas.width || !canvas.height) return;

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  const width = canvas.width / dpr;
  const height = canvas.height / dpr;

  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  const isDark = document.documentElement.classList.contains('dark');

  // 1. 学术坐标系与网格
  drawGrid(ctx, width, height, isDark);

  // 2. 有界性夹逼条带 [-M, M]
  if (showBoundedness.value) {
    drawBoundednessBand(ctx, width, height, isDark);
  }

  // 3. 反函数对照 y = x
  if (showInverse.value && currentData.value.inverse) {
    drawInverseFunction(ctx, width, height, isDark);
  }

  // 4. 定义域与值域正交光影投影带 (优雅投影轨)
  if (showDomain.value) {
    drawDomainProjection(ctx, width, height, isDark);
  }
  if (showRange.value) {
    drawRangeProjection(ctx, width, height, isDark);
  }

  // 5. 主函数曲线
  drawMainCurve(ctx, width, height, isDark);

  // 6. 奇偶性对称演示
  if (showParity.value) {
    drawParityVerification(ctx, width, height, isDark);
  }

  // 7. 微积分探针
  if (enableProbe.value && hoveredPoint.value) {
    drawTangentProbe(ctx, width, height, isDark);
  }

  ctx.restore();
}

function calcDecimalStep(minPixels, scale) {
  let step = 1;
  const rawStep = minPixels / scale;
  const power = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const frac = rawStep / power;
  if (frac <= 1) step = 1 * power;
  else if (frac <= 2) step = 2 * power;
  else if (frac <= 5) step = 5 * power;
  else step = 10 * power;
  return step;
}

function calcPiStep(minPixels, scale) {
  const rawStep = minPixels / scale;
  if (rawStep < (Math.PI / 4) * 1.3) return Math.PI / 4;
  if (rawStep < (Math.PI / 2) * 1.3) return Math.PI / 2;
  if (rawStep < Math.PI * 1.3) return Math.PI;
  return 2 * Math.PI;
}

function formatPi(val) {
  const eps = 1e-3;
  if (Math.abs(val) < eps) return '0';
  const sign = val < 0 ? '-' : '';
  const absVal = Math.abs(val);

  const n4 = Math.round(absVal / (Math.PI / 4));
  if (Math.abs(absVal - n4 * (Math.PI / 4)) < eps) {
    if (n4 === 4) return `${sign}π`;
    if (n4 === 8) return `${sign}2π`;
    if (n4 === 12) return `${sign}3π`;
    if (n4 === 16) return `${sign}4π`;
    if (n4 === 2) return `${sign}π/2`;
    if (n4 === 6) return `${sign}3π/2`;
    if (n4 === 10) return `${sign}5π/2`;
    if (n4 === 1) return `${sign}π/4`;
    if (n4 === 3) return `${sign}3π/4`;
    if (n4 === 5) return `${sign}5π/4`;
    if (n4 === 7) return `${sign}7π/4`;
    return `${sign}${n4}π/4`;
  }
  return parseFloat(val.toFixed(2)).toString();
}

function drawGrid(ctx, width, height, isDark) {
  const originX = toScreenX(0, width);
  const originY = toScreenY(0, height);

  const isTrig = currentCategory.value === 'trig';
  const isInvTrig = currentCategory.value === 'inv_trig';

  const stepX = isTrig ? calcPiStep(50, view.value.scale) : calcDecimalStep(50, view.value.scale);
  const stepY = isInvTrig ? calcPiStep(40, view.value.scale) : calcDecimalStep(50, view.value.scale);

  const subStepX = isTrig ? (stepX === Math.PI ? Math.PI / 2 : (stepX === Math.PI / 2 ? Math.PI / 4 : stepX / 2)) : stepX / 5;
  const subStepY = isInvTrig ? (stepY === Math.PI ? Math.PI / 2 : (stepY === Math.PI / 2 ? Math.PI / 4 : stepY / 2)) : stepY / 5;

  const minX = toMathX(0, width);
  const maxX = toMathX(width, width);
  const minY = toMathY(height, height);
  const maxY = toMathY(0, height);

  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)';
  const subGridColor = isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.015)';
  const axisColor = isDark ? '#94a3b8' : '#334155';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  // 细子网格
  ctx.beginPath();
  ctx.strokeStyle = subGridColor;
  ctx.lineWidth = 1;
  const startSubX = Math.floor(minX / subStepX) * subStepX;
  for (let x = startSubX; x <= maxX; x += subStepX) {
    const sx = Math.round(toScreenX(x, width)) + 0.5;
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx, height);
  }
  const startSubY = Math.floor(minY / subStepY) * subStepY;
  for (let y = startSubY; y <= maxY; y += subStepY) {
    const sy = Math.round(toScreenY(y, height)) + 0.5;
    ctx.moveTo(0, sy);
    ctx.lineTo(width, sy);
  }
  ctx.stroke();

  // 主网格
  ctx.beginPath();
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  const startX = Math.floor(minX / stepX) * stepX;
  for (let x = startX; x <= maxX; x += stepX) {
    const sx = Math.round(toScreenX(x, width)) + 0.5;
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx, height);
  }
  const startY = Math.floor(minY / stepY) * stepY;
  for (let y = startY; y <= maxY; y += stepY) {
    const sy = Math.round(toScreenY(y, height)) + 0.5;
    ctx.moveTo(0, sy);
    ctx.lineTo(width, sy);
  }
  ctx.stroke();

  // X 轴与 Y 轴
  ctx.beginPath();
  ctx.strokeStyle = axisColor;
  ctx.lineWidth = 1.6;

  if (originY >= 0 && originY <= height) {
    ctx.moveTo(0, Math.round(originY) + 0.5);
    ctx.lineTo(width, Math.round(originY) + 0.5);
  }
  if (originX >= 0 && originX <= width) {
    ctx.moveTo(Math.round(originX) + 0.5, 0);
    ctx.lineTo(Math.round(originX) + 0.5, height);
  }
  ctx.stroke();

  // 刻度文字
  ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  const textY = Math.max(10, Math.min(height - 20, originY + 5));
  for (let x = startX; x <= maxX; x += stepX) {
    if (Math.abs(x) < 1e-4) continue;
    const sx = Math.round(toScreenX(x, width)) + 0.5;
    if (sx >= 15 && sx <= width - 15) {
      ctx.beginPath();
      ctx.strokeStyle = axisColor;
      ctx.lineWidth = 1;
      ctx.moveTo(sx, originY - 3);
      ctx.lineTo(sx, originY + 3);
      ctx.stroke();

      const label = isTrig 
        ? formatPi(x) 
        : (Math.abs(x) < 1e-3 ? x.toExponential(1) : parseFloat(x.toFixed(2)).toString());
      ctx.fillText(label, sx, textY);
    }
  }

  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const textX = Math.max(28, Math.min(width - 10, originX - 6));
  for (let y = startY; y <= maxY; y += stepY) {
    if (Math.abs(y) < 1e-4) continue;
    const sy = Math.round(toScreenY(y, height)) + 0.5;
    if (sy >= 15 && sy <= height - 15) {
      ctx.beginPath();
      ctx.strokeStyle = axisColor;
      ctx.lineWidth = 1;
      ctx.moveTo(originX - 3, sy);
      ctx.lineTo(originX + 3, sy);
      ctx.stroke();

      const label = isInvTrig
        ? formatPi(y)
        : (Math.abs(y) < 1e-3 ? y.toExponential(1) : parseFloat(y.toFixed(2)).toString());
      ctx.fillText(label, textX, sy);
    }
  }

  // 坐标轴标签 (x, y, O)
  ctx.font = 'italic bold 13px serif';
  ctx.fillStyle = axisColor;
  if (originX >= 0 && originX <= width) {
    ctx.fillText('y', originX + 16, 16);
  }
  if (originY >= 0 && originY <= height) {
    ctx.fillText('x', width - 14, originY - 14);
  }
  ctx.font = '11px sans-serif';
  ctx.fillText('0', originX - 8, originY + 6);
}

function drawBoundednessBand(ctx, width, height, isDark) {
  const M = boundM.value;
  const syTop = toScreenY(M, height);
  const syBottom = toScreenY(-M, height);

  ctx.fillStyle = isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(37, 99, 235, 0.05)';
  ctx.fillRect(0, syTop, width, syBottom - syTop);

  ctx.beginPath();
  ctx.setLineDash([5, 4]);
  ctx.strokeStyle = isDark ? 'rgba(96, 165, 250, 0.7)' : 'rgba(37, 99, 235, 0.7)';
  ctx.lineWidth = 1.2;

  ctx.moveTo(0, syTop);
  ctx.lineTo(width, syTop);

  ctx.moveTo(0, syBottom);
  ctx.lineTo(width, syBottom);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.font = '11px sans-serif';
  ctx.fillStyle = isDark ? '#93c5fd' : '#2563eb';
  ctx.textAlign = 'left';
  ctx.fillText(`+M = ${M.toFixed(1)}`, 14, syTop - 5);
  ctx.fillText(`-M = -${M.toFixed(1)}`, 14, syBottom + 13);
}

function drawInverseFunction(ctx, width, height, isDark) {
  const inv = currentData.value.inverse;
  if (!inv) return;

  // y = x 对称线
  ctx.beginPath();
  ctx.setLineDash([5, 4]);
  ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.4)' : 'rgba(100, 116, 139, 0.4)';
  ctx.lineWidth = 1.2;
  const x1 = toMathX(0, width);
  const x2 = toMathX(width, width);
  ctx.moveTo(0, toScreenY(x1, height));
  ctx.lineTo(width, toScreenY(x2, height));
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.font = 'italic 11px serif';
  ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
  ctx.fillText('y = x', width - 38, toScreenY(toMathX(width - 38, width), height) - 6);

  // 反函数虚线
  ctx.beginPath();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = isDark ? '#f472b6' : '#db2777';
  ctx.lineWidth = 1.6;

  let started = false;
  const stepPx = 2;
  for (let sx = 0; sx <= width; sx += stepPx) {
    const mx = toMathX(sx, width);
    const my = inv.fn(mx);
    if (isNaN(my) || !isFinite(my)) {
      started = false;
      continue;
    }
    const sy = toScreenY(my, height);
    if (!started) {
      ctx.moveTo(sx, sy);
      started = true;
    } else {
      ctx.lineTo(sx, sy);
    }
  }
  ctx.stroke();
  ctx.setLineDash([]);
}

// 优雅的定义域 X 轴高亮条带（不污染全屏背景）
function drawDomainProjection(ctx, width, height, isDark) {
  const originY = toScreenY(0, height);
  const data = currentData.value;
  const param = paramValue.value;

  // 在 X 轴上下方绘制一条清爽的发光轨道
  ctx.fillStyle = isDark ? 'rgba(16, 185, 129, 0.22)' : 'rgba(16, 185, 129, 0.18)';
  ctx.strokeStyle = isDark ? '#34d399' : '#059669';
  ctx.lineWidth = 4;

  // 若具有理论明确的单连通定义域区间 (如 [-1, 1], [0, +inf), (-inf, +inf))
  if (data.domainMin !== undefined && data.domainMax !== undefined && !data.discontinuityX && !data.isPeriodicTrig) {
    const screenLeftMath = toMathX(0, width);
    const screenRightMath = toMathX(width, width);

    const effMinX = isFinite(data.domainMin) ? Math.max(data.domainMin, screenLeftMath) : screenLeftMath;
    const effMaxX = isFinite(data.domainMax) ? Math.min(data.domainMax, screenRightMath) : screenRightMath;

    if (effMinX <= effMaxX) {
      const sxStart = toScreenX(effMinX, width);
      const sxEnd = toScreenX(effMaxX, width);
      ctx.beginPath();
      ctx.moveTo(sxStart, originY);
      ctx.lineTo(sxEnd, originY);
      ctx.stroke();
    }
  } else {
    // 通用步进采样 (适用于 tan x, cot x, 1/x 等间断点函数)
    const stepPx = 2;
    let inSegment = false;
    let segStartX = 0;

    for (let sx = 0; sx <= width; sx += stepPx) {
      const mx = toMathX(sx, width);
      const isValid = data.domainCheck ? data.domainCheck(mx, param) : true;
      const my = data.fn(mx, param);

      if (isValid && !isNaN(my) && isFinite(my)) {
        if (!inSegment) {
          inSegment = true;
          segStartX = sx;
        }
      } else {
        if (inSegment) {
          ctx.beginPath();
          ctx.moveTo(segStartX, originY);
          ctx.lineTo(sx - stepPx, originY);
          ctx.stroke();
          inSegment = false;
        }
      }
    }

    if (inSegment) {
      ctx.beginPath();
      ctx.moveTo(segStartX, originY);
      ctx.lineTo(width, originY);
      ctx.stroke();
    }
  }

  // 关键端点 (实心闭区间 / 空心开区间)
  if (data.domainMin !== undefined && isFinite(data.domainMin)) {
    const endSx = toScreenX(data.domainMin, width);
    if (endSx >= -10 && endSx <= width + 10) {
      ctx.beginPath();
      ctx.arc(endSx, originY, 4, 0, Math.PI * 2);
      ctx.fillStyle = data.domainMinClosed ? (isDark ? '#34d399' : '#059669') : (isDark ? '#1e293b' : '#ffffff');
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isDark ? '#34d399' : '#059669';
      ctx.stroke();
    }
  }
  if (data.domainMax !== undefined && isFinite(data.domainMax)) {
    const endSx = toScreenX(data.domainMax, width);
    if (endSx >= -10 && endSx <= width + 10) {
      ctx.beginPath();
      ctx.arc(endSx, originY, 4, 0, Math.PI * 2);
      ctx.fillStyle = data.domainMaxClosed ? (isDark ? '#34d399' : '#059669') : (isDark ? '#1e293b' : '#ffffff');
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isDark ? '#34d399' : '#059669';
      ctx.stroke();
    }
  }
}

// 优雅的值域 Y 轴高亮条带（不污染全屏背景）
function drawRangeProjection(ctx, width, height, isDark) {
  const originX = toScreenX(0, width);
  const data = currentData.value;
  const param = paramValue.value;

  ctx.strokeStyle = isDark ? '#c084fc' : '#9333ea';
  ctx.lineWidth = 4;

  // 若具有理论明确的值域区间 (如 [-1, 1], [-π/2, π/2], [0, +inf), (-inf, +inf))
  if (data.rangeMin !== undefined && data.rangeMax !== undefined) {
    const screenBottomY = toMathY(height); // 屏幕底部对应的数学 y
    const screenTopY = toMathY(0);         // 屏幕顶部对应的数学 y

    const effMinY = isFinite(data.rangeMin) ? Math.max(data.rangeMin, screenBottomY) : screenBottomY;
    const effMaxY = isFinite(data.rangeMax) ? Math.min(data.rangeMax, screenTopY) : screenTopY;

    if (effMinY <= effMaxY) {
      const syBottom = toScreenY(effMinY, height);
      const syTop = toScreenY(effMaxY, height);
      ctx.beginPath();
      ctx.moveTo(originX, syBottom);
      ctx.lineTo(originX, syTop);
      ctx.stroke();
    }
  } else {
    // 通用步进采样 fallback
    const stepPx = 2;
    let minY = Infinity;
    let maxY = -Infinity;

    for (let sx = 0; sx <= width; sx += stepPx) {
      const mx = toMathX(sx, width);
      if (data.domainCheck && !data.domainCheck(mx, param)) continue;
      const my = data.fn(mx, param);
      if (!isNaN(my) && isFinite(my)) {
        if (my < minY) minY = my;
        if (my > maxY) maxY = my;
      }
    }

    if (minY !== Infinity && maxY !== -Infinity) {
      const syTop = toScreenY(Math.min(maxY, 100), height);
      const syBottom = toScreenY(Math.max(minY, -100), height);
      ctx.beginPath();
      ctx.moveTo(originX, syBottom);
      ctx.lineTo(originX, syTop);
      ctx.stroke();
    }
  }

  // 关键端点 (实心闭区间 / 空心开区间)
  if (data.rangeMin !== undefined && isFinite(data.rangeMin)) {
    const sy = toScreenY(data.rangeMin, height);
    if (sy >= -10 && sy <= height + 10) {
      ctx.beginPath();
      ctx.arc(originX, sy, 4, 0, Math.PI * 2);
      ctx.fillStyle = data.rangeMinClosed ? (isDark ? '#c084fc' : '#9333ea') : (isDark ? '#1e293b' : '#ffffff');
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isDark ? '#c084fc' : '#9333ea';
      ctx.stroke();
    }
  }
  if (data.rangeMax !== undefined && isFinite(data.rangeMax)) {
    const sy = toScreenY(data.rangeMax, height);
    if (sy >= -10 && sy <= height + 10) {
      ctx.beginPath();
      ctx.arc(originX, sy, 4, 0, Math.PI * 2);
      ctx.fillStyle = data.rangeMaxClosed ? (isDark ? '#c084fc' : '#9333ea') : (isDark ? '#1e293b' : '#ffffff');
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isDark ? '#c084fc' : '#9333ea';
      ctx.stroke();
    }
  }
}

function drawMainCurve(ctx, width, height, isDark) {
  const data = currentData.value;
  const param = paramValue.value;

  ctx.beginPath();
  ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
  ctx.lineWidth = 2.4;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // 1. 若具有参数方程定义 (如反三角函数 arcsin, arccos，端点处导数无穷大，沿参数精确绘制至物理端点)
  if (data.parametricFn && data.tRange) {
    const [tMin, tMax] = data.tRange;
    const count = 400; // 超高分辨率平滑采样
    for (let i = 0; i <= count; i++) {
      const t = tMin + (i / count) * (tMax - tMin);
      const pt = data.parametricFn(t);
      const sx = toScreenX(pt.x, width);
      const sy = toScreenY(pt.y, height);
      if (i === 0) {
        ctx.moveTo(sx, sy);
      } else {
        ctx.lineTo(sx, sy);
      }
    }
    ctx.stroke();

    // 绘制曲线端点以及向坐标轴的投影导引虚线
    if (data.curveEndpoints) {
      const originX = toScreenX(0, width);
      const originY = toScreenY(0, height);

      data.curveEndpoints.forEach((pt) => {
        const sx = toScreenX(pt.x, width);
        const sy = toScreenY(pt.y, height);

        // 如果开启了定义域投影，绘制垂直到 X 轴的虚线
        if (showDomain.value) {
          ctx.save();
          ctx.beginPath();
          ctx.setLineDash([3, 3]);
          ctx.strokeStyle = isDark ? 'rgba(52, 211, 153, 0.45)' : 'rgba(5, 150, 105, 0.4)';
          ctx.lineWidth = 1.2;
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx, originY);
          ctx.stroke();
          ctx.restore();
        }

        // 如果开启了值域投影，绘制水平到 Y 轴的虚线
        if (showRange.value) {
          ctx.save();
          ctx.beginPath();
          ctx.setLineDash([3, 3]);
          ctx.strokeStyle = isDark ? 'rgba(192, 132, 252, 0.45)' : 'rgba(147, 51, 234, 0.4)';
          ctx.lineWidth = 1.2;
          ctx.moveTo(sx, sy);
          ctx.lineTo(originX, sy);
          ctx.stroke();
          ctx.restore();
        }

        // 曲线自身端点处的精致圆点
        ctx.beginPath();
        ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
        ctx.fill();
        ctx.strokeStyle = isDark ? '#0f172a' : '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    }
    return;
  }

  // 2. 常规显式函数步进自适应绘制
  const stepPx = 1.0;
  let started = false;
  let prevY = 0;

  for (let sx = 0; sx <= width; sx += stepPx) {
    const mx = toMathX(sx, width);
    if (data.domainCheck && !data.domainCheck(mx, param)) {
      started = false;
      continue;
    }
    const my = data.fn(mx, param);
    if (isNaN(my) || !isFinite(my)) {
      started = false;
      continue;
    }

    const sy = toScreenY(my, height);
    // 奇异点防飞线
    if (started && Math.abs(sy - prevY) > height * 1.5) {
      started = false;
    }

    if (!started) {
      // 边界精度补偿：若刚好进入定义域左边界 (如 sqrt(x) 在 x=0 处)
      if (data.domainMin !== undefined && isFinite(data.domainMin) && mx >= data.domainMin && toMathX(sx - stepPx, width) < data.domainMin) {
        const edgeY = data.fn(data.domainMin, param);
        if (!isNaN(edgeY) && isFinite(edgeY)) {
          ctx.moveTo(toScreenX(data.domainMin, width), toScreenY(edgeY, height));
        }
      }
      ctx.moveTo(sx, sy);
      started = true;
    } else {
      ctx.lineTo(sx, sy);
    }
    prevY = sy;
  }

  // 边界精度补偿：若刚刚离开定义域右边界 (如 sqrt(x) 或有明确 domainMax 的函数)
  if (data.domainMax !== undefined && isFinite(data.domainMax)) {
    const edgeX = data.domainMax;
    const edgeSx = toScreenX(edgeX, width);
    if (edgeSx >= 0 && edgeSx <= width) {
      const edgeY = data.fn(edgeX, param);
      if (!isNaN(edgeY) && isFinite(edgeY)) {
        ctx.lineTo(edgeSx, toScreenY(edgeY, height));
      }
    }
  }

  ctx.stroke();
}

function drawParityVerification(ctx, width, height, isDark) {
  const data = currentData.value;
  const param = paramValue.value;
  const pType = data.parityType;
  const t = symmetryProgress.value;

  // 动态选择适合当前函数定义域的对称探测点 x0
  let x0 = 1.6;
  if (data.domainMax !== undefined && isFinite(data.domainMax) && data.domainMax <= 2.0) {
    x0 = data.domainMax * 0.7; // 例如 arcsin 时取 x0 = 0.7
  }

  if (data.domainCheck && data.domainCheck(x0, param) && data.domainCheck(-x0, param)) {
    const y0 = data.fn(x0, param);
    const yNeg = data.fn(-x0, param);

    if (!isNaN(y0) && !isNaN(yNeg)) {
      const sx0 = toScreenX(x0, width);
      const sy0 = toScreenY(y0, height);
      const sxNeg = toScreenX(-x0, width);
      const syNeg = toScreenY(yNeg, height);

      ctx.beginPath();
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = isDark ? '#f59e0b' : '#d97706';
      ctx.lineWidth = 1.2;

      ctx.moveTo(sx0, sy0);
      ctx.lineTo(sxNeg, syNeg);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(sx0, sy0, 4, 0, Math.PI * 2);
      ctx.arc(sxNeg, syNeg, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '11px sans-serif';
      ctx.fillStyle = isDark ? '#fbbf24' : '#b45309';
      ctx.fillText('(x₀, f(x₀))', sx0 + 6, sy0 - 5);
      ctx.fillText('(-x₀, f(-x₀))', sxNeg - 50, syNeg - 5);
    }
  }

  // 变换动态幽灵线
  if (t > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = isDark ? 'rgba(244, 63, 94, 0.8)' : 'rgba(225, 29, 72, 0.8)';
    ctx.lineWidth = 2.0;
    ctx.setLineDash([5, 3]);

    // 若具有参数方程，沿参数化采样变换
    if (data.parametricFn && data.tRange) {
      const [tMin, tMax] = data.tRange;
      const count = 300;
      for (let i = 0; i <= count; i++) {
        const pParam = tMin + (i / count) * (tMax - tMin);
        const pt = data.parametricFn(pParam);
        let transX = pt.x;
        let transY = pt.y;
        if (pType === 'even') {
          transX = pt.x * (1 - 2 * t);
          transY = pt.y;
        } else if (pType === 'odd') {
          const theta = t * Math.PI;
          transX = pt.x * Math.cos(theta) - pt.y * Math.sin(theta);
          transY = pt.x * Math.sin(theta) + pt.y * Math.cos(theta);
        } else {
          transX = pt.x * (1 - 2 * t);
          transY = pt.y;
        }
        const sxTrans = toScreenX(transX, width);
        const syTrans = toScreenY(transY, height);
        if (i === 0) ctx.moveTo(sxTrans, syTrans);
        else ctx.lineTo(sxTrans, syTrans);
      }
      ctx.stroke();
      ctx.restore();
      return;
    }

    const stepPx = 2;
    let started = false;
    let prevY = 0;

    for (let sx = 0; sx <= width; sx += stepPx) {
      const mx = toMathX(sx, width);
      if (data.domainCheck && !data.domainCheck(mx, param)) {
        started = false;
        continue;
      }
      const my = data.fn(mx, param);
      if (isNaN(my) || !isFinite(my)) {
        started = false;
        continue;
      }

      let transX = mx;
      let transY = my;

      if (pType === 'even') {
        transX = mx * (1 - 2 * t);
        transY = my;
      } else if (pType === 'odd') {
        const theta = t * Math.PI;
        transX = mx * Math.cos(theta) - my * Math.sin(theta);
        transY = mx * Math.sin(theta) + my * Math.cos(theta);
      } else {
        transX = mx * (1 - 2 * t);
        transY = my;
      }

      const sy = toScreenY(transY, height);
      const sxTrans = toScreenX(transX, width);

      if (started && Math.abs(sy - prevY) > height * 1.5) {
        started = false;
      }

      if (!started) {
        ctx.moveTo(sxTrans, sy);
        started = true;
      } else {
        ctx.lineTo(sxTrans, sy);
      }
      prevY = sy;
    }
    ctx.stroke();
    ctx.restore();
  }
}

function drawTangentProbe(ctx, width, height, isDark) {
  const p = hoveredPoint.value;
  if (!p) return;

  const sx0 = toScreenX(p.x, width);
  const sy0 = toScreenY(p.y, height);
  const originY = toScreenY(0, height);
  const originX = toScreenX(0, width);

  // 动点向坐标轴正交投影虚线
  ctx.beginPath();
  ctx.setLineDash([3, 3]);
  ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 1;
  ctx.moveTo(sx0, sy0);
  ctx.lineTo(sx0, originY);
  ctx.moveTo(sx0, sy0);
  ctx.lineTo(originX, sy0);
  ctx.stroke();
  ctx.setLineDash([]);

  // 切线
  if (p.derivative !== null && isFinite(p.derivative)) {
    const k = p.derivative;
    const deltaX = 2.2;
    const x1 = p.x - deltaX;
    const y1 = p.y - k * deltaX;
    const x2 = p.x + deltaX;
    const y2 = p.y + k * deltaX;

    ctx.beginPath();
    ctx.strokeStyle = isDark ? '#f43f5e' : '#e11d48';
    ctx.lineWidth = 1.8;
    ctx.moveTo(toScreenX(x1, width), toScreenY(y1, height));
    ctx.lineTo(toScreenX(x2, width), toScreenY(y2, height));
    ctx.stroke();
  }

  // 动点指示圆圈
  ctx.beginPath();
  ctx.arc(sx0, sy0, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = '#e11d48';
  ctx.fill();
  ctx.lineWidth = 1.8;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();
}

function updateHoverProbe(clientX, clientY) {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const sx = clientX - rect.left;
  const width = rect.width;

  const mx = toMathX(sx, width);
  const data = currentData.value;
  const param = paramValue.value;

  if (data.domainCheck && !data.domainCheck(mx, param)) {
    hoveredPoint.value = null;
    return;
  }

  const my = data.fn(mx, param);
  if (isNaN(my) || !isFinite(my)) {
    hoveredPoint.value = null;
    return;
  }

  const der = data.df ? data.df(mx, param) : null;
  hoveredPoint.value = {
    x: mx,
    y: my,
    derivative: der
  };
}

function onMouseDown(e) {
  isDragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  viewStartX = view.value.centerX;
  viewStartY = view.value.centerY;
}

function onMouseMove(e) {
  if (isDragging) {
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    view.value.centerX = viewStartX - dx / view.value.scale;
    view.value.centerY = viewStartY + dy / view.value.scale;
    redraw();
  } else if (enableProbe.value) {
    updateHoverProbe(e.clientX, e.clientY);
    redraw();
  }
}

function onMouseUp() {
  isDragging = false;
}

function onMouseLeave() {
  isDragging = false;
  hoveredPoint.value = null;
  redraw();
}

function onWheel(e) {
  const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
  zoomStep(zoomFactor);
}

let touchStartX = 0;
let touchStartY = 0;
function onTouchStart(e) {
  if (e.touches.length === 1) {
    isDragging = true;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    viewStartX = view.value.centerX;
    viewStartY = view.value.centerY;
  }
}

function onTouchMove(e) {
  if (isDragging && e.touches.length === 1) {
    const dx = e.touches[0].clientX - touchStartX;
    const dy = e.touches[0].clientY - touchStartY;
    view.value.centerX = viewStartX - dx / view.value.scale;
    view.value.centerY = viewStartY + dy / view.value.scale;
    redraw();
  }
}

function onTouchEnd() {
  isDragging = false;
}

let resizeObserver = null;

watch([paramValue, boundM, showDomain, showRange, showParity, showBoundedness, enableProbe, showInverse], () => {
  nextTick(redraw);
});

onMounted(() => {
  selectCategory('power');
  resetViewport();

  if (canvasWrapperRef.value) {
    resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(canvasWrapperRef.value);
  }
  window.addEventListener('resize', handleResize);

  // 双重保证：确保在组件挂载与 DOM 完全计算完成后以正确物理分辨率重新渲染
  nextTick(() => {
    handleResize();
    requestAnimationFrame(() => {
      handleResize();
    });
  });

  const observer = new MutationObserver(() => {
    redraw();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
});

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect();
  window.removeEventListener('resize', handleResize);
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
});
</script>

<style scoped>
.elem-lab-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 18px 0 28px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 24px -8px rgba(0, 0, 0, 0.05);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  user-select: none;
}

.elem-lab-container.is-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  margin: 0;
  border-radius: 0;
  height: 100vh;
}

/* 顶部导航与控制栏 */
.lab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  flex-wrap: wrap;
  gap: 8px;
}

.category-tabs {
  display: flex;
  gap: 4px;
  overflow-x: auto;
}

.cat-tab-btn {
  padding: 5px 12px;
  border: 1px solid transparent;
  border-radius: 7px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.cat-tab-btn:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-default-soft);
}

.cat-tab-btn.active {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  border-color: var(--vp-c-divider);
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.header-actions {
  display: flex;
  gap: 6px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 7px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.15s;
}

.action-btn:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

/* 主工作区布局 */
.lab-workspace {
  display: flex;
  height: 600px;
  position: relative;
}

.is-fullscreen .lab-workspace {
  flex: 1;
  height: calc(100vh - 54px);
}

/* 左侧画布 */
.canvas-wrapper {
  flex: 1;
  position: relative;
  height: 100%;
  cursor: grab;
  overflow: hidden;
  background: var(--vp-c-bg);
}

.canvas-wrapper:active {
  cursor: grabbing;
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
}

/* 画布悬浮 HUD */
.canvas-floating-hud {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;
}

.hud-item {
  padding: 6px 10px;
  background: rgba(var(--vp-c-bg-rgb, 255, 255, 255), 0.88);
  backdrop-filter: blur(8px);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

:global(.dark) .hud-item {
  background: rgba(24, 24, 27, 0.88);
}

.hud-label {
  display: block;
  font-size: 0.68rem;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
  margin-bottom: 2px;
}

.hud-katex :deep(.katex) {
  font-size: 1.05rem;
  color: var(--vp-c-brand-1);
}

.probe-hud {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.78rem;
  color: var(--vp-c-text-1);
}

.hud-math-row :deep(.katex) {
  font-size: 0.82rem;
}

.hud-math-row.derivative {
  color: #e11d48;
  display: flex;
  align-items: center;
  gap: 4px;
}

.mono-badge {
  font-size: 0.68rem;
  padding: 1px 4px;
  border-radius: 3px;
}

.mono-badge.inc {
  background: rgba(16, 185, 129, 0.15);
  color: #059669;
}

.mono-badge.dec {
  background: rgba(239, 68, 68, 0.15);
  color: #dc2626;
}

.mono-badge.stat {
  background: rgba(100, 116, 139, 0.15);
  color: #475569;
}

/* 缩放浮动按钮 */
.zoom-controls {
  position: absolute;
  right: 12px;
  bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.zoom-btn {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  border: 1px solid var(--vp-c-divider);
  background: rgba(var(--vp-c-bg-rgb, 255, 255, 255), 0.88);
  backdrop-filter: blur(6px);
  color: var(--vp-c-text-1);
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

:global(.dark) .zoom-btn {
  background: rgba(24, 24, 27, 0.88);
}

.zoom-btn:hover {
  color: var(--vp-c-brand-1);
}

/* 右侧学术控制面板 */
.lab-sidebar {
  width: 310px;
  height: 100%;
  border-left: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
}

.card-title {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 10px;
}

.preset-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.preset-pill-btn {
  padding: 4px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.preset-pill-btn :deep(.katex) {
  font-size: 0.82rem;
}

.preset-pill-btn:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.preset-pill-btn.active {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
}

.preset-pill-btn.active :deep(.katex) {
  color: #fff;
}

/* 参数微调滑块 */
.param-slider-group {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px dashed var(--vp-c-divider);
}

.param-slider-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  margin-bottom: 4px;
}

.param-label {
  color: var(--vp-c-text-2);
}

.param-label :deep(.katex) {
  font-size: 0.8rem;
}

.param-value {
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.slider-container {
  position: relative;
  width: 100%;
}

.param-slider {
  width: 100%;
  accent-color: var(--vp-c-brand-1);
  cursor: pointer;
  margin: 2px 0 0;
  display: block;
}

.slider-marks-track {
  position: relative;
  width: 100%;
  height: 22px;
  margin-top: 2px;
}

.mark-tick-wrap {
  position: absolute;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.mark-pip {
  width: 1.5px;
  height: 4px;
  background: var(--vp-c-divider);
  margin-bottom: 2px;
  border-radius: 1px;
}

.mark-val {
  font-size: 0.68rem;
  color: var(--vp-c-text-3);
  line-height: 1;
}

.mark-tick-wrap:hover .mark-val {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.mark-tick-wrap:hover .mark-pip {
  background: var(--vp-c-brand-1);
}

/* 特性开关列表 */
.switch-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.feature-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.15s;
  background: var(--vp-c-bg-alt);
}

.feature-toggle input {
  display: none;
}

.feature-toggle:hover {
  border-color: var(--vp-c-brand-1);
}

.feature-toggle.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
}

.toggle-indicator {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--vp-c-divider);
  transition: all 0.2s;
  flex-shrink: 0;
}

.feature-toggle.active .toggle-indicator.domain {
  background: #10b981;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.6);
}

.feature-toggle.active .toggle-indicator.range {
  background: #8b5cf6;
  box-shadow: 0 0 6px rgba(139, 92, 246, 0.6);
}

.feature-toggle.active .toggle-indicator.parity {
  background: #f59e0b;
  box-shadow: 0 0 6px rgba(245, 158, 11, 0.6);
}

.feature-toggle.active .toggle-indicator.bound {
  background: #3b82f6;
  box-shadow: 0 0 6px rgba(59, 130, 246, 0.6);
}

.feature-toggle.active .toggle-indicator.probe {
  background: #e11d48;
  box-shadow: 0 0 6px rgba(225, 29, 72, 0.6);
}

.feature-toggle.active .toggle-indicator.inverse {
  background: #ec4899;
  box-shadow: 0 0 6px rgba(236, 72, 153, 0.6);
}

.toggle-text {
  display: flex;
  flex-direction: column;
}

.text-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.text-sub {
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
}

.text-sub :deep(.katex) {
  font-size: 0.72rem;
}

.parity-action-box {
  margin-top: 8px;
  padding: 8px;
  background: var(--vp-c-bg-soft);
  border-radius: 7px;
}

.btn-symmetry-play {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 100%;
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-symmetry-play:disabled {
  opacity: 0.6;
}

.parity-hint {
  margin-top: 6px;
  font-size: 0.72rem;
  line-height: 1.4;
  color: var(--vp-c-text-2);
}

.bound-slider-box {
  margin-top: 8px;
  padding: 8px;
  background: var(--vp-c-bg-soft);
  border-radius: 7px;
}

.bound-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.76rem;
  color: var(--vp-c-text-2);
  margin-bottom: 3px;
}

.bound-status {
  font-size: 0.72rem;
  margin-top: 5px;
  font-weight: 500;
}

.bound-status.bounded {
  color: #059669;
}

.bound-status.unbounded {
  color: #d97706;
}

/* 学术看板 */
.math-properties-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.prop-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.prop-badge {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  display: flex;
  align-items: center;
  gap: 4px;
}

.prop-badge :deep(.katex) {
  font-size: 0.76rem;
}

.prop-math {
  font-size: 0.82rem;
  color: var(--vp-c-text-1);
  overflow-x: auto;
}

.prop-math :deep(.katex-display) {
  margin: 0.15em 0;
  text-align: left;
}

@media (max-width: 900px) {
  .lab-workspace {
    flex-direction: column;
    height: auto;
  }
  .canvas-wrapper {
    height: 380px;
  }
  .lab-sidebar {
    width: 100%;
    border-left: none;
    border-top: 1px solid var(--vp-c-divider);
    height: auto;
    max-height: 480px;
  }
}
</style>
