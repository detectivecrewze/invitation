"use client";

/**
 * ConcertTicketBarcode — VIP Festival Pass Lanyard layout.
 * Lanyard hole slot, SVG music icon, hero Heart QR code, and VIP barcode footer.
 */

import HeartQRCode from "@/components/ui/HeartQRCode";
import { useRef } from "react";
import type { ConcertTicketProps } from "./types";
import { downloadConcertTicket } from "./download-concert";

export default function ConcertTicketBarcode(props: ConcertTicketProps) {
  const {
    barcodeUrl, barcodeColor, cardBgColor, barcodeName,
    frontTitle, frontTitleColor, frontTitleSize,
    nameColor, nameSize,
    badgeText, badgeTextColor, badgeTextSize,
    cardNote, noteColor, noteSize,
    cardWeb, cardIg, cardTiktok,
  } = props;

  const qrWrapRef = useRef<HTMLDivElement>(null);
  const color = barcodeColor || "#7b68ee";
  const bg = cardBgColor || "#0c0a17";
  const hasFooter = Boolean(cardWeb.trim() || cardIg.trim() || cardTiktok.trim());

  const handleDownload = () => downloadConcertTicket({ ...props, qrWrapRef });

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* ── Live Preview (VIP Festival Lanyard Pass) ── */}
      <div
        className="relative w-full max-w-[290px] mx-auto rounded-[32px] p-5 shadow-2xl flex flex-col justify-between overflow-hidden transition-all border-2"
        style={{
          aspectRatio: "9/19",
          background: bg,
          borderColor: `${color}40`,
          boxShadow: `0 25px 50px -10px ${color}35, 0 0 35px ${color}15 inset`,
        }}
      >
        {/* Lanyard Punch Hole Slot */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-12 h-2.5 rounded-full bg-white/20 border border-white/30 shadow-inner z-20" />

        {/* Glowing aura overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{ background: `radial-gradient(ellipse at 50% 30%, ${color}35 0%, transparent 70%)` }}
        />

        {/* Top Header Title */}
        <div className="relative z-10 flex flex-col items-center text-center pt-3">
          <div className="flex items-center gap-1 mb-1">
            {/* SVG Music Note Icon */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke={frontTitleColor || color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            <span
              className="font-black uppercase tracking-[0.24em] block transition-all"
              style={{ color: frontTitleColor || color, fontSize: `${Math.round((frontTitleSize || 46) * 0.18)}px` }}
            >
              VIP FESTIVAL PASS
            </span>
          </div>

          <h2
            className="font-black uppercase tracking-wider leading-tight text-[11px] line-clamp-2 px-2"
            style={{ color: frontTitleColor || color }}
          >
            {frontTitle || "SOMETHING SPECIAL FOR U"}
          </h2>

          <div className="w-16 h-[1px] my-1.5 opacity-40" style={{ background: frontTitleColor || color }} />
        </div>

        {/* CENTER HERO HEART BARCODE */}
        <div ref={qrWrapRef} className="relative z-10 flex flex-col items-center justify-center my-auto">
          <HeartQRCode url={barcodeUrl} color={color} bgColor={bg} size={165} />
        </div>

        {/* Lower Content: Recipient Name, Badge, Short Note & Socials */}
        <div className={`relative z-10 text-center w-full flex flex-col items-center gap-1 transition-all ${hasFooter ? "pb-0.5" : "pb-2 my-auto"}`}>
          {barcodeName && (
            <div className="flex items-center justify-center gap-2 w-full">
              <span className="w-6 h-[1px] opacity-30" style={{ background: nameColor || color }} />
              <p
                className="font-bold tracking-wide -my-1 transition-all"
                style={{ color: nameColor || color, fontFamily: "var(--font-caveat)", fontSize: `${Math.round((nameSize || 105) * 0.22)}px` }}
              >
                {barcodeName}
              </p>
              <span className="w-6 h-[1px] opacity-30" style={{ background: nameColor || color }} />
            </div>
          )}

          {/* Badge pill */}
          <div
            className="w-full py-1.5 px-2 rounded-full font-bold text-center uppercase tracking-wider shadow-xs transition-all text-[8px]"
            style={{
              background: `${badgeTextColor || color}20`,
              color: badgeTextColor || color,
              border: `1px solid ${badgeTextColor || color}40`,
            }}
          >
            {badgeText || "SCAN QR CODE TO OPEN"}
          </div>

          {/* Short note */}
          {cardNote && (
            <p
              className="font-medium italic font-serif opacity-90 px-2 line-clamp-2 leading-tight my-0.5 transition-all text-[8.5px]"
              style={{ color: noteColor || color, fontSize: `${Math.round((noteSize || 48) * 0.19)}px` }}
            >
              &ldquo;{cardNote}&rdquo;
            </p>
          )}

          {/* Simulated Pass Barcode Lines */}
          <div className="flex justify-center items-center gap-0.5 opacity-40 my-0.5">
            {[4, 2, 6, 3, 2, 5, 2, 4, 3, 6, 2, 4, 3, 2, 5].map((h, i) => (
              <span key={i} className="w-[1.5px] rounded-full" style={{ height: `${h * 2}px`, background: color }} />
            ))}
          </div>

          {/* Footer handles */}
          {(cardWeb || cardIg || cardTiktok) && (
            <div className="flex flex-col items-center gap-0.5 opacity-75 text-[7px] font-bold uppercase tracking-wider" style={{ color }}>
              {cardWeb && <span>{cardWeb.replace(/^https?:\/\//i, "").trim()}</span>}
            </div>
          )}
        </div>
      </div>

      {/* ── High Res Download Button ── */}
      <button
        onClick={handleDownload}
        className="w-full max-w-md py-3.5 rounded-2xl font-bold text-sm text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)`, boxShadow: `0 8px 25px ${color}40` }}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
        Download Concert Ticket (300 DPI)
      </button>
    </div>
  );
}
