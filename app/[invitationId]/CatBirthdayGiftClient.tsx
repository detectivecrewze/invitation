"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as htmlToImage from "html-to-image";
import type { InvitationData } from "@/lib/types";

type Phase = "loading" | "gate" | "intro" | "date" | "note" | "ticket";

interface Props {
  data: InvitationData;
  invitationId: string;
}

const palette = {
  ink: "#47352f",
  muted: "#856f67",
  paper: "#fffaf3",
  blush: "#e8a8a1",
  rose: "#c86f72",
  peach: "#f6d8c8",
  cream: "#f8eee2",
  brown: "#8d6758",
};

function CatSticker({
  variant = "sitting",
  className = "",
}: {
  variant?: "sitting" | "peeking" | "sleeping" | "yarn";
  className?: string;
}) {
  if (variant === "yarn") {
    return (
      <motion.svg
        viewBox="0 0 120 100"
        className={className}
        animate={{ rotate: [-2, 3, -2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <circle cx="55" cy="49" r="29" fill="#f2c4bd" stroke={palette.rose} strokeWidth="3" />
        <path d="M34 33c20 4 34 17 39 37M30 48c18-2 37 6 48 22M39 22c5 27 22 44 44 50" fill="none" stroke={palette.rose} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M79 68c21 3 29 14 26 25" fill="none" stroke={palette.rose} strokeWidth="3" strokeLinecap="round" />
        <path d="M93 88c5-5 10-3 11 2" fill="none" stroke={palette.rose} strokeWidth="3" strokeLinecap="round" />
      </motion.svg>
    );
  }

  if (variant === "sleeping") {
    return (
      <motion.svg
        viewBox="0 0 150 100"
        className={className}
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <path d="M28 68c4-29 28-45 60-38 24 5 35 20 31 39-4 15-21 20-48 18-30-2-47-6-43-19Z" fill="#f5d7c7" stroke={palette.brown} strokeWidth="3" />
        <path d="m44 40 7-16 12 13M88 36l11-13 5 17" fill="#f5d7c7" stroke={palette.brown} strokeWidth="3" strokeLinejoin="round" />
        <path d="M62 55q6 6 12 0M87 55q6 6 12 0M79 62l3 2 3-2" fill="none" stroke={palette.brown} strokeWidth="3" strokeLinecap="round" />
        <path d="M117 66c23-8 29 6 16 14" fill="none" stroke={palette.brown} strokeWidth="4" strokeLinecap="round" />
      </motion.svg>
    );
  }

  if (variant === "peeking") {
    return (
      <motion.svg
        viewBox="0 0 120 110"
        className={className}
        animate={{ y: [8, 0, 8] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <path d="M28 72c0-29 14-47 33-47s34 18 34 47" fill="#f6d9c9" stroke={palette.brown} strokeWidth="3" />
        <path d="m35 37 5-23 17 16M66 30l17-16 4 25" fill="#f6d9c9" stroke={palette.brown} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="50" cy="51" r="3" fill={palette.ink} />
        <circle cx="75" cy="51" r="3" fill={palette.ink} />
        <path d="m61 59 3 3 3-3M64 62v5M64 67q-7 5-12 0M64 67q7 5 12 0M38 60l-18-4M39 66l-18 3M87 60l18-4M87 66l18 3" fill="none" stroke={palette.brown} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M12 80h99" stroke={palette.rose} strokeWidth="5" strokeLinecap="round" />
      </motion.svg>
    );
  }

  return (
    <motion.svg
      viewBox="0 0 120 145"
      className={className}
      animate={{ rotate: [-1.5, 1.5, -1.5] }}
      transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
    >
      <path d="M35 68c0-28 11-45 28-45s29 17 29 45v42c0 12-8 20-20 20H54c-12 0-19-8-19-20Z" fill="#f4d3c2" stroke={palette.brown} strokeWidth="3" />
      <path d="m39 36 4-23 17 15M67 28l17-15 5 25" fill="#f4d3c2" stroke={palette.brown} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="53" cy="53" r="3" fill={palette.ink} />
      <circle cx="75" cy="53" r="3" fill={palette.ink} />
      <path d="m62 61 3 3 3-3M65 64v5M65 69q-6 5-11 0M65 69q6 5 11 0M42 62l-18-4M42 68l-18 3M86 62l18-4M86 68l18 3" fill="none" stroke={palette.brown} strokeWidth="2.5" strokeLinecap="round" />
      <motion.path
        d="M88 106c25 4 25 27 8 29"
        fill="none"
        stroke={palette.brown}
        strokeWidth="5"
        strokeLinecap="round"
        animate={{ pathLength: [0.78, 1, 0.78] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

function PawMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <ellipse cx="20" cy="25" rx="9" ry="7" fill="currentColor" />
      <ellipse cx="9" cy="17" rx="4" ry="5" fill="currentColor" transform="rotate(-22 9 17)" />
      <ellipse cx="17" cy="11" rx="4" ry="5" fill="currentColor" transform="rotate(-7 17 11)" />
      <ellipse cx="27" cy="12" rx="4" ry="5" fill="currentColor" transform="rotate(12 27 12)" />
      <ellipse cx="33" cy="19" rx="4" ry="5" fill="currentColor" transform="rotate(26 33 19)" />
    </svg>
  );
}

function PaperShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28, rotate: -0.7, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.97 }}
      transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[430px] overflow-hidden rounded-[30px] border px-6 py-7 shadow-[0_28px_80px_rgba(91,57,48,0.18)] sm:px-8 sm:py-9"
      style={{
        background: "linear-gradient(145deg, rgba(255,253,248,.98), rgba(255,247,238,.97))",
        borderColor: "rgba(174,116,100,.24)",
      }}
    >
      <div className="pointer-events-none absolute inset-3 rounded-[23px] border border-dashed border-[#d8aca0]/35" />
      <div className="pointer-events-none absolute -right-7 -top-8 h-24 w-24 rounded-full bg-[#f2cfc3]/35 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-8 h-28 w-28 rounded-full bg-[#ead9bd]/35 blur-2xl" />
      <div className="relative z-10">{children}</div>
    </motion.section>
  );
}

function PrimaryButton({ children, onClick, disabled = false }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-extrabold tracking-[0.08em] text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-45"
      style={{ background: `linear-gradient(135deg, ${palette.rose}, #b75f64)` }}
    >
      {children}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </motion.button>
  );
}

export default function CatBirthdayGiftClient({ data, invitationId }: Props) {
  const experience = data.vipExperience!;
  const audioRef = useRef<HTMLAudioElement>(null);
  const ticketRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [selectedDate, setSelectedDate] = useState("");
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [opening, setOpening] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setPhase("gate"), 1150);
    try {
      const stored = localStorage.getItem(`cat-birthday-date:${invitationId}`);
      if (stored) setSelectedDate(stored);
    } catch {}
    return () => window.clearTimeout(timer);
  }, [invitationId]);

  const playMusic = useCallback(async () => {
    if (!audioRef.current || !data.musicUrl) return;
    try {
      await audioRef.current.play();
      setMusicPlaying(true);
    } catch {
      setMusicPlaying(false);
    }
  }, [data.musicUrl]);

  const openGift = useCallback(async () => {
    setOpening(true);
    await playMusic();
    window.setTimeout(() => setPhase("intro"), 850);
  }, [playMusic]);

  const toggleMusic = useCallback(async () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) await playMusic();
    else {
      audioRef.current.pause();
      setMusicPlaying(false);
    }
  }, [playMusic]);

  const chooseDate = (value: string) => {
    setSelectedDate(value);
    try { localStorage.setItem(`cat-birthday-date:${invitationId}`, value); } catch {}
  };

  const selectedLabel = experience.dateOptions.find((option) => option.value === selectedDate)?.label || selectedDate;

  const downloadTicket = useCallback(async () => {
    if (!ticketRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await htmlToImage.toPng(ticketRef.current, {
        quality: 1,
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: palette.cream,
      });
      const filename = "birthday-dinner-for-nadyas.png";
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], filename, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: experience.ticketTitle || "A birthday dinner", text: `It is a date — ${selectedLabel}.` });
        return;
      }
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to save VVIP ticket", error);
      alert("The card could not be saved. Please take a screenshot instead.");
    } finally {
      setDownloading(false);
    }
  }, [experience.ticketTitle, selectedLabel]);

  const replay = () => {
    setPhase("gate");
    setOpening(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setMusicPlaying(false);
    }
  };

  return (
    <main
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden px-4 py-6 font-sans sm:px-6"
      style={{
        color: palette.ink,
        background: "radial-gradient(circle at 20% 10%, #fff8ed 0, transparent 34%), radial-gradient(circle at 86% 84%, #f1cfc5 0, transparent 38%), linear-gradient(145deg, #f6eadf, #f7deda)",
      }}
    >
      {data.musicUrl && <audio ref={audioRef} src={data.musicUrl} loop preload="auto" />}

      <div className="pointer-events-none absolute inset-0 opacity-[0.13]" style={{ backgroundImage: "radial-gradient(#9d6e60 0.75px, transparent 0.75px)", backgroundSize: "16px 16px" }} />
      <PawMark className="pointer-events-none absolute left-[5%] top-[8%] h-11 w-11 -rotate-12 text-[#be7c75]/20" />
      <PawMark className="pointer-events-none absolute bottom-[8%] right-[6%] h-14 w-14 rotate-12 text-[#be7c75]/20" />

      {data.musicUrl && phase !== "loading" && phase !== "gate" && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          type="button"
          onClick={toggleMusic}
          className="fixed right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-[#fff9f0]/90 text-[#a85d61] shadow-lg backdrop-blur sm:right-6 sm:top-6"
          aria-label={musicPlaying ? "Pause music" : "Play music"}
        >
          {musicPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
          ) : (
            <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m8 5 11 7-11 7Z" /></svg>
          )}
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        {phase === "loading" && (
          <motion.div key="loading" exit={{ opacity: 0, scale: 1.08 }} className="relative z-10 flex flex-col items-center gap-5">
            <div className="relative h-24 w-24">
              {[0, 1, 2, 3].map((item) => (
                <motion.div key={item} className="absolute h-7 w-7 text-[#bd7771]" style={{ left: `${item * 22}px`, top: `${item % 2 === 0 ? 10 : 47}px`, rotate: `${-30 + item * 20}deg` }} animate={{ opacity: [0.15, 1, 0.15], scale: [0.8, 1, 0.8] }} transition={{ duration: 1.2, delay: item * 0.18, repeat: Infinity }}><PawMark /></motion.div>
              ))}
            </div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.34em] text-[#9e6b62]">A little invitation is arriving</p>
          </motion.div>
        )}

        {phase === "gate" && (
          <motion.section key="gate" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 1.05 }} className="relative z-10 w-full max-w-[430px]">
            <div className="absolute -left-5 -top-16 z-20 h-28 w-28 sm:-left-10"><CatSticker variant="peeking" className="h-full w-full" /></div>
            <div className="relative overflow-hidden rounded-[32px] border border-[#d8b5a6]/50 bg-[#fffaf2] p-4 shadow-[0_32px_90px_rgba(88,54,45,.22)] sm:p-5">
              <div className="relative overflow-hidden rounded-[25px] bg-[#e7c7b7]">
                {data.photoUrl ? (
                  <img src={data.photoUrl} alt={data.recipientName} crossOrigin="anonymous" className="h-[48svh] min-h-[330px] max-h-[510px] w-full object-cover object-[50%_42%]" />
                ) : (
                  <div className="flex h-[48svh] min-h-[330px] items-center justify-center"><CatSticker className="h-40 w-40" /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#4b3029]/75 via-transparent to-[#50342a]/10" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                  <p className="mb-2 text-[9px] font-extrabold uppercase tracking-[0.34em] text-white/80">{experience.eyebrow || "A fashionably late birthday invitation"}</p>
                  <h1 className="text-4xl font-bold leading-none sm:text-5xl" style={{ fontFamily: "var(--font-caveat)" }}>{experience.gateTitle || `For ${data.recipientName}`}</h1>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/85">{experience.gateNote || "One small question before the surprise begins."}</p>
                </div>
              </div>
              <motion.button
                type="button"
                onClick={openGift}
                disabled={opening}
                whileTap={{ scale: 0.98 }}
                className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl border border-[#d4a59b]/40 bg-[#fff7ed] px-5 py-4 text-sm font-extrabold tracking-wide text-[#745046] shadow-sm disabled:opacity-70"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5Z" /><path d="m3 7.5 9 5 9-5M12 12.5V21" /></svg>
                {opening ? "Opening your invitation..." : "Open this little invitation"}
              </motion.button>
            </div>
          </motion.section>
        )}

        {phase === "intro" && (
          <PaperShell key="intro">
            <CatSticker variant="sitting" className="absolute -right-4 -top-7 h-28 w-28 opacity-90" />
            <p className="mb-3 text-[9px] font-extrabold uppercase tracking-[0.32em] text-[#b26668]">A proper birthday celebration</p>
            <h1 className="max-w-[280px] text-4xl font-bold leading-[0.92] sm:text-5xl" style={{ fontFamily: "var(--font-caveat)" }}>{experience.greetingTitle}</h1>
            <div className="my-5 h-px w-16 bg-[#d7a19a]" />
            <p className="whitespace-pre-line text-[15px] leading-7 text-[#725e56]">{experience.greetingBody}</p>
            <div className="mt-7"><PrimaryButton onClick={() => setPhase("date")}>Pick a date with me</PrimaryButton></div>
          </PaperShell>
        )}

        {phase === "date" && (
          <PaperShell key="date">
            <CatSticker variant="yarn" className="absolute -right-1 -top-2 h-24 w-24 opacity-90" />
            <p className="mb-3 text-[9px] font-extrabold uppercase tracking-[0.32em] text-[#b26668]">Your only assignment</p>
            <h2 className="max-w-[310px] text-4xl font-bold leading-[0.96]" style={{ fontFamily: "var(--font-caveat)" }}>{experience.dateQuestion}</h2>
            <div className="mt-7 grid gap-3">
              {experience.dateOptions.map((option, index) => {
                const active = option.value === selectedDate;
                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    whileTap={{ scale: 0.985 }}
                    onClick={() => chooseDate(option.value)}
                    className="flex items-center gap-4 rounded-2xl border p-4 text-left transition"
                    style={{ background: active ? "#f8dfd7" : "#fffdf9", borderColor: active ? palette.rose : "#e7d5cc", boxShadow: active ? "0 10px 28px rgba(181,96,99,.16)" : "none" }}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black" style={{ background: active ? palette.rose : palette.cream, color: active ? "white" : palette.rose }}>{index + 1}</span>
                    <span className="flex-1">
                      <span className="block text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#a7756c]">Option {index + 1}</span>
                      <span className="mt-1 block text-base font-bold text-[#4c3933]">{option.label}</span>
                    </span>
                    {active && <PawMark className="h-8 w-8 text-[#bd7472]" />}
                  </motion.button>
                );
              })}
            </div>
            <div className="mt-6"><PrimaryButton disabled={!selectedDate} onClick={() => setPhase("note")}>This date works for me</PrimaryButton></div>
          </PaperShell>
        )}

        {phase === "note" && (
          <PaperShell key="note">
            <CatSticker variant="sleeping" className="absolute -right-3 -top-5 h-24 w-36 opacity-90" />
            <p className="mb-3 text-[9px] font-extrabold uppercase tracking-[0.32em] text-[#b26668]">Date saved · {selectedLabel}</p>
            <h2 className="max-w-[300px] text-4xl font-bold leading-[0.96]" style={{ fontFamily: "var(--font-caveat)" }}>{experience.afterDateTitle}</h2>
            <div className="my-5 h-px w-16 bg-[#d7a19a]" />
            <p className="whitespace-pre-line text-[15px] leading-7 text-[#725e56]">{experience.afterDateBody}</p>
            <div className="mt-7"><PrimaryButton onClick={() => setPhase("ticket")}>See our little date card</PrimaryButton></div>
          </PaperShell>
        )}

        {phase === "ticket" && (
          <motion.div key="ticket" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex w-full max-w-[430px] flex-col gap-4">
            <div ref={ticketRef} className="relative overflow-hidden rounded-[30px] border border-[#d5aa9d]/50 bg-[#fffaf2] p-5 shadow-[0_28px_80px_rgba(91,57,48,0.18)]">
              <div className="relative rounded-[23px] border border-dashed border-[#c88980]/55 px-6 py-7 text-center">
                <CatSticker variant="peeking" className="mx-auto -mt-10 h-24 w-24" />
                <p className="text-[9px] font-extrabold uppercase tracking-[0.3em] text-[#af6869]">Admit two · Birthday dinner</p>
                <h2 className="mt-3 text-4xl font-bold leading-none" style={{ fontFamily: "var(--font-caveat)" }}>{experience.ticketTitle || "It’s a date, Nadyas!"}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#806a61]">A little birthday celebration from <strong>{data.senderName}</strong> to <strong>{data.recipientName}</strong>.</p>
                <div className="my-6 flex items-center gap-3"><span className="h-px flex-1 bg-[#dfbbb0]" /><PawMark className="h-7 w-7 text-[#bf7772]" /><span className="h-px flex-1 bg-[#dfbbb0]" /></div>
                <div className="grid gap-3 text-left">
                  <div className="rounded-2xl bg-[#f9e5dc] px-4 py-3"><span className="block text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#af6869]">When</span><span className="mt-1 block text-base font-bold">{selectedLabel}</span></div>
                  <div className="rounded-2xl bg-[#f8eee2] px-4 py-3"><span className="block text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#af6869]">The plan</span><span className="mt-1 block text-sm font-semibold">A nice dinner and a lovely evening — details are still a surprise.</span></div>
                  <div className="rounded-2xl bg-[#f8eee2] px-4 py-3"><span className="block text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#af6869]">Dress code</span><span className="mt-1 block text-sm font-semibold">Your usual office outfit. You already look gorgeous.</span></div>
                </div>
                <p className="mt-6 text-lg leading-relaxed text-[#8a5e56]" style={{ fontFamily: "var(--font-caveat)" }}>{experience.ticketNote || "You picked the date. I’ll take care of the rest."}</p>
                <p className="mt-2 text-[9px] font-extrabold uppercase tracking-[0.25em] text-[#a67b70]">With care, {data.senderName}</p>
              </div>
            </div>
            <PrimaryButton onClick={downloadTicket}>{downloading ? "Preparing your card..." : "Save or share this card"}</PrimaryButton>
            <button type="button" onClick={replay} className="py-2 text-xs font-bold text-[#8b7067] underline decoration-[#c99a8e] underline-offset-4">Open again from the beginning</button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
