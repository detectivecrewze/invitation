"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { IconSparkle } from "@/components/ui/Icon";

interface Props {
  recipientName?: string;
  senderName?: string;
  theme: { bg: string; card: string; accent: string; text: string };
  onOpen: () => void;
  onTap: () => void;
}

export default function RundownEnvelopeGate({
  recipientName,
  senderName,
  theme,
  onOpen,
  onTap,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = useCallback(() => {
    if (isOpen) return;
    setIsOpen(true);
    onTap();
    setTimeout(() => {
      onOpen();
    }, 500);
  }, [isOpen, onOpen, onTap]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 relative z-20 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-80 h-80 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-3xl"
          style={{ background: theme.accent }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm flex flex-col items-center text-center relative z-10"
      >
        {/* Top Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 mb-6"
        >
          <div className="h-px w-6" style={{ background: `${theme.accent}60` }} />
          <span
            className="text-[10px] font-extrabold uppercase tracking-[0.3em]"
            style={{ color: theme.accent }}
          >
            EXCLUSIVE PASS &bull; {recipientName ? recipientName.toUpperCase() : "FOR YOU"}
          </span>
          <div className="h-px w-6" style={{ background: `${theme.accent}60` }} />
        </motion.div>

        {/* ── Central VIP Boarding Pass Badge Card ────────────────────────── */}
        <motion.div
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.96 }}
          animate={isOpen ? { scale: [1, 1.08, 0.9], opacity: [1, 1, 0] } : {}}
          transition={isOpen ? { duration: 0.5 } : { duration: 0.2 }}
          onClick={handleClick}
          className="w-full rounded-3xl p-7 relative cursor-pointer shadow-2xl backdrop-blur-xl border flex flex-col items-center overflow-hidden"
          style={{
            background: `linear-gradient(145deg, rgba(255, 255, 255, 0.92) 0%, ${theme.card}ee 100%)`,
            borderColor: `${theme.accent}40`,
            boxShadow: `0 20px 50px -10px ${theme.accent}35, inset 0 1px 1px rgba(255,255,255,0.8)`,
          }}
        >
          {/* Top Notch Tear Cutouts */}
          <div
            className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border shadow-inner"
            style={{ background: theme.bg, borderColor: `${theme.accent}30` }}
          />
          <div
            className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border shadow-inner"
            style={{ background: theme.bg, borderColor: `${theme.accent}30` }}
          />

          {/* Serial Stamp */}
          <div className="w-full flex items-center justify-between mb-4 px-1">
            <span
              className="text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full border"
              style={{
                color: theme.accent,
                borderColor: `${theme.accent}30`,
                background: `${theme.accent}10`,
              }}
            >
              PASS NO. RD-2001
            </span>
            <span
              className="text-[9px] font-extrabold tracking-widest uppercase"
              style={{ color: `${theme.text}60` }}
            >
              VIP ACCESS
            </span>
          </div>

          {/* ── Central Gold Wax Seal / Ticket Badge Icon ────────────────── */}
          <div className="relative my-4 flex items-center justify-center">
            {/* Glowing Ring */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-20 h-20 rounded-full"
              style={{ background: `${theme.accent}30`, filter: "blur(8px)" }}
            />

            {/* Glass Emblem Button */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center relative z-10 shadow-lg border"
              style={{
                background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent}dd 100%)`,
                borderColor: "rgba(255, 255, 255, 0.6)",
                boxShadow: `0 8px 24px -4px ${theme.accent}60`,
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
                <path d="M13 5v2" />
                <path d="M13 17v2" />
                <path d="M13 11v2" />
              </svg>
            </div>
          </div>

          {/* Card Title & Names */}
          <h2
            className="text-2xl font-bold tracking-tight mb-1"
            style={{ color: theme.text, fontFamily: "var(--font-caveat)" }}
          >
            Special Date VIP Pass
          </h2>

          <p className="text-xs text-gray-500 font-medium mb-3">
            {senderName ? `From ${senderName}` : "Personal Date Itinerary"}
          </p>

          {/* Dashed Tear Line */}
          <div
            className="w-full border-b border-dashed my-2"
            style={{ borderColor: `${theme.accent}35` }}
          />

          {/* CTA Instruction */}
          <div className="flex items-center gap-1.5 mt-2">
            <IconSparkle size={14} color={theme.accent} />
            <span
              className="text-xs font-bold tracking-wide"
              style={{ color: theme.accent }}
            >
              Tap to Scan VIP Pass
            </span>
          </div>
        </motion.div>

        {/* Bottom Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs font-medium mt-6 tracking-wide text-gray-400"
        >
          Special itinerary awaits you
        </motion.p>
      </motion.div>
    </div>
  );
}
