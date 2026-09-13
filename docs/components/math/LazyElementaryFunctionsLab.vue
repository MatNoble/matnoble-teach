<template>
  <div class="lazy-functions-lab">
    <ClientOnly>
      <ElementaryFunctionsLab v-if="isActive" />
      <div v-else class="functions-lab-placeholder">
        <div class="placeholder-card">
          <div class="icon-box" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 18C5.5 18 6.5 6 9.5 6C12.5 6 13.5 18 16.5 18C19.5 18 20.5 6 21 6" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3 12H21" stroke="#94A3B8" stroke-width="1.2" stroke-dasharray="3 3"/>
              <path d="M12 3V21" stroke="#94A3B8" stroke-width="1.2" stroke-dasharray="3 3"/>
            </svg>
          </div>
          <h2>基本初等函数图像与性质</h2>
          <p>涵盖幂函数、指数函数、对数函数、三角函数与反三角函数五大类。点击进入交互画板，动态探究定义域、值域、奇偶性与有界性。</p>
          <button class="btn-primary" type="button" @click="isActive = true">
            开启交互画板
          </button>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue';

const isActive = ref(false);
const ElementaryFunctionsLab = defineAsyncComponent(() => import('./ElementaryFunctionsLab.vue'));
</script>

<style scoped>
.lazy-functions-lab {
  width: 100%;
  margin: 20px 0 28px;
}

.functions-lab-placeholder {
  position: relative;
  width: 100%;
  min-height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background:
    radial-gradient(circle at 30% 20%, rgba(37, 99, 235, 0.08), transparent 32%),
    linear-gradient(135deg, var(--vp-c-bg-soft) 0%, var(--vp-c-bg-alt) 100%);
  box-shadow: 0 16px 36px -12px rgba(0, 0, 0, 0.06);
}

.placeholder-card {
  width: min(440px, calc(100% - 36px));
  padding: 32px 36px;
  text-align: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.05);
}

.icon-box {
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: rgba(37, 99, 235, 0.1);
}

.placeholder-card h2 {
  margin: 0 0 10px;
  border: 0;
  font-size: 1.22rem;
  line-height: 1.3;
  color: var(--vp-c-text-1);
}

.placeholder-card p {
  margin: 0 0 22px;
  color: var(--vp-c-text-2);
  font-size: 0.92rem;
  line-height: 1.6;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 24px;
  border: 0;
  border-radius: 10px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
}
</style>
