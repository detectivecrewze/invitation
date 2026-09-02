"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getTheme, formatIndonesianDate } from "@/lib/constants";
import { normaliseLocale, observeStaticDom, translateLocaleValue, translateStaticDom } from "@/lib/locale";
import type { RundownData } from "@/lib/types";
import LoadingScreen from "@/components/gift/LoadingScreen";
import RundownEnvelopeGate from "@/components/gift/RundownEnvelopeGate";
import RundownVortexBurst from "@/components/gift/RundownVortexBurst";
import RundownOpeningCard from "@/components/gift/RundownOpeningCard";
import { IconCalendar, IconMail } from "@/components/ui/Icon";

// ─── Sender Letter Card ───────────────────────────────────────────────────────
// Displayed for recipient in Rundown mode — displays the sender's special note written in Studio.

function SenderLetterCard({
  senderName,
  recipientName,
  note,
  theme,
  onContinue,
}: {
  senderName: string;
  recipientName: string;
  note: string;
  theme: { bg: string; card: string; accent: string; text: string };
  onContinue: () => void;
}) {
  const defaultLetter = "I've planned this special date itinerary for us. Can't wait to spend this wonderful time together with you!";
  const displayNote = note || defaultLetter;

  // Typewriting effect state
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let idx = 0;
    setDisplayedText("");
    setIsTypingComplete(false);

    const timer = setInterval(() => {
      if (idx < displayNote.length) {
        setDisplayedText((prev) => displayNote.slice(0, idx + 1));
        idx++;
      } else {
        setIsTypingComplete(true);
        clearInterval(timer);
      }
    }, 35);

    return () => clearInterval(timer);
  }, [displayNote]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -25, scale: 0.96 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-sm mx-auto flex flex-col gap-6 px-2 py-2"
    >
      {/* ── Editorial Container Card ───────────────────────────────────── */}
      <div
        className="relative rounded-[2.5rem] p-7 overflow-hidden text-center flex flex-col items-center gap-6 shadow-2xl backdrop-blur-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.92)",
          border: `1.5px solid ${theme.accent}35`,
          boxShadow: `0 28px 65px -12px ${theme.accent}35, 0 8px 24px rgba(0, 0, 0, 0.04)`,
        }}
      >
        {/* Decorative Ambient Background Glow */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none"
          style={{ background: theme.accent }}
        />

        {/* ── Top Wax Seal Monogram Badge ───────────────────────────────── */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 16 }}
          className="relative group z-10"
        >
          {/* Outer Glowing Pulsing Ring */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
            className="absolute -inset-2 rounded-[2rem] blur-sm pointer-events-none"
            style={{ background: `${theme.accent}30` }}
          />

          {/* Squircle Badge */}
          <div
            className="w-20 h-20 rounded-[1.75rem] flex items-center justify-center relative shadow-lg z-10"
            style={{
              background: `linear-gradient(135deg, ${theme.bg} 0%, #ffffff 100%)`,
              border: `1.5px solid ${theme.accent}40`,
              boxShadow: `0 10px 24px -4px ${theme.accent}35`,
            }}
          >
            <IconMail size={32} color={theme.accent} strokeWidth={1.8} />
          </div>
        </motion.div>

        {/* ── Editorial Header ─────────────────────────────────────────── */}
        <div className="flex flex-col items-center z-10">
          {/* Top Label with Accent Lines */}
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-5" style={{ background: `${theme.accent}40` }} />
            <span
              className="text-[9px] font-extrabold uppercase tracking-[0.32em]"
              style={{ color: theme.accent }}
            >
              PERSONAL NOTE &amp; DEDICATION
            </span>
            <div className="h-px w-5" style={{ background: `${theme.accent}40` }} />
          </div>

          <h2
            className="text-2xl font-bold tracking-tight text-gray-800"
            style={{ fontFamily: "var(--font-caveat)", fontSize: "2.1rem" }}
          >
            Pesan dari {senderName || "Ayangg"}
          </h2>
        </div>

        {/* ── Luxury Letterhead Stationery Container ──────────────────── */}
        <div
          className="w-full p-6 rounded-3xl border text-center flex flex-col justify-center gap-4 relative shadow-inner min-h-[140px] z-10 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${theme.bg}60 0%, #ffffff 100%)`,
            borderColor: `${theme.accent}35`,
            boxShadow: `inset 0 0 20px ${theme.accent}12`,
          }}
        >
          {/* Subtle Fine Inner Border Frame */}
          <div
            className="absolute inset-2.5 rounded-2xl pointer-events-none border border-dashed"
            style={{ borderColor: `${theme.accent}25` }}
          />

          {/* Letter Content */}
          <p
            className="text-xl leading-relaxed text-gray-800 italic whitespace-pre-line relative z-10 px-2"
            style={{ fontFamily: "var(--font-caveat)", letterSpacing: "0.01em" }}
          >
            &ldquo;{displayedText}&rdquo;
            {!isTypingComplete && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-0.5 h-5 ml-1 align-middle rounded-full"
                style={{ background: theme.accent }}
              />
            )}
          </p>
        </div>

        {/* ── Action Button ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full z-10"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onContinue}
            className="w-full py-4 rounded-2xl text-sm font-bold text-white shadow-xl flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent}ee 100%)`,
              boxShadow: `0 12px 32px -6px ${theme.accent}65`,
              letterSpacing: "0.03em",
            }}
          >
            <span>Next</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="text-base font-normal"
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
import RundownCard from "@/components/gift/RundownCard";
import ReadOnlyDressCodeCard from "@/components/gift/ReadOnlyDressCodeCard";
import * as htmlToImage from "html-to-image";
import HeartQRCode from "@/components/ui/HeartQRCode";
import { IconShare, IconWhatsApp, IconSparkle, ActivityIconSvg, DressCodeIconSvg, IconMapPin } from "@/components/ui/Icon";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Phase =
  | "loading"
  | "envelope"
  | "flowers"
  | "invitation"
  | "dresscode"
  | "rundown"
  | "message"
  | "ticket";

interface Props {
  data: RundownData;
  invitationId: string;
}

// ─── Rundown Ticket ─────────────────────────────────────────────────────────────
// Final screen — shows the full rundown summary as a clean aesthetic ticket card with barcode & share functionality.

function RundownTicket({
  data,
  message,
  theme,
  onReset,
}: {
  data: RundownData;
  message: string;
  theme: { bg: string; card: string; accent: string; text: string };
  onReset: () => void;
}) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const invitationUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${data.invitationId}`
    : `https://invitation.for-you-always.my.id/${data.invitationId}`;

  // Download ticket card as high-res PNG image
  const handleDownloadImage = useCallback(async () => {
    if (!ticketRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await htmlToImage.toPng(ticketRef.current, {
        quality: 1,
        pixelRatio: 3.125, // 300 DPI resolution (300 / 96 = 3.125)
        cacheBust: true,
        style: { transform: "scale(1)", margin: "0" },
      });

      const filename = `tiket-rundown-${(data.recipientName || "kencan").replace(/\s+/g, "-").toLowerCase()}.png`;

      // Try native Web Share API with image file first (for mobile)
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], filename, { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: data.ticketTitle || "Tiket Rundown Kencan",
            text: `Rundown Ngedate Spesial dari ${data.senderName} untuk ${data.recipientName}!`,
          });
          setDownloading(false);
          return;
        }
      } catch (e) {
        console.log("Native file share fallback to browser download", e);
      }

      // Browser download fallback
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Gagal mengunduh gambar tiket:", err);
      alert(translateLocaleValue("Gagal mengunduh gambar tiket. Silakan screenshot layar HP milikmu!", normaliseLocale(data.locale, "en")));
    } finally {
      setDownloading(false);
    }
  }, [data]);

  // WhatsApp share
  const handleWhatsAppShare = useCallback(() => {
    const text = encodeURIComponent(
      `Halo ${data.recipientName}! Ini Tiket & Rundown Ngedate dari ${data.senderName}:\n\n` +
      `📌 ${invitationUrl}\n\n` +
      `Buka link-nya yaa!`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }, [data, invitationUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md mx-auto flex flex-col gap-5 px-2 py-4"
    >
      {/* ── Ticket Container Card (Target for htmlToImage download) ─────── */}
      <div
        ref={ticketRef}
        className="rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-2xl bg-white/95 border relative"
        style={{ borderColor: `${theme.accent}35` }}
      >
        {/* Top Accent Gradient Bar */}
        <div
          className="h-3 w-full"
          style={{ background: `linear-gradient(90deg, ${theme.accent} 0%, ${theme.accent}aa 100%)` }}
        />

        {/* ── Ticket Top Stub Section ───────────────────────────────────── */}
        <div className="px-6 pt-6 pb-5 flex flex-col gap-4 text-center relative z-10">
          {/* Serial Number Stamp & Ticket Title */}
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: `${theme.accent}20` }}>
            <span
              className="text-[9px] font-extrabold uppercase tracking-[0.25em] font-mono px-2.5 py-0.5 rounded-md"
              style={{ background: `${theme.accent}12`, color: theme.accent }}
            >
              PASS NO. RD-2001
            </span>
            <span
              className="text-[9px] font-extrabold uppercase tracking-[0.25em]"
              style={{ color: `${theme.accent}bb` }}
            >
              {data.ticketTitle || "TIKET RUNDOWN KENCAN"}
            </span>
          </div>

          {/* Recipient & Sender Names */}
          <div>
            <h2
              className="text-3xl tracking-wide block font-normal leading-tight"
              style={{ fontFamily: "var(--font-caveat)", color: theme.text, fontSize: "2.3rem" }}
            >
              {data.recipientName} &amp; {data.senderName}
            </h2>
            <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
              {data.subText || "Special Date Invitation"}
            </p>
          </div>

          {/* Event Date Badge */}
          {data.eventDate && (
            <div className="flex justify-center">
              <div
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold border shadow-2xs font-mono"
                style={{
                  background: `${theme.accent}12`,
                  borderColor: `${theme.accent}30`,
                  color: theme.accent,
                }}
              >
                <IconCalendar size={14} color={theme.accent} strokeWidth={2} className="shrink-0" />
                <span>{formatIndonesianDate(data.eventDate, normaliseLocale(data.locale, "en"))}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Ticket Stub Cutout Divider (Ticket Tear Notches) ──────────── */}
        <div className="relative w-full flex items-center my-1">
          {/* Left Semi-Circle Ticket Notch */}
          <div
            className="w-7 h-7 rounded-full absolute -left-3.5 shadow-inner z-20"
            style={{
              background: theme.bg,
              boxShadow: `inset -3px 0 6px rgba(0,0,0,0.08)`,
              borderRight: `1.5px solid ${theme.accent}35`,
            }}
          />

          {/* Dashed Tear Line */}
          <div
            className="w-full border-t-2 border-dashed z-10 opacity-40 mx-4"
            style={{ borderColor: theme.accent }}
          />

          {/* Right Semi-Circle Ticket Notch */}
          <div
            className="w-7 h-7 rounded-full absolute -right-3.5 shadow-inner z-20"
            style={{
              background: theme.bg,
              boxShadow: `inset 3px 0 6px rgba(0,0,0,0.08)`,
              borderLeft: `1.5px solid ${theme.accent}35`,
            }}
          />
        </div>

        {/* ── Ticket Main Content Body ──────────────────────────────────── */}
        <div className="px-6 pt-4 pb-7 flex flex-col gap-5 z-10 relative">
          {/* Rundown Items Summary */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="h-px w-4" style={{ background: `${theme.accent}40` }} />
              <span
                className="text-[9px] font-extrabold uppercase tracking-[0.28em]"
                style={{ color: theme.accent }}
              >
                {data.rundownTitle || "JADWAL NGEDATE"}
              </span>
              <div className="h-px flex-1" style={{ background: `${theme.accent}20` }} />
            </div>

            <div className="flex flex-col gap-2.5">
              {data.rundownItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex items-center gap-3 p-3.5 rounded-2xl border transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${theme.bg}40 0%, #ffffff 100%)`,
                    borderColor: `${theme.accent}25`,
                  }}
                >
                  <ActivityIconSvg iconKey={item.icon || item.emoji} size={22} color={theme.accent} className="shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-extrabold text-gray-800 truncate">{item.title}</p>
                      <span
                        className="text-[10px] font-extrabold font-mono px-2 py-0.5 rounded-md border shrink-0"
                        style={{
                          background: `${theme.accent}15`,
                          color: theme.accent,
                          borderColor: `${theme.accent}25`,
                        }}
                      >
                        {item.time || "Flexibel"}
                      </span>
                    </div>
                    {item.location && (
                      <p className="text-[10px] text-gray-500 font-semibold truncate mt-0.5 inline-flex items-center gap-1">
                        <IconMapPin size={11} color={theme.accent} strokeWidth={2.5} className="shrink-0" />
                        <span>{item.location}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dress Code Section */}
          {data.dressCodes && data.dressCodes.length > 0 && (
            <div
              className="border-t pt-4 flex flex-col gap-2"
              style={{ borderColor: `${theme.accent}20` }}
            >
              <div className="flex items-center gap-2">
                <div className="h-px w-4" style={{ background: `${theme.accent}40` }} />
                <span
                  className="text-[9px] font-extrabold uppercase tracking-[0.28em]"
                  style={{ color: theme.accent }}
                >
                  DRESS CODE OUTFIT
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {data.dressCodes.map((dc) => (
                  <span
                    key={dc}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold border inline-flex items-center gap-1.5 shadow-2xs"
                    style={{
                      background: `linear-gradient(135deg, ${theme.accent}15 0%, #ffffff 100%)`,
                      color: theme.text,
                      borderColor: `${theme.accent}30`,
                    }}
                  >
                    <DressCodeIconSvg iconKey={(data.dressCodeIcons || {})[dc]} size={15} color={theme.accent} />
                    <span>{dc}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recipient Reply Message (if exists) */}
          {message && (
            <div
              className="border-t pt-4"
              style={{ borderColor: `${theme.accent}20` }}
            >
              <span
                className="text-[9px] font-extrabold uppercase tracking-[0.28em] block mb-1.5"
                style={{ color: theme.accent }}
              >
                PESAN BALASAN
              </span>
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-700 italic font-semibold leading-relaxed">&ldquo;{message}&rdquo;</p>
              </div>
            </div>
          )}

          {/* Note / Pesan dari Pengirim */}
          {data.closingNote && (
            <div
              className="border-t pt-4 text-center"
              style={{ borderColor: `${theme.accent}20` }}
            >
              <span
                className="text-[9px] font-extrabold uppercase tracking-[0.28em] block mb-1.5"
                style={{ color: theme.accent }}
              >
                NOTE FROM {(data.senderName || "PENGIRIM").toUpperCase()}
              </span>
              <p
                className="text-base leading-relaxed text-gray-800 italic whitespace-pre-line max-w-xs mx-auto font-normal"
                style={{ fontFamily: "var(--font-caveat)" }}
              >
                &ldquo;{data.closingNote}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Action Buttons Bar ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-2.5 w-full z-10">
        {/* Download Ticket Image */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleDownloadImage}
          disabled={downloading}
          className="w-full py-4 rounded-2xl font-bold text-sm text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer"
          style={{
            background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent}ee 100%)`,
            boxShadow: `0 12px 32px -6px ${theme.accent}65`,
            letterSpacing: "0.03em",
          }}
        >
          <IconShare size={18} color="white" />
          <span>{downloading ? "Mengunduh Tiket..." : "Simpan Gambar Tiket (PNG)"}</span>
        </motion.button>

        <div className="grid grid-cols-2 gap-2.5">
          {/* WhatsApp Share */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="py-3.5 rounded-2xl font-bold text-xs border bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <IconWhatsApp size={16} color="#047857" />
            <span>Bagikan ke WA</span>
          </button>

          {/* Copy Link */}
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(invitationUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="py-3.5 rounded-2xl font-bold text-xs border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <IconSparkle size={16} color={theme.accent} />
            <span>{copied ? "Link Tersalin!" : "Salin Link Tiket"}</span>
          </button>
        </div>
      </div>

      {/* Reset Button */}
      <button
        type="button"
        onClick={onReset}
        className="text-xs font-semibold text-gray-400 hover:text-gray-600 text-center mt-2 transition-colors cursor-pointer"
      >
        Buka ulang dari awal
      </button>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function RundownGiftClient({ data }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [phase, setPhase] = useState<Phase>("loading");
  const [showFlowers, setShowFlowers] = useState(false);
  const [recipientMessage, setRecipientMessage] = useState("");

  const theme = getTheme(data.themeId ?? "pink");
  const locale = normaliseLocale(data.locale, "en");

  useEffect(() => {
    document.documentElement.lang = locale;
    translateStaticDom(document.body, locale);
    return observeStaticDom(document.body, locale);
  }, [locale, phase]);

  // ── Audio helpers ─────────────────────────────────────────────────────────

  const clickAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      clickAudioRef.current = new Audio("/assets/click.mp3");
    }
  }, []);

  const playClick = useCallback(() => {
    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play().catch(() => {});
    }
  }, []);

  // ── Phase transitions ─────────────────────────────────────────────────────

  const handleLoadingComplete = useCallback(() => setPhase("envelope"), []);

  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log("iOS play error:", e));
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleEnvelopeTap = useCallback(() => {
    if (audioRef.current && data.musicUrl) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log("Audio play blocked by iOS:", e));
    }
  }, [data.musicUrl]);

  const handleEnvelopeOpen = useCallback(() => {
    setShowFlowers(true);
  }, []);

  const handleFlowerSwitchState = useCallback(() => {
    setPhase("invitation");
  }, []);

  const handleFlowerDone = useCallback(() => {
    setShowFlowers(false);
  }, []);

  // Acceptance -> Move to Dresscode first!
  const handleAccept = useCallback(() => {
    playClick();
    setPhase("dresscode");
  }, [playClick]);

  // Dresscode -> Move to Rundown next!
  const handleDresscodeContinue = useCallback(() => {
    playClick();
    setPhase("rundown");
  }, [playClick]);

  // Rundown -> Move to Message!
  const handleRundownContinue = useCallback(() => {
    playClick();
    setPhase("message");
  }, [playClick]);

  const handleMessage = useCallback(
    (msg: string) => {
      playClick();
      setRecipientMessage(msg);
      setPhase("ticket");
    },
    [playClick]
  );

  const handleReset = useCallback(() => {
    setPhase("loading");
    setRecipientMessage("");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  const cardVariants = {
    initial: { opacity: 0, scale: 0.96, y: 15 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
    },
    exit: { opacity: 0, scale: 0.96, y: -15, transition: { duration: 0.22, ease: "easeIn" as const } },
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 50% 40%, ${theme.bg} 0%, ${theme.card}88 60%, ${theme.bg} 100%)`,
      }}
    >
      {/* Background music */}
      {data.musicUrl && (
        <audio ref={audioRef} src={data.musicUrl} loop autoPlay={false} />
      )}

      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-15"
            style={{
              width: `${140 + i * 60}px`,
              height: `${140 + i * 60}px`,
              background: theme.accent,
              top: `${15 + i * 30}%`,
              left: `${-10 + (i % 2 === 0 ? 0 : 70)}%`,
              filter: "blur(30px)",
              willChange: "transform",
            }}
          />
        ))}
      </div>

      {/* Background Music UI (Same compact button as Invitation Date) */}
      {data.musicUrl && phase !== "loading" && phase !== "envelope" && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md"
          style={{
            background: `${theme.accent}cc`,
            color: "white",
            border: `2px solid ${theme.accent}40`,
          }}
          aria-label={isPlaying ? "Matikan musik" : "Aktifkan musik"}
        >
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
              <line x1="2" y1="2" x2="22" y2="22" />
            </svg>
          )}
        </motion.button>
      )}

      {/* ── Phase: loading ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === "loading" && (
          <LoadingScreen key="loading" theme={theme} onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      {/* ── Phase: envelope (VIP Boarding Pass Badge Gate for Rundown) ─────── */}
      <AnimatePresence>
        {phase === "envelope" && (
          <RundownEnvelopeGate
            key="envelope"
            recipientName={data.recipientName}
            senderName={data.senderName}
            theme={theme}
            onOpen={handleEnvelopeOpen}
            onTap={handleEnvelopeTap}
          />
        )}
      </AnimatePresence>

      {/* ── Rundown Petal Vortex Swirl Overlay ───────────────────────────── */}
      {showFlowers && (
        <RundownVortexBurst
          theme={theme}
          recipientName={data.recipientName}
          senderName={data.senderName}
          invitationTitle={data.invitationTitle || "A Special Invitation For"}
          onSwitchState={handleFlowerSwitchState}
          onDone={handleFlowerDone}
        />
      )}

      {/* ── Phases rendered below flowers ─────────────────────────────────── */}
      <AnimatePresence mode="wait">

        {/* invitation (Rundown mode: Magazine Cover opening) */}
        {phase === "invitation" && (
          <motion.div key="invitation" {...cardVariants} className="relative z-10 w-full px-4 my-auto">
            <RundownOpeningCard
              senderName={data.senderName}
              recipientName={data.recipientName}
              subText={data.subText}
              invitationTitle={data.invitationTitle}
              eventDate={data.eventDate}
              locale={locale}
              photoUrl={data.photoUrl ?? undefined}
              theme={theme}
              onStart={handleAccept}
            />
          </motion.div>
        )}

        {/* dresscode (FIRST BEFORE RUNDOWN!) */}
        {phase === "dresscode" && (
          <motion.div key="dresscode" {...cardVariants} className="relative z-10 w-full px-4 my-auto">
            <ReadOnlyDressCodeCard
              dressCodes={data.dressCodes ?? []}
              dressCodeIcons={data.dressCodeIcons}
              theme={theme}
              onContinue={handleDresscodeContinue}
            />
          </motion.div>
        )}

        {/* rundown (SECOND AFTER DRESSCODE!) */}
        {phase === "rundown" && (
          <motion.div key="rundown" {...cardVariants} className="relative z-10 w-full px-4 py-4 my-auto">
            <RundownCard
              items={data.rundownItems}
              title={data.rundownTitle}
              theme={theme}
              onContinue={handleRundownContinue}
            />
          </motion.div>
        )}

        {/* message / sender letter */}
        {phase === "message" && (
          <motion.div key="message" {...cardVariants} className="relative z-10 w-full px-4 my-auto">
            <SenderLetterCard
              senderName={data.senderName}
              recipientName={data.recipientName}
              note={data.closingNote}
              theme={theme}
              onContinue={() => {
                playClick();
                setPhase("ticket");
              }}
            />
          </motion.div>
        )}

        {/* ticket */}
        {phase === "ticket" && (
          <motion.div key="ticket" {...cardVariants} className="relative z-10 w-full px-4 py-4 my-auto">
            <RundownTicket
              data={data}
              message={recipientMessage}
              theme={theme}
              onReset={handleReset}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
