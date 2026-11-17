"use client";

import { motion } from "framer-motion";
import { vocabStore } from "@/lib/stores";

/** My単語リストの登録数（登録すると即反映） */
export function SavedWordCount() {
  const words = vocabStore.useStore();
  return (
    <motion.span
      key={words.length}
      initial={{ scale: 1.4, color: "#d7212f" }}
      animate={{ scale: 1, color: "#1f1f24" }}
      className="text-xl font-extrabold"
    >
      {words.length}
    </motion.span>
  );
}
