"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconCalendar, IconArrowRight } from "@/components/ui/Icon";

interface Props {
  recipientName: string;
  theme: { bg: string; card: string; accent: string; text: string };
  onNext: (selected: string) => void;
}

const TIME_OF_DAY = ["Pagi", "Siang", "Sore", "Malam"];

const CustomCalendar = ({ selectedDate, onSelect, theme }: { selectedDate: string, onSelect: (date: string) => void, theme: any }) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = selectedDate ? new Date(selectedDate) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const handleSelect = (day: number) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 10);
    onSelect(localISOTime);
  };

  return (
    <div style={{ background: "white", borderRadius: "16px", padding: "16px", border: `1.5px solid ${theme.accent}30`, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <button type="button" onClick={prevMonth} style={{ padding: "8px", background: "none", border: "none", cursor: "pointer", color: theme.text }}>
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <span style={{ fontWeight: 700, color: theme.text, fontSize: "14px" }}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button type="button" onClick={nextMonth} style={{ padding: "8px", background: "none", border: "none", cursor: "pointer", color: theme.text }}>
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "8px" }}>
        {dayNames.map((d, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: "12px", fontWeight: 700, color: theme.text, opacity: 0.6 }}>{d}</div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const currentDateStr = (() => {
             const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
             const tzOffset = d.getTimezoneOffset() * 60000;
             return (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 10);
          })();
          const isSelected = selectedDate === currentDateStr;
          
          return (
            <button
              key={day}
              type="button"
              onClick={() => handleSelect(day)}
              style={{
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isSelected ? theme.accent : "transparent",
                color: isSelected ? "white" : theme.text,
                borderRadius: "50%",
                border: "none",
                fontSize: "14px",
                fontWeight: isSelected ? 700 : 500,
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default function DatePickerCard({ recipientName, theme, onNext }: Props) {
  const [date, setDate] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("Siang");
  const [time, setTime] = useState("12:00");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    const today = new Date();
    const localDate = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
    setDate(localDate);
  }, []);

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

  const getDisplayDate = () => {
    if (!date) return "Pilih Tanggal";
    try {
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      }
    } catch (e) {}
    return date;
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
          {/* Custom Date Input Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="w-full px-4 py-3.5 rounded-xl text-base font-medium outline-none transition-all flex items-center justify-between"
              style={{
                background: "white",
                border: `1.5px solid ${theme.accent}30`,
                color: theme.text,
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
              }}
            >
              <div className="flex items-center gap-3">
                <IconCalendar size={18} color={theme.accent} />
                <span>{getDisplayDate()}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isCalendarOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            
            {/* Calendar Dropdown */}
            {isCalendarOpen && (
              <div className="mt-2 w-full">
                <CustomCalendar 
                  selectedDate={date} 
                  onSelect={(d) => { setDate(d); setIsCalendarOpen(false); }} 
                  theme={theme} 
                />
              </div>
            )}
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
              className="w-40 px-4 py-3 rounded-xl text-base font-medium outline-none text-center transition-all appearance-none"
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
