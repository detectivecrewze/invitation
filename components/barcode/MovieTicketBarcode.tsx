"use client";

/**
 * MovieTicketBarcode — Cinema Premiere Ticket Stub (Landscape 16:9).
 * Preserves user casing (no uppercase force) and offers prominent title sizing.
 */

import HeartQRCode from "@/components/ui/HeartQRCode";
import { useRef } from "react";
import type { MovieTicketProps } from "./types";
import { downloadMovieTicket } from "./download-movie";

export default function MovieTicketBarcode(props: MovieTicketProps) {
  const {
    barcodeUrl, barcodeColor, cardBgColor, barcodeName,
    frontTitle, frontTitleColor, frontTitleSize,
    nameColor, nameSize,
    badgeText, badgeTextColor, badgeTextSize,
    cardNote, noteColor, noteSize,
    cardWeb, cardIg, cardTiktok,
  } = props;

  const qrWrapRef = useRef<HTMLDivElement>(null);
  const color = barcodeColor || "#e8789a";
  const bg = cardBgColor || "#faf6ec";

  const handleDownload = () => downloadMovieTicket({ ...props, qrWrapRef });

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* ── Live Preview: Landscape Cinema Ticket Stub ── */}
      <div
        className="relative w-full max-w-[450px] rounded-3xl overflow-hidden shadow-2xl transition-all border-2"
        style={{
          aspectRatio: "16/8.8",
          background: bg,
          borderColor: `${color}40`,
          boxShadow: `0 20px 40px -10px ${color}25, 0 0 30px ${color}10 inset`,
        }}
      >
        {/* Top/Bottom Stub Perforation Notches */}
        {props.showPerforation !== false && (
          <>
            <div className="absolute top-0 left-[67%] -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-gray-200 z-20 shadow-xs" />
            <div className="absolute bottom-0 left-[67%] -translate-x-1/2 translate-y-1/2 w-6 h-6 rounded-full bg-white border border-gray-200 z-20 shadow-xs" />
          </>
        )}

        {/* Content Container */}
        <div className="relative z-10 flex h-full w-full">
          {/* ── Left Ticket Body (67% width) ── */}
          <div
            className="w-[67%] p-4 flex flex-col justify-between h-full"
            style={{
              borderRight: props.showPerforation !== false ? `2px dashed ${color}35` : `1px solid ${color}15`,
            }}
          >
            {/* Top Film Header & Title */}
            <div>
              <div className="flex items-center gap-1.5 opacity-90 pb-1.5 border-b-2" style={{ borderColor: `${frontTitleColor || color}40` }}>
                {/* SVG Film Clapper Icon */}
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke={frontTitleColor || color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 8h20" />
                  <path d="M6 4l2 4" />
                  <path d="M12 4l2 4" />
                  <path d="M18 4l2 4" />
                </svg>
                <span className="text-[8.5px] font-black uppercase tracking-[0.22em]" style={{ color: frontTitleColor || color }}>
                  CINEMA ADMIT ONE
                </span>
              </div>

              <h2
                className="font-black tracking-wide leading-tight transition-all line-clamp-2 mt-2"
                style={{
                  color: frontTitleColor || color,
                  fontSize: `${Math.round((frontTitleSize || 46) * 0.38)}px`,
                }}
              >
                {frontTitle || "Something Special For u"}
              </h2>
            </div>

            {/* Recipient & Quote */}
            <div className="my-auto py-1 space-y-2">
              {barcodeName && (
                <div>
                  <span className="text-[7.5px] font-extrabold uppercase tracking-widest block opacity-50 mb-1" style={{ color: nameColor || color }}>
                    FOR / PENERIMA
                  </span>
                  <p
                    className="font-bold tracking-wide transition-all leading-tight mt-1"
                    style={{
                      color: nameColor || color,
                      fontFamily: "var(--font-caveat)",
                      fontSize: `${Math.round((nameSize || 105) * 0.22)}px`,
                    }}
                  >
                    {barcodeName}
                  </p>
                </div>
              )}

              {cardNote && (
                <p
                  className="font-medium italic font-serif opacity-90 line-clamp-2 leading-tight"
                  style={{
                    color: noteColor || color,
                    fontSize: `${Math.round((noteSize || 48) * 0.20)}px`,
                  }}
                >
                  &ldquo;{cardNote}&rdquo;
                </p>
              )}
            </div>

            {/* Footer handles */}
            {(cardWeb || cardIg || cardTiktok) && (
              <div className="flex items-center gap-2 text-[7.5px] font-bold uppercase tracking-wider opacity-85 border-t-2 pt-1.5" style={{ borderColor: `${color}35`, color }}>
                {cardWeb && <span>{cardWeb.replace(/^https?:\/\//i, "").trim()}</span>}
                {cardIg && <span>@{cardIg.replace(/^@/, "").trim()}</span>}
              </div>
            )}
          </div>

          {/* ── Right Ticket Stub (33% width) ── */}
          <div className="w-[33%] p-3 flex flex-col items-center justify-between h-full bg-black/5">
            <span className="text-[7.5px] font-black uppercase tracking-widest text-center opacity-70 mt-0.5" style={{ color }}>
              TICKET STUB
            </span>

            {/* HERO HEART BARCODE */}
            <div ref={qrWrapRef} className="my-auto flex items-center justify-center">
              <HeartQRCode url={barcodeUrl} color={color} bgColor={bg} size={135} />
            </div>

            {/* Badge pill */}
            <div
              className="w-full py-1 px-1 rounded-full font-bold text-center uppercase tracking-wider truncate transition-all shadow-xs"
              style={{
                background: `${badgeTextColor || color}20`,
                color: badgeTextColor || color,
                border: `1px solid ${badgeTextColor || color}40`,
                fontSize: `${Math.round((badgeTextSize || 45) * 0.16)}px`,
              }}
            >
              {badgeText || "SCAN TO OPEN"}
            </div>
          </div>
        </div>
      </div>

      {/* ── High Res Download Button ── */}
      <button
        onClick={handleDownload}
        className="w-full max-w-md py-3.5 rounded-2xl font-bold text-sm text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)`, boxShadow: `0 8px 25px ${color}40` }}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 8h20" />
          <path d="M6 4l2 4" />
          <path d="M12 4l2 4" />
        </svg>
        Download Movie Ticket (300 DPI)
      </button>
    </div>
  );
}
