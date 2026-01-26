import lottie from '@aarsteinmedia/lottie-web';
import type { Directive, App } from 'vue';

import loadingAnimation from '@/assets/loading.json';

interface LoadingOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
  opacity?: number;
}

interface LoadingElement extends globalThis.HTMLElement {
  _lottieInstance?: unknown;
  _originalDisplay?: string;
  _overlay?: globalThis.HTMLDivElement;
}

// 提取指令逻辑到独立函数
const createLoadingOverlay = (
  el: LoadingElement,
  options: LoadingOptions
): { lottieInstance: unknown; overlay: globalThis.HTMLDivElement } => {
  const {
    width = 100,
    height = 100,
    backgroundColor = 'rgba(255, 255, 255, 0.9)',
    opacity = 0.8,
  } = options;

  // 保存原始 display 值
  el._originalDisplay = el.style.display || '';

  // 创建遮罩层
  const overlay = globalThis.document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = backgroundColor;
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '9999';
  overlay.style.opacity = opacity.toString();

  // 确保父元素有相对定位
  if (globalThis.window.getComputedStyle(el).position === 'static') {
    el.style.position = 'relative';
  }

  // 创建 lottie 容器
  const lottieContainer = globalThis.document.createElement('div');
  lottieContainer.style.width = `${width}px`;
  lottieContainer.style.height = `${height}px`;

  overlay.appendChild(lottieContainer);
  el.appendChild(overlay);

  // 初始化 lottie 动画
  const lottieInstance = lottie.loadAnimation({
    container: lottieContainer,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderer: 'svg' as any,
    loop: true,
    autoplay: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    animationData: loadingAnimation as any,
  });

  return { lottieInstance, overlay };
};

const removeLoadingOverlay = (el: LoadingElement): void => {
  // 销毁 lottie 实例
  if (el._lottieInstance) {
    (el._lottieInstance as { destroy: () => void }).destroy();
    el._lottieInstance = undefined;
  }

  // 移除遮罩层
  if (el._overlay) {
    el?.removeChild(el._overlay);
    el._overlay = undefined;
  }

  // 恢复原始状态
  el.style.pointerEvents = '';
  el.style.position = '';
};

export const vLoading: Directive<LoadingElement, boolean | LoadingOptions> = {
  mounted(el, binding) {
    if (binding.value === false) return;

    const options: LoadingOptions = typeof binding.value === 'object' ? binding.value : {};
    const { lottieInstance, overlay } = createLoadingOverlay(el, options);

    el._lottieInstance = lottieInstance;
    el._overlay = overlay;

    // 设置元素为加载状态
    el.style.pointerEvents = 'none';
  },

  updated(el, binding) {
    const oldValue = binding.oldValue;
    const newValue = binding.value;

    // 如果值从 false 变为 true
    if (oldValue === false && newValue !== false) {
      const options: LoadingOptions = typeof newValue === 'object' ? newValue : {};
      const { lottieInstance, overlay } = createLoadingOverlay(el, options);

      el._lottieInstance = lottieInstance;
      el._overlay = overlay;
      el.style.pointerEvents = 'none';
    }
    // 如果值从 true 变为 false
    else if (oldValue !== false && newValue === false) {
      removeLoadingOverlay(el);
    }
  },

  unmounted(el) {
    removeLoadingOverlay(el);
  },
};

// 插件形式注册
export const LoadingPlugin = {
  install(app: App) {
    app.directive('loading', vLoading);
  },
};

// 导出默认安装函数
export default {
  install(app: App) {
    app.directive('loading', vLoading);
  },
};
