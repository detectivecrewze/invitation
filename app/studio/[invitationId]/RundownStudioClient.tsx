"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { nanoid } from "nanoid";
import { THEMES, DRESS_CODES, PRESET_PLAYLIST, getTheme, formatIndonesianDate } from "@/lib/constants";
import { normaliseLocale, observeStaticDom, translateLocaleValue, translateStaticDom, type Locale } from "@/lib/locale";
import type { RundownItem } from "@/lib/types";
import * as htmlToImage from "html-to-image";
import HeartQRCode from "@/components/ui/HeartQRCode";
import StudioOverviewPanel from "@/components/studio/StudioOverviewPanel";
import {
  IconPalette,
  IconMail,
  IconCamera,
  IconSparkle,
  IconHanger,
  IconRocket,
  IconCheck,
  IconWhatsApp,
  IconShare,
  IconMessage,
  IconEye,
  IconCalendar,
  IconClock,
  IconClipboard,
  IconSettings,
  RUNDOWN_SVG_OPTIONS,
  ActivityIconSvg,
  DRESSCODE_SVG_OPTIONS,
  DressCodeIconSvg,
} from "@/components/ui/Icon";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RundownState {
  locale: Locale;
  themeId: string;
  recipientName: string;
  senderName: string;
  subText: string;
  eventDate: string;
  photoUrl: string | null;
  rundownItems: RundownItem[];
  rundownTitle: string;
  selectedDressCodes: string[];
  customDressCodes: Record<string, string>;
  dressCodeIcons: Record<string, string>;
  status: "draft" | "published";
  musicUrl: string | null;
  musicTitle: string | null;
  invitationTitle: string;
  closingNote: string;
  openingShape: "heart" | "star";
  ticketTitle: string;
}

// ─── Pre-filled English Rundown Items for New Invitations ────────────────────

const DEFAULT_ENGLISH_ITEMS: RundownItem[] = [
  { id: "def-1", time: "08:00 - 08:30", icon: "car", emoji: "car", title: "Pick up my babe", location: "Home", note: "Don't be late!" },
  { id: "def-2", time: "08:30 - 09:30", icon: "food", emoji: "food", title: "Breakfast date", location: "Favorite Cafe", note: "Coffee & croissants" },
  { id: "def-3", time: "10:00 - 12:30", icon: "movie", emoji: "movie", title: "Movie premiere", location: "Cinema XXI", note: "Caramel popcorn time!" },
  { id: "def-4", time: "13:00 - 15:00", icon: "icecream", emoji: "icecream", title: "Romantic lunch & gelato", location: "Italian Restaurant", note: "Try the fresh pasta" },
  { id: "def-5", time: "15:30 - 18:00", icon: "shopping", emoji: "shopping", title: "Strolling, shopping & snacks", location: "City Mall", note: "Photo booth time!" },
  { id: "def-6", time: "18:30 - 19:30", icon: "home", emoji: "home", title: "Drop you off home", location: "Home", note: "See you next time, babe!" },
];

const INITIAL: RundownState = {
  locale: "en",
  themeId: "pink",
  recipientName: "",
  senderName: "",
  subText: "Special Date Rundown & Invitation",
  eventDate: "",
  photoUrl: null,
  rundownItems: DEFAULT_ENGLISH_ITEMS.map(it => ({ ...it, id: nanoid(6) })),
  rundownTitle: "Date Itinerary & Rundown",
  selectedDressCodes: ["Casual", "Semi-formal"],
  customDressCodes: {},
  dressCodeIcons: { "Casual": "shirt", "Semi-formal": "dress" },
  status: "draft",
  musicUrl: null,
  musicTitle: null,
  invitationTitle: "Rundown & Invitation From",
  closingNote: "If you feel tired or want to change anything, we can tweak the schedule together!",
  openingShape: "heart",
  ticketTitle: "Date Ticket & Itinerary",
};

// Reordered Steps: Step 4 is Dress Code, Step 5 is Rundown, Step 6 is Note!
const STEPS = [
  { id: 1, label: "Tema",       Icon: IconPalette  },
  { id: 2, label: "Info",       Icon: IconMail     },
  { id: 3, label: "Foto",       Icon: IconCamera   },
  { id: 4, label: "Dress Code", Icon: IconHanger   },
  { id: 5, label: "Rundown",    Icon: IconSparkle  },
  { id: 6, label: "Note",       Icon: IconMessage  },
  { id: 7, label: "Publish",    Icon: IconRocket   },
];

const DEFAULT_DRESS_CODES: string[] = Array.from(DRESS_CODES);

const EMOJI_PRESETS = [
  "🚗", "🍽️", "🥤", "☕", "🎬", "🛍️", "🏠", "💖", "🍦", "🎵", "📸", "🌅", "🎁", "🎮", "🚶", "🚲", "🏖️", "🏨", "🌸", "📖", "✈️", "🐾", "🍿", "🍕", "🍝", "🍔", "💐", "⏰", "✨"
];

// ─── Helper: RundownItem row ──────────────────────────────────────────────────

function ItemRow({
  item,
  index,
  total,
  accent,
  locale,
  onUpdate,
  onDelete,
  onMove,
}: {
  item: RundownItem;
  index: number;
  total: number;
  accent: string;
  locale: Locale;
  onUpdate: (id: string, patch: Partial<RundownItem>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
}) {
  const [expanded, setExpanded] = useState(index === 0);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [pickerTab, setPickerTab] = useState<"svg" | "emoji">("svg");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const isId = locale === "id";
  const selectedVisual = item.icon || item.emoji || "sparkle";
  const customEmoji = RUNDOWN_SVG_OPTIONS.some((option) => option.key === selectedVisual)
    ? ""
    : selectedVisual;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
    >
      <div className="flex items-center gap-2.5 sm:gap-3 px-3.5 py-3.5 sm:px-5 sm:py-4">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3 text-left"
          aria-expanded={expanded}
        >
          <span className="w-5 text-center font-mono text-xs sm:text-sm font-bold text-slate-400 shrink-0 select-none">
            {index + 1}
          </span>
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
            style={{ borderColor: `${accent}35`, background: `${accent}10` }}
          >
            <ActivityIconSvg iconKey={selectedVisual} size={20} color={accent} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold" style={{ color: accent }}>
              {item.time || (isId ? "Waktu belum diisi" : "Time not set")}
            </span>
            <span className="mt-0.5 block truncate text-sm font-semibold text-slate-900">
              {item.title || (isId ? "Kegiatan tanpa judul" : "Untitled activity")}
            </span>
            {item.location && (
              <span className="mt-0.5 block truncate text-xs text-slate-500">{item.location}</span>
            )}
          </span>
          <span className="shrink-0 text-xs font-semibold text-slate-500">
            {expanded ? (isId ? "Tutup" : "Close") : "Edit"}
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-1 border-l border-slate-200 pl-2">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(item.id, -1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-slate-500 hover:bg-slate-100 disabled:opacity-25"
            aria-label={isId ? "Geser ke atas" : "Move up"}
          >
            {"\u2191"}
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(item.id, 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm text-slate-500 hover:bg-slate-100 disabled:opacity-25"
            aria-label={isId ? "Geser ke bawah" : "Move down"}
          >
            {"\u2193"}
          </button>
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50"
            aria-label={isId ? "Hapus kegiatan" : "Delete activity"}
          >
            {"\u00d7"}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {confirmingDelete && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-red-100 bg-red-50"
          >
            <div className="flex items-center justify-between gap-4 px-5 py-3">
              <p className="text-sm font-medium text-red-800">
                {isId ? "Hapus kegiatan ini dari rundown?" : "Remove this activity from the schedule?"}
              </p>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
                >
                  {isId ? "Batal" : "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  {isId ? "Hapus" : "Delete"}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-200"
          >
            <div className="space-y-5 px-4 py-5 sm:px-5">
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="text-xs font-semibold text-slate-700">
                    {isId ? "Ikon kegiatan" : "Activity icon"}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowIconPicker((value) => !value)}
                    className="text-xs font-semibold"
                    style={{ color: accent }}
                  >
                    {showIconPicker
                      ? (isId ? "Selesai" : "Done")
                      : (isId ? "Ganti ikon" : "Change icon")}
                  </button>
                </div>

                {showIconPicker && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="mb-3 flex gap-1 border-b border-slate-200 pb-3">
                      <button
                        type="button"
                        onClick={() => setPickerTab("svg")}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold"
                        style={{
                          background: pickerTab === "svg" ? accent : "transparent",
                          color: pickerTab === "svg" ? "white" : "#475569",
                        }}
                      >
                        Icon
                      </button>
                      <button
                        type="button"
                        onClick={() => setPickerTab("emoji")}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold"
                        style={{
                          background: pickerTab === "emoji" ? accent : "transparent",
                          color: pickerTab === "emoji" ? "white" : "#475569",
                        }}
                      >
                        Emoji
                      </button>
                    </div>

                    {pickerTab === "svg" ? (
                      <div className="grid grid-cols-6 gap-2 sm:grid-cols-10">
                        {RUNDOWN_SVG_OPTIONS.map(({ key, label, Icon }) => {
                          const active = selectedVisual === key;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => {
                                onUpdate(item.id, { icon: key, emoji: key });
                                setShowIconPicker(false);
                              }}
                              title={label}
                              className="flex aspect-square items-center justify-center rounded-lg border bg-white"
                              style={{
                                borderColor: active ? accent : "#e2e8f0",
                                boxShadow: active ? `0 0 0 1px ${accent}` : "none",
                              }}
                            >
                              <Icon size={18} color={accent} strokeWidth={1.8} />
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={customEmoji}
                          onChange={(event) => {
                            const value = event.target.value;
                            onUpdate(item.id, { icon: value, emoji: value });
                          }}
                          placeholder={isId ? "Tempel satu emoji" : "Paste one emoji"}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                        />
                        <div className="grid max-h-36 grid-cols-8 gap-2 overflow-y-auto">
                          {EMOJI_PRESETS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                onUpdate(item.id, { icon: emoji, emoji });
                                setShowIconPicker(false);
                              }}
                              className="flex aspect-square items-center justify-center rounded-lg border border-slate-200 bg-white text-lg"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[180px_minmax(0,1fr)]">
                <StudioItemField label={isId ? "Waktu" : "Time"}>
                  <input
                    type="text"
                    value={item.time}
                    onChange={(event) => onUpdate(item.id, { time: event.target.value })}
                    placeholder="07:30 - 08:10"
                    className="studio-item-input font-mono"
                  />
                </StudioItemField>
                <StudioItemField label={isId ? "Judul kegiatan" : "Activity title"}>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(event) => onUpdate(item.id, { title: event.target.value })}
                    placeholder={isId ? "Makan malam bersama" : "Dinner together"}
                    className="studio-item-input"
                  />
                </StudioItemField>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StudioItemField label={isId ? "Lokasi" : "Location"}>
                  <input
                    type="text"
                    value={item.location}
                    onChange={(event) => onUpdate(item.id, { location: event.target.value })}
                    placeholder={isId ? "Nama tempat" : "Venue name"}
                    className="studio-item-input"
                  />
                </StudioItemField>
                <StudioItemField label={isId ? "Link Google Maps (opsional)" : "Google Maps link (optional)"}>
                  <input
                    type="url"
                    value={item.locationUrl || ""}
                    onChange={(event) => onUpdate(item.id, { locationUrl: event.target.value })}
                    placeholder="https://maps.app.goo.gl/..."
                    className="studio-item-input font-mono"
                  />
                </StudioItemField>
              </div>

              <StudioItemField label={isId ? "Catatan (opsional)" : "Note (optional)"}>
                <textarea
                  rows={2}
                  value={item.note}
                  onChange={(event) => onUpdate(item.id, { note: event.target.value })}
                  placeholder={isId ? "Detail kecil yang perlu diingat" : "A small detail to remember"}
                  className="studio-item-input resize-y"
                />
              </StudioItemField>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function StudioItemField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>
      {children}
    </label>
  );
}

// Rundown editor
export default function RundownStudioClient({
  invitationId,
  bundleToken,
}: {
  invitationId: string;
  bundleToken: string | null;
}) {
  const [step, setStep] = useState(1);
  const [st, setSt] = useState<RundownState>(INITIAL);
  const [toast, setToast] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [downloadingBarcode, setDownloadingBarcode] = useState(false);
  const [giftUrl, setGiftUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [editingIconDc, setEditingIconDc] = useState<string | null>(null);
  const [dcPickerTab, setDcPickerTab] = useState<"svg" | "emoji">("svg");
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [customMusicUrl, setCustomMusicUrl] = useState("");
  const [customMusicTitle, setCustomMusicTitle] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewField, setPreviewField] = useState<string | null>(null);
  const [showMobileOverview, setShowMobileOverview] = useState(false);
  const [playlist, setPlaylist] = useState<Array<{ title: string; artist: string; audioUrl: string; coverUrl: string }>>(PRESET_PLAYLIST);

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

  useEffect(() => {
    fetch("/assets/playlist.json")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPlaylist(data);
        }
      })
      .catch(() => {});
  }, []);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const barcodeCardRef = useRef<HTMLDivElement>(null);

  const [showFormatModal, setShowFormatModal] = useState(false);
  const [switchingFormat, setSwitchingFormat] = useState(false);

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
          eventDate: st.eventDate,
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

  const theme = getTheme(st.themeId);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleDownloadBarcode = useCallback(async () => {
    if (!barcodeCardRef.current) return;
    setDownloadingBarcode(true);
    try {
      const dataUrl = await htmlToImage.toPng(barcodeCardRef.current, {
        quality: 1,
        pixelRatio: 3.125, // 300 DPI resolution (300 / 96 = 3.125)
        cacheBust: true,
        style: { transform: "scale(1)", margin: "0" },
      });

      const filename = `barcode-rundown-${(st.recipientName || "kencan").replace(/\s+/g, "-").toLowerCase()}.png`;

      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
      showToast("Kartu Barcode berhasil diunduh!");
    } catch (err) {
      console.error("Gagal unduh barcode:", err);
      showToast("Gagal mengunduh barcode. Coba lagi.");
    } finally {
      setDownloadingBarcode(false);
    }
  }, [st.recipientName, showToast]);

  const update = useCallback((patch: Partial<RundownState>) => {
    setSt((s) => ({ ...s, ...patch }));
    setPublished(false);
  }, []);

  // ── Load existing data ────────────────────────────────────────────────────

  useEffect(() => {
    fetch(`/api/invitations?id=${invitationId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;

        const loadedCustomDC: Record<string, string> = {};
        const loadedSelectedDC: string[] = [];
        if (data.dressCodes && Array.isArray(data.dressCodes)) {
          const unique = Array.from(new Set<string>(data.dressCodes));
          unique.forEach((dc: string, idx: number) => {
            if (DEFAULT_DRESS_CODES.includes(dc)) {
              if (!loadedSelectedDC.includes(dc)) loadedSelectedDC.push(dc);
            } else {
              const slotKey =
                DEFAULT_DRESS_CODES[idx] ??
                DEFAULT_DRESS_CODES[loadedSelectedDC.length] ??
                dc;
              loadedCustomDC[slotKey] = dc;
              if (!loadedSelectedDC.includes(slotKey)) loadedSelectedDC.push(slotKey);
            }
          });
        }

        const savedLocale = (typeof window !== "undefined" && localStorage.getItem(`invitation-studio-locale-${invitationId}`)) as Locale | null;
        setSt((s) => ({
          ...s,
          locale:           savedLocale || normaliseLocale(data.locale, s.locale || "en"),
          themeId:          data.themeId          ?? s.themeId,
          recipientName:    data.recipientName     ?? s.recipientName,
          senderName:       data.senderName        ?? s.senderName,
          subText:          data.subText           ?? s.subText,
          eventDate:        data.eventDate         ?? s.eventDate,
          photoUrl:         data.photoUrl          ?? s.photoUrl,
          rundownItems:     data.rundownItems && data.rundownItems.length > 0 ? data.rundownItems : s.rundownItems,
          rundownTitle:     data.rundownTitle      ?? s.rundownTitle,
          selectedDressCodes: loadedSelectedDC.length > 0 ? loadedSelectedDC : s.selectedDressCodes,
          customDressCodes: loadedCustomDC,
          status:           data.status            ?? s.status,
          musicUrl:         data.musicUrl          ?? s.musicUrl,
          musicTitle:       data.musicTitle        ?? s.musicTitle,
          invitationTitle:  data.invitationTitle   ?? s.invitationTitle,
          closingNote:      data.closingNote       ?? s.closingNote,
          openingShape:     data.openingShape      ?? s.openingShape,
          ticketTitle:      data.ticketTitle       ?? s.ticketTitle,
        }));

        if (data.status === "published") {
          setPublished(true);
          setGiftUrl(`${window.location.origin}/${invitationId}`);
        }
      })
      .catch(() => {});
  }, [invitationId]);

  // ── Photo upload ──────────────────────────────────────────────────────────

  const handlePhotoUpload = async (file: File) => {
    if (file.size > 8 * 1024 * 1024) {
      showToast("Gambar terlalu besar. Maks 8MB.");
      return;
    }
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

  // ── Rundown item helpers ──────────────────────────────────────────────────

  const addItem = () => {
    const newItem: RundownItem = {
      id: nanoid(6),
      time: "18:00",
      title: "",
      location: "",
      note: "",
      emoji: "⏰",
    };
    update({ rundownItems: [...st.rundownItems, newItem] });
  };

  const updateItem = (id: string, patch: Partial<RundownItem>) => {
    update({
      rundownItems: st.rundownItems.map((it) =>
        it.id === id ? { ...it, ...patch } : it
      ),
    });
  };

  const deleteItem = (id: string) => {
    update({ rundownItems: st.rundownItems.filter((it) => it.id !== id) });
  };

  const moveItem = (id: string, dir: -1 | 1) => {
    const items = [...st.rundownItems];
    const idx = items.findIndex((it) => it.id === id);
    if (idx < 0) return;
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    [items[idx], items[target]] = [items[target], items[idx]];
    update({ rundownItems: items });
  };

  // ── Publish ───────────────────────────────────────────────────────────────

  const handlePublish = useCallback(async () => {
    if (!st.recipientName || !st.senderName) {
      showToast("Isi nama pengirim & penerima dulu!");
      return;
    }
    setPublishing(true);
    try {
      const resolvedDressCodes = Array.from(
        new Set(
          st.selectedDressCodes.map(
            (dc) => (st.customDressCodes || {})[dc] ?? dc
          )
        )
      );

      const resolvedDressCodeIcons: Record<string, string> = { ...(st.dressCodeIcons || {}) };
      st.selectedDressCodes.forEach((dcKey) => {
        const finalText = (st.customDressCodes || {})[dcKey] ?? dcKey;
        const icon = (st.dressCodeIcons || {})[dcKey];
        if (icon) {
          resolvedDressCodeIcons[finalText] = icon;
          resolvedDressCodeIcons[dcKey] = icon;
        }
      });

      const payload = {
        invitationId,
        mode: "rundown",
        locale:          st.locale,
        themeId:         st.themeId,
        recipientName:   st.recipientName,
        senderName:      st.senderName,
        subText:         st.subText,
        eventDate:       st.eventDate,
        photoUrl:        st.photoUrl,
        rundownItems:    st.rundownItems,
        rundownTitle:    st.rundownTitle  || "Rundown Date Special",
        dressCodes:      resolvedDressCodes,
        dressCodeIcons:  resolvedDressCodeIcons,
        status:          "published",
        musicUrl:        st.musicUrl,
        musicTitle:      st.musicTitle,
        invitationTitle: st.invitationTitle || "Rundown & Invitation From",
        closingNote:     st.closingNote  || "",
        openingShape:    st.openingShape || "heart",
        ticketTitle:     st.ticketTitle  || "Rundown Kencan",
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
        showToast("Rundown berhasil dipublish!");
      } else {
        alert(translateLocaleValue(data.error || "Gagal menyimpan", st.locale));
      }
    } catch (e) {
      console.error(e);
      alert(translateLocaleValue("Terjadi kesalahan. Coba lagi.", st.locale));
    } finally {
      setPublishing(false);
    }
  }, [st, invitationId, bundleToken, showToast]);

  // ── Shared UI helpers ─────────────────────────────────────────────────────

  const inputClass =
    "w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-pink-300 bg-gray-50 transition-colors font-medium";

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className="studio-shell min-h-screen flex flex-col"
      style={{ background: `radial-gradient(ellipse at 50% 0%, ${theme.bg} 0%, #fafafa 100%)` }}
    >
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-xl"
            style={{ background: theme.accent }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Bar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 px-3.5 sm:px-6 py-2.5 sm:py-3 sticky top-0 z-30">
        <div className="mx-auto flex w-full max-w-[1360px] flex-wrap items-center justify-between gap-x-2 gap-y-2">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${theme.accent}15` }}>
              <IconClock size={16} color={theme.accent} strokeWidth={2.2} />
            </div>
            <h1 className="font-extrabold text-xs sm:text-sm text-gray-800 tracking-tight">
              Rundown Studio
            </h1>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowMobileOverview(true)}
              className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 shadow-xs lg:hidden cursor-pointer hover:bg-slate-50 active:scale-95 transition-all shrink-0"
              title={st.locale === "id" ? "Ringkasan proyek" : "Project overview"}
            >
              <IconClipboard size={12} color="#475569" strokeWidth={2} className="shrink-0" />
              <span className="hidden xs:inline">{st.locale === "id" ? "Ringkasan" : "Overview"}</span>
            </button>
            <label className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 text-[10px] font-bold text-gray-500 shrink-0 border border-gray-100">
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
                className="bg-transparent outline-none cursor-pointer font-bold text-[11px] text-gray-700"
              >
                <option value="id">ID</option>
                <option value="en">EN</option>
              </select>
            </label>
            <button
              type="button"
              onClick={() => setShowFormatModal(true)}
              className="text-[11px] sm:text-xs font-extrabold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer shrink-0 whitespace-nowrap"
              style={{
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)`,
                color: "white",
                boxShadow: `0 4px 14px ${theme.accent}40`,
              }}
              title="Klik untuk intip perbedaan / ubah format undangan"
            >
              <IconClock size={12} color="white" strokeWidth={2.2} className="shrink-0" />
              <span className="hidden sm:inline">Format: Rundown</span>
              <span className="sm:hidden">Rundown</span>
              <IconSettings size={11} color="white" strokeWidth={2.2} className="shrink-0 opacity-80" />
            </button>
          </div>
        </div>
      </header>

      {/* Step bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="mx-auto w-full max-w-[1360px] px-4 py-3 lg:px-8">
          <div className="flex items-center justify-between">
            {STEPS.map((s) => {
              const done = step > s.id;
              const active = step === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => step > s.id && setStep(s.id)}
                  className="flex flex-col items-center gap-1 flex-1 transition-opacity"
                  style={{ opacity: active ? 1 : done ? 0.85 : 0.35 }}
                  disabled={step <= s.id}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: active || done ? theme.accent : "#e5e7eb",
                    }}
                  >
                    {done ? (
                      <IconCheck size={12} color="white" strokeWidth={2.5} />
                    ) : (
                      <s.Icon size={12} color={active ? "white" : "#9ca3af"} strokeWidth={2} />
                    )}
                  </div>
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider hidden sm:block"
                    style={{ color: active ? theme.accent : "#9ca3af" }}
                  >
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
          {/* Progress bar */}
          <div className="mt-2 h-1 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${((step - 1) / (STEPS.length - 1)) * 100}%`,
                background: theme.accent,
              }}
            />
          </div>
        </div>
      </div>

      {/* Desktop workspace: editor + persistent project overview */}
      <div className="flex-1 px-4 py-8 lg:px-8">
        <div className="mx-auto grid w-full max-w-[1360px] grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,720px)_minmax(340px,1fr)] xl:gap-12">
          <main className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >

            {/* ── Step 1: Tema ─────────────────────────────────────────────── */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                {/* Prominent Format Info Banner */}
                <div
                  className="p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md flex items-center justify-between gap-3 shadow-[0_2px_12px_rgba(15,23,42,0.04)]"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <div
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 border"
                      style={{ background: `${theme.accent}10`, borderColor: `${theme.accent}25` }}
                    >
                      <IconClock size={17} color={theme.accent} strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: theme.accent }} />
                        <span
                          className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: theme.accent }}
                        >
                          {st.locale === "id" ? "Format Aktif" : "Active Format"}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 leading-snug break-words">
                        Rundown Date (Itinerary)
                      </h4>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowFormatModal(true)}
                    className="group px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold shrink-0 whitespace-nowrap transition-all duration-200 active:scale-95 shadow-2xs hover:shadow-xs cursor-pointer flex items-center gap-1.5 border"
                    style={{
                      borderColor: `${theme.accent}35`,
                      color: theme.accent,
                      background: "white",
                    }}
                  >
                    <IconSettings size={12} color={theme.accent} strokeWidth={2.2} className="shrink-0 transition-transform duration-300 group-hover:rotate-45" />
                    <span className="sm:hidden">{st.locale === "id" ? "Ubah" : "Change"}</span>
                    <span className="hidden sm:inline">{st.locale === "id" ? "Ubah Format" : "Change Format"}</span>
                  </button>
                </div>
                <StepHeader accent={theme.accent} label="Pilih Tema" sub="Warna khas untuk seluruh tampilan undangan" />
                <div className="grid grid-cols-2 gap-3">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => update({ themeId: t.id })}
                      className="rounded-2xl p-4 border-2 text-left transition-all"
                      style={{
                        background: t.bg,
                        borderColor: st.themeId === t.id ? t.accent : "transparent",
                        boxShadow: st.themeId === t.id ? `0 0 0 1px ${t.accent}` : "none",
                      }}
                    >
                      <div className="w-8 h-8 rounded-xl mb-2" style={{ background: t.accent }} />
                      <p className="text-xs font-bold" style={{ color: t.text }}>{t.label}</p>
                    </button>
                  ))}
                </div>
                <NavButtons accent={theme.accent} onNext={() => setStep(2)} canNext />
              </div>
            )}

            {/* ── Step 2: Info ─────────────────────────────────────────────── */}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                <StepHeader accent={theme.accent} label="Informasi Dasar" sub="Isi info yang akan tampil di cover pembuka & tiket rundown" />
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
                  <Field label="Nama Penerima" hint="Nama pasangan yang menerima rundown ini" accent={theme.accent} onPreview={() => setPreviewField("recipientName")}>
                    <input
                      className={inputClass}
                      value={st.recipientName}
                      onChange={(e) => update({ recipientName: e.target.value })}
                      placeholder="Nama pasangan / orang spesialmu"
                    />
                  </Field>

                  <Field label="Nama Pengirim" hint="Namamu — muncul sebagai 'dari ...' di bawah judul cover" accent={theme.accent} onPreview={() => setPreviewField("senderName")}>
                    <input
                      className={inputClass}
                      value={st.senderName}
                      onChange={(e) => update({ senderName: e.target.value })}
                      placeholder="Namamu"
                    />
                  </Field>

                  <Field
                    label="Judul Utama (Cover Foto)"
                    hint="Teks besar yang tampil di atas foto — judul acara atau nama kalian berdua"
                    accent={theme.accent}
                    onPreview={() => setPreviewField("subText")}
                  >
                    <input
                      className={inputClass}
                      value={st.subText}
                      onChange={(e) => update({ subText: e.target.value })}
                      placeholder="Special Date • Nama & Nama"
                    />
                  </Field>

                  <Field label="Tanggal Kencan / Acara" accent={theme.accent} onPreview={() => setPreviewField("eventDate")}>
                    <input
                      type="date"
                      className={inputClass}
                      value={st.eventDate}
                      onChange={(e) => update({ eventDate: e.target.value })}
                    />
                    {st.eventDate && (
                      <p className="text-[11px] font-semibold mt-1 flex items-center gap-1" style={{ color: theme.accent }}>
                        <IconCalendar size={13} color={theme.accent} strokeWidth={2} className="shrink-0" />
                        <span>Terpilih:</span>
                        <span className="font-bold">{formatIndonesianDate(st.eventDate, st.locale)}</span>
                      </p>
                    )}
                  </Field>

                  <Field
                    label="Label Cover (Atas Foto)"
                    hint="Teks kecil yang muncul di pojok kiri atas cover foto — identitas acara ini"
                    accent={theme.accent}
                    onPreview={() => setPreviewField("invitationTitle")}
                  >
                    <input
                      className={inputClass}
                      value={st.invitationTitle}
                      onChange={(e) => update({ invitationTitle: e.target.value })}
                      placeholder="Date Night Itinerary"
                    />
                  </Field>

                  <Field
                    label="Judul Tiket Akhir"
                    hint="Tampil sebagai judul besar di tiket / summary yang dibagikan di akhir"
                    accent={theme.accent}
                    onPreview={() => setPreviewField("ticketTitle")}
                  >
                    <input
                      className={inputClass}
                      value={st.ticketTitle}
                      onChange={(e) => update({ ticketTitle: e.target.value })}
                      placeholder="Date Ticket & Itinerary"
                    />
                  </Field>

                  {/* Background Music Selector Field */}
                  <Field label="Latar Musik (Opsional)" accent={theme.accent}>
                    <button
                      type="button"
                      onClick={() => setShowMusicModal(true)}
                      className="w-full px-4 py-3 rounded-2xl text-xs font-bold text-left flex items-center justify-between border bg-gray-50 hover:bg-gray-100/80 transition-all shadow-xs"
                      style={{ borderColor: `${theme.accent}30` }}
                    >
                      <span className="truncate pr-2" style={{ color: st.musicTitle ? theme.accent : "#6b7280" }}>
                        {st.musicTitle ? `🎵 ${st.musicTitle}` : "Tanpa Musik (Tap untuk pilih lagu)"}
                      </span>
                      <span
                        className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-xl shrink-0"
                        style={{ background: `${theme.accent}15`, color: theme.accent }}
                      >
                        Pilih Musik
                      </span>
                    </button>
                    <p className="text-[11px] text-gray-400 font-medium mt-1">
                      Lagu romantis pilihanmu yang akan otomatis berputar saat pasangan membuka undangan.
                    </p>
                  </Field>
                </div>
                <NavButtons
                  accent={theme.accent}
                  onBack={() => setStep(1)}
                  onNext={() => setStep(3)}
                  canNext={!!st.recipientName && !!st.senderName}
                  nextLabel="Lanjut"
                />
              </div>
            )}

            {/* ── Step 3: Foto ─────────────────────────────────────────────── */}
            {step === 3 && (
              <div className="flex flex-col gap-5">
                <StepHeader accent={theme.accent} label="Foto Spesial" sub="Foto kenangan bersama yang akan muncul di undangan" />
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col items-center gap-4">
                  {st.photoUrl ? (
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={st.photoUrl}
                        alt="Foto"
                        className="w-48 h-48 rounded-2xl object-cover shadow-md"
                      />
                      <button
                        onClick={() => update({ photoUrl: null })}
                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-xs font-bold text-red-400"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => photoInputRef.current?.click()}
                      disabled={photoUploading}
                      className="w-48 h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors"
                      style={{ borderColor: `${theme.accent}60`, background: `${theme.bg}` }}
                    >
                      <IconCamera size={28} color={theme.accent} strokeWidth={1.5} />
                      <span className="text-xs font-semibold" style={{ color: theme.accent }}>
                        {photoUploading ? "Mengunggah..." : "Pilih Foto"}
                      </span>
                      <span className="text-[10px] text-gray-400">Maks 8 MB</span>
                    </button>
                  )}
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handlePhotoUpload(f);
                    }}
                  />
                  {st.photoUrl && (
                    <button
                      onClick={() => photoInputRef.current?.click()}
                      disabled={photoUploading}
                      className="text-xs font-semibold underline"
                      style={{ color: theme.accent }}
                    >
                      Ganti foto
                    </button>
                  )}
                </div>
                <NavButtons
                  accent={theme.accent}
                  onBack={() => setStep(2)}
                  onNext={() => setStep(4)}
                  canNext
                  nextLabel="Lanjut Ke Dress Code"
                />
              </div>
            )}

            {/* ── Step 4: Dress Code (REORDERED BEFORE RUNDOWN!) ──────────────── */}
            {step === 4 && (
              <div className="flex flex-col gap-5">
                <StepHeader
                  accent={theme.accent}
                  label="Dress Code / Outfit"
                  sub="Pilih dress code pilihanmu, edit teks &amp; pilih icon SVG (sepatu, celana, dress, dll)"
                />
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2.5">
                    {DEFAULT_DRESS_CODES.map((dc) => {
                      const selected = st.selectedDressCodes.includes(dc);
                      const currentText = st.customDressCodes[dc] ?? dc;
                      const currentIconKey = (st.dressCodeIcons || {})[dc] || (dc.toLowerCase().includes("formal") ? "dress" : "shirt");

                      return (
                        <div key={dc} className="relative flex flex-col items-start gap-1">
                          <div
                            onClick={() => {
                              if (selected) {
                                update({
                                  selectedDressCodes: st.selectedDressCodes.filter((x) => x !== dc),
                                });
                              } else {
                                update({
                                  selectedDressCodes: [...st.selectedDressCodes, dc],
                                });
                              }
                            }}
                            className="pl-3 pr-3 py-2.5 rounded-2xl text-xs font-bold border-2 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                            style={{
                              borderColor: selected ? theme.accent : "#e5e7eb",
                              background: selected ? `${theme.accent}15` : "#f9fafb",
                              color: selected ? theme.accent : "#6b7280",
                            }}
                          >
                            {/* SVG Icon Button (opens SVG Outfit Selector Popover) */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingIconDc(editingIconDc === dc ? null : dc);
                              }}
                              className="p-1 rounded-lg bg-white/80 border hover:bg-white transition-transform active:scale-90 flex items-center justify-center shrink-0"
                              style={{ borderColor: `${theme.accent}30` }}
                              title="Pilih Icon SVG Outfit"
                            >
                              <DressCodeIconSvg iconKey={currentIconKey} size={15} color={theme.accent} />
                            </button>

                            <input
                              type="text"
                              value={currentText}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                update({
                                  customDressCodes: {
                                    ...st.customDressCodes,
                                    [dc]: e.target.value,
                                  },
                                })
                              }
                              className="font-bold text-xs bg-transparent outline-none"
                              style={{
                                color: "inherit",
                                width: `${Math.max(currentText.length, 4) * 0.85}ch`,
                              }}
                            />

                            <div
                              className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ml-0.5"
                              style={{
                                background: selected ? theme.accent : "transparent",
                                borderColor: selected ? theme.accent : "#d1d5db",
                              }}
                            >
                              {selected && (
                                <svg className="w-2.5 h-2.5 text-white stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-[11px] text-gray-400 italic">
                    * Tap icon SVG pada pill untuk memilih jenis outfit (sepatu, celana, dress, kemeja, dll) &amp; tap teks untuk mengubah nama.
                  </p>
                </div>
                <NavButtons
                  accent={theme.accent}
                  onBack={() => setStep(3)}
                  onNext={() => setStep(5)}
                  canNext={st.selectedDressCodes.length > 0}
                  nextLabel="Lanjut Ke Rundown"
                />
              </div>
            )}

            {/* ── Step 5: Rundown Builder ────────────────────────────────────────── */}
            {step === 5 && (
              <div className="flex flex-col gap-5">
                <StepHeader accent={theme.accent} label="Date Itinerary & Rundown" sub="Contoh jadwal dalam Bahasa Inggris sudah terisi. Silakan edit atau tambah kegiatan." />

                {/* Rundown title */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <label className="text-[10.5px] sm:text-[11px] font-extrabold uppercase tracking-wider block min-w-0 leading-tight" style={{ color: theme.accent }}>
                      Judul Header Rundown
                    </label>
                    <button
                      type="button"
                      onClick={() => setPreviewField("rundownTitle")}
                      className="flex items-center gap-1 text-[10.5px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer shrink-0 whitespace-nowrap"
                      style={{ background: `${theme.accent}15`, color: theme.accent, border: `1px solid ${theme.accent}30` }}
                      title="Klik untuk intip posisi tampilan di undangan"
                    >
                      <IconEye size={12} color={theme.accent} strokeWidth={2.2} className="shrink-0" />
                      <span className="sm:hidden">Intip</span>
                      <span className="hidden sm:inline">Intip Tampilan</span>
                    </button>
                  </div>
                  <input
                    className={inputClass}
                    value={st.rundownTitle}
                    onChange={(e) => update({ rundownTitle: e.target.value })}
                    placeholder="Date Itinerary & Rundown"
                  />
                </div>

                {/* Items list */}
                <AnimatePresence>
                  {st.rundownItems.map((item, idx) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      index={idx}
                      total={st.rundownItems.length}
                      accent={theme.accent}
                      locale={st.locale}
                      onUpdate={updateItem}
                      onDelete={deleteItem}
                      onMove={moveItem}
                    />
                  ))}
                </AnimatePresence>

                {st.rundownItems.length === 0 && (
                  <div
                    className="rounded-3xl border-2 border-dashed py-10 text-center bg-white"
                    style={{ borderColor: `${theme.accent}40` }}
                  >
                    <p className="text-sm font-bold text-gray-500">Belum ada kegiatan rundown.</p>
                    <p className="text-xs text-gray-400 mt-1">Klik tombol di bawah untuk menambah kegiatan baru.</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={addItem}
                  className="w-full py-4 rounded-2xl text-sm font-bold border-2 transition-all flex items-center justify-center gap-2"
                  style={{
                    borderColor: theme.accent,
                    color: theme.accent,
                    background: `${theme.accent}08`,
                  }}
                >
                  <span className="text-base">+</span>
                  <span>Tambah Kegiatan Rundown</span>
                </button>

                <NavButtons
                  accent={theme.accent}
                  onBack={() => setStep(4)}
                  onNext={() => setStep(6)}
                  canNext={st.rundownItems.length > 0}
                  nextLabel="Lanjut Ke Note"
                />
              </div>
            )}

            {/* ── Step 6: Pesan Pendek / Note (DEDICATED NOTE STEP) ───────────── */}
            {step === 6 && (
              <div className="flex flex-col gap-5">
                <StepHeader
                  accent={theme.accent}
                  label="Pesan Pendek / Note"
                  sub="Catatan singkat dari kamu untuk pasanganmu sebelum melihat tiket"
                />

                {/* Textarea Input */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <label className="text-[10.5px] sm:text-[11px] font-extrabold uppercase tracking-wider block min-w-0 leading-tight" style={{ color: theme.accent }}>
                      Note Dari Kamu
                    </label>
                    <button
                      type="button"
                      onClick={() => setPreviewField("closingNote")}
                      className="flex items-center gap-1 text-[10.5px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer shrink-0 whitespace-nowrap"
                      style={{ background: `${theme.accent}15`, color: theme.accent, border: `1px solid ${theme.accent}30` }}
                      title="Klik untuk intip posisi tampilan di undangan"
                    >
                      <IconEye size={12} color={theme.accent} strokeWidth={2.2} className="shrink-0" />
                      <span className="sm:hidden">Intip</span>
                      <span className="hidden sm:inline">Intip Tampilan</span>
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    className="w-full p-4 rounded-2xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-pink-300 bg-gray-50 transition-colors font-medium leading-relaxed"
                    value={st.closingNote}
                    onChange={(e) => update({ closingNote: e.target.value })}
                    placeholder="Contoh: Jangan lupa bawa kacamata hitam & jangan telat yaa babe! ❤️"
                  />

                  {/* Short & Concise Hint Box */}
                  <div
                    className="rounded-2xl p-3.5 border flex items-start gap-2 text-xs text-gray-600 font-medium"
                    style={{ background: `${theme.bg}80`, borderColor: `${theme.accent}30` }}
                  >
                    <span className="shrink-0 text-base">💡</span>
                    <p className="leading-snug">
                      <strong style={{ color: theme.accent }}>Hint:</strong> Tuliskan catatan atau pesan singkat untuk pasanganmu. Pasangan cukup membaca note ini &amp; langsung melihat tiket kencan.
                    </p>
                  </div>
                </div>

                {/* Real-time Note Preview */}
                {st.closingNote && (
                  <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                      PRATINJAU TAMPILAN NOTE
                    </span>
                    <div
                      className="p-4 rounded-2xl border text-center flex flex-col justify-center gap-2"
                      style={{ background: `${theme.bg}40`, borderColor: `${theme.accent}20` }}
                    >
                      <p
                        className="text-lg leading-relaxed text-gray-800 italic whitespace-pre-line"
                        style={{ fontFamily: "var(--font-caveat)" }}
                      >
                        &ldquo;{st.closingNote}&rdquo;
                      </p>
                    </div>
                  </div>
                )}

                <NavButtons
                  accent={theme.accent}
                  onBack={() => setStep(5)}
                  onNext={() => setStep(7)}
                  canNext={true}
                  nextLabel="Publish Undangan"
                />
              </div>
            )}

            {/* ── Step 7: Publish ────────────────────────────────────────────── */}
            {step === 7 && (
              <div className="flex flex-col gap-5 items-center text-center">
                <StepHeader accent={theme.accent} label="Rundown Undangan Siap!" sub="" />

                {!published && !publishing && (
                  <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
                    <p className="text-sm font-semibold text-slate-900">
                      {st.locale === "id" ? "Periksa sebelum diterbitkan" : "Review before publishing"}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">
                      {st.locale === "id"
                        ? "Rundown tidak akan terbit sampai kamu menekan tombol Publish."
                        : "The rundown stays as-is until you press Publish."}
                    </p>

                    <dl className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
                      <div className="flex justify-between gap-4 py-3 text-sm">
                        <dt className="text-slate-500">{st.locale === "id" ? "Penerima" : "Recipient"}</dt>
                        <dd className="font-semibold text-slate-900">{st.recipientName || "-"}</dd>
                      </div>
                      <div className="flex justify-between gap-4 py-3 text-sm">
                        <dt className="text-slate-500">{st.locale === "id" ? "Jumlah agenda" : "Schedule items"}</dt>
                        <dd className="font-semibold text-slate-900">{st.rundownItems.length}</dd>
                      </div>
                      <div className="flex justify-between gap-4 py-3 text-sm">
                        <dt className="text-slate-500">{st.locale === "id" ? "Dress code" : "Dress code"}</dt>
                        <dd className="font-semibold text-slate-900">{st.selectedDressCodes.length}</dd>
                      </div>
                    </dl>

                    <div className="mt-5 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(6)}
                        className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700"
                      >
                        {st.locale === "id" ? "Kembali" : "Back"}
                      </button>
                      <button
                        type="button"
                        onClick={handlePublish}
                        className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white"
                        style={{ background: theme.accent }}
                      >
                        Publish
                      </button>
                    </div>
                  </div>
                )}

                {publishing && (
                  <div className="flex flex-col items-center gap-3 py-8">
                    <div
                      className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: `${theme.accent}40`, borderTopColor: theme.accent }}
                    />
                    <p className="text-sm font-medium text-gray-500">Menyimpan rundown...</p>
                  </div>
                )}

                {published && !publishing && (
                  <div className="w-full flex flex-col items-center gap-5">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                      style={{ background: theme.accent }}
                    >
                      <IconCheck size={28} color="white" strokeWidth={2.5} />
                    </div>
                    <p className="text-lg font-bold text-gray-800">
                      Undangan Rundown Berhasil Dibuat!
                    </p>

                    {/* BARCODE CARD CONTAINER */}
                    <div
                      className="w-full rounded-3xl p-6 border text-center flex flex-col items-center gap-4 shadow-md bg-white relative"
                      style={{ borderColor: `${theme.accent}30` }}
                    >
                      <span
                        className="text-[10px] font-extrabold uppercase tracking-[0.25em] px-3.5 py-1 rounded-full border"
                        style={{ background: `${theme.accent}15`, color: theme.accent, borderColor: `${theme.accent}30` }}
                      >
                        PRATINJAU KARTU BARCODE
                      </span>

                      {/* Pure Barcode Card Stub (TARGET FOR PNG DOWNLOAD) */}
                      <div
                        ref={barcodeCardRef}
                        className="p-6 rounded-3xl flex flex-col items-center gap-3 border shadow-md my-1"
                        style={{
                          background: `radial-gradient(ellipse at 50% 0%, ${theme.bg} 0%, #ffffff 100%)`,
                          borderColor: `${theme.accent}40`,
                        }}
                      >
                        <span
                          className="text-[9px] font-extrabold uppercase tracking-[0.3em] opacity-80"
                          style={{ color: theme.accent }}
                        >
                          SCAN TO OPEN DATE ITINERARY
                        </span>

                        <div className="p-3 bg-white rounded-2xl border shadow-sm" style={{ borderColor: `${theme.accent}20` }}>
                          <HeartQRCode url={giftUrl} color={theme.accent} bgColor="#ffffff" size={170} />
                        </div>

                        {st.recipientName && (
                          <div className="text-center mt-1">
                            <span className="text-[9px] font-medium uppercase tracking-widest text-gray-400 block opacity-70">For</span>
                            <span
                              className="block capitalize leading-none mt-0.5"
                              style={{
                                fontFamily: "var(--font-caveat)",
                                fontSize: "1.85rem",
                                fontWeight: 400,
                                color: theme.text,
                              }}
                            >
                              {st.recipientName}
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-[11px] text-gray-400">
                        Scan QR Code ini untuk langsung membuka undangan &amp; rundown kencan.
                      </p>

                      {/* Download Barcode Button (OUTSIDE barcodeCardRef!) */}
                      <button
                        onClick={handleDownloadBarcode}
                        disabled={downloadingBarcode}
                        className="w-full py-3.5 rounded-2xl font-bold text-xs text-white shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                        style={{
                          background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent}dd 100%)`,
                          boxShadow: `0 8px 20px -4px ${theme.accent}50`,
                        }}
                      >
                        <IconShare size={16} color="white" />
                        <span>{downloadingBarcode ? "Mengunduh Barcode..." : "Download Barcode (PNG)"}</span>
                      </button>
                    </div>

                    {/* Link box */}
                    <div
                      className="w-full rounded-2xl p-4 border text-left"
                      style={{ background: theme.bg, borderColor: `${theme.accent}30` }}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: theme.accent }}>
                        Link Undangan Penerima
                      </p>
                      <p className="text-sm font-mono font-bold text-gray-800 break-all">{giftUrl}</p>
                    </div>

                    <div className="flex flex-col gap-3 w-full">
                      <a
                        href={giftUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 rounded-2xl font-bold text-sm text-white text-center shadow-lg transition-opacity hover:opacity-90"
                        style={{ background: theme.accent }}
                      >
                        Buka Undangan
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(giftUrl);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="w-full py-4 rounded-2xl font-bold text-sm border-2 transition-all flex items-center justify-center gap-2"
                        style={{
                          borderColor: `${theme.accent}50`,
                          color: theme.accent,
                          background: copied ? `${theme.accent}10` : "white",
                        }}
                      >
                        <IconSparkle size={16} color={theme.accent} />
                        <span>{copied ? "Link Tersalin!" : "Salin Link Undangan"}</span>
                      </button>
                      <button
                        onClick={() => setStep(6)}
                        className="text-xs font-semibold text-gray-400 hover:text-gray-600 mt-1"
                      >
                        Edit Surat Lagi
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

              </motion.div>
            </AnimatePresence>
          </main>

          <StudioOverviewPanel
            mode="rundown"
            theme={theme}
            locale={st.locale}
            currentStep={step}
            totalSteps={STEPS.length}
            stepLabel={STEPS.find((item) => item.id === step)?.label ?? ""}
            recipientName={st.recipientName}
            senderName={st.senderName}
            title={st.rundownTitle || st.subText}
            eventDate={st.eventDate}
            photoUrl={st.photoUrl}
            musicTitle={st.musicTitle}
            primaryCount={st.rundownItems.length}
            secondaryCount={st.selectedDressCodes.length}
            published={published}
            mobileOpen={showMobileOverview}
            onMobileClose={() => setShowMobileOverview(false)}
          />
        </div>
      </div>

      {/* ── Background Music Selection Modal ────────────────────────────── */}
      <AnimatePresence>
        {showMusicModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => { setShowMusicModal(false); setPreviewUrl(null); }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-md max-h-[85vh] shadow-2xl flex flex-col overflow-hidden relative"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl flex items-center justify-center bg-pink-50 text-pink-500 font-bold">
                    🎵
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-800">Latar Musik Undangan</h3>
                    <p className="text-[11px] text-gray-400 font-medium">Pilih lagu romantis atau tempel link audio MP3</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setShowMusicModal(false); setPreviewUrl(null); }}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 transition-colors shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 max-h-[60vh]">
                {/* Custom Audio URL Section */}
                <div className="p-4 rounded-2xl border flex flex-col gap-2.5 bg-gray-50/80 border-gray-200">
                  <p className="font-extrabold text-xs uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                    <span>🔗</span> Tempel Link Musik (MP3 / Audio URL)
                  </p>
                  <input
                    type="url"
                    value={customMusicUrl}
                    onChange={(e) => setCustomMusicUrl(e.target.value)}
                    placeholder="https://domain.com/lagu-romantis.mp3"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none bg-white border border-gray-200 focus:border-pink-300 font-medium"
                  />
                  <input
                    type="text"
                    value={customMusicTitle}
                    onChange={(e) => setCustomMusicTitle(e.target.value)}
                    placeholder="Judul Lagu (misal: Lagu Kenangan)"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none bg-white border border-gray-200 focus:border-pink-300 font-medium"
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
                      setPreviewUrl(null);
                      showToast("Link musik berhasil dipasang!");
                    }}
                    disabled={!customMusicUrl.trim()}
                    className="w-full py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-xs disabled:opacity-50"
                    style={{ background: theme.accent }}
                  >
                    Pasang Link Musik Ini
                  </button>
                </div>

                <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center my-1">
                  — ATAU PILIH DARI PRESET LAGU ROMANTIS —
                </div>

                {/* Option: No Music */}
                <button
                  type="button"
                  onClick={() => {
                    update({ musicUrl: null, musicTitle: null });
                    setShowMusicModal(false);
                    setPreviewUrl(null);
                  }}
                  className="w-full p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all text-left"
                  style={{
                    background: !st.musicUrl ? `${theme.accent}15` : "white",
                    borderColor: !st.musicUrl ? theme.accent : "#f3f4f6",
                  }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-100 shrink-0 text-xl">
                    🚫
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-gray-800">Tanpa Musik</p>
                    <p className="text-[11px] text-gray-400 font-medium">Undangan tanpa iringan musik</p>
                  </div>
                </button>

                {/* Preset Songs List */}
                {playlist.map((p) => {
                  const active = st.musicUrl === p.audioUrl;
                  const playing = previewUrl === p.audioUrl;

                  return (
                    <div
                      key={p.audioUrl}
                      onClick={() => {
                        update({ musicUrl: p.audioUrl, musicTitle: `${p.title} - ${p.artist}` });
                        setShowMusicModal(false);
                        setPreviewUrl(null);
                      }}
                      className="w-full p-3 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer hover:border-pink-300"
                      style={{
                        background: active ? `${theme.accent}15` : "white",
                        borderColor: active ? theme.accent : "#f3f4f6",
                      }}
                    >
                      {/* Play Preview Cover Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewUrl(playing ? null : p.audioUrl);
                        }}
                        className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 group shadow-xs"
                        title="Dengarkan pratinjau lagu"
                      >
                        <img src={p.coverUrl} className="w-full h-full object-cover" alt="" />
                        <div
                          className="absolute inset-0 flex items-center justify-center transition-all"
                          style={{ background: playing ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.25)" }}
                        >
                          {playing ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                              <rect x="6" y="4" width="4" height="16" />
                              <rect x="14" y="4" width="4" height="16" />
                            </svg>
                          ) : (
                            <svg className="opacity-90 drop-shadow-md transition-transform group-hover:scale-110" width="18" height="18" viewBox="0 0 24 24" fill="white">
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                          )}
                        </div>
                      </button>

                      <div className="flex-1 text-left min-w-0">
                        <p className="font-bold text-xs text-gray-800 truncate">{p.title}</p>
                        <p className="text-[11px] text-gray-400 font-medium truncate">{p.artist}</p>
                      </div>

                      {active && (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs"
                          style={{ background: theme.accent }}
                        >
                          ✓
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
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-sm text-gray-800">
                      {st.locale === "id" ? "Format Undangan Kencan" : "Date Invitation Format"}
                    </h3>
                    <IconSparkle size={15} color="#ec4899" />
                  </div>
                  <p className="text-[11px] text-pink-500 font-semibold">
                    {st.locale === "id" ? "Pilih format terbaik untuk momen kalian" : "Choose the best format for your moment"}
                  </p>
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
                {/* Target Switch Mode Card: Invitation Date */}
                <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50 flex flex-col gap-2.5 hover:border-pink-300 transition-all">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-gray-200/70">
                      <IconMail size={16} color="#475569" strokeWidth={2.2} />
                    </div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-gray-800 leading-snug">
                      {st.locale === "id" ? "Invitation Date (Interaktif)" : "Interactive Date Invitation"}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600 leading-snug">
                    {st.locale === "id" ? (
                      <>
                        Format di mana <b>pasangan yang menentukan sendiri</b> tanggal, kegiatan, & dresscode kencan melalui survey interaktif.
                      </>
                    ) : (
                      <>
                        A format where your <b>partner chooses the date</b>, activities, & dress code through an interactive survey.
                      </>
                    )}
                  </p>
                  <ul className="text-[11px] text-gray-500 flex flex-col gap-1 list-disc pl-4 mt-1 font-medium">
                    <li>
                      {st.locale === "id"
                        ? "Ada animasi amplop & bunga pembuka."
                        : "Opening envelope & blooming flower animation."}
                    </li>
                    <li>
                      {st.locale === "id"
                        ? "Pasangan memilih dari opsi tanggal & kegiatan."
                        : "Partner picks from date & activity choices."}
                    </li>
                    <li>
                      {st.locale === "id"
                        ? "Menghasilkan Tiket Kencan sesuai pilihan pasangan."
                        : "Generates a Date Ticket tailored to their picks."}
                    </li>
                  </ul>

                  <button
                    type="button"
                    onClick={() => handleSwitchMode("invitation")}
                    disabled={switchingFormat}
                    className="w-full py-2.5 mt-1 rounded-xl text-xs font-bold text-white bg-pink-500 hover:bg-pink-600 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <IconMail size={14} color="white" strokeWidth={2.2} />
                    <span>
                      {switchingFormat
                        ? (st.locale === "id" ? "Mengubah Format..." : "Changing format...")
                        : (st.locale === "id" ? "Ubah ke Invitation Date" : "Switch to Invitation Date")}
                    </span>
                  </button>
                </div>

                {/* Active Mode Card: Rundown Date */}
                <div 
                  className="p-4 rounded-2xl border-2 flex flex-col gap-2.5"
                  style={{
                    borderColor: `${theme.accent}50`,
                    background: `${theme.accent}08`,
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div 
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border"
                        style={{
                          background: `${theme.accent}15`,
                          borderColor: `${theme.accent}25`,
                        }}
                      >
                        <IconClock size={16} color={theme.accent} strokeWidth={2.2} />
                      </div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-gray-800 leading-snug">
                        Rundown Date (Itinerary)
                      </h4>
                    </div>
                    <span 
                      className="inline-flex items-center gap-1 text-[9px] sm:text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 whitespace-nowrap shadow-2xs mt-0.5"
                      style={{
                        background: `${theme.accent}15`,
                        color: theme.accent,
                        borderColor: `${theme.accent}30`,
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: theme.accent }} />
                      {st.locale === "id" ? "Format Aktif" : "Active Format"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-snug">
                    {st.locale === "id" ? (
                      <>
                        Format susunan agenda kencan <b>jam demi jam</b> yang sudah kamu rencanakan rapi dari pagi hingga malam.
                      </>
                    ) : (
                      <>
                        An <b>hour-by-hour schedule</b> format you have neatly planned out from morning to evening.
                      </>
                    )}
                  </p>
                  <ul className="text-[11px] text-gray-500 flex flex-col gap-1 list-disc pl-4 mt-1 font-medium">
                    <li>
                      {st.locale === "id"
                        ? "Linimasa itinerary waktu & lokasi (09:00, 12:00, 15:00)."
                        : "Time & location itinerary timeline (09:00, 12:00, 15:00)."}
                    </li>
                    <li>
                      {st.locale === "id"
                        ? "Dilengkapi QR Barcode Tiket Masuk Kencan."
                        : "Includes QR Barcode Date Pass Ticket."}
                    </li>
                    <li>
                      {st.locale === "id"
                        ? "Cocok untuk Anniversary / Trip Seharian."
                        : "Perfect for Anniversaries & Full-Day Trips."}
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dress Code Outfit Icon Picker Modal (100% Mobile Centered Modal) */}
      <AnimatePresence>
        {editingIconDc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setEditingIconDc(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-5 w-full max-w-sm max-h-[85vh] shadow-2xl flex flex-col gap-4 relative overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-pink-50 text-pink-500 shrink-0">
                    <IconHanger size={18} color={theme.accent} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-sm text-gray-800">Pilih Ikon Dress Code ✨</h3>
                    <p className="text-[11px] text-pink-500 font-semibold truncate">
                      {(st.customDressCodes || {})[editingIconDc] ?? editingIconDc}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingIconDc(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 transition-colors shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* Tab Switcher (Vector SVG vs Emoji) */}
              <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-2xl shrink-0">
                <button
                  type="button"
                  onClick={() => setDcPickerTab("svg")}
                  className="flex-1 py-2 rounded-xl text-xs font-extrabold transition-all"
                  style={{
                    background: dcPickerTab === "svg" ? theme.accent : "transparent",
                    color: dcPickerTab === "svg" ? "white" : "#4b5563",
                    boxShadow: dcPickerTab === "svg" ? `0 2px 8px ${theme.accent}40` : "none",
                  }}
                >
                  Vector (SVG) 🎨
                </button>
                <button
                  type="button"
                  onClick={() => setDcPickerTab("emoji")}
                  className="flex-1 py-2 rounded-xl text-xs font-extrabold transition-all"
                  style={{
                    background: dcPickerTab === "emoji" ? theme.accent : "transparent",
                    color: dcPickerTab === "emoji" ? "white" : "#4b5563",
                    boxShadow: dcPickerTab === "emoji" ? `0 2px 8px ${theme.accent}40` : "none",
                  }}
                >
                  Emoji ✨
                </button>
              </div>

              {/* Tab Content: SVG Vector */}
              {dcPickerTab === "svg" && (
                <div className="grid grid-cols-3 gap-2 overflow-y-auto pr-1 max-h-[50vh] p-0.5">
                  {DRESSCODE_SVG_OPTIONS.map(({ key: iconKey, label, Icon }) => {
                    const dcKey = editingIconDc;
                    const currentIconKey = (st.dressCodeIcons || {})[dcKey] ?? (dcKey === "Casual" ? "shirt" : dcKey === "Formal" ? "formal" : dcKey === "Semi-formal" ? "formal" : dcKey === "Couple Outfit" ? "sparkles" : "hanger");
                    const isActive = currentIconKey === iconKey;
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => {
                          update({
                            dressCodeIcons: {
                              ...(st.dressCodeIcons || {}),
                              [dcKey]: iconKey,
                            },
                          });
                          setEditingIconDc(null);
                        }}
                        className="p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 border text-center transition-all hover:scale-105 active:scale-95 shadow-xs"
                        style={{
                          background: isActive ? `${theme.accent}18` : "#f9fafb",
                          borderColor: isActive ? theme.accent : "#e5e7eb",
                          color: isActive ? theme.accent : "#4b5563",
                        }}
                      >
                        <Icon size={22} color={theme.accent} />
                        <span className="text-[10px] font-extrabold leading-tight">{label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Tab Content: Emoji & Custom Input */}
              {dcPickerTab === "emoji" && (
                <div className="flex flex-col gap-3 overflow-y-auto pr-1 max-h-[50vh]">
                  <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-2xl border border-gray-200">
                    <span className="text-xs font-bold text-gray-600 shrink-0 pl-1">
                      Paste Emoji:
                    </span>
                    <input
                      type="text"
                      value={/\p{Extended_Pictographic}/u.test((st.dressCodeIcons || {})[editingIconDc] ?? "") ? (st.dressCodeIcons || {})[editingIconDc] : ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        update({
                          dressCodeIcons: {
                            ...(st.dressCodeIcons || {}),
                            [editingIconDc]: val,
                          },
                        });
                      }}
                      placeholder="👔 / 👗 / 👟 / 👑"
                      className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-sm text-center bg-white outline-none focus:border-pink-400 font-bold"
                    />
                  </div>

                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                    Atau Pilih Emoji Outfit Populer:
                  </span>

                  <div className="grid grid-cols-6 gap-2 p-0.5">
                    {["👔", "👕", "👗", "👖", "👟", "🕶️", "⌚", "🧢", "🎀", "👠", "👢", "👑", "💍", "🧥", "👙", "✨", "🎒", "🥾"].map((em) => {
                      const currentIconKey = (st.dressCodeIcons || {})[editingIconDc] ?? "";
                      const active = currentIconKey === em;
                      return (
                        <button
                          key={em}
                          type="button"
                          onClick={() => {
                            update({
                              dressCodeIcons: {
                                ...(st.dressCodeIcons || {}),
                                [editingIconDc]: em,
                              },
                            });
                            setEditingIconDc(null);
                          }}
                          className="w-10 h-10 rounded-2xl bg-gray-50 text-xl hover:scale-110 shadow-xs border flex items-center justify-center transition-transform active:scale-95 shrink-0"
                          style={{
                            borderColor: active ? theme.accent : "#e5e7eb",
                            background: active ? `${theme.accent}25` : "#f9fafb",
                          }}
                        >
                          {em}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setEditingIconDc(null)}
                className="w-full py-3 rounded-2xl font-bold text-xs text-white transition-colors shadow-sm shrink-0 mt-1"
                style={{ background: theme.accent }}
              >
                Selesai & Simpan
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Visual Position Preview Modal (Eye Button 👁️ Modal) ── */}
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
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-pink-50">
                    <IconEye size={18} color={theme.accent} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-800">Pratinjau Posisi Tampilan</h3>
                    <p className="text-[11px] text-pink-500 font-semibold">
                      {previewField === "recipientName" && "Nama Penerima"}
                      {previewField === "senderName" && "Nama Pengirim / Kamu"}
                      {previewField === "subText" && "Sub Teks (Opsional)"}
                      {previewField === "eventDate" && "Tanggal Kencan / Acara"}
                      {previewField === "invitationTitle" && "Judul Undangan Opening"}
                      {previewField === "ticketTitle" && "Judul Tiket Akhir"}
                      {previewField === "rundownTitle" && "Judul Header Rundown"}
                      {previewField === "closingNote" && "Note / Pesan Penutup"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewField(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 transition-colors shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="overflow-y-auto flex flex-col gap-4 pr-1 max-h-[60vh]">
                {/* Visual Mini Mockup */}
                <div className="bg-gradient-to-br from-pink-50/50 to-purple-50/50 p-4 rounded-2xl border border-pink-100 flex flex-col items-center justify-center min-h-[180px]">
                  
                  {/* Mockup for Event Date */}
                  {previewField === "eventDate" && (
                    <div className="w-full flex flex-col items-center gap-2 text-center">
                      <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-pink-200 flex flex-col items-center gap-2">
                        <span className="text-[9px] font-bold text-amber-800 opacity-60 uppercase tracking-wider block">
                          {st.invitationTitle || "Rundown & Invitation From"} {st.senderName || "Nama Kamu"}
                        </span>
                        <span className="text-xs font-extrabold text-gray-800 block">
                          For {st.recipientName || "Nama Penerima"}
                        </span>
                        
                        <div className="flex flex-col items-center gap-1 mt-1 w-full">
                          <span className="bg-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                            📍 POSISI: TANGGAL KENCAN / ACARA
                          </span>
                          <div className="px-3.5 py-1.5 rounded-full bg-pink-100 border-2 border-pink-400 animate-pulse text-center inline-flex items-center gap-1.5">
                            <IconCalendar size={13} color="#be185d" strokeWidth={2} className="shrink-0" />
                            <span className="text-xs font-extrabold text-pink-700">{formatIndonesianDate(st.eventDate, st.locale) || (st.locale === "en" ? "Saturday, February 14, 2026" : "Sabtu, 14 Februari 2026")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mockup for Sub Teks */}
                  {previewField === "subText" && (
                    <div className="w-full flex flex-col items-center gap-2 text-center">
                      <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-pink-200 flex flex-col items-center gap-2">
                        <span className="text-[9px] font-bold text-amber-800 opacity-60 uppercase tracking-wider block">
                          {st.invitationTitle || "Rundown & Invitation From"} {st.senderName || "Nama Kamu"}
                        </span>
                        <span className="text-xs font-extrabold text-gray-800 block">
                          For {st.recipientName || "Nama Penerima"}
                        </span>
                        
                        <div className="flex flex-col items-center gap-1 mt-1 w-full">
                          <span className="bg-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                            📍 POSISI: SUB TEKS (OPSIONAL)
                          </span>
                          <div className="w-full px-3 py-2 rounded-xl bg-pink-100 border-2 border-pink-400 animate-pulse text-center">
                            <p className="text-xs italic text-pink-700 font-extrabold">{st.subText || "Special Date Rundown & Invitation"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mockup for Recipient Name */}
                  {previewField === "recipientName" && (
                    <div className="w-full flex flex-col items-center gap-2 text-center">
                      <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-pink-200 flex flex-col items-center gap-2">
                        <span className="text-[9px] font-bold text-amber-800 opacity-60 uppercase tracking-wider block">
                          {st.invitationTitle || "Rundown & Invitation From"} {st.senderName || "Nama Kamu"}
                        </span>
                        
                        <div className="flex flex-col items-center gap-1 w-full max-w-[220px]">
                          <span className="bg-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                            📍 POSISI: NAMA PENERIMA
                          </span>
                          <div className="w-full px-4 py-2 rounded-xl bg-pink-100 border-2 border-pink-400 animate-pulse text-center">
                            <span className="text-base font-extrabold uppercase text-pink-700 block tracking-wide">{st.recipientName || "Nevan"}</span>
                          </div>
                        </div>

                        <p className="text-[10px] text-gray-500 mt-1">{st.subText || "Special Date"}</p>
                      </div>
                    </div>
                  )}

                  {/* Mockup for Sender Name */}
                  {previewField === "senderName" && (
                    <div className="w-full flex flex-col items-center gap-2 text-center">
                      <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-pink-200 flex flex-col items-center gap-2">
                        <span className="text-[9px] font-bold text-amber-800 opacity-60 uppercase tracking-wider block">
                          {st.invitationTitle || "Rundown & Invitation From"}
                        </span>

                        <div className="flex flex-col items-center gap-1 w-full max-w-[220px]">
                          <span className="bg-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                            📍 POSISI: NAMA KAMU (PENGIRIM)
                          </span>
                          <div className="w-full px-4 py-2 rounded-xl bg-pink-100 border-2 border-pink-400 animate-pulse text-center">
                            <span className="text-sm font-extrabold uppercase text-pink-700 block tracking-wide">{st.senderName || "Kalula"}</span>
                          </div>
                        </div>

                        <span className="text-xs font-extrabold text-gray-800 block mt-1">
                          For {st.recipientName || "Nevan"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Mockup for Invitation Title */}
                  {previewField === "invitationTitle" && (
                    <div className="w-full flex flex-col items-center gap-2 text-center">
                      <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-pink-200 flex flex-col items-center gap-2">
                        <div className="flex flex-col items-center gap-1 w-full max-w-[220px]">
                          <span className="bg-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                            📍 POSISI: JUDUL UNGKAPAN / OPENING
                          </span>
                          <div className="w-full px-3 py-1.5 rounded-xl bg-pink-100 border-2 border-pink-400 animate-pulse text-center">
                            <span className="text-xs italic font-bold text-pink-700 block">{st.invitationTitle || "Rundown & Invitation From"}</span>
                          </div>
                        </div>

                        <span className="text-xs font-bold uppercase text-gray-800 block">{st.senderName || "Kalula"}</span>
                        <span className="text-xs font-extrabold text-gray-800 block">For {st.recipientName || "Nevan"}</span>
                      </div>
                    </div>
                  )}

                  {/* Mockup for Ticket Title */}
                  {previewField === "ticketTitle" && (
                    <div className="w-full flex flex-col items-center gap-2 text-center">
                      <div className="w-full bg-white rounded-2xl p-3.5 shadow-sm border border-dashed border-pink-300 flex flex-col items-center gap-1">
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block mb-1">ADMIT TWO</span>
                        
                        <div className="flex flex-col items-center gap-1 w-full">
                          <span className="bg-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                            📍 POSISI: JUDUL TIKET AKHIR
                          </span>
                          <div className="w-full px-3 py-1.5 rounded-xl bg-pink-100 border-2 border-pink-400 animate-pulse text-center">
                            <span className="text-sm font-bold text-pink-700 block">{st.ticketTitle || "Date Ticket & Itinerary"}</span>
                          </div>
                        </div>

                        <p className="text-[10px] text-gray-500 mt-2">UNTUK: {st.recipientName || "Nevan"}</p>
                      </div>
                    </div>
                  )}

                  {/* Mockup for Rundown Title */}
                  {previewField === "rundownTitle" && (
                    <div className="w-full flex flex-col items-center gap-2 text-center">
                      <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-pink-200 flex flex-col items-center gap-2">
                        <span className="text-[8px] font-bold text-pink-500 uppercase tracking-widest bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
                          🔆 AGENDA 2 DARI 6
                        </span>

                        <div className="flex flex-col items-center gap-1 w-full mt-1">
                          <span className="bg-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                            📍 POSISI: JUDUL HEADER RUNDOWN
                          </span>
                          <div className="w-full px-3 py-2.5 rounded-xl bg-pink-100 border-2 border-pink-400 animate-pulse text-center">
                            <h2 className="text-base font-extrabold text-pink-900 tracking-tight">
                              {st.rundownTitle || "Date Itinerary & Rundown"}
                            </h2>
                            <p className="text-[10px] text-pink-600 font-medium">Membuka rencana satu per satu...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mockup for Closing Note */}
                  {previewField === "closingNote" && (
                    <div className="w-full flex flex-col items-center gap-2 text-center">
                      <div className="w-full bg-white rounded-2xl p-3.5 shadow-sm border border-dashed border-pink-300 flex flex-col items-center gap-1">
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b pb-1 w-full text-center">RUNDOWN DATE TICKET</div>
                        <p className="text-[10px] text-gray-500">UNTUK: {st.recipientName || "Nevan"}</p>
                        
                        <div className="flex flex-col items-center gap-1 w-full mt-1">
                          <span className="bg-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                            📍 POSISI: PESAN PENUTUP / SURAT
                          </span>
                          <div className="w-full rounded-xl p-3 bg-pink-100 border-2 border-pink-400 animate-pulse text-left max-h-[160px] overflow-y-auto">
                            <span className="text-[8px] font-bold uppercase text-pink-600 tracking-wider block mb-1">CATATAN DARI {(st.senderName || "KALULA").toUpperCase()}</span>
                            <p className="text-[11px] italic text-pink-900 leading-snug whitespace-pre-line">{st.closingNote || "Jangan lupa istirahat yang cukup yaa..."}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description Text */}
                <div className="bg-pink-50/70 rounded-2xl p-3 border border-pink-100">
                  <p className="text-xs text-gray-600 leading-snug">
                    <span className="font-bold text-pink-600">💡 Penjelasan Posisi: </span>
                    {previewField === "subText" && "Tampil sebagai teks sub-judul pemanis tepat di bawah nama pada kartu pembuka dan header utama undangan."}
                    {previewField === "eventDate" && "Tampil sebagai lencana tanggal resmi kencan di kartu pembuka dan tiket rundown akhir."}
                    {previewField === "recipientName" && "Tampil sebagai nama penerima kencan di kartu pembuka dan barcode tiket."}
                    {previewField === "senderName" && "Tampil sebagai namamu sebagai pengirim undangan."}
                    {previewField === "invitationTitle" && "Tampil sebagai kata pengantar (contoh: Invitation From / Special Invite) di paling atas kartu pembuka."}
                    {previewField === "ticketTitle" && "Tampil sebagai judul utama di bagian paling atas kartu tiket kencan dan barcode."}
                    {previewField === "rundownTitle" && "Tampil sebagai judul header utama di halaman daftar kegiatan rundown kencan."}
                    {previewField === "closingNote" && "Tampil sebagai kotak surat / pesan ucapan di bagian bawah sebelum tiket kencan."}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setPreviewField(null)}
                className="w-full py-3 rounded-2xl font-bold text-sm text-white bg-pink-400 hover:bg-pink-500 transition-colors shadow-md shadow-pink-200 shrink-0 mt-1"
              >
                Paham & Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden audio element for preview playing in studio */}
      {previewUrl && <audio src={previewUrl} autoPlay onEnded={() => setPreviewUrl(null)} />}
    </div>
  );
}

// ─── Small shared sub-components ─────────────────────────────────────────────

function StepHeader({
  accent,
  label,
  sub,
}: {
  accent: string;
  label: string;
  sub: string;
}) {
  return (
    <div className="mb-2">
      <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">{label}</h1>
      {sub && <p className="text-xs text-gray-400 font-medium mt-1">{sub}</p>}
      <div className="w-10 h-1 rounded-full mt-3" style={{ background: accent }} />
    </div>
  );
}

function Field({
  label,
  hint,
  accent,
  onPreview,
  children,
}: {
  label: string;
  hint?: string;
  accent: string;
  onPreview?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <label
          className="text-[10.5px] sm:text-[11px] font-extrabold uppercase tracking-wider block min-w-0 leading-tight"
          style={{ color: accent }}
        >
          {label}
        </label>
        {onPreview && (
          <button
            type="button"
            onClick={onPreview}
            className="flex items-center gap-1 text-[10.5px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer shrink-0 whitespace-nowrap"
            style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}
            title="Klik untuk intip posisi tampilan di undangan"
          >
            <IconEye size={12} color={accent} strokeWidth={2.2} className="shrink-0" />
            <span className="sm:hidden">Intip</span>
            <span className="hidden sm:inline">Intip Tampilan</span>
          </button>
        )}
      </div>
      {hint && (
        <p className="text-[10px] text-gray-500 font-medium mb-1.5 leading-tight">
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}

function NavButtons({
  accent,
  onBack,
  onNext,
  canNext,
  nextLabel = "Lanjut",
}: {
  accent: string;
  onBack?: () => void;
  onNext: () => void;
  canNext: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="flex gap-3 mt-2">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-4 rounded-2xl text-sm font-bold border-2 border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          Kembali
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="flex-1 py-4 rounded-2xl text-sm font-bold text-white transition-all disabled:opacity-40 shadow-md"
        style={{ background: accent }}
      >
        {nextLabel}
      </button>
    </div>
  );
}
