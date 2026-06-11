"use client";

import { useState, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { IconHeart } from "@/components/ui/Icon";

interface Props {
  senderName: string;
  subText: string;
  photoUrl?: string;
  theme: { bg: string; card: string; accent: string; text: string };
  onAccept: () => void;
}

export default function InvitationCard({ senderName, subText, photoUrl, theme, onAccept }: Props) {
  const [rejectCount, setRejectCount] = useState(0);
  const [rejectPos, setRejectPos] = useState({ x: 0, y: 0 });
  const [accepted, setAccepted] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);
  const acceptControls = useAnimation();
  const heartId = useRef(0);

  const handleReject = () => {
    const count = rejectCount + 1;
    setRejectCount(count);
    acceptControls.start({ scale: 1 + count * 0.07, transition: { type: "spring", bounce: 0.5 } });
    const range = Math.min(130, 50 + count * 18);
    setRejectPos({
      x: (Math.random() - 0.5) * range * 2,
      y: (Math.random() - 0.5) * range * 0.7,
    });
  };

  const handleAccept = () => {
    setAccepted(true);
    for (let i = 0; i < 14; i++) {
      heartId.current += 1;
      const id = heartId.current;
      setTimeout(() => {
        setHearts(h => [...h, {
          id,
          x: window.innerWidth * 0.2 + Math.random() * window.innerWidth * 0.6,
          y: window.innerHeight * 0.55,
          delay: 0,
        }]);
      }, i * 55);
    }
    setTimeout(() => onAccept(), 1500);
  };

  return (
    <div className="relative">
      {/* Heart burst particles — SVG not emoji */}
      <AnimatePresence>
        {hearts.map(h => (
          <motion.div
            key={h.id}
            className="fixed pointer-events-none z-50"
            style={{ left: h.x, top: h.y }}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -200, scale: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            onAnimationComplete={() => setHearts(prev => prev.filter(x => x.id !== h.id))}
          >
            <IconHeart
              size={20 + Math.random() * 14}
              color={theme.accent}
              fill={theme.accent}
              strokeWidth={0}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Card */}
      <div
        className="w-full max-w-sm mx-auto rounded-[2rem] overflow-hidden"
        style={{
          background: "white",
          boxShadow: "0 24px 64px rgba(0,0,0,0.09), 0 4px 16px rgba(0,0,0,0.05)",
          border: `1px solid ${theme.accent}18`,
        }}
      >
        {/* Color band at top */}
        <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${theme.accent}cc, ${theme.accent})` }} />

        <div className="px-8 pt-8 pb-8 flex flex-col items-center">

          {/* Label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1" style={{ background: `${theme.accent}30` }} />
            <span
              className="text-[10px] tracking-[0.28em] uppercase font-bold"
              style={{ color: theme.accent, opacity: 0.75 }}
            >
              Undangan Spesial
            </span>
            <div className="h-px flex-1" style={{ background: `${theme.accent}30` }} />
          </div>

          {/* Polaroid photo */}
          {photoUrl && (
            <motion.div
              className="relative mb-6"
              initial={{ rotate: -3, scale: 0.88, opacity: 0 }}
              animate={{ rotate: -2, scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
            >
              {/* Photo frame */}
              <div
                className="p-2.5 pb-8 bg-white"
                style={{
                  boxShadow: "0 6px 24px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.07)",
                  transform: "rotate(-1.5deg)",
                }}
              >
                <div className="w-32 h-32 overflow-hidden bg-gray-100">
                  <img src={photoUrl} alt={senderName} className="w-full h-full object-cover" />
                </div>
              </div>
              {/* Tape */}
              <div
                className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-14 h-4 rounded-sm"
                style={{ background: `${theme.accent}38` }}
              />
            </motion.div>
          )}

          {/* Main question */}
          <div className="text-center mb-7">
            <h1
              style={{
                fontFamily: "var(--font-caveat)",
                fontSize: "2.05rem",
                color: theme.text,
                lineHeight: 1.35,
                letterSpacing: "0.01em",
              }}
            >
              Mau engga kamu pergi<br />kencan denganku?
            </h1>

            {subText && (
              <p
                className="mt-2.5 text-sm font-medium leading-relaxed"
                style={{ color: theme.text, opacity: 0.5 }}
              >
                {subText}
              </p>
            )}

            <div className="flex items-center justify-center gap-2 mt-2.5">
              <div className="h-px w-8" style={{ background: `${theme.accent}30` }} />
              <p className="text-xs font-semibold tracking-wide" style={{ color: theme.accent }}>
                dari {senderName}
              </p>
              <div className="h-px w-8" style={{ background: `${theme.accent}30` }} />
            </div>
          </div>

          {/* Buttons */}
          <div className="w-full flex flex-col items-center gap-3 relative" style={{ minHeight: 110 }}>
            {/* Accept — grows */}
            <motion.button
              onClick={handleAccept}
              animate={acceptControls}
              initial={{ scale: 1 }}
              whileTap={{ scale: 0.96 }}
              className="w-full py-4 rounded-2xl font-bold text-sm text-white tracking-wide transition-shadow"
              style={{
                background: `linear-gradient(135deg, ${theme.accent}ee, ${theme.accent})`,
                boxShadow: `0 8px 24px ${theme.accent}40`,
                letterSpacing: "0.05em",
              }}
            >
              Mau banget
            </motion.button>

            {/* Reject — flees */}
            <AnimatePresence>
              {!accepted && (
                <motion.button
                  onClick={handleReject}
                  animate={{ x: rejectPos.x, y: rejectPos.y }}
                  transition={{ type: "spring", bounce: 0.55, duration: 0.45 }}
                  className="px-7 py-2.5 rounded-2xl font-semibold text-xs border tracking-wide"
                  style={{
                    borderColor: `${theme.accent}30`,
                    color: theme.text,
                    background: "transparent",
                    opacity: Math.max(0.15, 1 - rejectCount * 0.1),
                    fontSize: `${Math.max(0.6, 0.8 - rejectCount * 0.04)}rem`,
                    letterSpacing: "0.04em",
                  }}
                >
                  {rejectCount === 0
                    ? "Belum, nanti dulu"
                    : rejectCount < 3
                    ? "Aku minta waktu..."
                    : rejectCount < 5
                    ? "Jangan dipaksa dong..."
                    : "Iya iya, aku mau..."}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
