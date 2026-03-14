"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import type { ToolMatchItem, Tool, ToolId } from "@/data/curriculum";
import { items, getToolById } from "@/data/curriculum";
import type { Enrichment } from "@/types/game";
import { useGameStats } from "@/hooks/useGameStats";
import { useProgress } from "@/hooks/useProgress";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { diversePick } from "@/lib/task-picker";

const ROUND_SIZE = 10;
const FEEDBACK_DELAY_MS = 2200;
const COMBO_CAP = 4;

export interface GameEngine {
  // State
  current: ToolMatchItem;
  currentTools: (Tool | undefined)[];
  idx: number;
  queueLength: number;
  selected: ToolId | null;
  feedback: "correct" | "wrong" | null;
  combo: number;
  score: number;
  enrichment: Enrichment | null;
  done: boolean;
  isEmpty: boolean;
  stats: ReturnType<typeof useGameStats>["stats"];
  sfx: ReturnType<typeof useSoundEffects>;
  // Actions
  handleSelect: (toolId: ToolId) => void;
  handlePlayAgain: () => void;
  xpEarned: number;
}

export function useGameEngine(): GameEngine {
  const [queue, setQueue] = useState<ToolMatchItem[]>(() => diversePick(items, ROUND_SIZE));
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<ToolId | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [taskStart, setTaskStart] = useState(() => Date.now());
  const [enrichment, setEnrichment] = useState<Enrichment | null>(null);
  const [done, setDone] = useState(false);

  const { stats, startTracking, stopTracking, recordAnswer } = useGameStats();
  const { earnXP } = useProgress();
  const sfx = useSoundEffects();

  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    startTracking();
  }, [startTracking]);

  const current = queue[idx];
  const currentTools = useMemo(
    () => (current ? current.toolOptions.map((id) => getToolById(id)).filter(Boolean) : []),
    [current]
  );

  const xpEarned = Math.max(10, Math.round(score / 5));

  const handleSelect = useCallback(
    (toolId: ToolId) => {
      if (feedback || !current) return;
      setSelected(toolId);

      const isCorrect = toolId === current.answer;
      const elapsed = (Date.now() - taskStart) / 1000;
      const speedBonus = Math.max(1, Math.min(5, Math.ceil(6 - elapsed)));
      const isDontUseAi = current.answer === "dont-use-ai";

      let pts = 0;
      if (isCorrect) {
        pts = isDontUseAi && toolId === "dont-use-ai" ? 15 : 10;
        pts += speedBonus;
        pts *= Math.min(combo + 1, COMBO_CAP);
        setCombo((c) => c + 1);
        sfx.playCorrect();
      } else {
        pts = toolId === "dont-use-ai" ? -3 : -5;
        setCombo(0);
        sfx.playIncorrect();
      }

      setScore((s) => Math.max(0, s + pts));
      setFeedback(isCorrect ? "correct" : "wrong");
      recordAnswer(isCorrect);
      setEnrichment(current.enrichment ?? null);

      setTimeout(() => {
        setFeedback(null);
        setSelected(null);
        setEnrichment(null);
        if (idx + 1 >= queue.length) {
          stopTracking();
          setDone(true);
          const xp = Math.max(10, Math.round(score / 5));
          earnXP(xp);
          sfx.playCelebration();
        } else {
          setIdx((i) => i + 1);
          setTaskStart(Date.now());
        }
      }, FEEDBACK_DELAY_MS);
    },
    [feedback, current, taskStart, combo, idx, queue.length, score, recordAnswer, stopTracking, earnXP, sfx]
  );

  const handlePlayAgain = useCallback(() => {
    setQueue(diversePick(items, ROUND_SIZE));
    setIdx(0);
    setScore(0);
    setCombo(0);
    setDone(false);
    setTaskStart(Date.now());
    initialized.current = false;
    startTracking();
  }, [startTracking]);

  return {
    current,
    currentTools,
    idx,
    queueLength: queue.length,
    selected,
    feedback,
    combo,
    score,
    enrichment,
    done,
    isEmpty: !queue.length,
    stats,
    sfx,
    handleSelect,
    handlePlayAgain,
    xpEarned,
  };
}
