"use client";

import { motion } from "framer-motion";
import { DressCodeIconSvg, IconSparkle, IconCheck } from "@/components/ui/Icon";

interface Theme {
  bg: string;
  card: string;
  accent: string;
  text: string;
}

interface ReadOnlyDressCodeCardProps {
  dressCodes: string[];
  dressCodeIcons?: Record<string, string>;
  theme: Theme;
  onContinue: () => void;
}

// Hero illustration dari dress-code.svg (jas+dress)
function DressCodeHeroSVG({ color }: { color: string }) {
  return (
    <svg width="46" height="46" viewBox="-5.0 -10.0 110.0 135.0" fill={color}>
      <path d="m41.805 23.922c0.015624 1.0508-1.6367 1.0547-1.625 0l0.003906-11.73c-0.015625-1.0508 1.6367-1.0547 1.625 0zm27.906-15.238c-1.2383-0.070313-0.94141-1.8516 0.25781-1.625 1.2383 0.074218 0.94141 1.8555-0.25781 1.625zm28.164 3.5078c-0.019531-1.0312 1.6445-1.0703 1.625 0v47.316c0 2.8242-2.3125 5.1289-5.1328 5.1328h-44.883c-0.44531 0-0.8125-0.36328-0.8125-0.8125s0.36328-0.8125 0.8125-0.8125h44.879c1.9297 0 3.5078-1.5781 3.5078-3.5078z" fillRule="evenodd"/>
      <path d="m52.188 34.555c-0.6875-0.77734 0.54297-1.8672 1.2227-1.0586l14.668 16.875c1.0586 1.1484 2.4766 1.1562 3.5352-0.015625l26.262-30.215v-9.5469c0-0.95703-0.42188-1.6914-1.0742-2.2578-1.5117-1.4727-7.2148-2.6406-9.1875-3.4414-0.75-0.25391-1.543 0.007813-2.0469 0.60547-0.28906 0.49219-0.66797 1.0859-1.3242 0.77734-1.0742-0.60547-0.007813-1.8594 0.65625-2.3633 2.0156-1.9102 6.582 0.77734 9.5742 1.4492 2.5195 0.79297 5.0156 2.2734 5.0234 5.2266v9.8477c-0.003906 0.1875-0.066406 0.375-0.19922 0.52734l-26.539 30.531c-1.7031 1.8008-4.125 1.8398-5.8398 0 0.003906 0.003906-14.73-16.941-14.73-16.941zm25.496-13.121c-2.5078 3.8906-4.5547 6.9062-7.8398 10.289-2.75-2.875-5.7383-6.6523-8.1484-10.16-5.4375-2.1914 6.9922 11.414 7.5742 11.891 0.31641 0.3125 0.83203 0.3125 1.1445-0.003906 3.6797-3.6719 5.918-6.9297 8.6289-11.137 0.57812-0.86719-0.79297-1.7656-1.3594-0.87891zm-21.863-16.234c-0.71875-1.5586-2.6055-2.4141-4.2422-1.8516-2.3828 0.92188-7.8906 2.0156-9.7656 3.7656-0.99219 0.86328-1.6328 1.9922-1.6328 3.4805v9.8477c-0.10547 0.51172 2.1875 2.6758 2.4219 3.0859 0.67578 0.79688 1.918-0.26953 1.2227-1.0586l-2.0234-2.3242v-9.5469c0-0.95312 0.42578-1.6875 1.0742-2.2578 1.5234-1.4297 7.2031-2.6719 9.1875-3.4375 0.89062-0.3125 1.8945 0.15625 2.293 0.99219 0.42969 0.94922 1.9258 0.25 1.4648-0.69531z" fillRule="evenodd"/>
      <path d="m69.027 32.883c-0.015625-1.043 1.6367-1.0586 1.625 0v30.949c0.015625 1.043-1.6367 1.0586-1.625 0z" fillRule="evenodd"/>
      <path d="m60.363 22.477c-0.60156-0.85547 0.75391-1.7891 1.3359-0.91406 2.4062 3.5078 5.3906 7.2852 8.1406 10.164 3.2852-3.3828 5.332-6.3984 7.8398-10.289 5.2188-2.293-5.9414 10.996-7.2266 11.973-0.30469 0.35938-0.85938 0.38281-1.1914 0.046875-2.8906-2.9141-6.3438-7.25-8.8984-10.98zm24.797-16.922c0.007813 1.0469-1.625 1.0508-1.6172 0 0.19531-1.5977-0.38672-3.4258-2.2773-3.4297h-22.852c-1.2539 0-2.2734 1.0195-2.2773 2.2656 0.003906 0.65234 0.19141 1.9922-0.8125 1.9727-1.0156 0.019531-0.79688-1.3203-0.80859-1.9727 0.003906-2.1406 1.75-3.8906 3.8945-3.8906h22.855c2.7109-0.027344 4.2422 2.5586 3.8945 5.0547z" fillRule="evenodd"/>
      <path d="m64.488 19.367c0.92188-0.48828 1.6758 0.98828 0.73047 1.4453l-7.4883 3.7773c-2.8281 1.5352-6.5781 0.30469-8.0898-2.4609-1.3672-1.8516-0.55469-9.0859-0.76172-11.277-0.15625-4.4062 4.9883-7.5781 8.8516-5.4453l7.4883 3.7773c0.9375 0.46484 0.20312 1.9297-0.73047 1.4453l-7.4883-3.7773c-1.4375-0.72656-2.9961-0.66016-4.3672 0.18359-1.3672 0.84375-2.1289 2.2031-2.1289 3.8164v8.293c-0.082031 2.3672 1.9766 4.4102 4.2812 4.4961 1.6797 0.32031 8.1484-3.6797 9.7031-4.2734z" fillRule="evenodd"/>
      <path d="m74.461 20.812c-0.9375-0.46094-0.20313-1.9297 0.73047-1.4453l7.4844 3.7773c2.0938 1.1406 4.8555 0.21094 5.9688-1.8398 0.99219-1.3242 0.36719-8.8359 0.53125-10.453 0-0.80469-0.19141-1.5547-0.54688-2.1953-1.1211-2.0273-3.8711-2.9453-5.9492-1.8086l-7.4844 3.7773c-0.39844 0.20312-0.88672 0.039062-1.0859-0.35938-0.20312-0.39844-0.039063-0.88672 0.35938-1.0859l7.4844-3.7773c2.8281-1.5391 6.582-0.30078 8.0938 2.4609 1.3633 1.8516 0.55078 9.0898 0.75781 11.277 0 1.0664-0.25781 2.0664-0.73828 2.9453-1.4961 2.793-5.2734 4.043-8.1133 2.5z" fillRule="evenodd"/>
      <path d="m69.84 7.0586c10.434 0.17969 10.43 15.699 0 15.879-10.438-0.18359-10.426-15.699 0-15.879zm4.4648 3.4727c-5.9648-5.7773-14.707 2.9766-8.9297 8.9297 5.9609 5.7773 14.707-2.9727 8.9297-8.9297z" fillRule="evenodd"/>
      <path d="m16.113 44.844c0.36719 4.7461 0.86719 12.176-2.2852 16.168-2.0938 2.4844-4.043 5.5508-5.9297 9.4727-1.8984 3.9531-3.7383 8.7812-5.5859 14.77-0.34375 1.1172-0.21484 2.2773 0.27344 3.2461 0.83984 2.4414 6.8008 3.418 8.7891 4.3789 9.4102 3.332 14.117 5 18.723 5 4.6055 0 9.3125-1.668 18.723-5l6.3398-2.2305c2.2109-0.76953 3.4141-3.1602 2.7227-5.3945-3.1016-9.7266-5.9766-17.449-11.516-24.242-3.1602-4.0078-2.6484-11.457-2.2812-16.207 0.03125-0.32813 0.25391-0.58984 0.54297-0.69141 3.1484-1.0781 5.2891-3.6406 6.4688-6.7656 1.3164-4.168 2.4336-11.629-1.9023-14.27-4.8203-1.3203-13.488 4.2461-16.988 8-0.55078 0.60156-1.3008 0.92578-2.1133 0.92578-0.82812 0-1.6094-0.34375-2.1523-0.97266-3.5-3.7383-12.156-9.2852-16.949-7.9531-4.3398 2.6211-3.1992 10.125-1.8984 14.27 1.1797 3.1211 3.3203 5.6875 6.4688 6.7656 0.32812 0.10547 0.40625 0.55078 0.73047zm-1.6055 9.707c0.39453-2.9648 0.27734-6.3477 0.039063-9.0938-8.0742-3.2969-10.422-15.363-6.1875-22.402 5.332-5.3203 16.324 2.4922 20.773 6.8789 0.46875 0.57422 1.4062 0.60938 1.8984 0.042968 4.4492-4.3984 15.461-12.25 20.816-6.9219 4.2422 7.043 1.875 19.105-6.1875 22.406-0.28516 4.2852-0.75 10.949 1.9531 14.508 2.1797 2.5898 4.207 5.7656 6.1523 9.8164 1.9336 4.0234 3.8008 8.9258 5.6758 14.992 0.47266 1.5312 0.29688 3.1211-0.375 4.4531-1.0859 3.082-7.1211 4.0273-9.6953 5.1758-19.109 6.7891-19.414 6.7891-38.523 0l-6.3359-2.2305c-3.0352-1.0547-4.6875-4.3281-3.7383-7.3984 3.1602-9.9414 6.1406-17.844 11.828-24.809 1.0273-1.2266 1.6094-3.1953 1.9062-5.418z" fillRule="evenodd"/>
      <path d="m23.922 43.895c0.42578-0.13672 0.88281 0.097657 1.0195 0.52344 0.13672 0.42578-0.097656 0.88281-0.52344 1.0195-1.6914 0.55078-3.625 0.85547-5.3438 0.85547-1.207-0.14453-4.8008 0.035156-4.5352-1.6719 0.14453-0.42188 0.60547-0.64844 1.0273-0.50781 2.668 0.90234 5.6562 0.625 8.3555-0.21875z" fillRule="evenodd"/>
      <path d="m35.785 45.434c-1-0.30469-0.50391-1.875 0.49609-1.5391 2.6953 0.84375 5.6875 1.1211 8.3555 0.21875 0.42188-0.14062 0.88281 0.085938 1.0273 0.50781 0.14063 0.42188-0.085937 0.88281-0.50781 1.0273-2.9883 1.0117-6.3398 0.73828-9.3711-0.21484z" fillRule="evenodd"/>
    </svg>
  );
}

export default function ReadOnlyDressCodeCard({
  dressCodes,
  dressCodeIcons,
  theme,
  onContinue,
}: ReadOnlyDressCodeCardProps) {
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
        {/* Glowing Background Light Orb */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none"
          style={{ background: theme.accent }}
        />

        {/* ── Top Floating Icon Badge ───────────────────────────────────── */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 16 }}
          className="relative group"
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
            <DressCodeHeroSVG color={theme.accent} />
          </div>
        </motion.div>

        {/* ── Editorial Header Section ───────────────────────────────────── */}
        <div className="flex flex-col items-center z-10">
          {/* Top Label with Thin Decorative Accent Lines */}
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-6" style={{ background: `${theme.accent}40` }} />
            <span
              className="text-[9px] font-extrabold uppercase tracking-[0.32em]"
              style={{ color: theme.accent }}
            >
              STYLE &amp; OUTFIT GUIDE
            </span>
            <div className="h-px w-6" style={{ background: `${theme.accent}40` }} />
          </div>

          {/* Title */}
          <h2
            className="text-2xl font-bold tracking-tight text-gray-800"
            style={{ fontFamily: "var(--font-caveat)", fontSize: "2.1rem" }}
          >
            Dress Code Spesial
          </h2>

          <p className="text-xs text-gray-400 mt-1 font-medium max-w-[240px]">
            Pakai pakaian terbaikmu sesuai panduan outfit di bawah ini!
          </p>
        </div>

        {/* ── Editorial Glass Dress Code Items Spread ───────────────────── */}
        <div className="w-full flex flex-col gap-3 my-1 z-10">
          {dressCodes.map((dc, idx) => (
            <motion.div
              key={dc}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3 + idx * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02 }}
              className="w-full p-4 rounded-2xl flex items-center justify-between border transition-all relative overflow-hidden group shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${theme.bg}70 0%, #ffffff 95%)`,
                borderColor: `${theme.accent}35`,
                boxShadow: `0 6px 18px -4px ${theme.accent}18`,
              }}
            >
              {/* Left Accent Bar */}
              <div
                className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full"
                style={{ background: theme.accent }}
              />

              <div className="flex items-center gap-3.5 pl-2">
                {/* Vector Icon Badge */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs border"
                  style={{
                    background: `linear-gradient(135deg, ${theme.accent}20 0%, ${theme.accent}08 100%)`,
                    borderColor: `${theme.accent}35`,
                  }}
                >
                  <DressCodeIconSvg
                    iconKey={(dressCodeIcons || {})[dc]}
                    size={24}
                    color={theme.accent}
                    strokeWidth={2}
                  />
                </div>

                {/* Text & Style Tag */}
                <div className="text-left">
                  <span
                    className="text-[9px] font-extrabold uppercase tracking-widest block"
                    style={{ color: `${theme.accent}aa` }}
                  >
                    OUTFIT #{idx + 1}
                  </span>
                  <span className="text-sm font-extrabold text-gray-800 leading-tight block">
                    {dc}
                  </span>
                </div>
              </div>

              {/* Right Sparkle / Check Accent */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border shadow-xs"
                style={{
                  background: `${theme.accent}15`,
                  borderColor: `${theme.accent}30`,
                }}
              >
                <IconCheck size={12} color={theme.accent} strokeWidth={2.5} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Continue Action Button ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + dressCodes.length * 0.12 + 0.15 }}
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
