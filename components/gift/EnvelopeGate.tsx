"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconHeart } from "@/components/ui/Icon";

interface Props {
  recipientName: string;
  theme: { bg: string; card: string; accent: string; text: string };
  onOpen: () => void;
}

export default function EnvelopeGate({ recipientName, theme, onOpen }: Props) {
  const [tapped, setTapped] = useState(false);

  const handleTap = () => {
    if (tapped) return;
    setTapped(true);
    setTimeout(onOpen, 800);
  };

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-40 px-6"
      style={{ background: `radial-gradient(ellipse at 50% 40%, ${theme.bg} 0%, #f8f4fc 100%)` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.5 } }}
    >
      {/* Ribbon / label */}
      <motion.div
        className="mb-8 flex items-center gap-3"
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="h-px w-10" style={{ background: theme.accent, opacity: 0.35 }} />
        <p
          className="text-xs tracking-[0.3em] uppercase font-bold"
          style={{ color: theme.accent, letterSpacing: "0.25em" }}
        >
          Undangan Pribadi · untuk {recipientName}
        </p>
        <div className="h-px w-10" style={{ background: theme.accent, opacity: 0.35 }} />
      </motion.div>

      {/* Envelope — pure SVG, no emoji */}
      <AnimatePresence mode="wait">
        {!tapped ? (
          <motion.button
            key="envelope"
            onClick={handleTap}
            className="focus:outline-none"
            initial={{ y: 24, opacity: 0, scale: 0.92 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.85, transition: { duration: 0.45 } }}
            transition={{ delay: 0.5, duration: 0.7, type: "spring", bounce: 0.35 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg viewBox="0 0 300 210" width="300" height="210" fill="none">
              <defs>
                <clipPath id="env-clip">
                  <rect x="10" y="45" width="280" height="155" rx="14" />
                </clipPath>
              </defs>

              {/* Drop shadow */}
              <ellipse cx="150" cy="206" rx="110" ry="7" fill="rgba(0,0,0,0.05)" />

              {/* Envelope body */}
              <rect x="10" y="45" width="280" height="155" rx="14"
                fill={theme.card}
                stroke={theme.accent}
                strokeWidth="1.5"
                strokeOpacity="0.25"
              />

              {/* Fold lines clipped to stay inside the rounded corners */}
              <g clipPath="url(#env-clip)">
                <line x1="10" y1="45" x2="150" y2="128" stroke={theme.accent} strokeWidth="1.2" strokeOpacity="0.3" />
                <line x1="290" y1="45" x2="150" y2="128" stroke={theme.accent} strokeWidth="1.2" strokeOpacity="0.3" />
                <line x1="10" y1="200" x2="150" y2="128" stroke={theme.accent} strokeWidth="1.2" strokeOpacity="0.25" />
                <line x1="290" y1="200" x2="150" y2="128" stroke={theme.accent} strokeWidth="1.2" strokeOpacity="0.25" />
              </g>

              {/* Decorative dots at corners */}
              <circle cx="40" cy="75" r="2.5" fill={theme.accent} opacity="0.25" />
              <circle cx="260" cy="75" r="2.5" fill={theme.accent} opacity="0.25" />
              <circle cx="30" cy="178" r="2" fill={theme.accent} opacity="0.15" />
              <circle cx="270" cy="178" r="2" fill={theme.accent} opacity="0.15" />

              {/* Small line ornaments */}
              <line x1="48" y1="72" x2="58" y2="72" stroke={theme.accent} strokeWidth="0.8" strokeOpacity="0.2" />
              <line x1="242" y1="72" x2="252" y2="72" stroke={theme.accent} strokeWidth="0.8" strokeOpacity="0.2" />

              {/* Wax seal circle */}
              <circle cx="150" cy="128" r="30" fill={theme.accent} opacity="0.12" />
              <circle cx="150" cy="128" r="24" fill={theme.accent} opacity="0.92" />

              {/* Heart properly sized and centered */}
              <g transform="translate(140, 118)">
                <IconHeart size={20} fill={theme.card} color={theme.card} />
              </g>
            </svg>
          </motion.button>
        ) : (
          <motion.div
            key="opening"
            className="w-[300px] h-[210px] flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.45 }}
          >
            <svg viewBox="0 0 300 210" width="300" height="210" fill="none">
              <rect x="10" y="45" width="280" height="155" rx="14" fill={theme.card} stroke={theme.accent} strokeWidth="1.5" strokeOpacity="0.25" />
              <circle cx="150" cy="128" r="24" fill={theme.accent} opacity="0.92" />
              <g transform="translate(140, 118)">
                <IconHeart size={20} fill={theme.card} color={theme.card} />
              </g>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instruction */}
      <AnimatePresence>
        {!tapped && (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            <p
              className="text-sm font-medium mb-1.5"
              style={{ color: theme.text, opacity: 0.55, letterSpacing: "0.01em" }}
            >
              Ada sesuatu yang spesial untukmu
            </p>
            <motion.p
              className="text-sm font-bold tracking-wide"
              style={{ color: theme.accent, letterSpacing: "0.05em" }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              Sentuh untuk membuka
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
