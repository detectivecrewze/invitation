"use client";

import { useEffect, useRef } from "react";

interface Props {
  recipientName?: string;
  senderName?: string;
  invitationTitle?: string;
  theme: { bg: string; card: string; accent: string; text: string };
  onSwitchState: () => void;
  onDone: () => void;
}

const FLOWER_SRCS = [
  "/assets/flower_daisy-removebg-preview copy.png",
  "/assets/flower_rose-removebg-preview.png",
  "/assets/flower_peony-removebg-preview.png",
  "/assets/flower_yellow-removebg-preview.webp",
  "/assets/flower_hydrangea-removebg-preview.png",
];

export default function RundownVortexBurst({
  recipientName,
  senderName,
  invitationTitle = "A Special Invitation For",
  theme,
  onSwitchState,
  onDone,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.innerHTML = "";

    let isMounted = true;
    const timers: (number | NodeJS.Timeout)[] = [];
    const safeTimeout = (fn: () => void, ms: number) => {
      const tid = setTimeout(() => {
        if (isMounted) fn();
      }, ms);
      timers.push(tid);
      return tid;
    };

    // Keyframe animations for continuous flower spin
    if (!document.getElementById("_rv-kf")) {
      const s = document.createElement("style");
      s.id = "_rv-kf";
      s.textContent = `
        @keyframes _rv-cw { to { transform: rotate(360deg); } }
        @keyframes _rv-ccw { to { transform: rotate(-360deg); } }
      `;
      document.head.appendChild(s);
    }

    const W = window.innerWidth;
    const H = window.innerHeight;
    const cx = W / 2;
    const cy = H / 2;
    const isMobile = W < 640;

    // ── Timings ─────────────────────────────────────────────────────────────
    const WREATH_FORM_MS = 2200;     // 36 flowers * 60ms = ~2.2s full ring bloom
    const TEXT_IN_MS = 2250;         // Name Crest fades in after wreath completes
    const TEXT_STAY_MS = 2400;       // Name stays visible for 2.4s
    const FADE_OUT_START_MS = TEXT_IN_MS + TEXT_STAY_MS; // ~4650ms Fade Out Begins
    const FADE_DUR = 800;            // Smooth 800ms fade out to reveal card
    const DONE_MS = FADE_OUT_START_MS + FADE_DUR + 100; // ~5550ms total

    // Preload flowers
    FLOWER_SRCS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const mkDiv = (css: string) => {
      const d = document.createElement("div");
      d.style.cssText = css;
      return d;
    };

    const mkImg = (src: string, spin: string, speed: string) => {
      const img = document.createElement("img");
      img.src = src;
      img.decoding = "async";
      img.draggable = false;
      img.style.cssText = `width:100%;height:100%;display:block;animation:${spin} ${speed}s linear infinite;will-change:transform;`;
      return img;
    };

    // ── STAGE 1: Symmetrical Botanical Wreath Ring (36 Lush Blooms) ─────────
    const WREATH_COUNT = 36;
    const radiusX = isMobile ? Math.min(W * 0.42, 175) : Math.min(W * 0.28, 260);
    const radiusY = isMobile ? Math.min(H * 0.32, 220) : Math.min(H * 0.32, 280);

    const wreathEls: { el: HTMLDivElement; angle: number; size: number }[] = [];

    for (let i = 0; i < WREATH_COUNT; i++) {
      const angle = (i / WREATH_COUNT) * Math.PI * 2;
      const size = isMobile ? 75 + Math.random() * 30 : 130 + Math.random() * 55;

      const px = cx + Math.cos(angle) * radiusX - size / 2;
      const py = cy + Math.sin(angle) * radiusY - size / 2;

      const pDiv = mkDiv(`
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${px}px;
        top: ${py}px;
        opacity: 0;
        transform: scale(0.2) rotate(${angle * (180 / Math.PI)}deg);
        pointer-events: none;
        will-change: transform, opacity;
        z-index: 100;
        filter: drop-shadow(0 8px 16px ${theme.accent}25);
      `);

      const spinDir = i % 2 === 0 ? "_rv-cw" : "_rv-ccw";
      const spinSpeed = (5 + Math.random() * 5).toFixed(1);
      pDiv.appendChild(mkImg(FLOWER_SRCS[i % FLOWER_SRCS.length], spinDir, spinSpeed));
      el.appendChild(pDiv);

      wreathEls.push({ el: pDiv, angle, size });
    }

    // Animate Wreath Ring Flowers Blooming ONE BY ONE Sequentially
    const STAGGER_PER_FLOWER = 60;
    wreathEls.forEach(({ el: pEl, angle }, i) => {
      const delay = i * STAGGER_PER_FLOWER;
      const duration = 550;

      pEl.animate(
        [
          { transform: `scale(0) rotate(${(angle - 0.6) * (180 / Math.PI)}deg)`, opacity: 0 },
          { transform: `scale(1.25) rotate(${(angle + 0.1) * (180 / Math.PI)}deg)`, opacity: 1, offset: 0.65 },
          { transform: `scale(1.0) rotate(${angle * (180 / Math.PI)}deg)`, opacity: 1 },
        ],
        {
          duration,
          delay,
          easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
          fill: "both",
        }
      );
    });

    // ── Hero Recipient Name Typography ──────────────────────────────────────
    let crest: HTMLDivElement | null = null;

    safeTimeout(() => {
      if (!isMounted) return;
      const to = (recipientName || "").trim();
      const from = (senderName || "").trim();
      if (!to && !from) return;

      crest = mkDiv(`
        position: absolute;
        top: ${cy}px;
        left: ${cx}px;
        transform: translate(-50%, -50%) scale(0.95);
        z-index: 500;
        text-align: center;
        pointer-events: none;
        opacity: 0;
        filter: blur(6px);
        transition: opacity 800ms ease, transform 800ms cubic-bezier(.16, 1, 0.3, 1), filter 800ms ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: ${isMobile ? "75%" : "400px"};
        box-sizing: border-box;
      `);

      crest.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:2px;width:100%;">
          <div style="width:${isMobile ? "14px" : "24px"};height:1.5px;background:${theme.accent};"></div>
          <span style="font-family:var(--font-caveat),cursive;font-size:${isMobile ? "18px" : "26px"};font-weight:700;color:${theme.accent};letter-spacing:0.02em;white-space:nowrap;">
            A Special Invitation For
          </span>
          <div style="width:${isMobile ? "14px" : "24px"};height:1.5px;background:${theme.accent};"></div>
        </div>

        ${
          to
            ? `<h1 style="font-family:var(--font-caveat),cursive;font-size:${
                isMobile ? "46px" : "72px"
              };font-weight:700;color:${theme.text};line-height:1.05;margin:2px 0 4px;text-shadow:0 4px 20px ${theme.accent}40, 0 2px 4px rgba(255,255,255,0.95);word-break:break-word;">
                ${to}
               </h1>`
            : ""
        }

        ${
          from
            ? `<div style="width:36px;height:1.5px;background:linear-gradient(90deg, transparent, ${theme.accent}, transparent);margin:4px auto 4px;"></div>
               <span style="font-family:var(--font-caveat),cursive;font-size:${
                 isMobile ? "20px" : "28px"
               };font-weight:700;color:${theme.accent};">
                 From ${from}
               </span>`
            : ""
        }
      `;
      el.appendChild(crest);

      requestAnimationFrame(() => {
        if (!isMounted || !crest) return;
        requestAnimationFrame(() => {
          if (!isMounted || !crest) return;
          crest.style.opacity = "1";
          crest.style.filter = "blur(0px)";
          crest.style.transform = "translate(-50%, -50%) scale(1)";
        });
      });
    }, TEXT_IN_MS);

    // ── Smooth Fade Out to Reveal Card ──────────────────────────────────────
    safeTimeout(() => {
      if (!isMounted) return;

      // 1. Fade out Name Crest
      if (crest) {
        crest.style.opacity = "0";
        crest.style.filter = "blur(4px)";
        crest.style.transform = "translate(-50%, -50%) scale(0.95)";
      }

      // 2. Fade out Wreath Ring Flowers
      wreathEls.forEach(({ el: pEl, angle }, i) => {
        safeTimeout(() => {
          if (!isMounted) return;
          pEl.animate(
            [
              { transform: `scale(1.0) rotate(${angle * (180 / Math.PI)}deg)`, opacity: 1 },
              { transform: `scale(0.3) rotate(${(angle + 0.3) * (180 / Math.PI)}deg)`, opacity: 0 },
            ],
            {
              duration: FADE_DUR,
              easing: "ease-in-out",
              fill: "both",
            }
          );
        }, (i / WREATH_COUNT) * 200);
      });

      // 3. Switch Card Phase & Fade Solid Overlay
      onSwitchState();
      el.animate(
        [
          { backgroundColor: theme.bg },
          { backgroundColor: "transparent" },
        ],
        { duration: FADE_DUR, easing: "ease-out", fill: "both" }
      );
    }, FADE_OUT_START_MS);

    // ── Cleanup ────────────────────────────────────────────────────────────
    safeTimeout(() => {
      if (!isMounted) return;
      el.innerHTML = "";
      onDone();
    }, DONE_MS);

    return () => {
      isMounted = false;
      timers.forEach(clearTimeout);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 9998, backgroundColor: theme.bg }}
    />
  );
}
