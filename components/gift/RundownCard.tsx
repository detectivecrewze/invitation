"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { RundownItem } from "@/lib/types";
import { IconMapPin, IconSparkle, ActivityIconSvg } from "@/components/ui/Icon";

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

// ─── Mini Particle Burst ──────────────────────────────────────────────────────
interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  color: string;
}

function ParticleBurst({ accent, trigger }: { accent: string; trigger: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const prevTrigger = useRef(0);

  useEffect(() => {
    if (trigger === 0 || trigger === prevTrigger.current) return;
    prevTrigger.current = trigger;

    // Generate burst of 14 particles
    const colors = [accent, `${accent}bb`, "#fff", "#ffe4e4", accent];
    const burst: Particle[] = Array.from({ length: 14 }, (_, i) => ({
      id: Date.now() + i,
      x: 0,
      y: 0,
      angle: (360 / 14) * i + Math.random() * 15 - 7,
      speed: 28 + Math.random() * 32,
      size: 4 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(burst);
    setTimeout(() => setParticles([]), 900);
  }, [trigger, accent]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl" style={{ zIndex: 20 }}>
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.speed;
        const ty = Math.sin(rad) * p.speed;
        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            animate={{ opacity: 0, scale: 0.3, x: tx, y: ty }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              left: "50%",
              top: "50%",
              marginLeft: -p.size / 2,
              marginTop: -p.size / 2,
              boxShadow: `0 0 6px ${p.color}`,
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Glowing PING Ring ────────────────────────────────────────────────────────
function GlowPing({ accent }: { accent: string }) {
  return (
    <>
      {/* Outer slow ping */}
      <motion.span
        className="absolute -inset-2 rounded-2xl"
        animate={{ scale: [1, 1.6, 1.6], opacity: [0.5, 0, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut" }}
        style={{ background: `${accent}40`, zIndex: 0 }}
      />
      {/* Inner fast ping */}
      <motion.span
        className="absolute -inset-1 rounded-2xl"
        animate={{ scale: [1, 1.35, 1.35], opacity: [0.6, 0, 0] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut", delay: 0.3 }}
        style={{ background: `${accent}55`, zIndex: 0 }}
      />
      {/* Corner dot indicator */}
      <span
        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full border-2 border-white z-10 shadow-md"
        style={{ background: accent, boxShadow: `0 0 10px ${accent}90` }}
      />
      <motion.span
        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full z-[9]"
        animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
        transition={{ repeat: Infinity, duration: 1.0, ease: "easeOut" }}
        style={{ background: accent }}
      />
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RundownCard({ items, title, theme, onContinue }: RundownCardProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [burstTrigger, setBurstTrigger] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  // Step 1: Wait 1.5s before starting, then reveal first item
  useEffect(() => {
    const initialDelay = setTimeout(() => {
      setRevealedCount(1);
      setBurstTrigger((t) => t + 1);
      setIsAutoPlaying(true);
    }, 1500);
    return () => clearTimeout(initialDelay);
  }, []);

  // Step 2: Auto-reveal remaining items every 2.5s
  useEffect(() => {
    if (!isAutoPlaying) return;
    if (revealedCount >= items.length) {
      setIsAutoPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setRevealedCount((prev) => {
        if (prev >= items.length) {
          setIsAutoPlaying(false);
          return prev;
        }
        const next = prev + 1;
        setBurstTrigger((t) => t + 1);
        return next;
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [revealedCount, items.length, isAutoPlaying]);

  // Auto-scroll to newest item
  useEffect(() => {
    if (revealedCount === 0) return;
    const lastEl = listRef.current?.lastElementChild;
    lastEl?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [revealedCount]);

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
            <span>
              {revealedCount === 0
                ? "Mempersiapkan..."
                : `AGENDA ${Math.min(revealedCount, items.length)} DARI ${items.length}`}
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">
            {title || "Rundown Ngedate"}
          </h2>
          <p className="text-xs text-gray-400 mt-1 font-medium">
            {revealedCount === 0
              ? "Sebentar lagi..."
              : allRevealed
              ? "Semua rencana siap! Gimana, seru kan? 🎉"
              : "Membuka rencana satu per satu..."}
          </p>

          {/* Reveal Progress Bar */}
          <div className="w-full max-w-[200px] h-2 bg-gray-100 rounded-full mt-3 overflow-hidden border border-gray-200/60">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${theme.accent} 0%, ${theme.accent}cc 100%)` }}
              initial={{ width: "0%" }}
              animate={{ width: revealedCount === 0 ? "0%" : `${(revealedCount / items.length) * 100}%` }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        {/* Timeline Items List (Revealed One-By-One) */}
        <div className="relative flex flex-col gap-4 py-2 min-h-[220px]" ref={listRef}>
          {/* Vertical Connecting Line — grows as items reveal */}
          <motion.div
            className="absolute left-[27px] top-7 w-0.5 rounded-full pointer-events-none origin-top"
            style={{ background: `linear-gradient(180deg, ${theme.accent}70 0%, ${theme.accent}15 100%)` }}
            initial={{ scaleY: 0, height: "calc(100% - 28px)" }}
            animate={{ scaleY: revealedCount > 0 ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />

          <AnimatePresence>
            {items.slice(0, revealedCount).map((item, idx) => {
              const isLatestRevealed = idx === revealedCount - 1 && !allRevealed;
              const isBursting = isLatestRevealed;

              return (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, x: -24, scale: 0.88, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex items-start gap-3.5 group"
                >
                  {/* Left Icon Badge — with glow ping on latest */}
                  <div className="relative shrink-0">
                    <motion.div
                      animate={
                        isLatestRevealed
                          ? { scale: [0.8, 1.15, 1.0], rotate: [0, -8, 4, 0] }
                          : { scale: 1, rotate: 0 }
                      }
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-md border z-10 relative"
                      style={{
                        background: isLatestRevealed
                          ? `linear-gradient(135deg, ${theme.accent}25 0%, #ffffff 100%)`
                          : `linear-gradient(135deg, ${theme.bg} 0%, #ffffff 100%)`,
                        borderColor: isLatestRevealed ? theme.accent : `${theme.accent}40`,
                        boxShadow: isLatestRevealed
                          ? `0 0 28px ${theme.accent}60, 0 4px 14px rgba(0,0,0,0.07)`
                          : `0 4px 12px ${theme.accent}15`,
                      }}
                    >
                      <ActivityIconSvg iconKey={item.icon || item.emoji} size={22} color={theme.accent} />

                      {/* Particle burst on latest item */}
                      {isBursting && (
                        <ParticleBurst accent={theme.accent} trigger={burstTrigger} />
                      )}
                    </motion.div>

                    {/* Big glowing PING on latest item */}
                    {isLatestRevealed && <GlowPing accent={theme.accent} />}
                  </div>

                  {/* Right Details Card */}
                  <motion.div
                    className="flex-1 p-4 rounded-2xl border transition-all"
                    animate={
                      isLatestRevealed
                        ? { boxShadow: [`0 0 0px ${theme.accent}00`, `0 8px 28px -4px ${theme.accent}35`] }
                        : {}
                    }
                    transition={{ duration: 0.5 }}
                    style={{
                      background: isLatestRevealed
                        ? `linear-gradient(135deg, ${theme.bg}50 0%, #ffffff 100%)`
                        : "rgba(249, 250, 251, 0.85)",
                      borderColor: isLatestRevealed ? `${theme.accent}50` : "rgba(229, 231, 235, 0.8)",
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
                      <span className="text-[10px] font-bold text-gray-300">#{idx + 1}</span>
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
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Anticipation pulse while waiting for next item */}
          {!allRevealed && revealedCount > 0 && revealedCount < items.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 pl-4"
            >
              <div className="w-14 h-10 flex items-center justify-center">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ background: `${theme.accent}60` }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
              <span className="text-[11px] text-gray-400 font-medium italic">Masih ada lagi...</span>
            </motion.div>
          )}
        </div>

        {/* Skip Auto-Reveal Button */}
        {!allRevealed && revealedCount > 0 && (
          <button
            type="button"
            onClick={handleRevealAll}
            className="text-[11px] font-bold text-gray-400 hover:text-gray-600 text-center transition-colors -mt-2"
          >
            ⚡ Tampilkan Semua Sekaligus
          </button>
        )}

        {/* Continue Action Button */}
        <AnimatePresence>
          {allRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "backOut", delay: 0.4 }}
            >
              <motion.button
                onClick={onContinue}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-2xl text-sm font-bold text-white shadow-xl flex items-center justify-center gap-2 mt-1"
                style={{
                  background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent}ee 100%)`,
                  boxShadow: `0 12px 32px -6px ${theme.accent}65`,
                }}
              >
                <span>Lanjut Ke Pesan Spesial</span>
                <span className="text-base font-normal">→</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
