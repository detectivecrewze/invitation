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

    // ── Timings (Matching smooth FlowerBurst physics) ─────────────────────────
    const WREATH_FORM_MS = 2300;     // 36 flowers * 60ms = ~2.2s full ring bloom
    const TEXT_IN_MS = 2350;         // Name Crest fades in after wreath completes
    const TEXT_STAY_MS = 2600;       // Name stays visible for 2.6s
    const WATERFALL_START_MS = TEXT_IN_MS + TEXT_STAY_MS; // ~4950ms Stage 2 Petal Waterfall
    const WATERFALL_SPAN = 1500;     // Petals spawn over 1.5s
    const MAX_FALL_DUR = 2800;       // Individual petal float duration (2.4s - 3.4s)
    const BG_FADE_DUR = 1200;        // Smooth overlay fade to reveal card
    const DONE_MS = WATERFALL_START_MS + WATERFALL_SPAN + MAX_FALL_DUR + BG_FADE_DUR + 200; // ~10650ms total

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
    safeTimeout(() => {
      if (!isMounted) return;
      const to = (recipientName || "").trim();
      const from = (senderName || "").trim();
      if (!to && !from) return;

      const crest = mkDiv(`
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
        if (!isMounted) return;
        requestAnimationFrame(() => {
          if (!isMounted) return;
          crest.style.opacity = "1";
          crest.style.filter = "blur(0px)";
          crest.style.transform = "translate(-50%, -50%) scale(1)";
        });
      });

      // Fade out crest before Stage 2
      safeTimeout(() => {
        if (!isMounted) return;
        crest.style.opacity = "0";
        crest.style.filter = "blur(4px)";
        crest.style.transform = "translate(-50%, -50%) scale(0.95)";
        safeTimeout(() => crest.remove(), 800);
      }, TEXT_STAY_MS);
    }, TEXT_IN_MS);

    // ── STAGE 2: Petal Waterfall Rain (Butter-smooth FlowerBurst physics) ────
    safeTimeout(() => {
      if (!isMounted) return;

      // 1. Gradually fade out Stage 1 Wreath Ring flowers under falling rain
      wreathEls.forEach(({ el: pEl, angle }, i) => {
        safeTimeout(() => {
          if (!isMounted) return;
          pEl.animate(
            [
              { transform: `scale(1.0) rotate(${angle * (180 / Math.PI)}deg)`, opacity: 1 },
              { transform: `scale(0.3) rotate(${(angle + 0.3) * (180 / Math.PI)}deg)`, opacity: 0 },
            ],
            {
              duration: 1000,
              easing: "ease-in-out",
              fill: "both",
            }
          );
        }, (i / WREATH_COUNT) * 500);
      });

      // 2. Spawn Smooth Floating Petal Waterfall Rain (140 mobile / 180 desktop)
      const PETAL_COUNT = isMobile ? 140 : 180;

      for (let i = 0; i < PETAL_COUNT; i++) {
        const sz = 85 + Math.random() * 95;
        const startX = Math.random() * (W + sz) - sz / 2;
        const fallDist = H + sz * 2.2;
        const drift = (Math.random() - 0.5) * 200;
        const fallDur = 2400 + Math.random() * (MAX_FALL_DUR - 2400); // 2.4s - 3.4s graceful fall
        const stagger = Math.random() * WATERFALL_SPAN;
        const swayMid = drift * 0.4;

        const petal = mkDiv(`
          position: absolute;
          left: ${startX}px;
          top: ${-sz}px;
          width: ${sz}px;
          height: ${sz}px;
          pointer-events: none;
          z-index: 600;
          will-change: transform, opacity;
        `);

        const spin = Math.random() > 0.5 ? "_rv-cw" : "_rv-ccw";
        const spinSpd = (2.5 + Math.random() * 4.5).toFixed(1);
        petal.appendChild(mkImg(FLOWER_SRCS[i % FLOWER_SRCS.length], spin, spinSpd));
        el.appendChild(petal);

        petal.animate(
          [
            { transform: `translateY(0px) translateX(0px)`, opacity: 0 },
            { transform: `translateY(${fallDist * 0.06}px) translateX(${drift * 0.2}px)`, opacity: 1, offset: 0.06 },
            { transform: `translateY(${fallDist * 0.5}px) translateX(${swayMid}px)`, opacity: 1, offset: 0.5 },
            { transform: `translateY(${fallDist * 0.9}px) translateX(${drift}px)`, opacity: 0.85, offset: 0.9 },
            { transform: `translateY(${fallDist}px) translateX(${drift}px)`, opacity: 0 },
          ],
          {
            duration: fallDur,
            delay: stagger,
            easing: "ease-in",
            fill: "both",
          }
        );
      }

      // 3. Switch card phase & fade solid overlay IMMEDIATELY as petals start raining down
      safeTimeout(() => {
        if (!isMounted) return;
        onSwitchState();
        el.animate(
          [
            { backgroundColor: theme.bg },
            { backgroundColor: "transparent" },
          ],
          { duration: 1000, easing: "ease-out", fill: "both" }
        );
      }, 150);

    }, WATERFALL_START_MS);

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
