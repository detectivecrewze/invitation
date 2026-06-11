"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  dressCodes: string[];
  theme: { bg: string; card: string; accent: string; text: string };
  onNext: (selected: string) => void;
}

export default function DressCodeCard({ dressCodes, theme, onNext }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [customIdea, setCustomIdea] = useState("");

  const handleSelect = (dc: string) => {
    setSelected(dc);
    setCustomIdea("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomIdea(e.target.value);
    setSelected(null);
  };

  const handleNext = () => {
    const finalSelection = customIdea.trim() || selected;
    if (finalSelection) {
      onNext(finalSelection);
    }
  };

  const canProceed = !!selected || customIdea.trim().length > 0;

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

      <div className="px-6 pt-10 pb-8 flex flex-col items-center text-center">
        {/* Header */}
        <div className="mb-6">
          <p
            style={{ fontFamily: "var(--font-caveat)", fontSize: "1.2rem", color: theme.accent, opacity: 0.8 }}
          >
            biar makin niat
          </p>
          <h2
            style={{ fontFamily: "var(--font-caveat)", fontSize: "2.5rem", color: theme.text, lineHeight: 1.1, marginTop: "0.25rem" }}
          >
            Dress code-nya?
          </h2>
        </div>

        {/* Dress code pills */}
        <div className="w-full flex flex-wrap justify-center gap-2 mb-4">
          {dressCodes.map((dc) => {
            const isSelected = selected === dc;
            return (
              <motion.button
                key={dc}
                onClick={() => handleSelect(dc)}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full font-medium text-[13px] transition-all"
                style={{
                  background: isSelected ? theme.accent : "white",
                  border: `1.5px solid ${isSelected ? theme.accent : `${theme.accent}25`}`,
                  color: isSelected ? "white" : theme.text,
                  boxShadow: isSelected ? `0 4px 12px ${theme.accent}30` : "none",
                }}
              >
                {dc}
              </motion.button>
            );
          })}
        </div>

        {/* Custom Input */}
        <div className="w-full mb-6">
          <input
            type="text"
            value={customIdea}
            onChange={handleCustomChange}
            placeholder="atau tulis sendiri..."
            className="w-full px-5 py-3 rounded-full text-[13px] font-medium text-center outline-none transition-all"
            style={{
              background: "white",
              border: `1.5px solid ${theme.accent}30`,
              color: theme.text,
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            }}
          />
        </div>

        {/* Submit Button */}
        <motion.button
          onClick={handleNext}
          disabled={!canProceed}
          whileTap={canProceed ? { scale: 0.95 } : {}}
          className="px-8 py-3.5 rounded-full font-bold text-[14px] text-white transition-all w-[140px]"
          style={{
            background: canProceed ? theme.accent : `${theme.accent}40`,
            boxShadow: canProceed ? `0 6px 16px ${theme.accent}40` : "none",
          }}
        >
          Lanjut
        </motion.button>
      </div>
    </div>
  );
}
