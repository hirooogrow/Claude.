"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * Next.js 16（Cache Components）は離れたページを <Activity> で隠して状態を保持する。
 * 終わったセッションは、ページが隠れるタイミングでリセットして次回は新しく始める。
 * 途中のセッションはそのまま残す（他のタブから戻って続きができる）。
 *
 * 返り値の round をセッションの key に使い、markDone を終了時に呼ぶ。
 */
export function useResetOnHide() {
  const [round, setRound] = useState(0);
  const done = useRef(false);

  useLayoutEffect(() => {
    return () => {
      if (done.current) {
        done.current = false;
        setRound((r) => r + 1);
      }
    };
  }, []);

  return {
    round,
    markDone: () => {
      done.current = true;
    },
    restart: () => {
      done.current = false;
      setRound((r) => r + 1);
    },
  };
}
