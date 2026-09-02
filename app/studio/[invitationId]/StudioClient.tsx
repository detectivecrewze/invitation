"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as htmlToImage from "html-to-image";
import { THEMES, ACTIVITIES, DRESS_CODES, PRESET_PLAYLIST, getTheme, formatIndonesianDate } from "@/lib/constants";
import { normaliseLocale, observeStaticDom, translateLocaleValue, translateStaticDom, type Locale } from "@/lib/locale";
import {
  IconPalette, IconMail, IconCamera, IconSparkle, IconHanger, IconRocket, ACTIVITY_ICONS, IconCheck, IconShare, IconEye, IconCalendar
} from "@/components/ui/Icon";
import HeartQRCode from "@/components/ui/HeartQRCode";

const EMOJI_CATEGORIES = [
  {
    name: "Makanan & Kuliner 🍕",
    emojis: ["🍽️", "🍕", "🍔", "🍟", "🍣", "🍜", "🍰", "🍦", "🍿", "☕", "🧋", "🍷", "🍻", "🥐", "🧇", "🍩", "🍪", "🥞", "🍡"]
  },
  {
    name: "Aktivitas & Tempat 🎬",
    emojis: ["🎬", "🎮", "🛍️", "🚶", "🧺", "🎵", "🎤", "🎳", "🎡", "🎢", "🎪", "🎨", "💃", "🕺", "📸", "🎧", "♟️", "🎯", "🧩"]
  },
  {
    name: "Romantis & Kencan 💖",
    emojis: ["❤️", "💖", "💕", "🌹", "🌸", "✨", "💫", "🕯️", "💌", "🎁", "🧸", "💍", "💐", "🌺", "⭐", "🌙"]
  },
  {
    name: "Jalan-jalan & Outdoor 🏖️",
    emojis: ["🏖️", "⛺", "🚗", "✈️", "⛵", "🚴", "🏞️", "🏙️", "🏰", "🌌", "🌉"]
  },
  {
    name: "Lucu & Seru 🐱",
    emojis: ["🐱", "🐶", "🐰", "🐼", "🐬", "🎆", "🎉", "🎈", "🔮", "🪄", "🐥"]
  }
];

interface State {
  locale: Locale;
  themeId: string;
  recipientName: string;
  senderName: string;
  subText: string;
  eventDate: string;
  photoUrl: string | null;
  selectedActivities: string[];
  customActivityLabels: Record<string, string>;
  customActivityEmojis: Record<string, string>;
  selectedDressCodes: string[];
  customDressCodes: Record<string, string>;
  dressCodeIcons?: Record<string, string>;
  status: "draft" | "published";
  musicUrl: string | null;
  musicTitle: string | null;
  activityTitle: string;
  dateTitle: string;
  invitationTitle: string;
  closingNote: string;
  openingShape: "heart" | "star";
  ticketTitle: string;
}

const INITIAL: State = {
  locale: "id",
  themeId: "pink",
  recipientName: "",
  senderName: "",
  subText: "",
  eventDate: "",
  photoUrl: null,
  selectedActivities: ["dinner", "cinema", "walk", "gaming", "shopping", "cafe"],
  customActivityLabels: {},
  customActivityEmojis: {},
  selectedDressCodes: ["Casual", "Semi-formal", "Couple Outfit", "Formal", "Bebas"],
  customDressCodes: {},
  status: "draft",
  musicUrl: null,
  musicTitle: null,
  activityTitle: "Nanti kita ngapain sayang?",
  dateTitle: "Kapan sayangku free?",
  invitationTitle: "Invitation From",
  closingNote: "",
  openingShape: "heart",
  ticketTitle: "Tiket kencan",
};

const STEPS = [
  { id: 1, label: "Tema", Icon: IconPalette },
  { id: 2, label: "Info", Icon: IconMail },
  { id: 3, label: "Foto", Icon: IconCamera },
  { id: 4, label: "Aktivitas", Icon: IconSparkle },
  { id: 5, label: "Dress Code", Icon: IconHanger },
  { id: 6, label: "Publish", Icon: IconRocket },
];

export default function StudioClient({
  invitationId,
  bundleToken,
}: {
  invitationId: string;
  bundleToken: string | null;
}) {
  const [step, setStep] = useState(1);
  const [st, setSt] = useState<State>(INITIAL);
  const [toast, setToast] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [downloadingQr, setDownloadingQr] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const [giftUrl, setGiftUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [playlist, setPlaylist] = useState<any[]>(PRESET_PLAYLIST);
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewField, setPreviewField] = useState<string | null>(null);
  const [emojiPickerId, setEmojiPickerId] = useState<string | null>(null);
  const [customMusicUrl, setCustomMusicUrl] = useState("");
  const [customMusicTitle, setCustomMusicTitle] = useState("");
  const [showFormatModal, setShowFormatModal] = useState(false);
  const [switchingFormat, setSwitchingFormat] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`invitation-studio-locale-${invitationId}`) as Locale | null;
      if (saved === "id" || saved === "en") {
        setSt((s) => ({ ...s, locale: saved }));
      }
    } catch {}
  }, [invitationId]);

  useEffect(() => {
    document.documentElement.lang = st.locale;
    translateStaticDom(document.body, st.locale);
    return observeStaticDom(document.body, st.locale);
  }, [st.locale, step]);

  const handleSwitchMode = async (targetMode: "invitation" | "rundown") => {
    setSwitchingFormat(true);
    try {
      await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId,
          mode: targetMode,
          recipientName: st.recipientName,
          senderName: st.senderName,
          subText: st.subText,
          photoUrl: st.photoUrl,
          themeId: st.themeId,
          musicUrl: st.musicUrl,
          musicTitle: st.musicTitle,
          invitationTitle: st.invitationTitle,
          closingNote: st.closingNote,
          ticketTitle: st.ticketTitle,
          locale: st.locale,
          ...(bundleToken ? { bundleToken } : {}),
        }),
      });
      window.location.reload();
    } catch {
      showToast("Gagal mengubah format. Coba lagi.");
      setSwitchingFormat(false);
    }
  };

  useEffect(() => {
    fetch("/assets/playlist.json")
      .then(r => r.json())
      .then(data => setPlaylist(data))
      .catch(() => {});
  }, []);

  const theme = getTheme(st.themeId);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const update = useCallback((patch: Partial<State>) => {
    setSt(s => ({ ...s, ...patch }));
    setPublished(false);
  }, []);

  useEffect(() => {
    fetch(`/api/invitations?id=${invitationId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const defaultDressCodes = ["Casual", "Semi-formal", "Couple Outfit", "Formal", "Bebas"];
        const loadedCustomDC: Record<string, string> = {};
        const loadedSelectedDC: string[] = [];

        if (data.dressCodes && Array.isArray(data.dressCodes)) {
          const uniqueInput = Array.from(new Set<string>(data.dressCodes));
          uniqueInput.forEach((dc: string, idx: number) => {
            if (defaultDressCodes.includes(dc)) {
              if (!loadedSelectedDC.includes(dc)) loadedSelectedDC.push(dc);
            } else {
              const slotKey = defaultDressCodes[idx] ?? defaultDressCodes[loadedSelectedDC.length] ?? dc;
              loadedCustomDC[slotKey] = dc;
              if (!loadedSelectedDC.includes(slotKey)) loadedSelectedDC.push(slotKey);
            }
          });
        }

        const savedLocale = (typeof window !== "undefined" && localStorage.getItem(`invitation-studio-locale-${invitationId}`)) as Locale | null;
        setSt(s => ({
          ...s,
          locale: savedLocale || normaliseLocale(data.locale, s.locale || "id"),
          themeId: data.themeId ?? s.themeId,
          recipientName: data.recipientName ?? s.recipientName,
          senderName: data.senderName ?? s.senderName,
          subText: data.subText ?? s.subText,
          eventDate: data.eventDate ?? s.eventDate,
          photoUrl: data.photoUrl ?? s.photoUrl,
          selectedActivities: data.activities?.map((a: any) => a.id) ?? s.selectedActivities,
          customActivityLabels: data.activities?.reduce((acc: any, a: any) => ({ ...acc, [a.id]: a.label }), {}) ?? s.customActivityLabels,
          customActivityEmojis: data.activities?.reduce((acc: any, a: any) => (a.emoji ? { ...acc, [a.id]: a.emoji } : acc), {}) ?? s.customActivityEmojis,
          selectedDressCodes: loadedSelectedDC.length > 0 ? loadedSelectedDC : s.selectedDressCodes,
          customDressCodes: loadedCustomDC,
          status: data.status ?? s.status,
          musicUrl: data.musicUrl ?? s.musicUrl,
          musicTitle: data.musicTitle ?? s.musicTitle,
          activityTitle: data.activityTitle ?? s.activityTitle,
          dateTitle: data.dateTitle ?? s.dateTitle,
          invitationTitle: data.invitationTitle ?? s.invitationTitle,
          closingNote: data.closingNote ?? s.closingNote,
          openingShape: data.openingShape ?? s.openingShape,
          ticketTitle: data.ticketTitle ?? s.ticketTitle,
        }));
        if (data.status === "published") {
          setPublished(true);
          setGiftUrl(`${window.location.origin}/${invitationId}`);
        }
      })
      .catch(() => {});
  }, [invitationId]);

  const handlePhotoUpload = async (file: File) => {
    if (file.size > 8 * 1024 * 1024) { showToast("Gambar terlalu besar. Maks 8MB."); return; }
    setPhotoUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      const result = await r.json();
      if (!result.success) throw new Error();
      update({ photoUrl: result.url });
      showToast("Foto berhasil diunggah!");
    } catch {
      showToast("Upload gagal, coba lagi.");
    } finally {
      setPhotoUploading(false);
    }
  };

  const handlePublish = async () => {
    if (!st.recipientName || !st.senderName) {
      showToast("Isi nama pengirim & penerima dulu!");
      return;
    }
    setPublishing(true);
    try {
      const payload = {
        invitationId,
        locale: st.locale,
        themeId: st.themeId,
        recipientName: st.recipientName,
        senderName: st.senderName,
        subText: st.subText,
        eventDate: st.eventDate,
        photoUrl: st.photoUrl,
        activities: ACTIVITIES
          .filter(a => st.selectedActivities.includes(a.id))
          .map(a => ({
            ...a,
            label: (st.customActivityLabels || {})[a.id] ?? a.label,
            emoji: (st.customActivityEmojis || {})[a.id] ?? a.emoji ?? "✨",
          })),
        dressCodes: Array.from(new Set(st.selectedDressCodes.map(dc => (st.customDressCodes || {})[dc] ?? dc))),
        dressCodeIcons: Object.fromEntries(
          st.selectedDressCodes.flatMap(dc => {
            const text = (st.customDressCodes || {})[dc] ?? dc;
            const icon = (st.dressCodeIcons || {})[dc];
            return icon ? [[text, icon], [dc, icon]] : [];
          })
        ),
        status: "published",
        musicUrl: st.musicUrl,
        musicTitle: st.musicTitle,
        activityTitle: st.activityTitle || "Nanti kita ngapain sayang?",
        dateTitle: st.dateTitle || "Kapan sayangku free?",
        invitationTitle: st.invitationTitle || "Invitation From",
        closingNote: st.closingNote || "",
        openingShape: st.openingShape || "heart",
        ticketTitle: st.ticketTitle || "Tiket kencan",
        ...(bundleToken ? { bundleToken } : {}),
      };
      const r = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await r.json();
      if (data.success) {
        setPublished(true);
        setGiftUrl(`${window.location.origin}/${invitationId}`);
      } else {
        alert(translateLocaleValue(data.error || "Gagal menyimpan", st.locale));
      }
    } catch (e) {
      console.error(e);
      alert(translateLocaleValue("Terjadi kesalahan. Coba lagi.", st.locale));
    } finally {
      setPublishing(false);
    }
  };

  useEffect(() => {
    if (step === 6 && !published && !publishing) {
      handlePublish();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const downloadQrCode = useCallback(async () => {
    if (!qrRef.current) return;
    setDownloadingQr(true);
    try {
      const dataUrl = await htmlToImage.toPng(qrRef.current, {
        quality: 1,
        pixelRatio: 3,
        style: { transform: "scale(1)", margin: "0" },
      });
      
      const filename = `barcode-${st.recipientName.replace(/\s+/g, "-").toLowerCase()}.png`;

      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], filename, { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "Barcode Undangan",
            text: "Scan barcode ini untuk membuka kejutan undangan dariku!",
          });
          return;
        }
      } catch (e) {
        console.log("Share failed or unsupported", e);
      }

      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert(translateLocaleValue("Gagal memproses gambar. Coba lagi.", st.locale));
    } finally {
      setDownloadingQr(false);
    }
  }, [st.recipientName]);

  const stepVariants = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.35 } },
    exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ background: `radial-gradient(ellipse at 50% 0%, ${theme.bg} 0%, #f8f8fa 100%)` }}
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-2xl"
            style={{ background: theme.accent }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-xl" style={{ borderColor: `${theme.accent}22` }}>
        <div className="max-w-lg mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconPalette size={18} color={theme.text} />
            <h1 className="font-bold text-base" style={{ color: theme.text }}>
              Studio Editor
            </h1>
          </div>
          <label className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 text-[10px] font-bold text-gray-500">
            <span className="hidden sm:inline">{st.locale === "id" ? "Bahasa" : "Language"}</span>
            <select
              value={st.locale}
              onChange={(event) => {
                const nextLocale = event.target.value as Locale;
                update({ locale: nextLocale });
                try {
                  localStorage.setItem(`invitation-studio-locale-${invitationId}`, nextLocale);
                } catch {}
              }}
              aria-label="Interface language"
              className="bg-transparent outline-none cursor-pointer"
            >
              <option value="id">Indonesia</option>
              <option value="en">English</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => setShowFormatModal(true)}
            className="text-xs font-extrabold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)`,
              color: "white",
              boxShadow: `0 4px 14px ${theme.accent}40`,
            }}
            title="Klik untuk intip perbedaan / ubah format undangan"
          >
            <span className="text-sm">💌</span>
            <span>Format: Invitation ⚙️</span>
          </button>
        </div>

        <div className="max-w-lg mx-auto px-5 pb-3 flex items-center gap-2">
          {STEPS.map(s => {
            const SIcon = s.Icon;
            return (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                className="flex-1 flex flex-col items-center gap-1.5"
              >
                <div
                  className="w-full h-1 rounded-full transition-all"
                  style={{ background: step >= s.id ? theme.accent : `${theme.accent}25` }}
                />
                <SIcon size={14} color={step === s.id ? theme.accent : `${theme.accent}66`} strokeWidth={2} />
              </button>
            );
          })}
        </div>
      </header>

      <div className="flex-1 max-w-lg mx-auto w-full px-5 py-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Theme */}
          {step === 1 && (
            <motion.div key="s1" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-5">
              
              {/* Prominent Format Info Banner */}
              <div className="p-4 rounded-3xl border-2 flex items-center justify-between gap-3 shadow-xs bg-white/90 backdrop-blur-md" style={{ borderColor: `${theme.accent}40` }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0" style={{ background: `${theme.accent}15` }}>
                    💌
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full text-white" style={{ background: theme.accent }}>
                        Format Aktif
                      </span>
                      <span className="text-[10px] font-bold text-gray-400">Tap untuk ubah</span>
                    </div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-gray-800 truncate mt-0.5">Invitation Date (Interaktif)</h4>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowFormatModal(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-extrabold text-white shrink-0 transition-transform active:scale-95 shadow-sm"
                  style={{ background: theme.accent }}
                >
                  Ubah Format ⚙️
                </button>
              </div>

              <div>
                <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: theme.text }}>
                  <IconPalette size={22} color={theme.accent} />
                  Pilih Tema Warna
                </h2>
                <p className="text-sm mt-1" style={{ color: theme.text, opacity: 0.6 }}>Warna ini akan mewarnai seluruh undangan kamu</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {THEMES.map(t => (
                  <motion.button
                    key={t.id}
                    onClick={() => update({ themeId: t.id })}
                    whileTap={{ scale: 0.96 }}
                    className="p-4 rounded-2xl font-bold text-sm border-2 transition-all text-left"
                    style={{
                      background: `linear-gradient(135deg, ${t.card}, ${t.bg})`,
                      borderColor: st.themeId === t.id ? t.accent : `${t.accent}33`,
                      color: t.text,
                      boxShadow: st.themeId === t.id ? `0 4px 16px ${t.accent}44` : "none",
                    }}
                  >
                    <div className="w-6 h-6 rounded-full mb-2" style={{ background: t.accent }} />
                    {t.label}
                  </motion.button>
                ))}
              </div>

              {/* Opening Shape Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: theme.accent }}>
                  Bentuk Animasi Opening ✨
                </label>
                <p className="text-xs mb-3" style={{ color: theme.text, opacity: 0.55 }}>Shape yang akan terbentuk dari bunga saat animasi pembuka</p>
                <div className="flex gap-3">
                  {(["heart", "star"] as const).map(shape => (
                    <motion.button
                      key={shape}
                      onClick={() => update({ openingShape: shape })}
                      whileTap={{ scale: 0.96 }}
                      className="flex-1 py-3.5 rounded-2xl font-bold text-sm border-2 transition-all flex flex-col items-center gap-1.5"
                      style={{
                        background: st.openingShape === shape ? `${theme.accent}15` : `${theme.accent}05`,
                        borderColor: st.openingShape === shape ? theme.accent : `${theme.accent}22`,
                        color: theme.text,
                        boxShadow: st.openingShape === shape ? `0 4px 16px ${theme.accent}30` : "none",
                      }}
                    >
                      <span style={{ fontSize: "1.6rem", lineHeight: 1 }}>
                        {shape === "heart" ? "❤️" : "⭐"}
                      </span>
                      <span className="text-xs font-bold" style={{ color: st.openingShape === shape ? theme.accent : theme.text }}>
                        {shape === "heart" ? "Hati" : "Bintang → Hati"}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 rounded-2xl font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}cc)` }}
              >
                Lanjut
              </button>
            </motion.div>
          )}

          {/* Step 2: Info */}
          {step === 2 && (
            <motion.div key="s2" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: theme.text }}>
                  <IconMail size={22} color={theme.accent} />
                  Informasi Dasar
                </h2>
                <p className="text-sm mt-1" style={{ color: theme.text, opacity: 0.6 }}>Nama yang akan muncul di undangan</p>
              </div>
              {[
                { label: "Nama Penerima", key: "recipientName", placeholder: "Nama pacar / orang spesialmu" },
                { label: "Nama Kamu", key: "senderName", placeholder: "Nama kamu sendiri" },
                { label: "Sub-teks Ajakan (opsional)", key: "subText", placeholder: "contoh: maukah kamu kencan denganku?" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest" style={{ color: theme.accent }}>
                      {label}
                    </label>
                    <button
                      type="button"
                      onClick={() => setPreviewField(key)}
                      className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xs"
                      style={{ background: `${theme.accent}15`, color: theme.accent, border: `1px solid ${theme.accent}30` }}
                      title="Klik untuk intip posisi tampilan di undangan"
                    >
                      <IconEye size={13} color={theme.accent} strokeWidth={2} />
                      <span>Intip Tampilan</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={(st as any)[key]}
                    onChange={e => update({ [key]: e.target.value } as any)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-2xl font-medium text-sm outline-none"
                    style={{ background: `${theme.accent}0a`, border: `2px solid ${theme.accent}22`, color: theme.text }}
                  />
                </div>
              ))}

              {/* Invitation Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest" style={{ color: theme.accent }}>
                    Judul Animasi Opening
                  </label>
                  <button
                    type="button"
                    onClick={() => setPreviewField("invitationTitle")}
                    className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xs"
                    style={{ background: `${theme.accent}15`, color: theme.accent, border: `1px solid ${theme.accent}30` }}
                    title="Klik untuk intip posisi tampilan di undangan"
                  >
                    <IconEye size={13} color={theme.accent} strokeWidth={2} />
                    <span>Intip Tampilan</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={st.invitationTitle}
                  onChange={e => update({ invitationTitle: e.target.value })}
                  placeholder="Invitation From"
                  className="w-full px-4 py-3 rounded-2xl font-medium text-sm outline-none"
                  style={{ background: `${theme.accent}0a`, border: `2px solid ${theme.accent}22`, color: theme.text }}
                />
                <p className="text-xs mt-1 opacity-50" style={{ color: theme.text }}>Teks yang muncul sebelum namamu di animasi pembuka (default: &ldquo;Invitation From&rdquo;)</p>
              </div>

              {/* Ticket Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest" style={{ color: theme.accent }}>
                    Judul Tiket Akhir (opsional)
                  </label>
                  <button
                    type="button"
                    onClick={() => setPreviewField("ticketTitle")}
                    className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xs"
                    style={{ background: `${theme.accent}15`, color: theme.accent, border: `1px solid ${theme.accent}30` }}
                    title="Klik untuk intip posisi tampilan di undangan"
                  >
                    <IconEye size={13} color={theme.accent} strokeWidth={2} />
                    <span>Intip Tampilan</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={st.ticketTitle}
                  onChange={e => update({ ticketTitle: e.target.value })}
                  placeholder="Tiket kencan"
                  className="w-full px-4 py-3 rounded-2xl font-medium text-sm outline-none"
                  style={{ background: `${theme.accent}0a`, border: `2px solid ${theme.accent}22`, color: theme.text }}
                />
                <p className="text-xs mt-1 opacity-50" style={{ color: theme.text }}>Judul utama di bagian atas tiket kencan (default: &ldquo;Tiket kencan&rdquo;)</p>
              </div>

              {/* Closing Note */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest" style={{ color: theme.accent }}>
                    Pesan Penutup di Tiket (opsional)
                  </label>
                  <button
                    type="button"
                    onClick={() => setPreviewField("closingNote")}
                    className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xs"
                    style={{ background: `${theme.accent}15`, color: theme.accent, border: `1px solid ${theme.accent}30` }}
                    title="Klik untuk intip posisi tampilan di undangan"
                  >
                    <IconEye size={13} color={theme.accent} strokeWidth={2} />
                    <span>Intip Tampilan</span>
                  </button>
                </div>
                <textarea
                  value={st.closingNote}
                  onChange={e => update({ closingNote: e.target.value })}
                  placeholder="Tulis pesan spesial yang akan muncul di tiket kencan..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl font-medium text-sm outline-none resize-none"
                  style={{ background: `${theme.accent}0a`, border: `2px solid ${theme.accent}22`, color: theme.text }}
                />
                <p className="text-xs mt-1 opacity-50" style={{ color: theme.text }}>Akan tampil di bagian bawah tiket kencan</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-2xl font-bold border-2" style={{ borderColor: `${theme.accent}33`, color: theme.text }}>Kembali</button>
                <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-2xl font-bold text-white" style={{ background: theme.accent }}>Lanjut</button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Photo */}
          {step === 3 && (
            <motion.div key="s3" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: theme.text }}>
                  <IconCamera size={22} color={theme.accent} />
                  Foto Polaroid
                </h2>
                <p className="text-sm mt-1" style={{ color: theme.text, opacity: 0.6 }}>Foto special yang akan ditempel di kartu undangan</p>
              </div>
              <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0]); e.target.value = ""; }} />

              {st.photoUrl ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="p-3 pb-8 bg-white shadow-lg" style={{ transform: "rotate(-2deg)" }}>
                    <img src={st.photoUrl} alt="Polaroid" className="w-48 h-48 object-cover" />
                  </div>
                  <button onClick={() => photoInputRef.current?.click()} className="text-xs font-bold underline" style={{ color: theme.accent }}>
                    Ganti foto
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => photoInputRef.current?.click()}
                  disabled={photoUploading}
                  className="w-full py-12 rounded-3xl flex flex-col items-center gap-3 border-2 border-dashed transition-all"
                  style={{ borderColor: `${theme.accent}44`, color: theme.text }}
                >
                  {photoUploading ? (
                    <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: `${theme.accent}33`, borderTopColor: theme.accent }} />
                  ) : (
                    <>
                      <IconCamera size={36} color={theme.text} strokeWidth={1} />
                      <span className="font-bold text-sm mt-2">Tap untuk upload foto</span>
                      <span className="text-xs opacity-50">Akan tampil sebagai bingkai polaroid</span>
                    </>
                  )}
                </button>
              )}

              <div className="mt-4">
                <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color: theme.accent }}>
                  Latar Musik (Opsional)
                </label>
                <button
                  onClick={() => setShowMusicModal(true)}
                  className="w-full px-4 py-3 rounded-2xl font-medium text-sm text-left flex items-center justify-between outline-none transition-all"
                  style={{ background: `${theme.accent}0a`, border: `2px solid ${theme.accent}22`, color: theme.text }}
                >
                  <span className="truncate pr-2">{st.musicTitle ? `🎵 ${st.musicTitle}` : "Tanpa Musik"}</span>
                  <span className="text-xs font-bold uppercase tracking-widest shrink-0" style={{ color: theme.accent, opacity: 0.8 }}>Pilih</span>
                </button>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-2xl font-bold border-2" style={{ borderColor: `${theme.accent}33`, color: theme.text }}>Kembali</button>
                <button onClick={() => setStep(4)} className="flex-1 py-3 rounded-2xl font-bold text-white" style={{ background: theme.accent }}>
                  {st.photoUrl ? "Lanjut" : "Lewati"}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Activities */}
          {step === 4 && (
            <motion.div key="s4" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: theme.text }}>
                  <IconSparkle size={22} color={theme.accent} />
                  Pilihan Aktivitas
                </h2>
                <p className="text-sm mt-1" style={{ color: theme.text, opacity: 0.6 }}>Centang aktivitas yang tersedia untuk dipilih penerima</p>
              </div>

              {/* Custom titles */}
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color: theme.accent }}>
                    Judul Section Aktivitas
                  </label>
                  <input
                    type="text"
                    value={st.activityTitle}
                    onChange={e => update({ activityTitle: e.target.value })}
                    placeholder="Nanti kita ngapain sayang?"
                    className="w-full px-4 py-3 rounded-2xl font-medium text-sm outline-none"
                    style={{ background: `${theme.accent}0a`, border: `2px solid ${theme.accent}22`, color: theme.text }}
                  />
                  <p className="text-xs mt-1 opacity-50" style={{ color: theme.text }}>Tampil di halaman pilihan kegiatan</p>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color: theme.accent }}>
                    Judul Section Tanggal
                  </label>
                  <input
                    type="text"
                    value={st.dateTitle}
                    onChange={e => update({ dateTitle: e.target.value })}
                    placeholder="Kapan sayangku free?"
                    className="w-full px-4 py-3 rounded-2xl font-medium text-sm outline-none"
                    style={{ background: `${theme.accent}0a`, border: `2px solid ${theme.accent}22`, color: theme.text }}
                  />
                  <p className="text-xs mt-1 opacity-50" style={{ color: theme.text }}>Tampil di halaman pilih tanggal kencan</p>
                </div>
              </div>
              <p className="text-xs font-semibold" style={{ color: theme.accent, opacity: 0.9 }}>
                💡 Tap tombol emoji di sebelah kiri untuk mengganti emoji tiap pilihan tempat!
              </p>
              <div className="grid grid-cols-2 gap-3">
                {ACTIVITIES.map(a => {
                  const active = st.selectedActivities.includes(a.id);
                  const currentEmoji = (st.customActivityEmojis || {})[a.id] ?? a.emoji;
                  
                  return (
                    <motion.div
                      key={a.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => update({ selectedActivities: active ? st.selectedActivities.filter(x => x !== a.id) : [...st.selectedActivities, a.id] })}
                      className="flex items-center gap-2 p-2.5 rounded-2xl border-2 transition-all cursor-pointer"
                      style={{
                        background: active ? `${theme.accent}15` : `${theme.accent}05`,
                        borderColor: active ? theme.accent : `${theme.accent}22`,
                        color: theme.text,
                      }}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEmojiPickerId(a.id);
                        }}
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-transform hover:scale-110 active:scale-95 shadow-xs"
                        style={{
                          background: active ? `${theme.accent}25` : "white",
                          borderColor: active ? theme.accent : `${theme.accent}40`,
                        }}
                        title="Klik untuk ganti emoji"
                      >
                        <span className="text-lg leading-none select-none">{currentEmoji}</span>
                      </button>

                      <input
                        type="text"
                        value={(st.customActivityLabels || {})[a.id] ?? a.label}
                        onClick={e => e.stopPropagation()}
                        onChange={e => update({ customActivityLabels: { ...(st.customActivityLabels || {}), [a.id]: e.target.value } })}
                        className="flex-1 text-sm font-semibold bg-transparent outline-none w-full"
                        style={{ color: theme.text }}
                      />
                      <div 
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                        style={{
                          background: active ? theme.accent : "transparent",
                          borderColor: active ? theme.accent : `${theme.accent}44`,
                        }}
                      >
                        {active && <IconCheck size={12} color="white" strokeWidth={3} />}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-2xl font-bold border-2" style={{ borderColor: `${theme.accent}33`, color: theme.text }}>Kembali</button>
                <button onClick={() => setStep(5)} className="flex-1 py-3 rounded-2xl font-bold text-white" style={{ background: theme.accent }}>Lanjut</button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Dress Codes */}
          {step === 5 && (
            <motion.div key="s5" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: theme.text }}>
                  <IconHanger size={22} color={theme.accent} />
                  Pilihan Dress Code
                </h2>
                <p className="text-sm mt-1" style={{ color: theme.text, opacity: 0.6 }}>Centang dress code yang akan tersedia</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {DRESS_CODES.map(dc => {
                  const active = st.selectedDressCodes.includes(dc);
                  const currentText = (st.customDressCodes || {})[dc] ?? dc;
                  return (
                    <motion.div
                      key={dc}
                      onClick={() => update({ selectedDressCodes: active ? st.selectedDressCodes.filter(x => x !== dc) : [...st.selectedDressCodes, dc] })}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 pl-4 pr-3 py-2 rounded-full border-2 transition-all cursor-pointer"
                      style={{
                        background: active ? theme.accent : `${theme.accent}0a`,
                        borderColor: active ? theme.accent : `${theme.accent}33`,
                        color: active ? "white" : theme.text,
                      }}
                    >
                      <input
                        type="text"
                        value={currentText}
                        onClick={e => e.stopPropagation()}
                        onChange={e => update({ customDressCodes: { ...(st.customDressCodes || {}), [dc]: e.target.value } })}
                        className="font-bold text-sm bg-transparent outline-none"
                        style={{ color: "inherit", width: `${Math.max(currentText.length, 3) * 0.9}ch` }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                        style={{
                          background: active ? "white" : "transparent",
                          borderColor: active ? "white" : `${theme.accent}44`,
                        }}
                      >
                        {active && <IconCheck size={10} color={theme.accent} strokeWidth={4} />}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(4)} className="flex-1 py-3 rounded-2xl font-bold border-2" style={{ borderColor: `${theme.accent}33`, color: theme.text }}>Kembali</button>
                <button onClick={() => setStep(6)} className="flex-1 py-3 rounded-2xl font-bold text-white" style={{ background: theme.accent }}>Lanjut</button>
              </div>
            </motion.div>
          )}

          {/* Step 6: Publish */}
          {step === 6 && (
            <motion.div key="s6" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: theme.text }}>
                  <IconRocket size={22} color={theme.accent} />
                  Publish Undangan
                </h2>
                <p className="text-sm mt-1" style={{ color: theme.text, opacity: 0.6 }}>Review terakhir sebelum dikirim ke orang spesialmu</p>
              </div>

              <div className="p-5 rounded-2xl border" style={{ background: `${theme.accent}08`, borderColor: `${theme.accent}22` }}>
                <div className="flex items-center gap-3 mb-3">
                  {st.photoUrl && <img src={st.photoUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                  <div>
                    <p className="font-bold text-sm" style={{ color: theme.text }}>Untuk: {st.recipientName || "—"}</p>
                    <p className="text-xs" style={{ color: theme.text, opacity: 0.6 }}>Dari: {st.senderName || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ background: getTheme(st.themeId).accent }} />
                  <span className="text-xs font-medium" style={{ color: theme.text, opacity: 0.7 }}>{getTheme(st.themeId).label}</span>
                </div>
              </div>

              {published && giftUrl ? (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <div ref={qrRef} className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl" style={{ border: `2px dashed ${theme.accent}40` }}>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-center opacity-70" style={{ color: theme.accent }}>Scan Untuk Membuka</p>
                      <HeartQRCode url={giftUrl} color={theme.accent} bgColor="#ffffff" size={200} />
                      <p style={{ fontFamily: "var(--font-caveat)", fontSize: "1.2rem", color: theme.text, marginTop: "16px" }}>Untuk {st.recipientName}</p>
                    </div>
                    <button
                      onClick={downloadQrCode}
                      disabled={downloadingQr}
                      className="w-full py-3 rounded-2xl font-bold text-[13px] text-white flex items-center justify-center gap-2 transition-all"
                      style={{ background: theme.accent, boxShadow: `0 4px 12px ${theme.accent}40`, opacity: downloadingQr ? 0.7 : 1 }}
                    >
                      <IconShare size={16} />
                      {downloadingQr ? "Memproses Barcode..." : "Bagikan Barcode"}
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl text-center mt-2" style={{ background: `${theme.accent}12`, border: `2px solid ${theme.accent}33` }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: theme.accent }}>Link Undangan</p>
                    <p className="text-sm font-mono break-all" style={{ color: theme.text }}>{giftUrl}</p>
                  </div>
                  <button
                    onClick={() => { navigator.clipboard.writeText(giftUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                    className="w-full py-3.5 rounded-2xl font-bold text-white transition-all"
                    style={{ background: copied ? "#4caf50" : theme.accent }}
                  >
                    {copied ? "Disalin" : "Salin Link"}
                  </button>
                  <button
                    onClick={() => window.open(giftUrl, '_blank')}
                    className="w-full py-3.5 rounded-2xl font-bold transition-all"
                    style={{ background: `${theme.accent}22`, color: theme.accent }}
                  >
                    Buka Gift
                  </button>
                  <button onClick={() => setStep(1)} className="text-xs font-semibold underline text-center mt-2" style={{ color: theme.text, opacity: 0.5 }}>
                    Kembali ke awal
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button onClick={() => setStep(5)} className="flex-1 py-3 rounded-2xl font-bold border-2" style={{ borderColor: `${theme.accent}33`, color: theme.text }}>Kembali</button>
                  <button
                    onClick={handlePublish}
                    disabled={publishing}
                    className="flex-1 py-3 rounded-2xl font-bold text-white transition-all"
                    style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}cc)`, opacity: publishing ? 0.7 : 1 }}
                  >
                    {publishing ? "Menyimpan..." : "Publish"}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showMusicModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => { setShowMusicModal(false); setPreviewUrl(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md h-[80dvh] max-h-[600px] bg-white rounded-3xl flex flex-col overflow-hidden shadow-2xl relative"
            >
              <div className="p-5 border-b flex justify-between items-center bg-white z-10" style={{ borderColor: `${theme.accent}22` }}>
                <h3 className="font-bold text-lg" style={{ color: theme.text }}>Pilih Latar Musik</h3>
                <button onClick={() => { setShowMusicModal(false); setPreviewUrl(null); }} className="text-sm font-bold" style={{ color: theme.accent }}>Tutup</button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 pb-12 sm:pb-4">
                {/* Custom Music URL Input Box */}
                <div className="p-4 rounded-2xl border-2 flex flex-col gap-2.5 transition-all" style={{ background: `${theme.accent}08`, borderColor: `${theme.accent}33` }}>
                  <p className="font-bold text-xs uppercase tracking-widest flex items-center gap-1.5" style={{ color: theme.accent }}>
                    <span>🔗</span> Tempel Link Musik (MP3 / Audio URL)
                  </p>
                  <input
                    type="url"
                    value={customMusicUrl}
                    onChange={e => setCustomMusicUrl(e.target.value)}
                    placeholder="https://domain.com/lagu-kita.mp3"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none bg-white border border-pink-200"
                    style={{ color: theme.text }}
                  />
                  <input
                    type="text"
                    value={customMusicTitle}
                    onChange={e => setCustomMusicTitle(e.target.value)}
                    placeholder="Judul Lagu (opsional: misal Lagu Kenangan Kita)"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none bg-white border border-pink-200"
                    style={{ color: theme.text }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!customMusicUrl.trim()) return;
                      update({
                        musicUrl: customMusicUrl.trim(),
                        musicTitle: customMusicTitle.trim() || "Lagu Pilihan Kamu 🎵",
                      });
                      setShowMusicModal(false);
                      showToast("Link musik berhasil dipasang!");
                    }}
                    disabled={!customMusicUrl.trim()}
                    className="w-full py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-xs"
                    style={{
                      background: theme.accent,
                      opacity: customMusicUrl.trim() ? 1 : 0.5,
                    }}
                  >
                    Pasang Link Musik Ini
                  </button>
                </div>

                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest my-1 text-center">
                  — ATAU PILIH DARI PRESET —
                </div>

                <button
                  onClick={() => { update({ musicUrl: null, musicTitle: null }); setShowMusicModal(false); setPreviewUrl(null); }}
                  className="w-full p-4 rounded-2xl border-2 flex items-center gap-3 transition-all text-left"
                  style={{
                    background: !st.musicUrl ? theme.accent : "transparent",
                    borderColor: !st.musicUrl ? theme.accent : `${theme.accent}22`,
                    color: !st.musicUrl ? "white" : theme.text,
                  }}
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-black/10 shrink-0">
                    <span className="text-2xl">🚫</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">Tanpa Musik</p>
                    <p className="text-xs truncate opacity-70">Undangan tanpa iringan lagu</p>
                  </div>
                </button>
                {playlist.map(p => {
                  const active = st.musicUrl === p.audioUrl;
                  const playing = previewUrl === p.audioUrl;
                  return (
                    <div
                      key={p.audioUrl}
                      className="w-full p-3 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer"
                      style={{
                        background: active ? `${theme.accent}15` : "transparent",
                        borderColor: active ? theme.accent : `${theme.accent}22`,
                      }}
                      onClick={() => { update({ musicUrl: p.audioUrl, musicTitle: p.title }); setShowMusicModal(false); setPreviewUrl(null); }}
                    >
                      <button
                        className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 group focus:outline-none"
                        onClick={(e) => { e.stopPropagation(); setPreviewUrl(playing ? null : p.audioUrl); }}
                      >
                        <img src={p.coverUrl} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 flex items-center justify-center transition-all" style={{ background: playing ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.2)" }} >
                          {playing ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                          ) : (
                            <svg className="opacity-90 drop-shadow-md transition-transform group-hover:scale-110" width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                          )}
                        </div>
                      </button>
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-bold text-sm truncate" style={{ color: theme.text }}>{p.title}</p>
                        <p className="text-xs truncate opacity-70" style={{ color: theme.text }}>{p.artist}</p>
                      </div>
                      {active && (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: theme.accent }}>
                          <IconCheck size={12} color="white" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Location Preview Modal */}
      <AnimatePresence>
        {previewField && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setPreviewField(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 w-full max-w-sm max-h-[85vh] shadow-2xl flex flex-col gap-3 relative overflow-hidden"
            >
              {/* Fixed Top Header with Close Button */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-pink-50">
                    <IconEye size={18} color="#e8789a" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-800">Pratinjau Posisi Tampilan</h3>
                    <p className="text-[11px] text-pink-500 font-semibold">
                      {previewField === "recipientName" && "Nama Penerima"}
                      {previewField === "senderName" && "Nama Kamu"}
                      {previewField === "subText" && "Sub-teks Ajakan"}
                      {previewField === "invitationTitle" && "Judul Animasi Opening"}
                      {previewField === "closingNote" && "Pesan Penutup di Tiket"}
                      {previewField === "openingShape" && "Bentuk Animasi Opening"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewField(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 transition-colors shrink-0"
                  title="Tutup Modal"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="overflow-y-auto flex flex-col gap-4 pr-1 max-h-[60vh]">
                {/* Visual Mini Mockup */}
                <div className="bg-gradient-to-br from-pink-50/50 to-purple-50/50 p-4 rounded-2xl border border-pink-100 flex flex-col items-center justify-center min-h-[180px]">
                  {previewField === "recipientName" && (
                    <div className="w-full flex flex-col items-center gap-2 text-center">
                      <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-pink-200 flex flex-col items-center gap-2">
                        <span className="text-[10px] italic text-amber-800 opacity-60 block">{st.invitationTitle || "Invitation From"}</span>
                        <span className="text-xs font-bold uppercase text-amber-950 block my-0.5">{st.senderName || "Nama Kamu"}</span>
                        <div className="w-6 h-px bg-amber-800/30 mx-auto" />
                        <span className="text-[10px] italic text-amber-800 opacity-60 block">For</span>
                        
                        <div className="flex flex-col items-center gap-1 w-full max-w-[200px]">
                          <span className="bg-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                            📍 POSISI: NAMA PENERIMA
                          </span>
                          <div className="w-full px-4 py-2 rounded-xl bg-pink-100 border-2 border-pink-400 animate-pulse text-center">
                            <span className="text-base font-extrabold uppercase text-pink-700 block tracking-wide">{st.recipientName || "Ziza"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {previewField === "senderName" && (
                    <div className="w-full flex flex-col items-center gap-2 text-center">
                      <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-pink-200 flex flex-col items-center gap-2">
                        <span className="text-[10px] italic text-amber-800 opacity-60 block">{st.invitationTitle || "Invitation From"}</span>
                        
                        <div className="flex flex-col items-center gap-1 w-full max-w-[200px]">
                          <span className="bg-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                            📍 POSISI: NAMA KAMU
                          </span>
                          <div className="w-full px-4 py-2 rounded-xl bg-pink-100 border-2 border-pink-400 animate-pulse text-center">
                            <span className="text-base font-extrabold uppercase text-pink-700 block tracking-wide">{st.senderName || "Rayy"}</span>
                          </div>
                        </div>

                        <div className="w-6 h-px bg-amber-800/30 mx-auto" />
                        <span className="text-[10px] italic text-amber-800 opacity-60 block">For</span>
                        <span className="text-xs font-bold uppercase text-amber-950 block">{st.recipientName || "Nama Penerima"}</span>
                      </div>
                    </div>
                  )}

                  {previewField === "invitationTitle" && (
                    <div className="w-full flex flex-col items-center gap-2 text-center">
                      <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-pink-200 flex flex-col items-center gap-2">
                        <div className="flex flex-col items-center gap-1 w-full max-w-[220px]">
                          <span className="bg-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                            📍 POSISI: JUDUL OPENING
                          </span>
                          <div className="w-full px-3 py-1.5 rounded-xl bg-pink-100 border-2 border-pink-400 animate-pulse text-center">
                            <span className="text-xs italic font-bold text-pink-700 block">{st.invitationTitle || "Invitation From"}</span>
                          </div>
                        </div>

                        <span className="text-xs font-bold uppercase text-amber-950 block">{st.senderName || "Rayy"}</span>
                        <div className="w-6 h-px bg-amber-800/30 mx-auto" />
                        <span className="text-[10px] italic text-amber-800 opacity-60 block">For</span>
                        <span className="text-xs font-bold uppercase text-amber-950 block">{st.recipientName || "Ziza"}</span>
                      </div>
                    </div>
                  )}

                  {previewField === "subText" && (
                    <div className="w-full flex flex-col items-center gap-2 text-center">
                      <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-pink-200 flex flex-col items-center gap-2">
                        <span className="text-[8px] font-bold text-pink-400 uppercase tracking-widest block mb-1">SPECIAL INVITATION</span>
                        <p className="text-xs font-bold text-gray-800">Maukah kamu pergi kencan denganku?</p>
                        
                        <div className="flex flex-col items-center gap-1 mt-1 w-full">
                          <span className="bg-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                            📍 POSISI: SUB-TEKS AJAKAN
                          </span>
                          <div className="w-full px-3 py-2 rounded-xl bg-pink-100 border-2 border-pink-400 animate-pulse text-center">
                            <p className="text-xs italic text-pink-700 font-medium">{st.subText || "contoh: maukah kamu kencan denganku?"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {previewField === "closingNote" && (
                    <div className="w-full flex flex-col items-center gap-2 text-center">
                      <div className="w-full bg-white rounded-2xl p-3.5 shadow-sm border border-dashed border-pink-300 flex flex-col items-center gap-1">
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b pb-1 w-full text-center">TIKET KENCAN</div>
                        <p className="text-[10px] text-gray-500">UNTUK: {st.recipientName || "Ziza"}</p>
                        <p className="text-[10px] text-gray-500 mb-1">KAPAN: Selasa, 28 Juli 2026</p>
                        
                        <div className="flex flex-col items-center gap-1 w-full">
                          <span className="bg-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                            📍 POSISI: PESAN PENUTUP / SURAT
                          </span>
                          <div className="w-full rounded-xl p-3 bg-pink-100 border-2 border-pink-400 animate-pulse text-left max-h-[160px] overflow-y-auto">
                            <span className="text-[8px] font-bold uppercase text-pink-600 tracking-wider block mb-1">CATATAN DARI {(st.senderName || "RAYY").toUpperCase()}</span>
                            <p className="text-[11px] italic text-pink-900 leading-snug whitespace-pre-line">{st.closingNote || "Jangan lupa istirahat yang cukup yaa..."}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {previewField === "ticketTitle" && (
                    <div className="w-full flex flex-col items-center gap-2 text-center">
                      <div className="w-full bg-white rounded-2xl p-3.5 shadow-sm border border-dashed border-pink-300 flex flex-col items-center gap-1">
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block mb-1">ADMIT TWO</span>
                        
                        <div className="flex flex-col items-center gap-1 w-full">
                          <span className="bg-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                            📍 POSISI: JUDUL TIKET AKHIR
                          </span>
                          <div className="w-full px-3 py-1.5 rounded-xl bg-pink-100 border-2 border-pink-400 animate-pulse text-center">
                            <span className="text-sm font-bold text-pink-700 block">{st.ticketTitle || "Tiket kencan"}</span>
                          </div>
                        </div>

                        <p className="text-[10px] text-gray-500 mt-2">UNTUK: {st.recipientName || "Ziza"}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="bg-pink-50/70 rounded-2xl p-3 border border-pink-100">
                  <p className="text-xs text-gray-600 leading-snug">
                    <span className="font-bold text-pink-600">💡 Posisi: </span>
                    {previewField === "recipientName" && "Tampil sebagai nama tujuan di animasi pembuka dan kartu utama undangan."}
                    {previewField === "senderName" && "Tampil sebagai nama pengirim di animasi pembuka dan footer tiket akhir."}
                    {previewField === "invitationTitle" && "Tampil sebagai kata pengantar tepat di atas namamu di animasi bunga pembuka."}
                    {previewField === "subText" && "Tampil sebagai kalimat ajakan tambahan di kartu undangan utama."}
                    {previewField === "closingNote" && "Tampil sebagai kotak catatan/surat khusus di bagian paling bawah tiket kencan."}
                    {previewField === "ticketTitle" && "Tampil sebagai judul utama di bagian paling atas tiket kencan hasil akhir."}
                  </p>
                </div>
              </div>

              {/* Fixed Bottom Button */}
              <button
                onClick={() => setPreviewField(null)}
                className="w-full py-3 rounded-2xl font-bold text-sm text-white bg-pink-400 hover:bg-pink-500 transition-colors shadow-md shadow-pink-200 shrink-0 mt-1"
              >
                Paham & Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Preset Emoji Picker Modal */}
      <AnimatePresence>
        {emojiPickerId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setEmojiPickerId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 w-full max-w-sm max-h-[85vh] shadow-2xl flex flex-col gap-3 relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0">
                <div>
                  <h3 className="font-bold text-sm text-gray-800">Pilih Emoji Tempat ✨</h3>
                  <p className="text-[11px] text-pink-500 font-semibold">
                    {(st.customActivityLabels || {})[emojiPickerId] ?? ACTIVITIES.find(x => x.id === emojiPickerId)?.label ?? "Aktivitas"}
                  </p>
                </div>
                <button
                  onClick={() => setEmojiPickerId(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 transition-colors shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Emoji Preset Categories */}
              <div className="overflow-y-auto flex flex-col gap-4 pr-1 max-h-[55vh]">
                {EMOJI_CATEGORIES.map((cat) => (
                  <div key={cat.name} className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{cat.name}</span>
                    <div className="grid grid-cols-6 gap-2">
                      {cat.emojis.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            update({
                              customActivityEmojis: {
                                ...(st.customActivityEmojis || {}),
                                [emojiPickerId]: emoji,
                              },
                            });
                            setEmojiPickerId(null);
                          }}
                          className="w-10 h-10 rounded-2xl flex items-center justify-center text-2xl transition-all hover:scale-125 hover:bg-pink-50 active:scale-95 border border-transparent hover:border-pink-200"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setEmojiPickerId(null)}
                className="w-full py-2.5 rounded-2xl font-bold text-xs text-white bg-pink-400 hover:bg-pink-500 transition-colors shadow-sm shrink-0 mt-1"
              >
                Selesai
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Format Comparison & Switch Modal */}
      <AnimatePresence>
        {showFormatModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setShowFormatModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[85vh] shadow-2xl flex flex-col gap-4 relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-800">Format Undangan Kencan ✨</h3>
                  <p className="text-[11px] text-pink-500 font-semibold">Pilih format terbaik untuk momen kalian</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFormatModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 transition-colors shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Format Comparison */}
              <div className="overflow-y-auto flex flex-col gap-3 pr-1 max-h-[60vh]">
                {/* Active Mode Card: Invitation Date */}
                <div className="p-4 rounded-2xl border-2 border-pink-400 bg-pink-50/60 flex flex-col gap-2 relative">
                  <span className="absolute top-3 right-3 text-[9px] font-extrabold bg-pink-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Format Aktif
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💌</span>
                    <h4 className="font-extrabold text-sm text-gray-800">Invitation Date (Interaktif)</h4>
                  </div>
                  <p className="text-xs text-gray-600 leading-snug">
                    Format di mana <b>pasangan yang menentukan sendiri</b> tanggal, kegiatan, & dresscode kencan melalui survey interaktif.
                  </p>
                  <ul className="text-[11px] text-gray-500 flex flex-col gap-1 list-disc pl-4 mt-1 font-medium">
                    <li>Ada animasi amplop & bunga pembuka.</li>
                    <li>Pasangan memilih dari opsi tanggal & kegiatan.</li>
                    <li>Menghasilkan Tiket Kencan sesuai pilihan pasangan.</li>
                  </ul>
                </div>

                {/* Target Switch Mode Card: Rundown Date */}
                <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50 flex flex-col gap-2 hover:border-pink-300 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⏱️</span>
                    <h4 className="font-extrabold text-sm text-gray-800">Rundown Date (Itinerary)</h4>
                  </div>
                  <p className="text-xs text-gray-600 leading-snug">
                    Format susunan agenda kencan <b>jam demi jam</b> yang sudah kamu rencanakan rapi dari pagi hingga malam.
                  </p>
                  <ul className="text-[11px] text-gray-500 flex flex-col gap-1 list-disc pl-4 mt-1 font-medium">
                    <li>Linimasa itinerary waktu & lokasi (09:00, 12:00, 15:00).</li>
                    <li>Dilengkapi QR Barcode Tiket Masuk Kencan.</li>
                    <li>Cocok untuk Anniversary / Trip Seharian.</li>
                  </ul>

                  <button
                    type="button"
                    onClick={() => handleSwitchMode("rundown")}
                    disabled={switchingFormat}
                    className="w-full py-2.5 mt-1 rounded-xl text-xs font-bold text-white bg-pink-500 hover:bg-pink-600 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {switchingFormat ? "Mengubah Format..." : "Ubah ke Rundown Date ⏱️"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {previewUrl && <audio src={previewUrl} autoPlay onEnded={() => setPreviewUrl(null)} />}
    </div>
  );
}
