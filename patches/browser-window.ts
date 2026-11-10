/**
 * 网页版窗口垫片：替换 @tauri-apps/api/window。
 * 浏览器没有原生窗口控制，全部方法静默成功（catch(() => {}) 的调用点无感）。
 */

export interface WebviewWindowHandle {
  isMaximized(): Promise<boolean>;
  isFullscreen(): Promise<boolean>;
  onResized(cb: (event: unknown) => void): Promise<{ unregister: () => Promise<void> }>;
  toggleMaximize(): Promise<void>;
  minimize(): Promise<void>;
  close(): Promise<void>;
  startResizeDragging(direction: string): Promise<void>;
  startDragging(): Promise<void>;
}

const noopUnregister = () => Promise.resolve();

export function getCurrentWindow(): WebviewWindowHandle {
  return {
    isMaximized: () => Promise.resolve(false),
    isFullscreen: () => Promise.resolve(
      typeof document !== "undefined" && !!document.fullscreenElement,
    ),
    onResized: (_cb: (event: unknown) => void) => Promise.resolve({ unregister: noopUnregister }),
    toggleMaximize: () => {
      if (typeof document === "undefined") return Promise.resolve();
      return document.fullscreenElement
        ? document.exitFullscreen().catch(() => {})
        : Promise.resolve();
    },
    minimize: () => Promise.resolve(),
    close: () => Promise.resolve(),
    startResizeDragging: (_direction: string) => Promise.resolve(),
    startDragging: () => Promise.resolve(),
  };
}
