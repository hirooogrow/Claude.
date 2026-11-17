"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** クライアントでマウント済みなら true（サーバー描画とハイドレーション中は false） */
export function useIsClient() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
