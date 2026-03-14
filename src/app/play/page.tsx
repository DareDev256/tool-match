"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ToolId } from "@/data/curriculum";
import { useGameEngine } from "@/hooks/useGameEngine";
import { VictoryScreen } from "@/components/game/VictoryScreen";
import { Button } from "@/components/ui/Button";

export default function PlayPage() {
  const engine = useGameEngine();

  if (engine.isEmpty) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-pixel text-xs text-game-primary animate-pulse-neon">LOADING WORKSHOP...</p>
      </main>
    );
  }

  if (engine.done) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <VictoryScreen
          results={{ xp: engine.xpEarned, accuracy: engine.stats.accuracy, speed: engine.stats.elapsedSeconds, correctAnswers: engine.stats.correct, totalQuestions: engine.stats.total }}
          speedLabel="Time (s)"
          onPlayAgain={engine.handlePlayAgain}
          onBackToMenu={() => { window.location.href = "/"; }}
        />
      </main>
    );
  }

  const { current, currentTools, idx, queueLength, selected, feedback, combo, score, enrichment } = engine;

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-4 md:p-8 relative">
      {/* HUD */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-4">
        <div className="font-pixel text-[10px] text-game-secondary">
          {idx + 1}<span className="text-game-secondary/40">/{queueLength}</span>
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
                onClick={() => engine.handleSelect(tool.id)}
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
