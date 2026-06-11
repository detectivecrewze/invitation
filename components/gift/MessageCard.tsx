"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  senderName: string;
  theme: { bg: string; card: string; accent: string; text: string };
  onNext: (msg: string) => void;
}

export default function MessageCard({ senderName, theme, onNext }: Props) {
  const [message, setMessage] = useState("");

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
            terakhir
          </p>
          <h2
            style={{ fontFamily: "var(--font-caveat)", fontSize: "2.5rem", color: theme.text, lineHeight: 1.1, marginTop: "0.25rem" }}
          >
            Ada pesan buat<br />{senderName}?
          </h2>
        </div>

        {/* Text Area */}
        <div className="w-full mb-6">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="contoh : jangan telat lagi!!"
            className="w-full h-28 px-5 py-5 rounded-[1.5rem] font-medium text-center outline-none transition-all resize-none"
            style={{
              background: "white",
              border: `1.5px solid ${theme.accent}30`,
              color: theme.text,
              fontFamily: "var(--font-caveat)",
              fontSize: "1.2rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
            }}
          />
        </div>

        {/* Submit Button */}
        <motion.button
          onClick={() => onNext(message.trim())}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3.5 rounded-full font-bold text-[14px] text-white transition-all min-w-[140px]"
          style={{
            background: theme.accent,
            boxShadow: `0 6px 16px ${theme.accent}40`,
          }}
        >
          Bikin tiketnya
        </motion.button>
      </div>
    </div>
  );
}
