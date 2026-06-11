"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as htmlToImage from "html-to-image";
import { THEMES, ACTIVITIES, DRESS_CODES, getTheme } from "@/lib/constants";
import {
  IconPalette, IconMail, IconCamera, IconSparkle, IconHanger, IconRocket, ACTIVITY_ICONS, IconCheck, IconShare
} from "@/components/ui/Icon";
import HeartQRCode from "@/components/ui/HeartQRCode";

interface State {
  themeId: string;
  recipientName: string;
  senderName: string;
  subText: string;
  photoUrl: string | null;
  selectedActivities: string[];
  customActivityLabels: Record<string, string>;
  selectedDressCodes: string[];
  customDressCodes: Record<string, string>;
  status: "draft" | "published";
  musicUrl: string | null;
  musicTitle: string | null;
}

const INITIAL: State = {
  themeId: "pink",
  recipientName: "",
  senderName: "",
  subText: "",
  photoUrl: null,
  selectedActivities: ["dinner", "cinema", "walk", "gaming", "shopping", "cafe"],
  customActivityLabels: {},
  selectedDressCodes: ["Casual", "Semi-formal", "Couple Outfit", "Formal", "Bebas"],
  customDressCodes: {},
  status: "draft",
  musicUrl: null,
  musicTitle: null,
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
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
        setSt(s => ({
          ...s,
          themeId: data.themeId ?? s.themeId,
          recipientName: data.recipientName ?? s.recipientName,
          senderName: data.senderName ?? s.senderName,
          subText: data.subText ?? s.subText,
          photoUrl: data.photoUrl ?? s.photoUrl,
          selectedActivities: data.activities?.map((a: any) => a.id) ?? s.selectedActivities,
          customActivityLabels: data.activities?.reduce((acc: any, a: any) => ({ ...acc, [a.id]: a.label }), {}) ?? s.customActivityLabels,
          selectedDressCodes: data.dressCodes ?? s.selectedDressCodes,
          customDressCodes: {},
          status: data.status ?? s.status,
          musicUrl: data.musicUrl ?? s.musicUrl,
          musicTitle: data.musicTitle ?? s.musicTitle,
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
        themeId: st.themeId,
        recipientName: st.recipientName,
        senderName: st.senderName,
        subText: st.subText,
        photoUrl: st.photoUrl,
        activities: ACTIVITIES
          .filter(a => st.selectedActivities.includes(a.id))
          .map(a => ({ ...a, label: (st.customActivityLabels || {})[a.id] ?? a.label })),
        dressCodes: st.selectedDressCodes.map(dc => (st.customDressCodes || {})[dc] ?? dc),
        status: "published",
        musicUrl: st.musicUrl,
        musicTitle: st.musicTitle,
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
        alert(data.error || "Gagal menyimpan");
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan. Coba lagi.");
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
      alert("Gagal memproses gambar. Coba lagi.");
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
          <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `${theme.accent}15`, color: theme.accent }}>
            ID: {invitationId}
          </span>
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
                  <label className="text-xs font-bold uppercase tracking-widest block mb-1.5" style={{ color: theme.accent }}>
                    {label}
                  </label>
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
              <div className="grid grid-cols-2 gap-3">
                {ACTIVITIES.map(a => {
                  const active = st.selectedActivities.includes(a.id);
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
                  const svgFileName = SVG_MAP[a.id];
                  
                  return (
                    <motion.div
                      key={a.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => update({ selectedActivities: active ? st.selectedActivities.filter(x => x !== a.id) : [...st.selectedActivities, a.id] })}
                      className="flex items-center gap-2 p-3 rounded-2xl border-2 transition-all cursor-pointer"
                      style={{
                        background: active ? `${theme.accent}15` : `${theme.accent}05`,
                        borderColor: active ? theme.accent : `${theme.accent}22`,
                        color: theme.text,
                      }}
                    >
                      {svgFileName ? (
                        <img 
                          src={`/${svgFileName}`} 
                          alt={a.label} 
                          className="w-4 h-4 object-contain flex-shrink-0"
                          style={{ filter: active ? "none" : "opacity(0.5) grayscale(100%)" }} 
                        />
                      ) : (
                        <IconSparkle size={16} color={active ? theme.accent : theme.text} className="flex-shrink-0" />
                      )}
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
      {previewUrl && <audio src={previewUrl} autoPlay onEnded={() => setPreviewUrl(null)} />}
    </div>
  );
}
