"use client";

import { motion } from "framer-motion";
import { IconHanger, IconSparkle, DressCodeIconSvg } from "@/components/ui/Icon";

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

// Custom SVG illustrations for fashion / outfit aesthetics
function DressIconSVG({ color }: { color: string }) {
  return (
    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a2 2 0 0 1 2 2v1l3.5 2.5a1 1 0 0 1 .3 1.2L16 12v9a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-9L6.2 8.7a1 1 0 0 1 .3-1.2L10 5V4a2 2 0 0 1 2-2z" />
      <path d="M9 12h6" strokeDasharray="2 2" />
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
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-sm mx-auto flex flex-col gap-6 px-3 py-2"
    >
      {/* Container Card */}
      <div
        className="relative rounded-[2.5rem] p-7 overflow-hidden text-center flex flex-col items-center gap-6 shadow-2xl backdrop-blur-xl"
        style={{
          background: "rgba(255, 255, 255, 0.88)",
          border: `1.5px solid ${theme.accent}30`,
          boxShadow: `0 20px 50px -10px ${theme.accent}25, 0 8px 20px rgba(0, 0, 0, 0.04)`,
        }}
      >
        {/* Subtle decorative glowing background blob */}
        <div
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-30 pointer-events-none"
          style={{ background: theme.accent }}
        />

        {/* Top Header Badge / Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-3xl flex items-center justify-center relative shadow-inner"
          style={{ background: `${theme.accent}15`, border: `1px solid ${theme.accent}30` }}
        >
          <DressIconSVG color={theme.accent} />
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-1.5 -right-1.5 p-1.5 rounded-full bg-white shadow-md border"
            style={{ borderColor: `${theme.accent}30` }}
          >
            <IconSparkle size={14} color={theme.accent} strokeWidth={2} />
          </motion.div>
        </motion.div>

        {/* Title */}
        <div>
          <span
            className="text-[10px] font-extrabold uppercase tracking-[0.3em] block mb-1"
            style={{ color: theme.accent }}
          >
            OUTFIT &amp; STYLE
          </span>
          <h2 className="text-xl font-bold tracking-tight text-gray-800">
            Dress Code Hari Ini
          </h2>
          <p className="text-xs text-gray-400 mt-1 font-medium">
            Pakai pakaian terbaikmu sesuai panduan berikut!
          </p>
        </div>

        {/* Dress code pills list */}
        <div className="w-full flex flex-col gap-2.5 my-1">
          {dressCodes.map((dc, idx) => (
            <motion.div
              key={dc}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.12, duration: 0.4 }}
              className="w-full py-3.5 px-4 rounded-2xl flex items-center justify-between border transition-all"
              style={{
                background: `linear-gradient(135deg, ${theme.bg}80 0%, #ffffff 100%)`,
                borderColor: `${theme.accent}30`,
                boxShadow: `0 4px 12px ${theme.accent}10`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${theme.accent}20` }}
                >
                  <DressCodeIconSvg iconKey={(dressCodeIcons || {})[dc]} size={18} color={theme.accent} strokeWidth={2} />
                </div>
                <span className="text-sm font-bold text-gray-800">{dc}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Continue Action Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + dressCodes.length * 0.12 + 0.2 }}
          onClick={onContinue}
          className="w-full py-4 rounded-2xl text-sm font-bold text-white shadow-lg transition-transform active:scale-[0.98] hover:opacity-95 flex items-center justify-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent}ee 100%)`,
            boxShadow: `0 10px 25px -5px ${theme.accent}60`,
          }}
        >
          <span>Lihat Rundown Acara</span>
          <span className="text-base font-normal">→</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
