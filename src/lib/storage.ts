"use client";

import { useSyncExternalStore } from "react";

/**
 * localStorage に永続化される小さなストア。
 * useSyncExternalStore で購読するので、複数コンポーネント・複数タブ間で同期する。
 * （将来 Supabase に移行する際はこのインターフェースの裏側を差し替える）
 */
export function createLocalStore<T>(key: string, fallback: T) {
  let cache: T | undefined;
  const listeners = new Set<() => void>();

  const read = (): T => {
    if (cache !== undefined) return cache;
    try {
      const raw = window.localStorage.getItem(key);
      cache = raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      cache = fallback;
    }
    return cache;
  };

  const emit = () => listeners.forEach((l) => l());

  const set = (updater: T | ((prev: T) => T)) => {
    const next =
      typeof updater === "function"
        ? (updater as (prev: T) => T)(read())
        : updater;
    cache = next;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // 容量超過やプライベートモードでも、メモリ上の状態は更新する
    }
    emit();
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      cache = undefined;
      emit();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  };

  const useStore = () =>
    useSyncExternalStore(subscribe, read, () => fallback);

  return { get: read, set, subscribe, useStore };
}
