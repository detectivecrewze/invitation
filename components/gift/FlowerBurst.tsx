"use client";

import { useEffect, useRef } from "react";

interface Props {
  recipientName?: string;
  senderName?: string;
  /** ~3400ms: switch page phase while burst covers screen */
  onSwitchState: () => void;
  /** ~14300ms: all petals fallen, overlay faded → remove */
  onDone: () => void;
}

const FLOWER_SRCS = [
  "/assets/flower_daisy-removebg-preview copy.png",
  "/assets/flower_rose-removebg-preview.png",
  "/assets/flower_peony-removebg-preview.png",
  "/assets/flower_tulip-removebg-preview.png",
  "/assets/flower_hydrangea-removebg-preview.png",
];

export default function FlowerBurst({ recipientName, senderName, onSwitchState, onDone }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const el = containerRef.current;
    if (!el) return;

    // ── Keyframes ─────────────────────────────────────────────────────────
    if (!document.getElementById("_fi-kf")) {
      const s = document.createElement("style");
      s.id = "_fi-kf";
      s.textContent = `
        @keyframes _fi-cw  { to { transform: rotate(360deg);  } }
        @keyframes _fi-ccw { to { transform: rotate(-360deg); } }
      `;
      document.head.appendChild(s);
    }

    const W  = window.innerWidth;
    const H  = window.innerHeight;
    const cx = W / 2;
    const cy = H / 2;

    // ════════════════════════════════════════════════════════════════════════
    // TIMINGS
    // ════════════════════════════════════════════════════════════════════════
    const SETTLE_MS       = 3600;
    const VORTEX_MS       = 4000;
    const HEART_MS        = 6000;
    const HEART_STAY      = 4500;
    const TEXT_MS         = 6500;
    const TEXT_OUT_MS     = 9900;

    // Petal waterfall starts after heart+name have been visible for ~2s
    const WATERFALL_START = HEART_MS + 2000;        // 8000ms — heart+name clearly visible first
    const WATERFALL_SPAN  = 1600;                   // petals spawn over 1.6 seconds
    const MAX_FALL_DUR    = 2800;                   // max individual petal fall duration
    const BG_FADE_START   = WATERFALL_START + WATERFALL_SPAN + MAX_FALL_DUR; // ~12400ms
    const BG_FADE_DUR     = 1200;
    const RESOLVE_MS      = BG_FADE_START + BG_FADE_DUR + 300;              // ~15500ms

    // Preload
    FLOWER_SRCS.forEach(src => { const i = new Image(); i.src = src; });

    // ── Seeded RNG ────────────────────────────────────────────────────────
    let seed = 42;
    const rng = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

    const mkImg = (src: string, spin: string, speed: string) => {
      const img = document.createElement("img");
      img.src = src; img.decoding = "async"; img.draggable = false;
      img.style.cssText = `width:100%;height:100%;display:block;animation:${spin} ${speed}s linear infinite;will-change:transform;`;
      return img;
    };
    const mkDiv = (css: string) => {
      const d = document.createElement("div"); d.style.cssText = css; return d;
    };

    // ════════════════════════════════════════════════════════════════════════
    // 1. BURST ── 300 flowers from center
    // ════════════════════════════════════════════════════════════════════════
    interface P { i:number; xEnd:number; yPeak:number; yFinal:number; size:number; finalScale:number; rotateDir:number; rotateSpeed:string; delay:number; duration:number; }
    const pts: P[] = [];
    const isMobile = window.innerWidth < 768;
    const burstScale = isMobile ? 0.90 : 1;

    for (let i = 0; i < 300; i++) {
      const frac = i / 300;
      const aRad = ((-90 + (frac - 0.5) * 240 + (rng() - 0.5) * 18) * Math.PI) / 180;
      const pull = 1 + Math.abs(frac - 0.5) * 1.8;
      const dist = 350 + rng() * 650;
      pts.push({
        i, xEnd: Math.cos(aRad)*dist*pull+(rng()-.5)*100,
        yPeak: Math.sin(aRad)*dist-50-rng()*150,
        yFinal: Math.sin(aRad)*dist-50-rng()*150+400+rng()*650,
        size: (140+rng()*140) * burstScale, finalScale: 1+rng()*.6,
        rotateDir: rng()>.5?1:-1, rotateSpeed: (6+rng()*10).toFixed(2),
        delay: frac*1.6+rng()*.15, duration: 2+rng()*1.6,
      });
    }

    const burstEls = pts.map(p => {
      const half = p.size / 2;
      const w = mkDiv(`position:absolute;width:${p.size}px;height:${p.size}px;left:${cx-half}px;top:${cy-half}px;opacity:0;transform:translate(0,0) scale(.12);will-change:transform,opacity;pointer-events:none;`);
      w.appendChild(mkImg(FLOWER_SRCS[p.i % FLOWER_SRCS.length], p.rotateDir>0?"_fi-cw":"_fi-ccw", p.rotateSpeed));
      el.appendChild(w);
      return { w, p };
    });

    burstEls.forEach(({ w, p }) => {
      w.animate([
        { transform:`translate(0,0) scale(.12)`, opacity:0 },
        { transform:`translate(${p.xEnd*.4}px,${p.yPeak}px) scale(.85)`, opacity:1, offset:.38 },
        { transform:`translate(${p.xEnd}px,${p.yFinal}px) scale(${p.finalScale})`, opacity:1 },
      ], { duration:p.duration*1000, delay:p.delay*1000, easing:"ease-out", fill:"both" });
    });

    // Switch page state (card renders hidden behind solid overlay)
    setTimeout(() => onSwitchState(), SETTLE_MS - 200);

    // ════════════════════════════════════════════════════════════════════════
    // 2. VORTEX
    // ════════════════════════════════════════════════════════════════════════
    setTimeout(() => {
      burstEls.forEach(({ w, p }) => {
        const sa = Math.atan2(p.yFinal, p.xEnd) + Math.PI/2;
        const vx = p.xEnd+Math.cos(sa)*2500+(Math.random()-.5)*500;
        const vy = p.yFinal+Math.sin(sa)*2500+(Math.random()-.5)*500;
        const stagger = Math.random()*400;
        setTimeout(() => {
          w.animate([
            { transform:`translate(${p.xEnd}px,${p.yFinal}px) scale(${p.finalScale}) rotate(0deg)` },
            { transform:`translate(${vx}px,${vy}px) scale(${p.finalScale}) rotate(360deg)` },
          ], { duration:1000+Math.random()*600, easing:"cubic-bezier(.55,.085,.68,.53)", fill:"both" });
        }, stagger);
      });
    }, VORTEX_MS);

    // ════════════════════════════════════════════════════════════════════════
    // 3. NAME CARD
    // ════════════════════════════════════════════════════════════════════════
    setTimeout(() => {
      const to   = (recipientName || "").trim();
      const from = (senderName   || "").trim();
      if (!to && !from) return;

      const S  = Math.min(13, W*.028);
      const hy = cy + 2.35*S - 30;

      const card = mkDiv(`position:absolute;top:${hy}px;left:${cx}px;transform:translate(-50%,calc(-50% + 15px));z-index:300;text-align:center;pointer-events:none;opacity:0;filter:blur(4px);transition:opacity 1500ms ease,transform 1500ms cubic-bezier(.2,.8,.2,1),filter 1500ms ease;display:flex;flex-direction:column;align-items:center;width:60%;max-width:300px;`);
      const iS = `font-family:'Georgia',serif;font-style:italic;letter-spacing:.12em;font-size:clamp(12px,1.8vw,15px);color:rgba(90,55,30,.85);display:block;margin-bottom:6px;`;
      const nS = `font-family:'Georgia',serif;letter-spacing:.15em;text-transform:uppercase;font-size:clamp(15px,1.5vw,18px);color:rgba(50,30,15,.95);font-weight:700;display:block;text-shadow:0 2px 12px rgba(255,255,255,.9),0 1px 3px rgba(255,255,255,1);word-wrap:break-word;`;
      const dS = `width:32px;height:1px;background:rgba(100,60,20,.3);margin:0 auto 16px;display:block;`;

      card.innerHTML = `
        ${from ? `<span style="${iS}">Invitation From</span><span style="${nS}margin-bottom:16px;">${from}</span>` : ""}
        <span style="${dS}"></span>
        ${to   ? `<span style="${iS}">For</span><span style="${nS}">${to}</span>` : ""}
      `;
      el.appendChild(card);

      requestAnimationFrame(() => requestAnimationFrame(() => {
        card.style.opacity="1"; card.style.filter="blur(0)"; card.style.transform="translate(-50%,-50%)";
      }));

      setTimeout(() => {
        card.style.opacity="0"; card.style.filter="blur(4px)"; card.style.transform="translate(-50%,-60%)";
        setTimeout(() => card.remove(), 1500);
      }, TEXT_OUT_MS - TEXT_MS);
    }, TEXT_MS);

    // ════════════════════════════════════════════════════════════════════════
    // 4. HEART FORMATION  (z-index 200, above petals)
    // ════════════════════════════════════════════════════════════════════════
    setTimeout(() => {
      const hw = mkDiv("position:absolute;width:100%;height:100%;top:0;left:0;pointer-events:none;z-index:200;");
      el.appendChild(hw);

      const SAMP=2000; const raw:{x:number;y:number}[]=[];
      for(let i=0;i<SAMP;i++){const t=(i/SAMP)*Math.PI*2;raw.push({x:16*Math.pow(Math.sin(t),3),y:-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))});}
      const arc=[0];for(let i=1;i<SAMP;i++){const dx=raw[i].x-raw[i-1].x,dy=raw[i].y-raw[i-1].y;arc.push(arc[i-1]+Math.sqrt(dx*dx+dy*dy));}
      const tot=arc[SAMP-1];

      const HC=54, FSZ=Math.min(46,W*.1), HS=Math.min(13,W*.028);
      const hEls:HTMLDivElement[]=[];
      let si=0;

      for(let i=0;i<HC;i++){
        const tl=(i/HC)*tot;
        while(si<SAMP-1&&arc[si+1]<tl)si++;
        const pt=raw[si];
        const px=cx+pt.x*HS, py=cy+pt.y*HS-30;
        const d=mkDiv(`position:absolute;width:${FSZ}px;height:${FSZ}px;left:${px-FSZ/2}px;top:${py-FSZ/2}px;opacity:0;transform:scale(.1);will-change:transform,opacity;`);
        d.appendChild(mkImg(FLOWER_SRCS[i % FLOWER_SRCS.length],i%2===0?"_fi-cw":"_fi-ccw",(4+(i%3)*2).toFixed(2)));
        hw.appendChild(d); hEls.push(d);
        setTimeout(()=>d.animate([{transform:"scale(0) rotate(-30deg)",opacity:0},{transform:"scale(1.25) rotate(5deg)",opacity:1,offset:.65},{transform:"scale(1) rotate(0)",opacity:1}],{duration:550,easing:"cubic-bezier(.34,1.56,.64,1)",fill:"both"}),(i/HC)*600);
      }

      setTimeout(()=>hEls.forEach(d=>d.animate([{transform:"scale(1)"},{transform:"scale(1.08)"},{transform:"scale(1)"}],{duration:900,easing:"ease-in-out",iterations:3})),700);
      setTimeout(()=>hEls.forEach((d,i)=>setTimeout(()=>d.animate([{transform:"scale(1)",opacity:1},{transform:"scale(.3) rotate(20deg)",opacity:0}],{duration:400,easing:"ease-in",fill:"both"}),(i/HC)*300)),HEART_STAY);
    }, HEART_MS);

    // ════════════════════════════════════════════════════════════════════════
    // 5. PETAL WATERFALL ── starts AFTER heart + name done (10500ms)
    //    Petals rain from top at z-index 500, covering heart (200) + name (300)
    //    After all petals clear the screen → overlay bg fades → card revealed
    // ════════════════════════════════════════════════════════════════════════
    setTimeout(() => {
      const PETAL_COUNT = 300;

      for (let i = 0; i < PETAL_COUNT; i++) {
        const sz       = 90 + Math.random() * 110;        // 90–200px (slightly bigger)
        const startX   = Math.random() * (W + sz) - sz/2; // full width coverage
        const fallDist = H + sz * 2.2;                    // distance to fall off bottom
        const drift    = (Math.random() - 0.5) * 220;     // gentle left/right sway
        const fallDur  = 2500 + Math.random() * (MAX_FALL_DUR - 2500); // 2.5–3.5s
        const stagger  = Math.random() * WATERFALL_SPAN;  // 0–1.5s stagger (fast burst)
        const swayMid  = drift * 0.4;

        const petal = mkDiv(`
          position:absolute;
          left:${startX}px;
          top:${-sz}px;
          width:${sz}px;height:${sz}px;
          pointer-events:none;
          z-index:500;
          will-change:transform,opacity;
        `);

        const spin    = Math.random() > 0.5 ? "_fi-cw" : "_fi-ccw";
        const spinSpd = (2.5 + Math.random() * 4.5).toFixed(1);
        petal.appendChild(mkImg(FLOWER_SRCS[i % FLOWER_SRCS.length], spin, spinSpd));
        el.appendChild(petal);

        petal.animate(
          [
            { transform: `translateY(0px) translateX(0px)`,                          opacity: 0 },
            { transform: `translateY(${fallDist*.06}px) translateX(${drift*.2}px)`,  opacity: 1,   offset: 0.06 },
            { transform: `translateY(${fallDist*.5}px) translateX(${swayMid}px)`,   opacity: 1,   offset: 0.5  },
            { transform: `translateY(${fallDist*.9}px) translateX(${drift}px)`,     opacity: 0.8, offset: 0.9  },
            { transform: `translateY(${fallDist}px) translateX(${drift}px)`,        opacity: 0 },
          ],
          {
            duration: fallDur,
            delay:    stagger,
            easing:   "ease-in",
            fill:     "both",
          }
        );
      }

      // After last petal clears screen → fade overlay → card revealed
      setTimeout(() => {
        el.animate(
          [
            { background: "rgba(255,245,246,1)" },
            { background: "rgba(255,245,246,0)" },
          ],
          { duration: BG_FADE_DUR, easing: "ease-out", fill: "both" }
        );
      }, WATERFALL_SPAN + MAX_FALL_DUR);

    }, WATERFALL_START);

    // ── Cleanup ───────────────────────────────────────────────────────────
    setTimeout(() => { el.innerHTML = ""; onDone(); }, RESOLVE_MS);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 9998, background: "rgba(255,245,246,1)" }}
    />
  );
}
