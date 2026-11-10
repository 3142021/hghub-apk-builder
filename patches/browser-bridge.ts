/**
 * 网页版桥接层：替换 @tauri-apps/api/core。
 * 所有 invoke 调用转成对本地 Python 服务（同源）的 HTTP POST。
 * 通过 vite resolve.alias 注入，源码其余部分零改动。
 */

export async function invoke<T = unknown>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  const r = await fetch(`/cmd/${encodeURIComponent(cmd)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args ?? {}),
  });
  let data: unknown = null;
  try {
    data = await r.json();
  } catch {
    /* 空响应体 */
  }
  if (!r.ok || (data && typeof data === "object" && "__error__" in (data as Record<string, unknown>))) {
    const msg = (data as { __error__?: string } | null)?.__error__ ?? `请求失败（HTTP ${r.status}）`;
    throw new Error(msg);
  }
  return data as T;
}

/** 浏览器没有 Tauri 插件事件（安卓返回键等），安静返回空监听器。 */
export async function addPluginListener(
  _plugin: string,
  _event: string,
  _handler: (event: unknown) => void,
): Promise<{ unregister: () => Promise<void> }> {
  void _handler;
  return { unregister: async () => {} };
}
