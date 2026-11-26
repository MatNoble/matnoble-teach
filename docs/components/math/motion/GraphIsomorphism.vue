<template>
  <section
    ref="embedRef"
    class="gi-embed"
    :class="{ 'is-fs': isFs }"
    aria-label="图的同构 · 教学动画"
  >
    <div ref="fitRef" class="gi-fitbox">
      <div
        ref="stageRef"
        class="gi-stage"
        :style="{ transform: `scale(${fit})` }"
        tabindex="0"
        @pointerdown="armed = true"
      >
        <!-- ============ 顶栏 ============ -->
        <header class="gi-header">
          <div class="gi-brand">
            <svg viewBox="0 0 128 128" width="36" height="36" aria-hidden="true">
              <rect x="4" y="4" width="120" height="120" rx="28" fill="#18252E" stroke="rgba(217,184,117,.35)" stroke-width="2" />
              <rect x="20" y="20" width="42" height="42" rx="5" fill="rgba(217,184,117,.05)" stroke="#8F7A4E" stroke-width="2.4" />
              <rect x="43" y="43" width="42" height="42" rx="5" fill="rgba(217,184,117,.09)" stroke="#C8A96B" stroke-width="2.4" />
              <rect x="66" y="66" width="42" height="42" rx="5" fill="rgba(217,184,117,.13)" stroke="#E8CF9A" stroke-width="2.8" />
              <line x1="62" y1="20" x2="85" y2="43" stroke="#D9B875" stroke-width="1.6" stroke-dasharray="4 5" opacity=".55" />
              <line x1="85" y1="43" x2="108" y2="66" stroke="#D9B875" stroke-width="1.6" stroke-dasharray="4 5" opacity=".55" />
              <line x1="20" y1="62" x2="43" y2="85" stroke="#D9B875" stroke-width="1.6" stroke-dasharray="4 5" opacity=".4" />
              <line x1="43" y1="85" x2="66" y2="108" stroke="#D9B875" stroke-width="1.6" stroke-dasharray="4 5" opacity=".4" />
            </svg>
            <div class="gi-brand-text">
              <span class="gi-brand-name">Math in Motion · 数学之形</span>
              <span class="gi-brand-sub">Graph Isomorphism · 图的同构</span>
            </div>
          </div>

          <nav class="gi-tabs" aria-label="幕导航">
            <button
              v-for="(m, i) in ACT_META"
              :key="m.short"
              type="button"
              class="gi-tab"
              :class="{ active: act === i + 1 }"
              @click="jumpAct(i + 1)"
            >
              {{ m.short }}
            </button>
          </nav>

          <div class="gi-step-chip">{{ actTitle }} · {{ stepInAct }}/{{ actSteps }}</div>
        </header>

        <!-- ============ 画布区 ============ -->
        <div class="gi-scene">
          <!-- —— 第一幕：五边形 → 五角星 连续变形 —— -->
          <svg v-if="act === 1" class="gi-svg" viewBox="0 0 1600 646" aria-label="五边形到五角星的连续变形">
            <g v-for="(e, i) in c5EdgeList" :key="'e' + i" class="gi-edge-strong">
              <line :x1="morphPos[e[0]].x" :y1="morphPos[e[0]].y" :x2="morphPos[e[1]].x" :y2="morphPos[e[1]].y" />
            </g>
            <g v-for="id in C5_IDS" :key="'v' + id" class="gv" :transform="`translate(${morphPos[id].x},${morphPos[id].y})`">
              <circle class="gv-dot" r="27" />
              <text class="gv-label" dy="0.36em">{{ id }}</text>
            </g>
            <!-- 不变量读数：顶点数 / 边数 -->
            <g class="gi-invariant" :class="{ show: stepInAct >= 2 }">
              <rect x="560" y="12" width="480" height="46" rx="23" />
              <text x="800" y="42">顶点 5 · 边 5 · 未增删任何一条边</text>
            </g>
          </svg>

          <!-- —— 第二 / 四幕：通用多面板 —— -->
          <svg
            v-if="act === 2 || act === 4"
            class="gi-svg"
            :class="{ dim: act === 4 && stepInAct === 9 }"
            viewBox="0 0 1600 646"
            aria-label="图对照面板"
          >
            <template v-for="(panel, pi) in panels" :key="'p' + pi">
              <text class="gi-panel-title" :x="panel.cx" y="40">{{ panel.title }}</text>

              <!-- 连通分支着色区域（第四幕第三组） -->
              <g v-for="(w, wi) in panel.washes" :key="'w' + wi">
                <rect
                  :x="w.x" :y="w.y" :width="w.w" :height="w.h" rx="34"
                  :style="{ fill: w.fill, stroke: w.stroke }"
                  stroke-width="2.5" stroke-dasharray="10 8"
                />
                <text class="gi-wash-label" :x="w.x + w.w / 2" :y="w.y - 14" :style="{ fill: w.stroke }">{{ w.label }}</text>
              </g>

              <!-- 边 -->
              <template v-for="(e, ei) in panel.edges" :key="'pe' + ei">
                <line
                  :class="['gi-edge', e.cls]"
                  :style="{ transitionDelay: e.cls.includes('counted') ? `${ei * 0.16}s` : '0s' }"
                  :x1="panel.pos[e.a].x" :y1="panel.pos[e.a].y"
                  :x2="panel.pos[e.b].x" :y2="panel.pos[e.b].y"
                />
              </template>

              <!-- 顶点 -->
              <g
                v-for="v in panel.vertices"
                :key="'pv' + v.id"
                class="gv"
                :class="[{ clickable: panel.clickable }, v.cls]"
                :transform="`translate(${v.x},${v.y})`"
                @click="panel.clickable && selectVertex(v.id)"
              >
                <circle class="gv-halo" r="36" />
                <circle class="gv-dot" r="25" :style="v.fill ? { fill: v.fill } : null" />
                <text class="gv-label" dy="0.36em" :fill="v.labelFill || null">{{ v.id }}</text>
                <g v-if="v.deg != null" class="gi-deg-badge" transform="translate(29,-29)">
                  <circle r="17" />
                  <text dy="0.36em">{{ v.deg }}</text>
                </g>
              </g>

              <!-- 面板下方文字（边数统计等） -->
              <text
                v-for="(t, ti) in panel.texts"
                :key="'pt' + ti"
                class="gi-panel-text"
                :x="panel.cx"
                y="624"
              >{{ t }}</text>
            </template>
          </svg>

          <!-- —— 第三幕：建立映射 —— -->
          <svg v-if="act === 3" class="gi-svg" :class="{ dim: stepInAct === 9 }" viewBox="0 0 1600 646" aria-label="同构映射的建立与验证">
            <!-- 最近一对对应顶点之间的连线 -->
            <line
              v-if="latestPair"
              class="gi-pair-line"
              :x1="g1Pos[latestPair.from].x + 34"
              :y1="g1Pos[latestPair.from].y"
              :x2="g2Pos[latestPair.to].x - 34"
              :y2="g2Pos[latestPair.to].y"
            />
            <template v-for="(panel, pi) in act3Panels" :key="'q' + pi">
              <text class="gi-panel-title" :x="panel.cx" y="40">{{ panel.title }}</text>
              <template v-for="(e, ei) in panel.edges" :key="'qe' + ei">
                <line
                  :class="['gi-edge', e.cls]"
                  :x1="panel.pos[e.a].x" :y1="panel.pos[e.a].y"
                  :x2="panel.pos[e.b].x" :y2="panel.pos[e.b].y"
                />
              </template>
              <template v-for="(x, xi) in panel.extras" :key="'qx' + xi">
                <line
                  :class="['gi-edge', x.cls]"
                  :x1="panel.pos[x.a].x" :y1="panel.pos[x.a].y"
                  :x2="panel.pos[x.b].x" :y2="panel.pos[x.b].y"
                />
              </template>
              <g v-for="v in panel.vertices" :key="'qv' + v.id" class="gv" :transform="`translate(${v.x},${v.y})`">
                <circle class="gv-halo" r="36" />
                <circle class="gv-dot" r="25" :style="v.fill ? { fill: v.fill } : null" />
                <text class="gv-label" dy="0.36em">{{ v.id }}</text>
              </g>
            </template>
          </svg>

          <!-- —— 第五幕：总结 + K5 思考题 —— -->
          <div v-if="act === 5" class="gi-summary">
            <div class="gi-summary-rows">
              <div
                v-for="(r, i) in SUMMARY_ROWS"
                :key="r.no"
                class="gi-summary-row"
                :class="{ active: stepInAct >= i + 1 }"
              >
                <span class="row-no">{{ r.no }}</span>
                <div class="row-body">
                  <h4>{{ r.title }}</h4>
                  <p>{{ r.body }}</p>
                </div>
              </div>
            </div>
            <svg class="gi-k5" :class="{ show: stepInAct >= 4 }" viewBox="0 0 460 646" aria-label="完全图 K5">
              <text class="gi-panel-title" x="230" y="40">K₅（完全图）</text>
              <line
                v-for="(e, i) in k5Edges"
                :key="'k5' + i"
                class="gi-edge"
                :x1="k5Pos[e[0]].x" :y1="k5Pos[e[0]].y"
                :x2="k5Pos[e[1]].x" :y2="k5Pos[e[1]].y"
              />
              <g v-for="(p, id) in k5Pos" :key="'k5v' + id" class="gv" :transform="`translate(${p.x},${p.y})`">
                <circle class="gv-dot" r="23" />
                <text class="gv-label" dy="0.36em">{{ id }}</text>
              </g>
              <text class="gi-k5-hint" x="230" y="600">5 个顶点 · 10 条边</text>
            </svg>
          </div>

          <!-- —— 第二幕：度数对照 —— -->
          <div v-if="act === 2 && stepInAct >= 5" class="gi-degline">
            <span class="kx" v-html="degFormula" />
            <span class="kx" v-html="degFormula" />
          </div>

          <!-- —— 覆盖层：映射表 / 验证条 —— -->
          <div v-if="act === 3 && stepInAct >= 2 && stepInAct <= 8" class="gi-strip">
            <span
              v-for="c in mappingChips"
              :key="c.text"
              class="gi-chip"
              :class="{ show: c.show }"
              :style="c.color ? { borderColor: c.color, color: c.color } : null"
            >{{ c.text }}</span>
            <span v-if="stepInAct === 4" class="gi-chip bijection"><span class="kx" v-html="kx('f')" /> 是双射 ✓</span>
            <span v-if="stepInAct >= 5" class="gi-chip ok">邻接保持 ✓</span>
            <span v-if="stepInAct >= 8" class="gi-chip noedge">非邻接保持 ✓</span>
          </div>

          <!-- —— 覆盖层：结论 / 警示横幅 —— -->
          <transition name="gi-pop">
            <div v-if="banner" class="gi-banner" :class="banner.tone">
              <strong>{{ banner.main }}</strong>
              <span>{{ banner.sub }}</span>
            </div>
          </transition>

          <!-- —— 覆盖层：同构定义卡片 —— -->
          <transition name="gi-pop">
            <div v-if="act === 3 && stepInAct === 9" class="gi-defcard">
              <h3>定义 · 图同构（Graph Isomorphism）</h3>
              <p class="def-line">
                设 <span class="kx" v-html="kx('G_1=(V_1,E_1)')" /> 与
                <span class="kx" v-html="kx('G_2=(V_2,E_2)')" />。若存在
                <em>双射</em> <span class="kx" v-html="kx('f:V_1\\to V_2')" />，使得对任意
                <span class="kx" v-html="kx('u,v\\in V_1')" /> 都有
              </p>
              <p class="def-formula" v-html="kx('\\{u,v\\}\\in E_1 \\;\\Leftrightarrow\\; \\{f(u),\\,f(v)\\}\\in E_2', true)" />
              <p class="def-line">
                则称 <span class="kx" v-html="kx('G_1')" /> 与 <span class="kx" v-html="kx('G_2')" />
                <strong>同构</strong>，记作 <span class="kx gold" v-html="kx('G_1\\cong G_2')" />。
              </p>
              <ul class="def-points">
                <li>顶点之间一一对应（f 是双射）</li>
                <li>邻接与非邻接关系同时保持（⇔，两个方向都要成立）</li>
                <li>同构的核心是<strong>结构相同</strong>，而不是形状相同</li>
              </ul>
            </div>
          </transition>

          <!-- —— 第一幕：变形进度滑杆 —— -->
          <div v-if="act === 1 && stepInAct >= 2" class="gi-slider">
            <span class="gi-slider-label">变形进度</span>
            <input
              v-model.number="morphT"
              type="range"
              min="0"
              max="1"
              step="0.001"
              aria-label="五边形到五角星的变形进度"
              @input="cancelTween"
            />
            <span class="gi-slider-value">{{ Math.round(morphT * 100) }}%</span>
          </div>
        </div>

        <!-- ============ 教学字幕 ============ -->
        <div class="gi-caption">
          <p>{{ caption }}</p>
        </div>

        <!-- ============ 控制栏 ============ -->
        <footer class="gi-controls">
          <div class="gi-btns">
            <button type="button" :disabled="stepIdx === 0" @click="prev">← 上一步</button>
            <button type="button" class="primary" :disabled="stepIdx === LAST_STEP" @click="next">
              下一步 →<span v-if="spaceHint" class="space-hint">（或 Space）</span>
            </button>
            <button type="button" @click="replay">↻ 重播本幕</button>
            <button type="button" @click="toggleFs">{{ isFs ? "退出全屏" : "⛶ 全屏" }}</button>
          </div>
          <p class="gi-kbd" :class="{ armed: armed || isFs }">
            <template v-if="armed || isFs">← 上一步 · → 下一步 · Space 推进 · R 重播本幕 · F 全屏 · Esc 退出</template>
            <template v-else>点击动画区域后即可使用键盘控制</template>
          </p>
        </footer>
      </div>
    </div>
  </section>
</template>

<script setup>
import katex from "katex";
import "katex/dist/katex.min.css";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

/* ==================================================================
 * 一、数学结构（与屏幕坐标、视觉属性完全分离）
 * ================================================================== */

const C5_IDS = ["A", "B", "C", "D", "E"];
const C5_EDGES = [
  ["A", "B"], ["B", "C"], ["C", "D"], ["D", "E"], ["E", "A"],
];

/** 第三幕：G₁（五边形画法，编号 1–5）与 G₂（五角星画法，编号 a–e），同为 C₅ 结构 */
const G1_IDS = ["1", "2", "3", "4", "5"];
const G1_EDGES = [["1", "2"], ["2", "3"], ["3", "4"], ["4", "5"], ["5", "1"]];
const G2_IDS = ["a", "b", "c", "d", "e"];
const G2_EDGES = [["a", "c"], ["c", "e"], ["e", "b"], ["b", "d"], ["d", "a"]];
/** 双射 f: V₁ → V₂ */
const F_MAP = { 1: "a", 2: "c", 3: "e", 4: "b", 5: "d" };

/** 第四幕三组反例 */
const C4_EDGES = [["a", "b"], ["b", "c"], ["c", "d"], ["d", "a"]];
const C4D_EDGES = [...C4_EDGES, ["a", "c"]];
const P4_EDGES = [["a", "b"], ["b", "c"], ["c", "d"]];
const K13_EDGES = [["h", "x"], ["h", "y"], ["h", "z"]];
const P5_IDS = ["1", "2", "3", "4", "5"];
const P5_EDGES = [["1", "2"], ["2", "3"], ["3", "4"], ["4", "5"]];
const C3K2_IDS = ["a", "b", "c", "d", "e"];
const C3K2_EDGES = [["a", "b"], ["b", "c"], ["a", "c"], ["d", "e"]];

const edgeKey = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);
const edgeSetOf = (edges) => new Set(edges.map(([a, b]) => edgeKey(a, b)));
const isEdgeOf = (edges, a, b) => edgeSetOf(edges).has(edgeKey(a, b));

function neighborsOf(edges, v) {
  const ns = [];
  for (const [a, b] of edges) {
    if (a === v) ns.push(b);
    else if (b === v) ns.push(a);
  }
  return ns;
}
const degreeOf = (edges, v) => neighborsOf(edges, v).length;

/** 度数序列：按不增顺序排列 */
function degreeSequence(edges, ids) {
  return ids.map((v) => degreeOf(edges, v)).sort((x, y) => y - x);
}

/** 连通分支（BFS），用于第四幕第三组 */
function componentsOf(edges, ids) {
  const adj = {};
  ids.forEach((v) => (adj[v] = []));
  edges.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
  const seen = new Set();
  const comps = [];
  for (const s of ids) {
    if (seen.has(s)) continue;
    const comp = [];
    const queue = [s];
    seen.add(s);
    while (queue.length) {
      const v = queue.shift();
      comp.push(v);
      for (const w of adj[v]) if (!seen.has(w)) { seen.add(w); queue.push(w); }
    }
    comps.push(comp);
  }
  return comps;
}

/* ==================================================================
 * 二、几何布局（屏幕坐标；改变布局绝不改动上面的数学结构）
 * ================================================================== */

const ring = (ids, cx, cy, R, startDeg = -90) => {
  const pos = {};
  const n = ids.length;
  ids.forEach((id, i) => {
    const a = ((startDeg + (360 / n) * i) * Math.PI) / 180;
    pos[id] = { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
  });
  return pos;
};

/* —— 第一幕：五边形 → 五角星 的连续变形 ——
 * 五边形顶点角（屏幕坐标，-90° 为正上方）：A -90°, B -18°, C 54°, D 126°, E 198°。
 * 目标（五角星）角：A -90°, B 126°, C -18°, D 198°, E 54°。
 * 每个顶点角度按 easeInOutCubic 推移 Δ，同时半径叠加 bump·sin(πt) 形成弧线轨迹。
 * 逐对检验可证：任意两顶点在 t∈(0,1) 内角度重合的时刻，半径必不相同
 * （角度重合事件：B–C 与 D–E 在 e=1/3，B–E 在 e=3/4；此时半径差 ≥ 60px > 2×27px），
 * 因此动画过程中顶点永不重合；邻接关系由 C5_EDGES 固定，绝无增删。
 * B 的 bump 取 0.18 使其最低点（y≈638）不越过画布下边界（646），
 * 也不进入左下角的滑杆区域（x ≤ 560, y ≥ 570）。 */
const MORPH = {
  A: { d: 0, bump: 0.0 },
  B: { d: 144, bump: 0.18 },
  C: { d: -72, bump: -0.1 },
  D: { d: 72, bump: 0.1 },
  E: { d: -144, bump: -0.2 },
};
const MORPH_BASE = { A: -90, B: -18, C: 54, D: 126, E: 198 };
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const ACT1 = { cx: 800, cy: 330, R: 242 };
const ACT2 = { LC: 430, RC: 1170, cy: 330, R: 218 };
const ACT3 = { LC: 430, RC: 1170, cy: 322, R: 205 };
const ACT4 = { LC: 500, RC: 1100 };

const pentagonPos = ring(C5_IDS, ACT2.LC, ACT2.cy, ACT2.R);
const starPos = ring(["A", "C", "E", "B", "D"], ACT2.RC, ACT2.cy, ACT2.R);
const g1Pos = ring(G1_IDS, ACT3.LC, ACT3.cy, ACT3.R);
/* G₂ 顶点按自然顺序 a–e 放在五边形槽位上，其边 a-c、c-e、e-b、b-d、d-a
 * 均为隔点弦，从而画出五角星（与 G₁ 同构但画法与编号都不同）。 */
const g2Pos = ring(["a", "b", "c", "d", "e"], ACT3.RC, ACT3.cy, ACT3.R);

const c4Pos = { a: { x: 500, y: 125 }, b: { x: 695, y: 320 }, c: { x: 500, y: 515 }, d: { x: 305, y: 320 } };
const p4Pos = { a: { x: 230, y: 320 }, b: { x: 410, y: 320 }, c: { x: 590, y: 320 }, d: { x: 770, y: 320 } };
const k13Pos = { h: { x: 1100, y: 235 }, x: { x: 885, y: 420 }, y: { x: 1100, y: 465 }, z: { x: 1315, y: 420 } };
const p5Pos = {
  1: { x: 150, y: 332 }, 2: { x: 320, y: 274 }, 3: { x: 490, y: 332 },
  4: { x: 660, y: 274 }, 5: { x: 830, y: 332 },
};
const c3k2Pos = {
  a: { x: 900, y: 205 }, b: { x: 1000, y: 378 }, c: { x: 800, y: 378 },
  d: { x: 1180, y: 320 }, e: { x: 1340, y: 320 },
};
const k5Pos = ring(["1", "2", "3", "4", "5"], 230, 320, 168);
const k5Edges = [];
for (let i = 0; i < 5; i++)
  for (let j = i + 1; j < 5; j++) k5Edges.push([String(i + 1), String(j + 1)]);

/* ==================================================================
 * 三、幕与步骤（教师逐步推进；返回上一步即恢复对应数学状态）
 * ================================================================== */

const ACT_META = [
  { short: "一 · 形状", title: "第一幕 · 形状变了，图变了吗" },
  { short: "二 · 结构", title: "第二幕 · 寻找不变的结构" },
  { short: "三 · 定义", title: "第三幕 · 从重新编号到同构定义" },
  { short: "四 · 判定", title: "第四幕 · 如何判断非同构" },
  { short: "五 · 总结", title: "第五幕 · 课堂总结" },
];
const ACT_STEP_COUNTS = [3, 6, 9, 9, 4];
const ACT_STARTS = [];
{
  let acc = 0;
  ACT_STEP_COUNTS.forEach((c, i) => { ACT_STARTS[i] = acc; acc += c; });
}
const LAST_STEP = ACT_STEP_COUNTS.reduce((a, b) => a + b, 0) - 1;

const CAPTIONS = {
  1: [
    "这是图 G：顶点 A、B、C、D、E；边 AB、BC、CD、DE、EA。请先记住它的样子。",
    "问题：如果移动这些顶点，但不增加、也不删除任何一条边——它还是原来的图吗？（按 Space 演示，或拖动下方滑杆）",
    "五条边始终连着原来的顶点，一条没多、一条没少。注意：边的交叉处并不是顶点。那么——这还是同一个图吗？",
  ],
  2: [
    "同一组顶点与边，两种画法。顶点的位置变了——有什么东西没有变？",
    "选定一个顶点，例如 B。它在两幅图中是同一个顶点。（也可以点击任意顶点切换）",
    "与 B 相邻的顶点：A 与 C。两幅图完全一致。",
    "与 B 关联的边：BA 与 BC。边，还是那些边。",
    "B 的度数：deg(B) = 2。换一个顶点，结论也一样。",
    "顶点的位置改变了，但顶点之间的邻接关系没有变。图论关心的不是几何形状，而是顶点之间的连接结构。",
  ],
  3: [
    "两个「编号不同、画法不同」的图：G₁ 与 G₂。它们结构相同吗？——试着给顶点建立一一对应。",
    "先猜一个对应：把 1 对到 a（同色顶点表示一对）。双射 f 要求每个顶点恰好对应一个像。",
    "继续建立对应：2 对 c，3 对 e。",
    "最后：4 对 b，5 对 d。f：1↦a, 2↦c, 3↦e, 4↦b, 5↦d 是双射——顶点一一对应。",
    "验证邻接：G₁ 中的边 1—2，其像 {a, c} 恰好也是 G₂ 中的边。✓",
    "继续验证：2—3 ↦ c—e ✓；3—4 ↦ e—b ✓。",
    "全部五条边一一对应：4—5 ↦ b—d ✓，5—1 ↦ d—a ✓。每条边都映到边——邻接关系完全保持。",
    "反之，G₁ 中不相邻的 1 与 3，其像 a 与 e 在 G₂ 中也不相邻。⇔ 的两个方向都成立：非邻接关系同样保持。",
    "这就是图同构的定义：结构相同，形状可以不同。记作 G₁ ≅ G₂。",
  ],
  4: [
    "第一组：C₄ 与「C₄ 加一条对角线」。先数一数边数。",
    "|E| = 4 ≠ 5。边数不同，不可能同构——边数是一个同构不变量。",
    "第二组：P₄ 与星形 K₁,₃。边数都是 3，边数失效了，换一个不变量。",
    "给每个顶点标出度数（与它关联的边数）。",
    "度数序列不同：(2,2,1,1) ≠ (3,1,1,1)。非同构——度数序列是同构不变量。",
    "第三组：P₅ 与 C₃ ∪ K₂（不交并）。都是 5 个顶点、4 条边。",
    "度数序列都是 (2,2,2,1,1)——完全相同！度数序列这次也失效了。",
    "但左图连通（1 个连通分支），右图不连通（2 个连通分支：C₃ 与 K₂）。连通性是同构不变量——两图非同构。",
    "警惕：同构 ⟹ 度数序列相同；反之不成立。度数序列相同只是必要条件，不是充分条件。",
  ],
  5: [
    "理解同构：形状可以不同，连接结构必须相同。",
    "证明同构：构造一个保持邻接关系的顶点双射。",
    "证明非同构：找到一个不同的同构不变量——边数、度数序列、连通性……",
    "课堂思考：如何从完全图 K₅ 出发，构造至少 8 个两两非同构的生成子图？（提示：按边数分类讨论）",
  ],
};

const SUMMARY_ROWS = [
  { no: "01", title: "理解同构", body: "形状可以不同，连接结构必须相同。" },
  { no: "02", title: "证明同构", body: "构造一个保持邻接关系的顶点双射 f。" },
  { no: "03", title: "证明非同构", body: "找一个不同的同构不变量：|E|、度数序列、连通性……" },
  { no: "04", title: "课堂思考", body: "从 K₅ 出发，至少 8 个两两非同构的生成子图。" },
];

/* ==================================================================
 * 四、状态
 * ================================================================== */

const stepIdx = ref(0);
const morphT = ref(0);
const selectedVertex = ref("B");
const fit = ref(1);
const isFs = ref(false);
const armed = ref(false);

const embedRef = ref(null);
const fitRef = ref(null);

const act = computed(() => {
  for (let i = ACT_STARTS.length - 1; i >= 0; i--) {
    if (stepIdx.value >= ACT_STARTS[i]) return i + 1;
  }
  return 1;
});
const stepInAct = computed(() => stepIdx.value - ACT_STARTS[act.value - 1] + 1);
const actSteps = computed(() => ACT_STEP_COUNTS[act.value - 1]);
const actTitle = computed(() => ACT_META[act.value - 1].title);
const caption = computed(() => CAPTIONS[act.value][stepInAct.value - 1]);

const kx = (tex, display = false) =>
  katex.renderToString(tex, { displayMode: display, throwOnError: false, output: "html" });

/* ==================================================================
 * 五、场景计算
 * ================================================================== */

/* —— 第一幕 —— */
const morphPos = computed(() => {
  const e = easeInOutCubic(morphT.value);
  const pos = {};
  for (const id of C5_IDS) {
    const m = MORPH[id];
    const theta = ((MORPH_BASE[id] + m.d * e) * Math.PI) / 180;
    const r = ACT1.R * (1 + m.bump * Math.sin(Math.PI * morphT.value));
    pos[id] = { x: ACT1.cx + r * Math.cos(theta), y: ACT1.cy + r * Math.sin(theta) };
  }
  return pos;
});
const c5EdgeList = C5_EDGES;

/* —— 第二幕 —— */
const act2Panels = computed(() => {
  const s = stepInAct.value;
  const v = selectedVertex.value;
  const nbrs = neighborsOf(C5_EDGES, v);
  const mk = (pos, title, cx) => ({
    cx,
    title,
    clickable: true,
    pos,
    washes: [],
    edges: C5_EDGES.map(([a, b]) => ({
      a, b,
      cls: s >= 4 && (a === v || b === v) ? "hi" : "",
    })),
    vertices: C5_IDS.map((id) => ({
      id, ...pos[id],
      fill: s >= 3 && nbrs.includes(id) ? "var(--gi-teal-soft)" : null,
      cls: [
        s >= 2 && id === v ? "sel" : "",
        s >= 3 && nbrs.includes(id) ? "nbr" : "",
      ].filter(Boolean).join(" "),
    })),
    texts: [],
  });
  return [mk(pentagonPos, "原来的画法", ACT2.LC), mk(starPos, "移动后的画法", ACT2.RC)];
});
const degFormula = computed(() =>
  kx(`\\deg(${selectedVertex.value})=${degreeOf(C5_EDGES, selectedVertex.value)}`)
);

/* —— 第三幕 —— */
/* 五对对应顶点的配色：深浅两套主题由 CSS 变量 --gi-p1..p5（及 -soft 半透明版）提供 */
const PAIR_VAR = (u) => `var(--gi-p${u})`;
const PAIR_SOFT = (u) => `var(--gi-p${u}-soft)`;
const pairReveal = (s) => (s === 2 ? ["1"] : s === 3 ? ["1", "2", "3"] : ["1", "2", "3", "4", "5"]);
const verifiedCount = (s) => (s === 5 ? 1 : s === 6 ? 3 : s >= 7 ? 5 : 0);

const act3Panels = computed(() => {
  const s = stepInAct.value;
  const revealed = pairReveal(s);
  const nVerify = verifiedCount(s);
  const img = (u, vv) => edgeKey(F_MAP[u], F_MAP[vv]);

  const p1 = {
    cx: ACT3.LC, title: "G₁（五边形画法）", pos: g1Pos,
    edges: G1_EDGES.map(([a, b], i) => ({
      a, b,
      cls: nVerify > 0 && i < nVerify ? "hi" : "",
    })),
    // 第八步：额外展示一对"非邻接"顶点（虚线）
    extras: s === 8 ? [{ a: "1", b: "3", cls: "pairdash" }] : [],
    vertices: G1_IDS.map((id) => ({
      id, ...g1Pos[id],
      fill: revealed.includes(id) ? PAIR_SOFT(id) : null,
    })),
  };
  const p2 = {
    cx: ACT3.RC, title: "G₂（五角星画法）", pos: g2Pos,
    edges: G2_EDGES.map(([a, b]) => {
      // 该边是否是某条已验证 G₁ 边的像
      let isImage = false;
      for (let i = 0; i < nVerify; i++) if (img(...G1_EDGES[i]) === edgeKey(a, b)) isImage = true;
      return { a, b, cls: isImage ? "hi" : "" };
    }),
    extras: s === 8 ? [{ a: "a", b: "e", cls: "pairdash" }] : [],
    vertices: G2_IDS.map((id) => {
      const pre = Object.keys(F_MAP).find((u) => F_MAP[u] === id);
      return {
        id, ...g2Pos[id],
        fill: revealed.includes(pre) ? PAIR_SOFT(pre) : null,
      };
    }),
  };
  return [p1, p2];
});

const latestPair = computed(() => {
  const s = stepInAct.value;
  if (s < 2 || s > 4) return null;
  const from = s === 2 ? "1" : s === 3 ? "3" : "5";
  return { from, to: F_MAP[from] };
});

const mappingChips = computed(() => {
  const s = stepInAct.value;
  const revealed = pairReveal(Math.min(s, 4));
  return G1_IDS.map((u) => ({
    text: `${u} ↦ ${F_MAP[u]}`,
    color: PAIR_VAR(u),
    show: revealed.includes(u),
  })).concat(
    verifiedCount(s) > 0
      ? G1_EDGES.slice(0, verifiedCount(s)).map(([a, b]) => ({
          text: `${a}${b} ↦ ${F_MAP[a]}${F_MAP[b]} ✓`,
          show: true,
        }))
      : []
  ).concat(
    s === 8 ? [{ text: "1 ⋯ 3 ↦ a ⋯ e（都是非边）✓", show: true }] : []
  );
});

/* —— 第四幕 —— */
const washStyle = [
  { fill: "var(--gi-wash-a-fill)", stroke: "var(--gi-wash-a-stroke)", label: "连通分支 ①" },
  { fill: "var(--gi-wash-b-fill)", stroke: "var(--gi-wash-b-stroke)", label: "连通分支 ②" },
];
function bboxOf(pos, ids, pad) {
  const xs = ids.map((v) => pos[v].x);
  const ys = ids.map((v) => pos[v].y);
  const x = Math.min(...xs) - pad, y = Math.min(...ys) - pad;
  return { x, y, w: Math.max(...xs) - x + pad, h: Math.max(...ys) - y + pad };
}

const panels = computed(() => {
  const s = stepInAct.value;
  if (act.value === 2) return act2Panels.value;

  const mkEdges = (edges, hiAll, extra = "") =>
    edges.map(([a, b], i) => ({
      a, b,
      cls: [hiAll ? "counted" : "", extra].filter(Boolean).join(" "),
      _i: i,
    }));

  if (s <= 2) {
    return [
      {
        cx: ACT4.LC, title: "C₄（四阶圈图）", pos: c4Pos, clickable: false,
        edges: mkEdges(C4_EDGES, s >= 2),
        vertices: ["a", "b", "c", "d"].map((id) => ({ id, ...c4Pos[id] })),
        texts: s >= 2 ? ["|E| = 4"] : [],
        washes: [],
      },
      {
        cx: ACT4.RC, title: "C₄ + 一条对角线", pos: c4Pos, clickable: false,
        edges: mkEdges(C4D_EDGES, s >= 2),
        vertices: ["a", "b", "c", "d"].map((id) => ({ id, ...c4Pos[id] })),
        texts: s >= 2 ? ["|E| = 5"] : [],
        washes: [],
      },
    ];
  }
  if (s <= 5) {
    const showDeg = s >= 4;
    return [
      {
        cx: ACT4.LC, title: "P₄（四阶路径）", pos: p4Pos, clickable: false,
        edges: mkEdges(P4_EDGES, false),
        vertices: ["a", "b", "c", "d"].map((id) => ({ id, ...p4Pos[id], deg: showDeg ? degreeOf(P4_EDGES, id) : null })),
        texts: s >= 5 ? [`度数序列 ${fmtSeq(degreeSequence(P4_EDGES, ["a", "b", "c", "d"]))}`] : [],
        washes: [],
      },
      {
        cx: ACT4.RC, title: "K₁,₃（星形）", pos: k13Pos, clickable: false,
        edges: mkEdges(K13_EDGES, false),
        vertices: ["h", "x", "y", "z"].map((id) => ({ id, ...k13Pos[id], deg: showDeg ? degreeOf(K13_EDGES, id) : null })),
        texts: s >= 5 ? [`度数序列 ${fmtSeq(degreeSequence(K13_EDGES, ["h", "x", "y", "z"]))}`] : [],
        washes: [],
      },
    ];
  }
  // 第三组：P₅ vs C₃ ∪ K₂
  const showDeg = s >= 7;
  const p5Seq = degreeSequence(P5_EDGES, P5_IDS);
  const unionSeq = degreeSequence(C3K2_EDGES, C3K2_IDS);
  const washes = s >= 8
    ? componentsOf(C3K2_EDGES, C3K2_IDS).map((comp, i) => ({
        ...bboxOf(c3k2Pos, comp, 58),
        ...washStyle[i % 2],
      }))
    : [];
  return [
    {
      cx: ACT4.LC, title: "P₅（五阶路径）", pos: p5Pos, clickable: false,
      edges: mkEdges(P5_EDGES, false),
      vertices: P5_IDS.map((id) => ({ id, ...p5Pos[id], deg: showDeg ? degreeOf(P5_EDGES, id) : null })),
      texts: s >= 7 ? [`度数序列 ${fmtSeq(p5Seq)}`] : [],
      washes: [],
    },
    {
      cx: ACT4.RC, title: "C₃ ∪ K₂（不交并）", pos: c3k2Pos, clickable: false,
      edges: mkEdges(C3K2_EDGES, false),
      vertices: C3K2_IDS.map((id) => ({ id, ...c3k2Pos[id], deg: showDeg ? degreeOf(C3K2_EDGES, id) : null })),
      texts: s >= 7 ? [`度数序列 ${fmtSeq(unionSeq)}`] : [],
      washes,
    },
  ];
});

const fmtSeq = (seq) => `(${seq.join(",")})`;

/* —— 结论横幅 —— */
const banner = computed(() => {
  const s = stepInAct.value;
  if (act.value === 2 && s === 6)
    return { tone: "good", main: "位置改变，邻接不变", sub: "图论研究的是顶点之间的连接结构，而不是几何形状" };
  if (act.value === 4 && s === 2)
    return { tone: "bad", main: "非同构：边数不同", sub: "|E| 是同构不变量——同构的图必有相同的边数" };
  if (act.value === 4 && s === 5)
    return { tone: "bad", main: "非同构：度数序列不同", sub: "(2,2,1,1) ≠ (3,1,1,1)，度数序列是同构不变量" };
  if (act.value === 4 && s === 8)
    return { tone: "bad", main: "非同构：连通性不同", sub: "一个连通，一个不连通——连通性是同构不变量" };
  if (act.value === 4 && s === 9)
    return { tone: "warn", main: "必要条件 ≠ 充分条件", sub: "同构 ⟹ 度数序列相同；度数序列相同 ⇏ 同构" };
  return null;
});

const spaceHint = computed(() => act.value === 1 && stepInAct.value === 2 && morphT.value < 0.999);

/* ==================================================================
 * 六、动画引擎（补间 + rAF，统一清理）
 * ================================================================== */

let rafId = 0;
let reduceMotion = false;

function cancelTween() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;
}
function tweenMorph(target, duration) {
  cancelTween();
  const from = morphT.value;
  if (reduceMotion) { morphT.value = target; return; }
  const t0 = performance.now();
  const dur = Math.max(1, duration);
  const tick = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    morphT.value = from + (target - from) * p;
    if (p < 1) rafId = requestAnimationFrame(tick);
    else rafId = 0;
  };
  rafId = requestAnimationFrame(tick);
}

/* ==================================================================
 * 七、交互控制
 * ================================================================== */

function next() {
  if (stepIdx.value >= LAST_STEP) return;
  // 第一幕第 2 → 3 步：触发完整的连续变形
  if (act.value === 1 && stepInAct.value === 2) {
    stepIdx.value += 1;
    if (morphT.value < 0.999) tweenMorph(1, 3600);
    return;
  }
  stepIdx.value += 1;
}
function prev() {
  if (stepIdx.value <= 0) return;
  stepIdx.value -= 1;
  if (act.value === 1) {
    if (stepInAct.value === 2) tweenMorph(0, 900);
    if (stepInAct.value === 1) { cancelTween(); morphT.value = 0; }
  }
}
function replay() {
  cancelTween();
  const start = ACT_STARTS[act.value - 1];
  stepIdx.value = start;
  if (act.value === 1) morphT.value = 0;
}
function jumpAct(n) {
  cancelTween();
  stepIdx.value = ACT_STARTS[n - 1];
  if (n === 1) morphT.value = 0;
}
function selectVertex(id) {
  selectedVertex.value = id;
}
function advance() {
  // Space：优先推进当前幕的连续动画，否则进入下一步
  if (act.value === 1 && stepInAct.value === 2 && morphT.value < 0.999) {
    tweenMorph(1, 3600);
    return;
  }
  next();
}
function toggleFs() {
  const el = embedRef.value;
  if (!el) return;
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    (el.requestFullscreen || el.webkitRequestFullscreen || function() {}).call(el);
  } else if (document.exitFullscreen || document.webkitExitFullscreen) {
    (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  }
}

function onKey(e) {
  if (!armed.value && !isFs.value) return;
  const t = e.target;
  if (t && t.closest && t.closest("button, input, textarea, select, a, [contenteditable]")) return;
  switch (e.key) {
    case "ArrowRight": e.preventDefault(); next(); break;
    case "ArrowLeft": e.preventDefault(); prev(); break;
    case " ": e.preventDefault(); advance(); break;
    case "r": case "R": e.preventDefault(); replay(); break;
    case "f": case "F": e.preventDefault(); toggleFs(); break;
    default: break;
  }
}
function onDocPointerDown(e) {
  if (embedRef.value && !embedRef.value.contains(e.target)) armed.value = false;
}

/* ==================================================================
 * 八、自适应缩放与生命周期
 * ================================================================== */

let ro = null;
function updateFit() {
  const el = fitRef.value;
  if (!el) return;
  const { width, height } = el.getBoundingClientRect();
  if (width && height) fit.value = Math.min(width / 1600, height / 900);
}

onMounted(() => {
  reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  ro = new ResizeObserver(updateFit);
  ro.observe(fitRef.value);
  updateFit();
  window.addEventListener("keydown", onKey);
  document.addEventListener("pointerdown", onDocPointerDown, true);
  document.addEventListener("fullscreenchange", onFsChange);
  document.addEventListener("webkitfullscreenchange", onFsChange);
});
function onFsChange() {
  isFs.value = !!(document.fullscreenElement || document.webkitFullscreenElement);
  requestAnimationFrame(updateFit);
}
onBeforeUnmount(() => {
  cancelTween();
  if (ro) ro.disconnect();
  window.removeEventListener("keydown", onKey);
  document.removeEventListener("pointerdown", onDocPointerDown, true);
  document.removeEventListener("fullscreenchange", onFsChange);
  document.removeEventListener("webkitfullscreenchange", onFsChange);
});
</script>

<style scoped>
/* ============ 主题令牌：深色黑板（默认） / 浅色纸面（跟随站点外观） ============ */
.gi-stage {
  /* 深色主题（数学黑板） */
  --gi-stage-bg: radial-gradient(ellipse 130% 100% at 50% 0%, #1a2833 0%, #141e26 55%, #101922 100%);
  --gi-embed-bg: #141e26;
  --gi-embed-shadow: 0 18px 46px -18px rgba(9, 20, 30, 0.55);
  --gi-ink: #f0e6d2;            /* 主文字（暖白） */
  --gi-ink-soft: #a9b6be;       /* 次级文字（灰蓝） */
  --gi-gold: #d9b875;           /* 金色强调（边、徽章、控件） */
  --gi-gold-strong: #e8cf9a;    /* 高亮金（标题） */
  --gi-primary-ink: #141e26;    /* 金底上的文字 */
  --gi-line: rgba(217, 184, 117, 0.18);      /* 分隔线 */
  --gi-line-strong: rgba(217, 184, 117, 0.45);
  --gi-edge-base: rgba(214, 224, 230, 0.6);  /* 常态边 */
  --gi-edge-strong: rgba(214, 224, 230, 0.75);
  --gi-dot-fill: #101922;       /* 顶点填充 */
  --gi-dot-stroke: #d9b875;     /* 顶点描边 */
  --gi-halo: #e8cf9a;           /* 选中光环 */
  --gi-teal: #86c7c7;           /* 邻居强调 */
  --gi-teal-soft: rgba(134, 199, 199, 0.28);
  --gi-rose: #e5a8b4;           /* 非邻接 / 反例强调 */
  --gi-rose-border: rgba(229, 168, 180, 0.55);
  --gi-warn: #e8b45f;
  --gi-warn-border: rgba(232, 180, 95, 0.6);
  --gi-ok: #b5dcb5;
  --gi-ok-border: rgba(169, 214, 169, 0.7);
  --gi-card-bg: rgba(14, 21, 28, 0.93);
  --gi-card-border: rgba(217, 184, 117, 0.5);
  --gi-card-shadow: 0 30px 80px -30px rgba(0, 0, 0, 0.8);
  --gi-chip-bg: rgba(16, 25, 34, 0.85);
  --gi-chip-border: rgba(169, 182, 190, 0.4);
  --gi-btn-bg: rgba(240, 230, 210, 0.05);
  --gi-btn-border: rgba(240, 230, 210, 0.25);
  --gi-primary-bg: #d9b875;
  --gi-primary-hover: #e8cf9a;
  --gi-badge-fill: #d9b875;
  --gi-badge-ink: #141e26;
  --gi-wash-a-fill: rgba(217, 184, 117, 0.06);
  --gi-wash-a-stroke: #d9b875;
  --gi-wash-b-fill: rgba(134, 199, 199, 0.07);
  --gi-wash-b-stroke: #86c7c7;
  --gi-p1: #e5a8b4;  --gi-p1-soft: rgba(229, 168, 180, 0.3);
  --gi-p2: #86c7c7;  --gi-p2-soft: rgba(134, 199, 199, 0.3);
  --gi-p3: #b9a7e8;  --gi-p3-soft: rgba(185, 167, 232, 0.3);
  --gi-p4: #a9c97e;  --gi-p4-soft: rgba(169, 201, 126, 0.3);
  --gi-p5: #e8a662;  --gi-p5-soft: rgba(232, 166, 98, 0.3);
  --gi-kbd: rgba(169, 182, 190, 0.55);
  --gi-kbd-armed: rgba(232, 207, 154, 0.85);
  --gi-row-no: rgba(217, 184, 117, 0.55);
  --gi-summary-bg: rgba(217, 184, 117, 0.03);
}

/* 浅色主题（暖纸面）：站点外观为浅色时自动切换 */
html:not(.dark) .gi-stage {
  --gi-stage-bg: radial-gradient(ellipse 130% 100% at 50% 0%, #fcfaf4 0%, #f7f1e6 55%, #f0e9d8 100%);
  --gi-embed-bg: #f7f1e6;
  --gi-embed-shadow: 0 18px 40px -20px rgba(112, 88, 40, 0.35);
  --gi-ink: #2e3b47;
  --gi-ink-soft: #5e6e7a;
  --gi-gold: #9c7828;
  --gi-gold-strong: #74571e;
  --gi-primary-ink: #231a07;
  --gi-line: rgba(143, 110, 46, 0.22);
  --gi-line-strong: rgba(143, 110, 46, 0.5);
  --gi-edge-base: rgba(52, 67, 80, 0.45);
  --gi-edge-strong: rgba(38, 50, 62, 0.72);
  --gi-dot-fill: #ffffff;
  --gi-dot-stroke: #b08a3e;
  --gi-halo: #9c7828;
  --gi-teal: #1f7e7e;
  --gi-teal-soft: rgba(31, 126, 126, 0.18);
  --gi-rose: #c25b72;
  --gi-rose-border: rgba(194, 91, 114, 0.55);
  --gi-warn: #9a6a1f;
  --gi-warn-border: rgba(154, 106, 31, 0.55);
  --gi-ok: #2f7d46;
  --gi-ok-border: rgba(47, 125, 70, 0.5);
  --gi-card-bg: rgba(255, 252, 244, 0.97);
  --gi-card-border: rgba(143, 110, 46, 0.45);
  --gi-card-shadow: 0 30px 70px -30px rgba(80, 60, 20, 0.45);
  --gi-chip-bg: rgba(255, 255, 255, 0.92);
  --gi-chip-border: rgba(70, 84, 96, 0.3);
  --gi-btn-bg: rgba(46, 59, 71, 0.04);
  --gi-btn-border: rgba(46, 59, 71, 0.22);
  --gi-primary-bg: #c9a45c;
  --gi-primary-hover: #b8934a;
  --gi-badge-fill: #b08a3e;
  --gi-badge-ink: #ffffff;
  --gi-wash-a-fill: rgba(169, 130, 47, 0.07);
  --gi-wash-a-stroke: #9c7828;
  --gi-wash-b-fill: rgba(31, 126, 126, 0.07);
  --gi-wash-b-stroke: #1f7e7e;
  --gi-p1: #b34a63;  --gi-p1-soft: rgba(179, 74, 99, 0.28);
  --gi-p2: #176767;  --gi-p2-soft: rgba(23, 103, 103, 0.26);
  --gi-p3: #6a4fb0;  --gi-p3-soft: rgba(106, 79, 176, 0.26);
  --gi-p4: #557f1f;  --gi-p4-soft: rgba(85, 127, 31, 0.28);
  --gi-p5: #8a540e;  --gi-p5-soft: rgba(138, 84, 14, 0.30);
  --gi-kbd: rgba(72, 86, 98, 0.85);
  --gi-kbd-armed: rgba(122, 94, 34, 0.95);
  --gi-row-no: rgba(143, 110, 46, 0.45);
  --gi-summary-bg: rgba(143, 110, 46, 0.04);
}

/* ============ 外层容器：内嵌模式保持 16:9 ============ */
.gi-embed {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 88vh;
  margin: 18px 0 26px;
  border-radius: 18px;
  overflow: hidden;
  --gi-embed-bg: #141e26;
  --gi-embed-shadow: 0 18px 46px -18px rgba(9, 20, 30, 0.55);
  background: var(--gi-embed-bg);
  box-shadow: var(--gi-embed-shadow);
  outline: none;
}
html:not(.dark) .gi-embed {
  --gi-embed-bg: #f7f1e6;
  --gi-embed-shadow: 0 18px 40px -20px rgba(112, 88, 40, 0.35);
}
.gi-embed:fullscreen {
  border-radius: 0;
  max-height: none;
  aspect-ratio: auto;
  width: 100vw;
  height: 100vh;
}
.gi-embed:fullscreen .gi-fitbox,
.gi-embed.is-fs .gi-fitbox {
  position: fixed;
  inset: 0;
}
.gi-fitbox {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* ============ 固定设计画布 1600×900，等比缩放 ============ */
.gi-stage {
  flex: none;
  width: 1600px;
  height: 900px;
  display: flex;
  flex-direction: column;
  transform-origin: center;
  background: var(--gi-stage-bg);
  color: var(--gi-ink);
  font-family: var(--vp-font-family-base), "Inter", "PingFang SC", "Microsoft YaHei", sans-serif;
  user-select: none;
}

/* ============ 顶栏 ============ */
.gi-header {
  flex: none;
  height: 92px;
  display: flex;
  align-items: center;
  gap: 22px;
  padding: 0 30px;
  border-bottom: 1px solid var(--gi-line);
}
.gi-brand { display: flex; align-items: center; gap: 12px; min-width: 320px; }
.gi-brand-text { display: flex; flex-direction: column; line-height: 1.25; }
.gi-brand-name {
  font-family: var(--vp-font-family-heading), "EB Garamond", serif;
  font-size: 21px;
  letter-spacing: 0.06em;
  color: var(--gi-gold-strong);
}
.gi-brand-sub { font-size: 14px; color: var(--gi-ink-soft); letter-spacing: 0.04em; }
.gi-tabs { display: flex; gap: 8px; flex: 1; justify-content: center; }
.gi-tab {
  padding: 8px 16px;
  font-size: 16px;
  color: var(--gi-ink-soft);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.25s;
}
.gi-tab:hover { color: var(--gi-ink); border-color: var(--gi-line-strong); }
.gi-tab.active {
  color: var(--gi-primary-ink);
  background: var(--gi-primary-bg);
  font-weight: 600;
}
.gi-step-chip {
  min-width: 320px;
  text-align: right;
  font-family: var(--vp-font-family-heading), "EB Garamond", serif;
  font-size: 18px;
  color: var(--gi-gold-strong);
  letter-spacing: 0.03em;
}

/* ============ 画布区 ============ */
.gi-scene { position: relative; flex: 1 1 auto; min-height: 0; }
.gi-svg { position: absolute; inset: 0; width: 100%; height: 100%; transition: opacity 0.4s; }
.gi-svg.dim { opacity: 0.16; }

.gi-panel-title {
  text-anchor: middle;
  font-size: 26px;
  fill: var(--gi-ink-soft);
  letter-spacing: 0.05em;
}
.gi-panel-text {
  text-anchor: middle;
  font-size: 30px;
  fill: var(--gi-gold);
  font-weight: 600;
}
.gi-wash-label {
  text-anchor: middle;
  font-size: 21px;
  letter-spacing: 0.08em;
}

/* —— 边 —— */
.gi-edge {
  stroke: var(--gi-edge-base);
  stroke-width: 4;
  stroke-linecap: round;
  transition: stroke 0.4s, stroke-width 0.4s, opacity 0.4s;
}
.gi-edge.hi { stroke: var(--gi-gold); stroke-width: 6.5; }
.gi-edge.counted { stroke: var(--gi-gold); stroke-width: 6; }
.gi-edge.pairdash {
  stroke: var(--gi-rose);
  stroke-width: 4.5;
  stroke-dasharray: 12 10;
}
.gi-edge-strong line {
  stroke: var(--gi-edge-strong);
  stroke-width: 5;
  stroke-linecap: round;
}

/* —— 顶点 —— */
.gv { cursor: default; }
.gv.clickable { cursor: pointer; }
.gv-dot {
  fill: var(--gi-dot-fill);
  stroke: var(--gi-dot-stroke);
  stroke-width: 3;
  transition: fill 0.4s, stroke 0.4s;
}
.gv-halo {
  fill: none;
  stroke: transparent;
  stroke-width: 3;
  opacity: 0;
  transition: all 0.35s;
}
.gv.sel .gv-halo {
  opacity: 1;
  stroke: var(--gi-halo);
  animation: gi-pulse 1.8s ease-in-out infinite;
}
.gv.sel .gv-dot { stroke: var(--gi-halo); stroke-width: 4.5; }
.gv.nbr .gv-dot { stroke: var(--gi-teal); stroke-width: 4; }
@keyframes gi-pulse {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 1; }
}
.gv-label {
  text-anchor: middle;
  font-family: var(--vp-font-family-heading), "EB Garamond", serif;
  font-style: italic;
  font-size: 27px;
  fill: var(--gi-ink);
  pointer-events: none;
}
.gi-deg-badge circle { fill: var(--gi-badge-fill); stroke: none; }
.gi-deg-badge text {
  text-anchor: middle;
  font-size: 19px;
  font-weight: 700;
  fill: var(--gi-badge-ink);
  font-family: var(--vp-font-family-base), sans-serif;
  font-style: normal;
}

/* —— 第一幕不变量读数 —— */
.gi-invariant rect {
  fill: var(--gi-wash-a-fill);
  stroke: var(--gi-line-strong);
  stroke-width: 1.5;
}
.gi-invariant text {
  text-anchor: middle;
  font-size: 22px;
  fill: var(--gi-gold);
  letter-spacing: 0.08em;
}
.gi-invariant { opacity: 0; transition: opacity 0.5s; }
.gi-invariant.show { opacity: 1; }

/* —— 第三幕映射线 —— */
.gi-pair-line {
  stroke: var(--gi-ink-soft);
  stroke-width: 2.5;
  stroke-dasharray: 3 14;
  stroke-linecap: round;
  opacity: 0.75;
  animation: gi-dash-flow 1.2s linear infinite;
}
@keyframes gi-dash-flow {
  to { stroke-dashoffset: -17; }
}

/* ============ 覆盖层 ============ */
.gi-strip {
  position: absolute;
  left: 0; right: 0; bottom: 10px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0 40px;
}
.gi-chip {
  padding: 7px 16px;
  font-size: 20px;
  border: 1.5px solid var(--gi-chip-border);
  border-radius: 999px;
  color: var(--gi-ink-soft);
  background: var(--gi-chip-bg);
  opacity: 0.25;
  transform: translateY(8px);
  transition: all 0.45s;
}
.gi-chip.show { opacity: 1; transform: none; }
.gi-chip.bijection { border-color: var(--gi-gold); color: var(--gi-gold-strong); }
.gi-chip.ok { border-color: var(--gi-ok-border); color: var(--gi-ok); }
.gi-chip.noedge { border-color: var(--gi-rose-border); color: var(--gi-rose); }

.gi-banner {
  position: absolute;
  left: 50%;
  bottom: 88px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 18px 44px;
  border-radius: 14px;
  background: var(--gi-card-bg);
  border: 1.5px solid var(--gi-card-border);
  box-shadow: var(--gi-card-shadow);
  text-align: center;
  max-width: 1100px;
}
.gi-banner strong {
  font-family: var(--vp-font-family-heading), "EB Garamond", serif;
  font-size: 34px;
  letter-spacing: 0.06em;
  color: var(--gi-gold-strong);
}
.gi-banner span { font-size: 21px; color: var(--gi-ink-soft); }
.gi-banner.bad strong { color: var(--gi-rose); }
.gi-banner.bad { border-color: var(--gi-rose-border); }
.gi-banner.warn strong { color: var(--gi-warn); }
.gi-banner.warn { border-color: var(--gi-warn-border); }
.gi-pop-enter-active, .gi-pop-leave-active { transition: all 0.45s ease; }
.gi-pop-enter-from, .gi-pop-leave-to { opacity: 0; transform: translateX(-50%) translateY(14px); }

/* —— 定义卡片 —— */
.gi-defcard {
  position: absolute;
  left: 50%; top: 50%;
  transform: translate(-50%, -50%);
  width: 1180px;
  padding: 28px 48px 24px;
  border-radius: 18px;
  background: var(--gi-card-bg);
  border: 1.5px solid var(--gi-card-border);
  box-shadow: var(--gi-card-shadow);
  text-align: center;
}
.gi-defcard h3 {
  margin: 0 0 14px;
  font-family: var(--vp-font-family-heading), "EB Garamond", serif;
  font-size: 28px;
  color: var(--gi-gold-strong);
  letter-spacing: 0.1em;
}
.def-line { font-size: 22px; color: var(--gi-ink); line-height: 1.6; margin: 4px 0; }
.def-line em { color: var(--gi-gold-strong); font-style: normal; font-weight: 600; }
.def-formula { margin: 12px 0; }
.def-formula :deep(.katex-display) { margin: 0; }
.def-formula :deep(.katex) { font-size: 1.5em; color: var(--gi-ink); }
.kx :deep(.katex) { color: var(--gi-ink); }
.kx.gold :deep(.katex) { color: var(--gi-gold-strong); }
.def-points {
  margin: 14px 0 0;
  padding: 14px 0 0;
  border-top: 1px dashed var(--gi-line-strong);
  list-style: none;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 34px;
}
.def-points li { font-size: 19.5px; color: var(--gi-ink-soft); text-align: left; max-width: 350px; line-height: 1.55; }
.def-points li::before { content: "◆ "; color: var(--gi-gold); font-size: 14px; }
.def-points strong { color: var(--gi-gold-strong); }

/* —— 度数（第二幕）显示在面板下方 —— */
.gi-degline {
  position: absolute;
  bottom: 26px;
  display: flex;
  justify-content: space-around;
  left: 0; right: 0;
}
.gi-degline .kx :deep(.katex) { font-size: 1.7em; color: var(--gi-gold-strong); }

/* —— 第五幕总结 —— */
.gi-summary { position: absolute; inset: 0; display: flex; }
.gi-summary-rows {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 14px;
  padding: 0 20px 0 60px;
}
.gi-summary-row {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 12px 22px;
  border-radius: 14px;
  border: 1px solid var(--gi-line);
  background: var(--gi-summary-bg);
  opacity: 0.18;
  transform: translateX(-16px);
  transition: all 0.5s ease;
}
.gi-summary-row.active { opacity: 1; transform: none; border-color: var(--gi-line-strong); }
.gi-summary-row .row-no {
  font-family: var(--vp-font-family-heading), "EB Garamond", serif;
  font-size: 34px;
  color: var(--gi-row-no);
}
.gi-summary-row.active .row-no { color: var(--gi-gold); }
.gi-summary-row h4 {
  margin: 0 0 3px;
  font-family: var(--vp-font-family-heading), "EB Garamond", serif;
  font-size: 23px;
  color: var(--gi-gold-strong);
  letter-spacing: 0.06em;
}
.gi-summary-row p { margin: 0; font-size: 19.5px; color: var(--gi-ink-soft); }
.gi-k5 {
  flex: none;
  width: 480px;
  height: 100%;
  opacity: 0;
  transform: scale(0.94);
  transition: all 0.55s ease;
}
.gi-k5.show { opacity: 1; transform: none; }
.gi-k5 .gi-edge { stroke-width: 3; }
.gi-k5-hint {
  text-anchor: middle;
  font-size: 21px;
  fill: var(--gi-ink-soft);
  letter-spacing: 0.06em;
}

/* —— 滑杆（置于左下角，避开 B 顶点的运动轨迹） —— */
.gi-slider {
  position: absolute;
  left: 36px;
  bottom: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 11px 22px;
  border-radius: 999px;
  background: var(--gi-chip-bg);
  border: 1px solid var(--gi-line-strong);
}
.gi-slider-label, .gi-slider-value { font-size: 19px; color: var(--gi-ink-soft); }
.gi-slider-value { min-width: 52px; text-align: right; color: var(--gi-gold-strong); }
.gi-slider input[type="range"] {
  width: 300px;
  accent-color: var(--gi-gold);
  cursor: ew-resize;
}

/* ============ 字幕 ============ */
.gi-caption {
  flex: none;
  height: 74px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 90px;
  border-top: 1px solid var(--gi-line);
}
.gi-caption p {
  margin: 0;
  text-align: center;
  font-size: 24px;
  line-height: 1.55;
  color: var(--gi-ink);
}

/* ============ 控制栏 ============ */
.gi-controls {
  flex: none;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 30px 6px;
}
.gi-btns { display: flex; gap: 12px; }
.gi-btns button {
  padding: 11px 22px;
  font-size: 19px;
  color: var(--gi-ink);
  background: var(--gi-btn-bg);
  border: 1px solid var(--gi-btn-border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.22s;
}
.gi-btns button:hover:not(:disabled) {
  border-color: var(--gi-gold);
  color: var(--gi-gold-strong);
  background: var(--gi-summary-bg);
}
.gi-btns button:disabled { opacity: 0.35; cursor: default; }
.gi-btns button.primary {
  background: var(--gi-primary-bg);
  border-color: var(--gi-primary-bg);
  color: var(--gi-primary-ink);
  font-weight: 700;
}
.gi-btns button.primary:hover:not(:disabled) {
  background: var(--gi-primary-hover);
  color: var(--gi-primary-ink);
}
.space-hint { font-weight: 400; font-size: 15px; opacity: 0.75; }
.gi-kbd { margin: 0; font-size: 17px; color: var(--gi-kbd); }
.gi-kbd.armed { color: var(--gi-kbd-armed); }

/* ============ 移动端 ============ */
@media (max-width: 768px) {
  .gi-embed { border-radius: 10px; }
  .gi-caption p { font-size: 26px; }
}

/* ============ 减少动态 ============ */
@media (prefers-reduced-motion: reduce) {
  .gi-stage * { animation: none !important; }
}
</style>
