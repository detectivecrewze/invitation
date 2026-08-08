"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatIndonesianDate } from "@/lib/constants";
import { IconCalendar, IconSparkle } from "@/components/ui/Icon";

interface Props {
  senderName: string;
  recipientName: string;
  subText?: string;
  invitationTitle?: string;
  eventDate?: string;
  photoUrl?: string;
  theme: { bg: string; card: string; accent: string; text: string };
  onStart: () => void;
}

// ─── Countdown Timer Hook ──────────────────────────────────────────────────
function useCountdown(eventDate?: string) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
    isToday: boolean;
  } | null>(null);

  useEffect(() => {
    if (!eventDate) return;

    const calculate = () => {
      const target = new Date(`${eventDate}T00:00:00`);
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (isNaN(target.getTime())) {
        setTimeLeft(null);
        return;
      }

      const isSameDay =
        target.getFullYear() === now.getFullYear() &&
        target.getMonth() === now.getMonth() &&
        target.getDate() === now.getDate();

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: !isSameDay,
          isToday: isSameDay,
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isPast: false,
        isToday: isSameDay,
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [eventDate]);

  return timeLeft;
}

// ─── Letter stagger reveal animation ───────────────────────────────────────────
function StaggerText({ text, className, style, delay = 0 }: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}) {
  return (
    <span className={className} style={style} aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.4,
            delay: delay + i * 0.035,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ display: char === " " ? "inline" : "inline-block" }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RundownOpeningCard({
  senderName,
  recipientName,
  subText,
  invitationTitle,
  eventDate,
  photoUrl,
  theme,
  onStart,
}: Props) {
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const timeLeft = useCountdown(eventDate);

  // Delay content reveal until photo fades in
  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(t);
  }, []);

  const displayTitle = subText || `${senderName} & ${recipientName}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.97 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-xs sm:max-w-sm mx-auto"
    >
      <div
        className="relative w-full rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden"
        style={{
          boxShadow: `0 20px 50px -10px ${theme.accent}40, 0 8px 24px rgba(0,0,0,0.10)`,
          border: `1.5px solid ${theme.accent}20`,
          background: theme.bg,
        }}
      >
        {/* ── Photo Section (Magazine Cover Hero) ─────────────────────── */}
        <div className="relative w-full overflow-hidden min-h-[300px] sm:min-h-[340px]" style={{ minHeight: 300 }}>
          {/* Photo — Ken Burns zoom */}
          {photoUrl ? (
            <motion.div
              className="absolute inset-0 w-full h-full"
              initial={{ scale: 1.08 }}
              animate={{ scale: photoLoaded ? 1.0 : 1.08 }}
              transition={{ duration: 6, ease: "easeOut" }}
            >
              <img
                src={photoUrl}
                alt={displayTitle}
                className="w-full h-full object-cover min-h-[300px]"
                style={{ minHeight: 300 }}
                onLoad={() => setPhotoLoaded(true)}
              />
            </motion.div>
          ) : (
            // Placeholder if no photo
            <div
              className="absolute inset-0 flex items-center justify-center min-h-[300px]"
              style={{
                background: `linear-gradient(135deg, ${theme.bg} 0%, ${theme.accent}20 100%)`,
                minHeight: 300,
              }}
            >
              <div className="opacity-40">
                <IconCalendar size={42} color={theme.accent} strokeWidth={1.5} />
              </div>
            </div>
          )}

          {/* Gradient overlay — bottom */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(
                to bottom,
                rgba(0,0,0,0.18) 0%,
                rgba(0,0,0,0.02) 30%,
                rgba(0,0,0,0.0) 55%,
                ${theme.accent}cc 100%
              )`,
            }}
          />

          {/* Gradient overlay — top (subtle dark for legibility of top label) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(
                to bottom,
                rgba(0,0,0,0.45) 0%,
                transparent 35%
              )`,
            }}
          />

          {/* ── Top Label (over photo) ──────────────────────────────── */}
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="absolute top-0 left-0 right-0 px-4 pt-3.5 sm:px-6 sm:pt-5 flex items-center justify-between z-10"
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 24 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="h-px"
                    style={{ background: "rgba(255,255,255,0.6)" }}
                  />
                  <span
                    className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-[0.35em]"
                    style={{ color: "rgba(255,255,255,0.85)" }}
                  >
                    {invitationTitle || "Date Night Itinerary"}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Title Overlay (bottom of photo) ────────────────────── */}
          <AnimatePresence>
            {showContent && (
              <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 sm:px-6 sm:pb-5 z-10">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p
                    className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.28em] mb-0.5"
                    style={{ color: "rgba(255,255,255,0.75)" }}
                  >
                    dari {senderName}
                  </p>
                  <h1
                    className="font-extrabold leading-tight text-white"
                    style={{
                      fontFamily: "var(--font-caveat)",
                      fontSize: "1.75rem",
                      textShadow: "0 2px 12px rgba(0,0,0,0.3)",
                    }}
                  >
                    {displayTitle}
                  </h1>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Bottom Info Section ──────────────────────────────────────── */}
        <div
          className="relative p-4 sm:p-5 flex flex-col gap-2.5 sm:gap-3.5"
          style={{ background: "white" }}
        >
          {/* Accent top stripe */}
          <div
            className="absolute top-0 left-5 right-5 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}50, transparent)` }}
          />

          {/* Date row */}
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="flex items-center justify-between"
              >
                {eventDate && (
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold"
                    style={{
                      background: `${theme.accent}15`,
                      border: `1.5px solid ${theme.accent}30`,
                    }}
                  >
                    <IconCalendar size={13} color={theme.accent} strokeWidth={2} />
                    <span
                      className="text-[11px] sm:text-xs font-extrabold tracking-wide uppercase font-mono"
                      style={{ color: theme.accent }}
                    >
                      {formatIndonesianDate(eventDate)}
                    </span>
                  </div>
                )}

                {/* Divider dots */}
                <div className="flex gap-1.5 items-center pr-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.55 + i * 0.08, type: "spring", bounce: 0.5 }}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: i === 1 ? theme.accent : `${theme.accent}40` }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Live Countdown Badge */}
          {timeLeft && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full py-1.5 px-3 rounded-xl border flex items-center justify-between shadow-2xs"
              style={{
                background: `linear-gradient(135deg, ${theme.accent}08 0%, ${theme.accent}15 100%)`,
                borderColor: `${theme.accent}30`,
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ background: theme.accent }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{ background: theme.accent }}
                  />
                </span>
                <span
                  className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest font-mono"
                  style={{ color: theme.accent }}
                >
                  {timeLeft.isToday
                    ? "HARI INI! 🌟"
                    : timeLeft.isPast
                    ? "SPECIAL DAY 💖"
                    : "COUNTDOWN"}
                </span>
              </div>

              {!timeLeft.isPast && !timeLeft.isToday && (
                <div className="flex items-center gap-0.5 font-mono text-[10px] sm:text-[11px] font-bold" style={{ color: theme.text }}>
                  <span className="px-1 py-0.5 rounded bg-white border border-gray-200 shadow-2xs">
                    {String(timeLeft.days).padStart(2, "0")}d
                  </span>
                  <span className="text-gray-300 font-normal">:</span>
                  <span className="px-1 py-0.5 rounded bg-white border border-gray-200 shadow-2xs">
                    {String(timeLeft.hours).padStart(2, "0")}h
                  </span>
                  <span className="text-gray-300 font-normal">:</span>
                  <span className="px-1 py-0.5 rounded bg-white border border-gray-200 shadow-2xs">
                    {String(timeLeft.minutes).padStart(2, "0")}m
                  </span>
                  <span className="text-gray-300 font-normal">:</span>
                  <span
                    className="px-1 py-0.5 rounded text-white shadow-2xs font-extrabold"
                    style={{ background: theme.accent }}
                  >
                    {String(timeLeft.seconds).padStart(2, "0")}s
                  </span>
                </div>
              )}
            </motion.div>
          )}

          {/* Subtext / caption */}
          <AnimatePresence>
            {showContent && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-[11px] sm:text-xs text-center font-medium leading-relaxed"
                style={{ color: `${theme.text}80` }}
              >
                Beberapa rencana spesial telah disiapkan khusus untukmu.
              </motion.p>
            )}
          </AnimatePresence>

          {/* CTA Button */}
          <AnimatePresence>
            {showContent && (
              <motion.button
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7, ease: "backOut" }}
                onClick={onStart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${theme.accent}f0 0%, ${theme.accent} 100%)`,
                  boxShadow: `0 8px 24px -4px ${theme.accent}55`,
                  letterSpacing: "0.04em",
                }}
              >
                <span>Next</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="text-sm sm:text-base"
                >
                  →
                </motion.span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
