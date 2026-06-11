"use client";

import { useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getTheme } from "@/lib/constants";
import LoadingScreen from "@/components/gift/LoadingScreen";
import EnvelopeGate from "@/components/gift/EnvelopeGate";
import InvitationCard from "@/components/gift/InvitationCard";
import DatePickerCard from "@/components/gift/DatePickerCard";
import ActivityCard from "@/components/gift/ActivityCard";
import DressCodeCard from "@/components/gift/DressCodeCard";
import MessageCard from "@/components/gift/MessageCard";
import DateTicket from "@/components/gift/DateTicket";

type Phase =
  | "loading"
  | "envelope"
  | "invitation"
  | "date"
  | "activity"
  | "dresscode"
  | "message"
  | "ticket";

interface InvitationData {
  recipientName: string;
  senderName: string;
  subText?: string;
  photoUrl?: string;
  themeId?: string;
  suggestedDates?: string[];
  activities?: { id: string; label: string; emoji: string }[];
  dressCodes?: string[];
  musicUrl?: string;
  musicTitle?: string;
}

interface Props {
  data: InvitationData;
  invitationId: string;
}

const cardVariants = {
  initial: { opacity: 0, scale: 0.92, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, ease: "backOut" as const } },
  exit: { opacity: 0, scale: 0.92, y: -20, transition: { duration: 0.25 } },
};

export default function GiftClient({ data, invitationId }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [phase, setPhase] = useState<Phase>("loading");
  const [answers, setAnswers] = useState({
    date: "",
    activities: [] as string[],
    dressCode: "",
    message: "",
  });

  const theme = getTheme(data.themeId ?? "pink");

  const activityList = data.activities ?? [
    { id: "dinner", label: "Makan Malam", emoji: "🍽️" },
    { id: "cinema", label: "Nonton Film", emoji: "🎬" },
    { id: "walk",   label: "Jalan-Jalan", emoji: "🌿" },
    { id: "gaming", label: "Main Game",   emoji: "🎮" },
    { id: "shopping", label: "Belanja",   emoji: "🛍️" },
    { id: "cafe",   label: "Ngopi Bareng", emoji: "☕" },
  ];

  const dressCodes = data.dressCodes ?? ["Casual", "Semi-formal", "Couple Outfit", "Formal", "Bebas"];
  const suggestedDates = data.suggestedDates ?? [];

  const handleLoadingComplete = useCallback(() => setPhase("envelope"), []);
  
  const handleEnvelopeTap = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
    }
  }, []);

  const clickAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      clickAudioRef.current = new Audio("/assets/click.mp3");
    }
  }, []);

  const playClick = () => {
    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play().catch(() => {});
    }
  };

  const handleEnvelopeOpen = useCallback(() => {
    setPhase("invitation");
  }, []);
  const handleAccept = useCallback(() => { playClick(); setPhase("date"); }, []);

  const handleDate = useCallback((date: string) => {
    playClick();
    setAnswers(a => ({ ...a, date }));
    setPhase("activity");
  }, []);

  const handleActivity = useCallback((activities: string[]) => {
    playClick();
    const labels = activities.map(id => activityList.find(a => a.id === id)?.label ?? id);
    setAnswers(a => ({ ...a, activities: labels }));
    setPhase("dresscode");
  }, [activityList]);

  const handleDressCode = useCallback((dressCode: string) => {
    playClick();
    setAnswers(a => ({ ...a, dressCode }));
    setPhase("message");
  }, []);

  const handleMessage = useCallback((message: string) => {
    playClick();
    setAnswers(a => ({ ...a, message }));
    setPhase("ticket");
  }, []);

  const handleReset = useCallback(() => {
    setAnswers({ date: "", activities: [], dressCode: "", message: "" });
    setPhase("loading");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 50% 40%, ${theme.bg} 0%, ${theme.card}88 60%, ${theme.bg} 100%)`,
      }}
    >
      {/* Background Music Audio Element */}
      {data.musicUrl && (
        <audio ref={audioRef} src={data.musicUrl} loop autoPlay={false} />
      )}
      {/* Subtle ambient petals background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: `${80 + i * 40}px`,
              height: `${80 + i * 40}px`,
              background: theme.accent,
              top: `${10 + i * 15}%`,
              left: `${-5 + (i % 2 === 0 ? 0 : 75)}%`,
              filter: "blur(40px)",
            }}
          />
        ))}
      </div>

      {/* Loading screen */}
      <AnimatePresence>
        {phase === "loading" && (
          <LoadingScreen key="loading" theme={theme} onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      {/* Envelope gate */}
      <AnimatePresence>
        {phase === "envelope" && (
          <EnvelopeGate
            key="envelope"
            recipientName={data.recipientName}
            theme={theme}
            onOpen={handleEnvelopeOpen}
            onTap={handleEnvelopeTap}
          />
        )}
      </AnimatePresence>

      {/* Wizard cards */}
      {phase !== "loading" && phase !== "envelope" && (
        <div className="w-full max-w-sm px-5 py-10 relative z-10">
          <AnimatePresence mode="wait">
            {phase === "invitation" && (
              <motion.div key="invitation" variants={cardVariants} initial="initial" animate="animate" exit="exit">
                <InvitationCard
                  senderName={data.senderName}
                  subText={data.subText ?? ""}
                  photoUrl={data.photoUrl}
                  theme={theme}
                  onAccept={handleAccept}
                />
              </motion.div>
            )}

            {phase === "date" && (
              <motion.div key="date" variants={cardVariants} initial="initial" animate="animate" exit="exit">
                <DatePickerCard
                  recipientName={data.recipientName}
                  theme={theme}
                  onNext={handleDate}
                />
              </motion.div>
            )}

            {phase === "activity" && (
              <motion.div key="activity" variants={cardVariants} initial="initial" animate="animate" exit="exit">
                <ActivityCard
                  activities={activityList}
                  theme={theme}
                  onNext={handleActivity}
                />
              </motion.div>
            )}

            {phase === "dresscode" && (
              <motion.div key="dresscode" variants={cardVariants} initial="initial" animate="animate" exit="exit">
                <DressCodeCard
                  dressCodes={dressCodes}
                  theme={theme}
                  onNext={handleDressCode}
                />
              </motion.div>
            )}

            {phase === "message" && (
              <motion.div key="message" variants={cardVariants} initial="initial" animate="animate" exit="exit">
                <MessageCard senderName={data.senderName} theme={theme} onNext={handleMessage} />
              </motion.div>
            )}

            {phase === "ticket" && (
              <motion.div key="ticket" variants={cardVariants} initial="initial" animate="animate" exit="exit">
                <motion.div
                  className="text-center mb-7 flex flex-col items-center gap-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* SVG heart burst — no emoji */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", bounce: 0.5 }}
                  >
                    <svg width="48" height="48" viewBox="0 0 24 24" fill={theme.accent} stroke="none">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </motion.div>
                  <h2
                    style={{ fontFamily: "var(--font-caveat)", fontSize: "2rem", color: theme.text }}
                  >
                    Yeay, it&apos;s a date!
                  </h2>
                  <p className="text-xs tracking-widest uppercase font-bold" style={{ color: theme.accent, opacity: 0.6 }}>
                    Simpan tiketmu di bawah
                  </p>
                </motion.div>
                <DateTicket
                  data={{
                    recipientName: data.recipientName,
                    senderName: data.senderName,
                    date: answers.date,
                    activities: answers.activities,
                    dressCode: answers.dressCode,
                    message: answers.message,
                    subText: data.subText,
                  }}
                  theme={theme}
                  onReset={handleReset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Background Music UI */}
      {data.musicUrl && phase !== "loading" && phase !== "envelope" && (
        <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMute}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md"
            style={{
              background: `${theme.accent}cc`,
              color: "white",
              border: `2px solid ${theme.accent}40`,
            }}
          >
            {isMuted ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
                <line x1="2" y1="2" x2="22" y2="22" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            )}
          </motion.button>
      )}
    </div>
  );
}
