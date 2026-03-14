"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categories, getItemsByLevel } from "@/data/curriculum";
import type { ToolMatchCategoryId } from "@/data/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { Button } from "@/components/ui/Button";

export default function CategoriesPage() {
  const { progress, isLoading, isCategoryUnlocked, isLevelUnlocked } =
    useProgress(categories);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-pixel text-xs text-game-primary animate-pulse-neon">
          LOADING...
        </p>
      </main>
    );
  }

  function getLevelCompletion(categoryId: ToolMatchCategoryId, levelId: number): number {
    if (!progress) return 0;
    const levelItems = getItemsByLevel(categoryId, levelId);
    if (levelItems.length === 0) return 0;
    const answered = levelItems.filter(
      (item) => progress.itemScores[item.id]
    ).length;
    return Math.round((answered / levelItems.length) * 100);
  }

  function getCategoryCompletion(categoryId: ToolMatchCategoryId): number {
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat || !progress) return 0;
    const totalItems = cat.levels.reduce((sum, level) => {
      return sum + getItemsByLevel(categoryId, level.id).length;
    }, 0);
    if (totalItems === 0) return 0;
    const answeredItems = cat.levels.reduce((sum, level) => {
      const levelItems = getItemsByLevel(categoryId, level.id);
      return (
        sum +
        levelItems.filter((item) => progress.itemScores[item.id]).length
      );
    }, 0);
    return Math.round((answeredItems / totalItems) * 100);
  }

  function isLevelCompleted(categoryId: ToolMatchCategoryId, levelId: number): boolean {
    if (!progress) return false;
    return progress.completedLevels.includes(`${categoryId}-${levelId}`);
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-4 md:p-8 relative">
      {/* Decorative corners */}
      <div className="fixed top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-game-primary/30" />
      <div className="fixed top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-game-primary/30" />
      <div className="fixed bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-game-primary/30" />
      <div className="fixed bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-game-primary/30" />

      {/* Header */}
      <motion.div
        className="text-center mb-8 mt-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="font-pixel text-[8px] text-game-secondary/50 tracking-widest mb-2">
          TOOL MATCH
        </p>
        <h1 className="font-pixel text-sm md:text-base text-game-primary neon-glow">
          CATEGORIES
        </h1>
        <p className="font-pixel text-[7px] text-game-accent/60 mt-2">
          SELECT A WORKSHOP TO TRAIN
        </p>
      </motion.div>

      {/* Category Grid */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {categories.map((category, catIndex) => {
          const unlocked = isCategoryUnlocked(category.id);
          const completion = getCategoryCompletion(category.id);
          const isExpanded = expandedId === category.id;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
              className="flex flex-col"
            >
              {/* Category Card */}
              <motion.button
                onClick={() => {
                  if (!unlocked) return;
                  setExpandedId(isExpanded ? null : category.id);
                }}
                whileHover={unlocked ? { scale: 1.02 } : undefined}
                whileTap={unlocked ? { scale: 0.98 } : undefined}
                className={`
                  relative w-full text-left p-5 border-2 transition-colors duration-150
                  ${unlocked
                    ? "border-game-primary/30 bg-game-dark/80 hover:border-game-primary/60 cursor-pointer"
                    : "border-game-secondary/15 bg-game-dark/40 cursor-not-allowed opacity-50"
                  }
                  ${isExpanded ? "border-game-primary/80" : ""}
                `}
                disabled={!unlocked}
                aria-expanded={isExpanded}
                aria-label={
                  unlocked
                    ? `${category.title} - ${completion}% complete`
                    : `${category.title} - Locked`
                }
              >
                {/* Blueprint corner marks */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-game-primary/40" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-game-primary/40" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-game-primary/40" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-game-primary/40" />

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {unlocked ? (
                      <span
                        className="text-2xl block"
                        style={{ color: "var(--game-primary)" }}
                      >
                        {category.icon}
                      </span>
                    ) : (
                      <span className="text-2xl block text-game-secondary/30">
                        &#x25A0;
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-pixel text-[10px] text-white mb-1">
                      {unlocked ? category.title : "LOCKED"}
                    </h2>
                    <p className="font-pixel text-[7px] text-game-secondary/70 leading-relaxed">
                      {unlocked ? category.description : "Complete previous category to unlock"}
                    </p>

                    {/* Stats row */}
                    {unlocked && (
                      <div className="flex items-center gap-3 mt-3">
                        <span className="font-pixel text-[7px] text-game-accent">
                          {category.levels.length} {category.levels.length === 1 ? "LEVEL" : "LEVELS"}
                        </span>
                        <span className="font-pixel text-[7px] text-game-primary">
                          {completion}%
                        </span>
                      </div>
                    )}

                    {/* Progress bar */}
                    {unlocked && (
                      <div className="mt-2 w-full h-1 bg-game-secondary/10 overflow-hidden">
                        <motion.div
                          className="h-full bg-game-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${completion}%` }}
                          transition={{ delay: catIndex * 0.1 + 0.3, duration: 0.6, ease: "easeOut" }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Expand indicator */}
                  {unlocked && (
                    <motion.span
                      className="font-pixel text-[8px] text-game-primary/50 flex-shrink-0 mt-1"
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {">"}
                    </motion.span>
                  )}
                </div>
              </motion.button>

              {/* Expanded Level List */}
              <AnimatePresence>
                {isExpanded && unlocked && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-l-2 border-r-2 border-b-2 border-game-primary/20 bg-game-dark/60">
                      {category.levels.map((level, levelIndex) => {
                        const levelUnlocked = isLevelUnlocked(category.id, level.id);
                        const levelCompletion = getLevelCompletion(category.id, level.id);
                        const completed = isLevelCompleted(category.id, level.id);
                        const levelItems = getItemsByLevel(category.id, level.id);

                        return (
                          <motion.div
                            key={level.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: levelIndex * 0.05 }}
                            className={`
                              flex items-center justify-between p-4
                              ${levelIndex < category.levels.length - 1 ? "border-b border-game-secondary/10" : ""}
                            `}
                          >
                            <div className="flex items-center gap-3">
                              {/* Level status icon */}
                              <span
                                className={`font-pixel text-[10px] ${
                                  completed
                                    ? "text-game-success"
                                    : levelUnlocked
                                    ? "text-game-accent"
                                    : "text-game-secondary/30"
                                }`}
                              >
                                {completed ? "+" : levelUnlocked ? ">" : "#"}
                              </span>

                              <div>
                                <p
                                  className={`font-pixel text-[8px] ${
                                    levelUnlocked ? "text-white" : "text-game-secondary/40"
                                  }`}
                                >
                                  LVL {level.id}: {level.name}
                                </p>
                                <p className="font-pixel text-[6px] text-game-secondary/40 mt-1">
                                  {levelItems.length} TASKS
                                  {level.requiredXp > 0 && !levelUnlocked && (
                                    <span className="text-game-accent/50 ml-2">
                                      {level.requiredXp} XP REQ
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {/* Level completion */}
                              {levelUnlocked && (
                                <span className="font-pixel text-[7px] text-game-primary/60">
                                  {levelCompletion}%
                                </span>
                              )}

                              {/* Play link */}
                              {levelUnlocked ? (
                                <Button
                                  href={`/play?category=${category.id}&level=${level.id}`}
                                  variant="ghost"
                                  className="!px-3 !py-1 !text-[7px]"
                                >
                                  {completed ? "REPLAY" : "PLAY"}
                                </Button>
                              ) : (
                                <span className="font-pixel text-[7px] text-game-secondary/30">
                                  LOCKED
                                </span>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Back button */}
      <div className="mt-auto pt-4 pb-4">
        <Button href="/" variant="ghost">
          {"<"} BACK
        </Button>
      </div>
    </main>
  );
}
