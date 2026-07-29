"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as htmlToImage from "html-to-image";
import { IconShare, IconWhatsApp, IconUser, IconCalendar, IconSparkle, IconHanger, IconMessage, IconHeart } from "@/components/ui/Icon";

interface DateTimeProps {
  data: {
    recipientName: string;
    senderName: string;
    date: string;
    activities: string[];
    dressCode: string;
    message: string;
    subText?: string;
    senderNote?: string;
    ticketTitle?: string;
  };
  theme: { bg: string; card: string; accent: string; text: string };
  onReset: () => void;
}

function TypewriterText({
  text,
  speed = 35,
  isDownloading = false,
  accentColor,
  style,
}: {
  text: string;
  speed?: number;
  isDownloading?: boolean;
  accentColor?: string;
  style?: React.CSSProperties;
}) {
  const [displayedLength, setDisplayedLength] = useState(isDownloading ? text.length : 0);
  const [isDone, setIsDone] = useState(isDownloading);

  useEffect(() => {
    if (isDownloading) {
      setDisplayedLength(text.length);
      setIsDone(true);
      return;
    }

    setDisplayedLength(0);
    setIsDone(false);

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setDisplayedLength(idx);
      if (idx >= text.length) {
        setIsDone(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, isDownloading]);

  const currentText = isDownloading ? text : text.slice(0, displayedLength);

  return (
    <div className="relative">
      <p style={style}>
        {currentText}
        {!isDone && !isDownloading && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse" }}
            className="inline-block font-sans font-bold text-xs ml-0.5"
            style={{ color: accentColor || "currentColor" }}
          >
            |
          </motion.span>
        )}
      </p>
    </div>
  );
}

export default function DateTicket({ data, theme, onReset }: DateTimeProps) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const downloadTicket = useCallback(async () => {
    if (!ticketRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await htmlToImage.toPng(ticketRef.current, {
        quality: 1,
        pixelRatio: 3,
        style: { transform: "scale(1)", margin: "0" },
      });
      
      const filename = `tiket-kencan-${data.recipientName.replace(/\s+/g, "-").toLowerCase()}.png`;

      // Canggih mobile native sharing (iOS/Android)
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], filename, { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "Tiket Kencan",
            text: `Tiket kencan untuk ${data.recipientName} dari ${data.senderName}`,
          });
          return;
        }
      } catch (e) {
        // Fallback to standard download if share is cancelled or fails
        console.log("Share failed or unsupported", e);
      }

      // Fallback: standard browser download
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Gagal memproses tiket. Coba lagi.");
    } finally {
      setDownloading(false);
    }
  }, [data.recipientName, data.senderName]);

  const shareWhatsApp = () => {
    const text = `Yeay, it's a date!\n\nNanti kita ${data.activities.join(", ")} ya.\nKapan: ${data.date}\nDress code: ${data.dressCode}\n\nCan't wait!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: `${theme.accent}15` }}>
      {children}
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center">
      {/* The Ticket Itself */}
      <motion.div
        ref={ticketRef}
        className="w-full max-w-[340px] rounded-2xl relative overflow-hidden flex flex-col"
        style={{
          background: `linear-gradient(to bottom right, #ffffff, ${theme.bg})`,
          boxShadow: "0 24px 64px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Ticket cutouts */}
        <div className="absolute top-[48%] -left-3 w-6 h-6 rounded-full bg-[#f8f8fa]" style={{ boxShadow: "inset -2px 0 4px rgba(0,0,0,0.02)" }} />
        <div className="absolute top-[48%] -right-3 w-6 h-6 rounded-full bg-[#f8f8fa]" style={{ boxShadow: "inset 2px 0 4px rgba(0,0,0,0.02)" }} />

        {/* Top Section */}
        <div className="px-6 pt-6 pb-4 flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: theme.accent }}>
              ADMIT TWO
            </span>
            <h3 style={{ fontFamily: "var(--font-caveat)", fontSize: "2.2rem", color: theme.text, lineHeight: 1 }}>
              {data.ticketTitle || "Tiket kencan"}
            </h3>
          </div>
          {/* Stamp */}
          <div className="w-12 h-12 rounded-full border-[1.5px] border-dashed flex items-center justify-center shrink-0" style={{ borderColor: theme.accent, background: `${theme.accent}10` }}>
            <IconHeart size={20} color={theme.accent} fill={theme.accent} />
          </div>
        </div>

        {/* Separator */}
        <div className="w-full px-6">
          <div className="w-full border-t-[1.5px] border-dashed opacity-20" style={{ borderColor: theme.text }} />
        </div>

        {/* Details Section */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="flex gap-3 items-center">
            <IconWrapper><IconUser size={16} color={theme.accent} /></IconWrapper>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold tracking-widest uppercase opacity-60" style={{ color: theme.text }}>UNTUK</span>
              <span style={{ fontFamily: "var(--font-caveat)", fontSize: "1.4rem", color: theme.text, lineHeight: 1.1 }}>{data.recipientName}</span>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <IconWrapper><IconCalendar size={16} color={theme.accent} /></IconWrapper>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold tracking-widest uppercase opacity-60" style={{ color: theme.text }}>KAPAN</span>
              <span style={{ fontFamily: "var(--font-caveat)", fontSize: "1.25rem", color: theme.text, lineHeight: 1.2 }}>{data.date}</span>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <IconWrapper><IconSparkle size={16} color={theme.accent} /></IconWrapper>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold tracking-widest uppercase opacity-60" style={{ color: theme.text }}>ACARA</span>
              <span style={{ fontFamily: "var(--font-caveat)", fontSize: "1.4rem", color: theme.text, lineHeight: 1.1 }}>{data.activities.join(", ")}</span>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <IconWrapper><IconHanger size={16} color={theme.accent} /></IconWrapper>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold tracking-widest uppercase opacity-60" style={{ color: theme.text }}>DRESS CODE</span>
              <span style={{ fontFamily: "var(--font-caveat)", fontSize: "1.4rem", color: theme.text, lineHeight: 1.1 }}>{data.dressCode}</span>
            </div>
          </div>

          {/* Notes dari Penerima */}
          <div className="flex gap-3 items-start">
            <IconWrapper><IconMessage size={16} color={theme.accent} /></IconWrapper>
            <div className="flex flex-col w-full min-w-0">
              <span className="text-[8px] font-bold tracking-widest uppercase opacity-60 block mb-0.5" style={{ color: theme.text }}>
                NOTES DARI {data.recipientName.toUpperCase()}
              </span>
              {data.message && data.message.trim() !== "" ? (
                <div
                  className="w-full rounded-xl px-3 py-2 mt-1"
                  style={{ background: `${theme.accent}0d`, border: `1px solid ${theme.accent}18` }}
                >
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: "1.25rem", color: theme.text, lineHeight: 1.35, whiteSpace: "pre-line", wordBreak: "break-word" }}>
                    &ldquo;{data.message}&rdquo;
                  </p>
                </div>
              ) : (
                <span style={{ fontFamily: "var(--font-caveat)", fontSize: "1.3rem", color: theme.text, opacity: 0.5 }}>
                  -
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="w-full px-6">
          <div className="w-full border-t-[1.5px] border-dashed opacity-20" style={{ borderColor: theme.text }} />
        </div>

        {/* Footer */}
        <div className="px-6 py-5 flex flex-col items-center text-center gap-3">
          {/* Catatan dari Pembuat (Studio Editor) */}
          {data.senderNote && data.senderNote.trim() !== "" && (
            <div
              className="w-full rounded-2xl px-5 py-4 mb-1 text-left"
              style={{ background: `${theme.accent}12`, border: `1px solid ${theme.accent}25` }}
            >
              <span className="text-[8px] font-bold tracking-widest uppercase block mb-1.5 opacity-70" style={{ color: theme.accent }}>
                CATATAN DARI {data.senderName.toUpperCase()}
              </span>
              <TypewriterText
                text={data.senderNote}
                speed={35}
                isDownloading={downloading}
                accentColor={theme.accent}
                style={{ fontFamily: "var(--font-caveat)", fontSize: "1.2rem", color: theme.text, lineHeight: 1.5, whiteSpace: "pre-line", wordBreak: "break-word" }}
              />
            </div>
          )}
          {data.subText && data.subText.trim() !== "" && (
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: "1.1rem", color: theme.text, opacity: 0.9, lineHeight: 1.4 }}>
              {data.subText}
            </p>
          )}
          <span className="text-[10px] font-bold" style={{ color: theme.accent }}>
            dari {data.senderName}, buat {data.recipientName} ♥
          </span>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="w-full max-w-[340px] mt-6 flex flex-col gap-3">
        <p className="text-xs text-center font-medium opacity-50 mb-1" style={{ color: theme.text }}>
          Bagikan tiketnya ke {data.senderName} ya — langsung jadi gambar
        </p>
        <div className="flex gap-3">
          <motion.button
            onClick={downloadTicket}
            whileTap={{ scale: 0.96 }}
            className="flex-1 py-3.5 rounded-full font-bold text-[13px] text-white flex items-center justify-center gap-2 transition-all"
            style={{ background: theme.accent, boxShadow: `0 4px 12px ${theme.accent}40` }}
          >
            <IconShare size={16} />
            {downloading ? "Memproses..." : "Bagikan tiket"}
          </motion.button>

          <motion.button
            onClick={shareWhatsApp}
            whileTap={{ scale: 0.96 }}
            className="px-6 py-3.5 rounded-full font-bold text-[13px] flex items-center justify-center transition-all"
            style={{ background: "white", color: theme.text, border: `1px solid ${theme.accent}30` }}
          >
            Chat WhatsApp
          </motion.button>
        </div>
      </div>
    </div>
  );
}
