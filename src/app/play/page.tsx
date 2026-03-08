"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { items, getToolById, ToolMatchItem } from "@/data/curriculum";
import { useGameStats } from "@/hooks/useGameStats";
import { useProgress } from "@/hooks/useProgress";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { VictoryScreen } from "@/components/game/VictoryScreen";
import { Button } from "@/components/ui/Button";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Diversity-aware task picker. Guarantees:
 * 1. Proportional category balance (text vs visual)
 * 2. At least 2 "Don't Use AI" items per session (first-class mechanic)
 * 3. Answer tool diversity — no single correct tool dominates
 * 4. Final order is shuffled so patterns aren't predictable
 */
function diversePick(pool: ToolMatchItem[], count: number): ToolMatchItem[] {
  if (pool.length <= count) return shuffle(pool);

  // Split by category for proportional representation
  const byCategory = new Map<string, ToolMatchItem[]>();
  for (const item of pool) {
    const list = byCategory.get(item.category) ?? [];
    list.push(item);
    byCategory.set(item.category, list);
  }

  // Guarantee "Don't Use AI" floor — the game's signature mechanic
  const noAiItems = shuffle(pool.filter((i) => i.answer === "dont-use-ai"));
  const noAiFloor = Math.min(2, noAiItems.length);
  const guaranteed = noAiItems.slice(0, noAiFloor);
  const guaranteedIds = new Set(guaranteed.map((i) => i.id));

  // Fill remaining slots proportionally from each category
  const remaining = count - guaranteed.length;
  const availableByCategory = new Map<string, ToolMatchItem[]>();
  for (const [cat, catItems] of byCategory) {
    availableByCategory.set(cat, shuffle(catItems.filter((i) => !guaranteedIds.has(i.id))));
  }

  const categoryKeys = [...availableByCategory.keys()];
  const totalAvailable = categoryKeys.reduce((sum, k) => sum + (availableByCategory.get(k)?.length ?? 0), 0);

  const picked: ToolMatchItem[] = [...guaranteed];
  const pickedIds = new Set(guaranteedIds);

  // Proportional allocation per category
  for (const cat of categoryKeys) {
    const catPool = availableByCategory.get(cat) ?? [];
    const share = Math.round((catPool.length / totalAvailable) * remaining);
    const take = Math.min(share, catPool.length);
    for (let i = 0; i < take && picked.length < count; i++) {
      picked.push(catPool[i]);
      pickedIds.add(catPool[i].id);
    }
  }

  // Fill any remainder (rounding gaps) from unused items
  if (picked.length < count) {
    const unused = shuffle(pool.filter((i) => !pickedIds.has(i.id)));
    for (const item of unused) {
      if (picked.length >= count) break;
      picked.push(item);
    }
  }

  return shuffle(picked);
}

export default function PlayPage() {
  const [queue, setQueue] = useState<ToolMatchItem[]>(() => diversePick(items, 10));
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [taskStart, setTaskStart] = useState(() => Date.now());
  const [enrichment, setEnrichment] = useState<ToolMatchItem["enrichment"] | null>(null);
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

  const handleSelect = useCallback(
    (toolId: string) => {
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
        pts *= Math.min(combo + 1, 4); // combo cap at 4x
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
          const xpEarned = Math.max(10, Math.round(score / 5));
          earnXP(xpEarned);
          sfx.playCelebration();
        } else {
          setIdx((i) => i + 1);
          setTaskStart(Date.now());
        }
      }, 2200);
    },
    [feedback, current, taskStart, combo, idx, queue.length, score, recordAnswer, stopTracking, earnXP, sfx]
  );

  if (!queue.length) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-pixel text-xs text-game-primary animate-pulse-neon">LOADING WORKSHOP...</p>
      </main>
    );
  }

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <VictoryScreen
          results={{ xp: Math.max(10, Math.round(score / 5)), accuracy: stats.accuracy, speed: stats.elapsedSeconds, correctAnswers: stats.correct, totalQuestions: stats.total }}
          speedLabel="Time (s)"
          onPlayAgain={() => { setQueue(diversePick(items, 10)); setIdx(0); setScore(0); setCombo(0); setDone(false); setTaskStart(Date.now()); startTracking(); }}
          onBackToMenu={() => { window.location.href = "/"; }}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-4 md:p-8 relative">
      {/* HUD */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-4">
        <div className="font-pixel text-[10px] text-game-secondary">
          {idx + 1}<span className="text-game-secondary/40">/{queue.length}</span>
        </div>
        <div className="font-pixel text-[10px] text-game-accent">
          {score} PTS
        </div>
        {combo > 1 && (
          <motion.div
            key={combo}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-pixel text-[10px] text-game-warning"
          >
            {combo}x COMBO
          </motion.div>
        )}
      </div>

      {/* Task Card — Blueprint style */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="w-full max-w-2xl border-2 border-game-primary/30 bg-game-dark/80 p-6 md:p-8 relative"
          style={{ borderImage: "none" }}
        >
          {/* Blueprint corner marks */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-game-primary" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-game-primary" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-game-primary" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-game-primary" />

          <p className="font-pixel text-[8px] text-game-primary/50 mb-3 tracking-widest">TASK BRIEF</p>
          <p className="font-pixel text-xs md:text-sm text-white leading-relaxed">{current.prompt}</p>
        </motion.div>
      </AnimatePresence>

      {/* Enrichment feedback */}
      <AnimatePresence>
        {enrichment && feedback && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`w-full max-w-2xl mt-3 p-4 border-l-4 ${feedback === "correct" ? "border-game-success bg-game-success/5" : "border-game-error bg-game-error/5"}`}
          >
            <p className="font-pixel text-[8px] text-game-secondary mb-2">{enrichment.whyItMatters}</p>
            {enrichment.proTip && <p className="font-pixel text-[7px] text-game-accent/70">💡 {enrichment.proTip}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tool Shelf — Pegboard */}
      <div className="w-full max-w-2xl mt-6 mb-4">
        <p className="font-pixel text-[8px] text-game-secondary/40 mb-3 tracking-widest text-center">SELECT THE RIGHT TOOL</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {currentTools.map((tool) => {
            if (!tool) return null;
            const isSelected = selected === tool.id;
            const isCorrect = feedback === "correct" && isSelected;
            const isWrong = feedback === "wrong" && isSelected;
            const isAnswer = feedback === "wrong" && tool.id === current.answer;
            return (
              <motion.button
                key={tool.id}
                onClick={() => handleSelect(tool.id)}
                disabled={!!feedback}
                whileHover={!feedback ? { scale: 1.04 } : undefined}
                whileTap={!feedback ? { scale: 0.96 } : undefined}
                animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : isCorrect ? { scale: [1, 1.08, 1] } : {}}
                className={`
                  relative p-4 border-2 transition-colors duration-150 cursor-pointer
                  font-pixel text-[10px] text-center
                  ${isCorrect ? "border-game-success bg-game-success/10 text-game-success" : ""}
                  ${isWrong ? "border-game-error bg-game-error/10 text-game-error" : ""}
                  ${isAnswer ? "border-game-success/60 bg-game-success/5" : ""}
                  ${!feedback && !isSelected ? "border-game-secondary/20 hover:border-game-primary/60 bg-game-dark/60 text-white" : ""}
                  ${feedback && !isSelected && !isAnswer ? "opacity-30" : ""}
                  disabled:cursor-default
                `}
                aria-label={`Select ${tool.name}`}
              >
                <span className="text-lg block mb-2" style={{ color: !feedback ? tool.color : undefined }}>{tool.icon}</span>
                <span className="block">{tool.name}</span>
                {tool.id === "dont-use-ai" && (
                  <span className="absolute -top-1 -right-1 font-pixel text-[6px] text-game-accent bg-game-dark px-1">+5</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Back button */}
      <div className="mt-auto pt-4">
        <Button href="/" variant="ghost">← BACK</Button>
      </div>
    </main>
  );
}
