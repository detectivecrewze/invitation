"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IconCalendar, IconArrowRight } from "@/components/ui/Icon";

interface Props {
  recipientName: string;
  theme: { bg: string; card: string; accent: string; text: string };
  onNext: (selected: string) => void;
}

const TIME_OF_DAY = ["Pagi", "Siang", "Sore", "Malam"];

export default function DatePickerCard({ recipientName, theme, onNext }: Props) {
  const [date, setDate] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("Siang");
  const [time, setTime] = useState("");

  const canProceed = !!date;

  const handleNext = () => {
    if (!canProceed) return;
    
    let formattedDate = date;
    try {
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        const dayName = d.toLocaleDateString("id-ID", { weekday: "long" });
        const day = d.getDate();
        const monthName = d.toLocaleDateString("id-ID", { month: "long" });
        const year = d.getFullYear();
        formattedDate = `${dayName}, ${day} ${monthName} ${year}`;
      }
    } catch (e) {}

    const formatted = `${formattedDate} • ${timeOfDay}${time ? ` • ${time}` : ""}`;
    onNext(formatted);
  };

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

      <div className="px-8 pt-10 pb-8 flex flex-col gap-6 items-center">
        {/* Header */}
        <div className="text-center">
          <p
            style={{ fontFamily: "var(--font-caveat)", fontSize: "1.2rem", color: theme.accent, opacity: 0.8 }}
          >
            buat {recipientName}
          </p>
          <h2
            style={{ fontFamily: "var(--font-caveat)", fontSize: "2.1rem", color: theme.text, lineHeight: 1.1, marginTop: "0.25rem" }}
          >
            Kapan sayangku<br />free?
          </h2>
        </div>

        <div className="w-full flex flex-col gap-4 mt-2">
          {/* Date Input */}
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all"
              style={{
                background: "white",
                border: `1.5px solid ${theme.accent}30`,
                color: theme.text,
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
              }}
            />
          </div>

          {/* Time of Day Pills */}
          <div className="flex justify-between gap-2">
            {TIME_OF_DAY.map(tod => (
              <motion.button
                key={tod}
                onClick={() => setTimeOfDay(tod)}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-2.5 rounded-[1.25rem] text-[13px] font-bold transition-all"
                style={{
                  background: timeOfDay === tod ? theme.accent : "white",
                  color: timeOfDay === tod ? "white" : theme.text,
                  border: `1.5px solid ${timeOfDay === tod ? theme.accent : `${theme.accent}20`}`,
                  boxShadow: timeOfDay === tod ? `0 4px 12px ${theme.accent}40` : "none",
                }}
              >
                {tod}
              </motion.button>
            ))}
          </div>

          {/* Time Input */}
          <div className="relative flex justify-center mt-1">
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-40 px-4 py-3 rounded-xl text-sm font-medium outline-none text-center transition-all"
              style={{
                background: "white",
                border: `1.5px solid ${theme.accent}30`,
                color: theme.text,
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
              }}
            />
          </div>
        </div>

        <motion.button
          onClick={handleNext}
          disabled={!canProceed}
          whileTap={canProceed ? { scale: 0.97 } : {}}
          className="w-32 mt-2 py-3 rounded-[1.5rem] font-bold text-sm text-white flex items-center justify-center gap-2 transition-all mx-auto"
          style={{
            background: canProceed ? theme.accent : `${theme.accent}40`,
            boxShadow: canProceed ? `0 6px 20px ${theme.accent}40` : "none",
            letterSpacing: "0.02em",
          }}
        >
          Lanjut
        </motion.button>
      </div>
    </div>
  );
}
