"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getTheme } from "@/lib/constants";
import type { RundownData } from "@/lib/types";
import LoadingScreen from "@/components/gift/LoadingScreen";
import EnvelopeGate from "@/components/gift/EnvelopeGate";
import FlowerBurst from "@/components/gift/FlowerBurst";
import InvitationCard from "@/components/gift/InvitationCard";
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
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-sm mx-auto flex flex-col gap-6 px-3 py-2"
    >
      <div
        className="relative rounded-[2.5rem] p-7 overflow-hidden text-center flex flex-col items-center gap-6 shadow-2xl backdrop-blur-xl"
        style={{
          background: "rgba(255, 255, 255, 0.94)",
          border: `1.5px solid ${theme.accent}30`,
          boxShadow: `0 20px 50px -10px ${theme.accent}25, 0 8px 20px rgba(0, 0, 0, 0.04)`,
        }}
      >
        <div
          className="absolute -top-12 -left-12 w-32 h-32 rounded-full blur-2xl opacity-25 pointer-events-none"
          style={{ background: theme.accent }}
        />

        <div className="text-center">
          <span
            className="text-[10px] font-extrabold uppercase tracking-[0.3em] block mb-1"
            style={{ color: theme.accent }}
          >
            A SPECIAL NOTE FOR YOU
          </span>
          <h2
            className="text-2xl font-normal leading-tight"
            style={{ fontFamily: "var(--font-caveat)", color: theme.text }}
          >
            Pesan dari {senderName || "Ayangg"}
          </h2>
        </div>

        {/* Letter / Note Container */}
        <div
          className="w-full p-5 rounded-2xl border text-center flex flex-col justify-center gap-3 relative shadow-inner min-h-[140px]"
          style={{
            background: `linear-gradient(135deg, ${theme.bg}70 0%, #ffffff 100%)`,
            borderColor: `${theme.accent}30`,
          }}
        >
          <p
            className="text-lg leading-relaxed text-gray-800 italic whitespace-pre-line relative"
            style={{ fontFamily: "var(--font-caveat)" }}
          >
            &ldquo;{displayedText}&rdquo;
            {!isTypingComplete && (
              <span
                className="inline-block w-0.5 h-4 ml-0.5 align-middle animate-pulse"
                style={{ background: theme.accent }}
              />
            )}
          </p>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl text-sm font-bold text-white shadow-lg transition-transform active:scale-[0.98] hover:opacity-95 flex items-center justify-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent}ee 100%)`,
            boxShadow: `0 10px 25px -5px ${theme.accent}60`,
          }}
        >
          <span>Buka Tiket Kencan</span>
          <span className="text-base font-normal">→</span>
        </button>
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
        pixelRatio: 3,
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
      alert("Gagal mengunduh gambar tiket. Silakan screenshot layar HP milikmu!");
    } finally {
      setDownloading(false);
    }
  }, [data]);

  // WhatsApp share
  const handleWhatsAppShare = useCallback(() => {
    const text = encodeURIComponent(
      `Halo ${data.recipientName}! ✨ Ini Tiket & Rundown Ngedate dari ${data.senderName}:\n\n` +
      `📌 ${invitationUrl}\n\n` +
      `Buka link-nya yaa!`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }, [data, invitationUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md mx-auto flex flex-col gap-5 px-2 py-4"
    >
      {/* Ticket Container Card (Target for htmlToImage download) */}
      <div
        ref={ticketRef}
        className="rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl bg-white/95 border relative"
        style={{ borderColor: `${theme.accent}30` }}
      >
        {/* Top accent strip */}
        <div className="h-2.5 w-full" style={{ background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent}aa)` }} />

        <div className="px-6 py-7 flex flex-col gap-6">
          {/* Header */}
          <div className="text-center border-b pb-5" style={{ borderColor: `${theme.accent}20` }}>
            <span
              className="text-[10px] font-extrabold uppercase tracking-[0.25em] px-3.5 py-1 rounded-full border mb-2 inline-block"
              style={{ background: `${theme.accent}15`, color: theme.accent, borderColor: `${theme.accent}30` }}
            >
              {data.ticketTitle || "TIKET RUNDOWN KENCAN"}
            </span>
            <h2
              className="text-3xl tracking-wide mt-1 block font-normal"
              style={{ fontFamily: "var(--font-caveat)", color: theme.text }}
            >
              {data.recipientName} &amp; {data.senderName}
            </h2>
            <p className="text-[11px] text-gray-400 font-medium mt-1">
              {data.subText || "Special Date Invitation"}
            </p>
          </div>

          {/* Rundown items */}
          <div className="flex flex-col gap-3">
            <p
              className="text-[10px] font-extrabold uppercase tracking-[0.2em]"
              style={{ color: theme.accent }}
            >
              {data.rundownTitle || "JADWAL NGEDATE"}
            </p>

            <div className="flex flex-col gap-2.5">
              {data.rundownItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3.5 rounded-2xl border"
                  style={{ background: `${theme.bg}50`, borderColor: "rgba(229, 231, 235, 0.8)" }}
                >
                  <ActivityIconSvg iconKey={item.icon || item.emoji} size={20} color={theme.accent} className="shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-gray-800 truncate">{item.title}</p>
                      <span
                        className="text-[10px] font-bold font-mono px-2 py-0.5 rounded shrink-0"
                        style={{ background: `${theme.accent}15`, color: theme.accent }}
                      >
                        {item.time || "Flexibel"}
                      </span>
                    </div>
                    {item.location && (
                      <p className="text-[10px] text-gray-500 font-medium truncate mt-0.5 inline-flex items-center gap-1">
                        <IconMapPin size={11} color={theme.accent} strokeWidth={2} className="shrink-0" />
                        <span>{item.location}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dress code */}
          {data.dressCodes && data.dressCodes.length > 0 && (
            <div
              className="border-t pt-4 flex flex-col gap-2"
              style={{ borderColor: `${theme.accent}20` }}
            >
              <p
                className="text-[10px] font-extrabold uppercase tracking-[0.2em]"
                style={{ color: theme.accent }}
              >
                DRESS CODE OUTFIT
              </p>
              <div className="flex flex-wrap gap-2">
                {data.dressCodes.map((dc) => (
                  <span
                    key={dc}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border inline-flex items-center gap-1.5"
                    style={{
                      background: `${theme.accent}12`,
                      color: theme.text,
                      borderColor: `${theme.accent}25`,
                    }}
                  >
                    <DressCodeIconSvg iconKey={(data.dressCodeIcons || {})[dc]} size={14} color={theme.accent} />
                    <span>{dc}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recipient message */}
          {message && (
            <div
              className="border-t pt-4"
              style={{ borderColor: `${theme.accent}20` }}
            >
              <p
                className="text-[10px] font-extrabold uppercase tracking-[0.2em] mb-1.5"
                style={{ color: theme.accent }}
              >
                PESAN BALASAN
              </p>
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-700 italic font-medium leading-relaxed">&ldquo;{message}&rdquo;</p>
              </div>
            </div>
          )}

          {/* Note / Pesan dari Pengirim */}
          {data.closingNote && (
            <div
              className="border-t pt-4 text-center"
              style={{ borderColor: `${theme.accent}20` }}
            >
              <p
                className="text-[9px] font-extrabold uppercase tracking-[0.2em] mb-1.5"
                style={{ color: theme.accent }}
              >
                NOTE DARI {(data.senderName || "PENGIRIM").toUpperCase()}
              </p>
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

      {/* Action Buttons Bar: Download PNG, WhatsApp Share, Copy Link */}
      <div className="flex flex-col gap-2.5 w-full">
        {/* Download Ticket Image */}
        <button
          onClick={handleDownloadImage}
          disabled={downloading}
          className="w-full py-4 rounded-2xl font-bold text-sm text-white shadow-xl transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent}ee 100%)`,
            boxShadow: `0 10px 25px -5px ${theme.accent}60`,
          }}
        >
          <IconShare size={18} color="white" />
          <span>{downloading ? "Mengunduh Tiket..." : "Simpan Gambar Tiket (PNG)"}</span>
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          {/* WhatsApp Share */}
          <button
            onClick={handleWhatsAppShare}
            className="py-3.5 rounded-2xl font-bold text-xs border bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <IconWhatsApp size={16} color="#047857" />
            <span>Bagikan ke WA</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(invitationUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="py-3.5 rounded-2xl font-bold text-xs border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <IconSparkle size={16} color={theme.accent} />
            <span>{copied ? "Link Tersalin!" : "Salin Link Tiket"}</span>
          </button>
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="text-xs font-semibold text-gray-400 hover:text-gray-600 text-center mt-2 transition-colors"
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
    initial: { opacity: 0, scale: 0.92, y: 20 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.45, ease: "backOut" as const },
    },
    exit: { opacity: 0, scale: 0.92, y: -20, transition: { duration: 0.25 } },
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

      {/* ── Phase: envelope ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === "envelope" && (
          <EnvelopeGate
            key="envelope"
            recipientName={data.recipientName}
            theme={theme}
            onOpen={handleEnvelopeOpen}
            onTap={handleEnvelopeTap}
          />
        )}
      </AnimatePresence>

      {/* ── Flower burst overlay (FIXED PROPS FOR RECIPIENT & SENDER NAME) ──────────────────────────────────────────── */}
      {showFlowers && (
        <FlowerBurst
          theme={theme}
          recipientName={data.recipientName}
          senderName={data.senderName}
          invitationTitle={data.invitationTitle || "Invitation From"}
          onSwitchState={handleFlowerSwitchState}
          onDone={handleFlowerDone}
          openingShape={data.openingShape ?? "heart"}
        />
      )}

      {/* ── Phases rendered below flowers ─────────────────────────────────── */}
      <AnimatePresence mode="wait">

        {/* invitation */}
        {phase === "invitation" && !showFlowers && (
          <motion.div key="invitation" {...cardVariants} className="relative z-10 w-full px-4">
            <InvitationCard
              senderName={data.senderName}
              subText={data.subText}
              photoUrl={data.photoUrl ?? undefined}
              theme={theme}
              onAccept={handleAccept}
            />
          </motion.div>
        )}

        {/* dresscode (FIRST BEFORE RUNDOWN!) */}
        {phase === "dresscode" && (
          <motion.div key="dresscode" {...cardVariants} className="relative z-10 w-full px-4">
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
          <motion.div key="rundown" {...cardVariants} className="relative z-10 w-full px-4 py-8 overflow-y-auto max-h-screen">
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
          <motion.div key="message" {...cardVariants} className="relative z-10 w-full px-4">
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
          <motion.div key="ticket" {...cardVariants} className="relative z-10 w-full px-4 py-8 overflow-y-auto max-h-screen">
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
