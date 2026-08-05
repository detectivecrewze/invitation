"use client";

/**
 * GiftCardBarcode — Live preview + 300DPI canvas export for the Gift Card style.
 * Self-contained: rendering logic lives here; admin/page.tsx only passes props.
 */

import { useRef } from "react";
import HeartQRCode from "@/components/ui/HeartQRCode";
import type { GiftCardProps } from "./types";
import { downloadGiftCard } from "./download-gift";

export default function GiftCardBarcode(props: GiftCardProps) {
  const {
    barcodeUrl, barcodeColor, cardBgColor, barcodeName,
    frontTitle, frontTitleColor, frontTitleSize,
    nameColor, nameSize,
    badgeText, badgeTextColor, badgeTextSize,
    cardNote, noteColor, noteSize,
    cardWeb, cardIg, cardTiktok,
  } = props;

  const qrWrapRef = useRef<HTMLDivElement>(null);
  const hasFooter = Boolean(cardWeb.trim() || cardIg.trim() || cardTiktok.trim());
  const color = barcodeColor || "#e8789a";

  const handleDownload = () =>
    downloadGiftCard({ ...props, qrWrapRef });

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* ── Live Preview Card ── */}
      <div
        className="relative w-full max-w-[340px] rounded-3xl p-5 shadow-xl flex flex-col justify-between overflow-hidden transition-all border-4"
        style={{
          aspectRatio: "24/28",
          background: cardBgColor || "#ffffff",
          borderColor: `${color}33`,
          boxShadow: `0 20px 50px ${color}20`,
        }}
      >
        {/* Inner accent */}
        <div className="absolute inset-2.5 rounded-2xl border-2 pointer-events-none" style={{ borderColor: `${color}20` }} />

        {/* Corner dots */}
        {[["top-4 left-4"], ["top-4 right-4"], ["bottom-4 left-4"], ["bottom-4 right-4"]].map(([pos]) => (
          <div key={pos} className={`absolute ${pos} w-1.5 h-1.5 rounded-full pointer-events-none opacity-50`} style={{ background: color }} />
        ))}

        <div className="flex flex-col items-center justify-between h-full relative z-10 pt-1 pb-1">
          {/* Top header */}
          <div className="text-center">
            <span
              className="font-bold uppercase tracking-[0.24em] block transition-all"
              style={{ color: frontTitleColor || color, fontSize: `${Math.round((frontTitleSize || 46) * 0.19)}px` }}
            >
              {frontTitle || "SOMETHING SPECIAL FOR U"}
            </span>
            <div className="flex items-center justify-center gap-1.5 opacity-40 my-0.5">
              <span className="w-8 h-[1px]" style={{ background: frontTitleColor || color }} />
              <span className="text-[8px]" style={{ color: frontTitleColor || color }}>♥</span>
              <span className="w-8 h-[1px]" style={{ background: frontTitleColor || color }} />
            </div>
          </div>

          {/* Heart QR Code */}
          <div ref={qrWrapRef} className="flex flex-col items-center justify-center my-auto">
            <HeartQRCode url={barcodeUrl} color={color} bgColor={cardBgColor || "#ffffff"} size={200} />
          </div>

          {/* Lower section */}
          <div className={`text-center w-full flex flex-col items-center gap-1 transition-all ${hasFooter ? "pb-0.5" : "pb-4 my-auto gap-1.5"}`}>
            {barcodeName && (
              <div className="flex items-center justify-center gap-2 w-full">
                <span className="w-8 h-[1px] opacity-30" style={{ background: nameColor || color }} />
                <p
                  className="font-bold tracking-wide -my-1 transition-all"
                  style={{ color: nameColor || color, fontFamily: "var(--font-caveat)", fontSize: `${Math.round((nameSize || 105) * 0.23)}px` }}
                >
                  {barcodeName}
                </p>
                <span className="w-8 h-[1px] opacity-30" style={{ background: nameColor || color }} />
              </div>
            )}

            {/* Badge pill */}
            <div
              className="w-full py-1.5 px-2 rounded-full font-bold text-center uppercase tracking-wider shadow-xs transition-all"
              style={{
                background: `${badgeTextColor || color}12`,
                color: badgeTextColor || color,
                border: `1px solid ${badgeTextColor || color}40`,
                fontSize: `${Math.round((badgeTextSize || 45) * 0.19)}px`,
              }}
            >
              {badgeText || "SCAN QR CODE TO OPEN"}
            </div>

            {/* Short note */}
            {cardNote && (
              <p
                className="font-medium italic font-serif opacity-90 px-2 line-clamp-2 leading-tight my-0.5 transition-all"
                style={{ color: noteColor || color, fontSize: `${Math.round((noteSize || 48) * 0.21)}px` }}
              >
                &ldquo;{cardNote}&rdquo;
              </p>
            )}

            {/* Footer social */}
            <div className="flex flex-col items-center gap-0.5 mt-0.5">
              {cardWeb && (
                <div className="flex items-center justify-center gap-1 opacity-90" style={{ color }}>
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z" />
                  </svg>
                  <span className="text-[7.5px] font-bold uppercase tracking-widest">: {cardWeb.replace(/^https?:\/\//i, "").trim()}</span>
                </div>
              )}
              {(cardIg || cardTiktok) && (
                <div className="flex items-center justify-center gap-2 opacity-75 mt-0.5" style={{ color }}>
                  {cardIg && (
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                      <span className="text-[7px] font-bold uppercase tracking-wider">: {cardIg.replace(/^@/, "").trim()}</span>
                    </div>
                  )}
                  {cardIg && cardTiktok && <span className="text-[7px] opacity-40">•</span>}
                  {cardTiktok && (
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.901 2.846 2.894 2.894 0 0 1-2.894-2.894 2.894 2.894 0 0 1 2.894-2.894c.244 0 .478.031.704.086V9.28a6.34 6.34 0 0 0-.704-.039 6.339 6.339 0 0 0-6.339 6.339 6.339 6.339 0 0 0 6.339 6.339 6.339 6.339 0 0 0 6.339-6.339V9.01a8.163 8.163 0 0 0 4.777 1.518V7.08a4.826 4.826 0 0 1-1.004-.394z" />
                      </svg>
                      <span className="text-[7px] font-bold uppercase tracking-wider">: {cardTiktok.replace(/^@/, "").trim()}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Download Button ── */}
      <button
        onClick={handleDownload}
        className="w-full max-w-md py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
        style={{ background: `linear-gradient(135deg, ${color}dd, ${color})`, boxShadow: `0 6px 20px ${color}40` }}
      >
        🖼️ Download Gift Card (300 DPI)
      </button>
    </div>
  );
}
