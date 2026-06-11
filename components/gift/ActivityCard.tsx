"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ACTIVITY_ICONS } from "@/components/ui/Icon";

interface Activity { id: string; label: string; }

interface Props {
  activities: Activity[];
  theme: { bg: string; card: string; accent: string; text: string };
  onNext: (selected: string[]) => void;
}

export default function ActivityCard({ activities, theme, onNext }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [customIdea, setCustomIdea] = useState("");

  const toggle = (id: string) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const handleNext = () => {
    const finalSelection = [...selected];
    if (customIdea.trim()) {
      finalSelection.push(customIdea.trim());
    }
    if (finalSelection.length > 0) {
      onNext(finalSelection);
    }
  };

  const canProceed = selected.length > 0 || customIdea.trim().length > 0;

  return (
    <div
      className="w-full max-w-sm mx-auto rounded-[2rem] overflow-hidden"
      style={{
        background: "white",
        boxShadow: "0 24px 64px rgba(0,0,0,0.09), 0 4px 16px rgba(0,0,0,0.05)",
        border: `1px solid ${theme.accent}18`,
      }}
    >
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${theme.accent}cc, ${theme.accent})` }} />

      <div className="px-6 pt-10 pb-8 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-6">
          <p
            style={{ fontFamily: "var(--font-caveat)", fontSize: "1.2rem", color: theme.accent, opacity: 0.8 }}
          >
            rencana kita
          </p>
          <h2
            style={{ fontFamily: "var(--font-caveat)", fontSize: "2.1rem", color: theme.text, lineHeight: 1.1, marginTop: "0.25rem" }}
          >
            Nanti kita<br />ngapain sayang?
          </h2>
        </div>

        {/* Activity grid (4 columns) */}
        <div className="w-full grid grid-cols-4 gap-2 mb-6">
          {activities.map((act) => {
            const isSelected = selected.includes(act.id);
            
            // Map the id to the corresponding SVG filename in the public folder
            const SVG_MAP: Record<string, string> = {
              "dinner": "makan.svg",
              "cinema": "nonton-film.svg",
              "walk": "jalan-jalan.svg",
              "gaming": "main-game.svg",
              "shopping": "belanja.svg",
              "cafe": "ngopi-bareng.svg",
              "picnic": "piknik.svg",
              "concert": "konser.svg"
            };
            const svgFileName = SVG_MAP[act.id];

            return (
              <motion.button
                key={act.id}
                onClick={() => toggle(act.id)}
                whileTap={{ scale: 0.92 }}
                className="flex flex-col items-center justify-center p-2 rounded-[1rem] transition-all relative overflow-hidden"
                style={{
                  background: isSelected ? theme.accent : `${theme.accent}04`,
                  border: `1.5px solid ${isSelected ? theme.accent : `${theme.accent}15`}`,
                  height: "85px",
                }}
              >
                {/* Custom SVG Asset */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-1.5 transition-all"
                  style={{
                    background: isSelected ? "transparent" : `${theme.accent}12`,
                  }}
                >
                  {svgFileName ? (
                    <img 
                      src={`/${svgFileName}`} 
                      alt={act.label} 
                      className="w-6 h-6 object-contain"
                      style={{ 
                        filter: isSelected 
                          ? "brightness(0) invert(1)" 
                          : "opacity(0.8)",
                      }} 
                    />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isSelected ? theme.accent : theme.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  )}
                </div>

                {/* Label */}
                <span
                  className="text-[9px] font-bold leading-[1.1] text-center"
                  style={{ color: isSelected ? "white" : theme.text, transition: "color 0.2s" }}
                >
                  {act.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Custom Input & Submit Button */}
        <div className="w-full flex items-center gap-2">
          <input
            type="text"
            value={customIdea}
            onChange={e => setCustomIdea(e.target.value)}
            placeholder="atau tulis ide kamu..."
            className="flex-1 px-5 py-3.5 rounded-full text-[13px] font-medium outline-none transition-all"
            style={{
              background: "white",
              border: `1.5px solid ${theme.accent}30`,
              color: theme.text,
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            }}
          />
          <motion.button
            onClick={handleNext}
            disabled={!canProceed}
            whileTap={canProceed ? { scale: 0.95 } : {}}
            className="px-6 py-3.5 rounded-full font-bold text-[13px] text-white transition-all"
            style={{
              background: canProceed ? theme.accent : `${theme.accent}40`,
              boxShadow: canProceed ? `0 6px 16px ${theme.accent}40` : "none",
            }}
          >
            Oke
          </motion.button>
        </div>
      </div>
    </div>
  );
}
