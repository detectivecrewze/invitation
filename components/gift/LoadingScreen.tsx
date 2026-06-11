"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen({ onComplete, theme }: { onComplete: () => void; theme: { bg: string; card: string; accent: string; text: string } }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + 4; // Consistent, smooth increment (takes exactly 25 ticks, ~750ms)
        if (next >= 100) { clearInterval(interval); return 100; }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => onComplete(), 150);
      return () => clearTimeout(t);
    }
  }, [progress, onComplete]);

  const clampedProgress = Math.min(100, Math.round(progress));

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: `radial-gradient(ellipse at 50% 40%, ${theme.bg} 0%, ${theme.card}88 60%, ${theme.bg} 100%)` }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
    >
      {/* Flower SVG — pure vector, no emoji */}
      <motion.div
        className="relative mb-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <ellipse
              key={i}
              cx="50" cy="25"
              rx="9" ry="18"
              fill={theme.accent}
              opacity={0.3 + i * 0.08}
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="12" fill={theme.card} />
          <circle cx="50" cy="50" r="6" fill={theme.accent} />
        </svg>
      </motion.div>

      <p
        className="text-center tracking-wide"
        style={{ fontFamily: "var(--font-caveat)", fontSize: "1.35rem", color: theme.accent, letterSpacing: "0.02em" }}
      >
        Sebentar, bunganya sedang mekar...
      </p>

      <p
        className="mt-3 font-bold"
        style={{ fontFamily: "var(--font-caveat)", fontSize: "2rem", color: theme.accent }}
      >
        {clampedProgress}%
      </p>

      <div className="mt-4 w-44 h-0.5 rounded-full overflow-hidden" style={{ background: `${theme.accent}33` }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: theme.accent }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.15 }}
        />
      </div>
    </motion.div>
  );
}
