"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { RundownItem } from "@/lib/types";
import { IconMapPin, IconSparkle, IconCheck, ActivityIconSvg } from "@/components/ui/Icon";

interface Theme {
  bg: string;
  card: string;
  accent: string;
  text: string;
}

interface RundownCardProps {
  items: RundownItem[];
  title?: string;
  theme: Theme;
  onContinue: () => void;
}

export default function RundownCard({ items, title, theme, onContinue }: RundownCardProps) {
  // Track how many items have been revealed so far (starts at 1 for dramatic reveal)
  const [revealedCount, setRevealedCount] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-reveal next item every 1.5 seconds for dramatic pacing
  useEffect(() => {
    if (!isAutoPlaying) return;
    if (revealedCount >= items.length) return;

    const timer = setInterval(() => {
      setRevealedCount((prev) => {
        if (prev >= items.length) {
          setIsAutoPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1400); // 1.4s per item = dramatic & readable!

    return () => clearInterval(timer);
  }, [revealedCount, items.length, isAutoPlaying]);

  const allRevealed = revealedCount >= items.length;

  const handleRevealAll = () => {
    setRevealedCount(items.length);
    setIsAutoPlaying(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md mx-auto flex flex-col gap-5 px-2 py-4"
    >
      {/* Outer Aesthetic Container Card */}
      <div
        className="relative rounded-[2.5rem] p-6 sm:p-7 overflow-hidden flex flex-col gap-6 shadow-2xl backdrop-blur-xl"
        style={{
          background: "rgba(255, 255, 255, 0.94)",
          border: `1.5px solid ${theme.accent}35`,
          boxShadow: `0 24px 60px -12px ${theme.accent}35, 0 8px 24px rgba(0, 0, 0, 0.04)`,
        }}
      >
        {/* Decorative Ambient Background Glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full blur-3xl pointer-events-none"
          style={{ background: theme.accent }}
        />

        {/* Header & Reveal Progress */}
        <div className="text-center flex flex-col items-center relative z-10">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.25em] mb-2 border shadow-sm"
            style={{ background: `${theme.accent}15`, color: theme.accent, borderColor: `${theme.accent}30` }}
          >
            <IconSparkle size={12} color={theme.accent} strokeWidth={2} />
            <span>AGENDA {Math.min(revealedCount, items.length)} DARI {items.length}</span>
          </div>

          <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">
            {title || "Rundown Ngedate"}
          </h2>
          <p className="text-xs text-gray-400 mt-1 font-medium">
            {allRevealed
              ? "Semua rencana siap! Gimana, seru kan?"
              : "Mem buka rencana satu per satu..."}
          </p>

          {/* Reveal Progress Bar */}
          <div className="w-full max-w-[200px] h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden p-0.5 border border-gray-200/60">
            <motion.div
              className="h-full rounded-full"
              style={{ background: theme.accent }}
              initial={{ width: "0%" }}
              animate={{ width: `${(revealedCount / items.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Timeline Items List (Revealed One-By-One) */}
        <div className="relative flex flex-col gap-4 py-2 min-h-[220px]">
          {/* Vertical Connecting Line */}
          <div
            className="absolute left-[27px] top-5 bottom-5 w-0.5 rounded-full pointer-events-none"
            style={{ background: `linear-gradient(180deg, ${theme.accent}70 0%, ${theme.accent}15 100%)` }}
          />

          {items.slice(0, revealedCount).map((item, idx) => {
            const isLatestRevealed = idx === revealedCount - 1 && !allRevealed;
            const emojiDisplay = item.emoji || "⏰";

            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 35, scale: 0.88, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex items-start gap-3.5 group"
              >
                {/* Left Emoji Badge Container */}
                <motion.div
                  animate={isLatestRevealed ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 0.4 }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-xl shadow-md border z-10 relative"
                  style={{
                    background: isLatestRevealed
                      ? `linear-gradient(135deg, ${theme.accent}20 0%, #ffffff 100%)`
                      : `linear-gradient(135deg, ${theme.bg} 0%, #ffffff 100%)`,
                    borderColor: isLatestRevealed ? theme.accent : `${theme.accent}40`,
                    boxShadow: isLatestRevealed
                      ? `0 0 20px ${theme.accent}50, 0 4px 12px rgba(0,0,0,0.05)`
                      : `0 4px 12px ${theme.accent}20`,
                  }}
                >
                  <ActivityIconSvg iconKey={item.icon || item.emoji} size={22} color={theme.accent} />
                  {isLatestRevealed && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-pink-500 animate-ping" />
                  )}
                </motion.div>

                {/* Right Details Card */}
                <div
                  className="flex-1 p-4 rounded-2xl border transition-all"
                  style={{
                    background: isLatestRevealed
                      ? `linear-gradient(135deg, ${theme.bg}50 0%, #ffffff 100%)`
                      : "rgba(249, 250, 251, 0.85)",
                    borderColor: isLatestRevealed ? `${theme.accent}50` : "rgba(229, 231, 235, 0.8)",
                    boxShadow: isLatestRevealed ? `0 8px 20px -4px ${theme.accent}20` : "none",
                  }}
                >
                  {/* Time Badge */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="inline-flex items-center gap-1 text-[11px] font-extrabold font-mono px-2.5 py-0.5 rounded-md"
                      style={{ background: `${theme.accent}15`, color: theme.accent }}
                    >
                      <span>⏰</span>
                      <span>{item.time || "Flexibel"}</span>
                    </span>
                    <span className="text-[10px] font-bold text-gray-300">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Activity Title */}
                  <h3 className="text-sm font-extrabold text-gray-800 leading-snug mt-1">
                    {item.title || "Kegiatan"}
                  </h3>

                  {/* Location */}
                  {item.location && (
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium mt-1">
                      <IconMapPin size={12} color={theme.accent} strokeWidth={2} />
                      <span className="truncate">{item.location}</span>
                    </div>
                  )}

                  {/* Optional Note */}
                  {item.note && (
                    <div
                      className="text-[11px] mt-2 pt-1.5 border-t italic font-medium"
                      style={{ color: `${theme.accent}bb`, borderColor: "rgba(229, 231, 235, 0.6)" }}
                    >
                      &ldquo;{item.note}&rdquo;
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Skip Auto-Reveal Button (if still revealing) */}
        {!allRevealed && (
          <button
            type="button"
            onClick={handleRevealAll}
            className="text-[11px] font-bold text-gray-400 hover:text-gray-600 text-center transition-colors -mt-2"
          >
            ⚡ Tampilkan Semua Sekaligus
          </button>
        )}

        {/* Continue Action Button (Revealed after all items appear) */}
        <AnimatePresence>
          {allRevealed && (
            <motion.button
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "backOut" }}
              onClick={onContinue}
              className="w-full py-4 rounded-2xl text-sm font-bold text-white shadow-xl transition-transform active:scale-[0.98] hover:opacity-95 flex items-center justify-center gap-2 mt-1"
              style={{
                background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent}ee 100%)`,
                boxShadow: `0 12px 28px -5px ${theme.accent}60`,
              }}
            >
              <span>Lanjut Ke Pesan Spesial</span>
              <span className="text-base font-normal">→</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
