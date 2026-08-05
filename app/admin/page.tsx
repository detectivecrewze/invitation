"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconLock, IconMail, IconCheck, IconTicket, IconSparkle } from "@/components/ui/Icon";
import { verifyPassword } from "./actions";
import type { BarcodeStyle } from "@/components/barcode/types";
import GiftCardBarcode from "@/components/barcode/GiftCardBarcode";
import MovieTicketBarcode from "@/components/barcode/MovieTicketBarcode";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [invitations, setInvitations] = useState<any[]>([]);
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTokenQuota, setNewTokenQuota] = useState(1);
  const [newTokenLabel, setNewTokenLabel] = useState("");
  const [tab, setTab] = useState<"invitations" | "tokens" | "barcode">("invitations");
  const [toast, setToast] = useState<string | null>(null);

  // ── Barcode & Physical Card Generator State ──────────────────────────────
  const [barcodeStyle, setBarcodeStyle] = useState<BarcodeStyle>("movie");
  const [barcodeUrl, setBarcodeUrl] = useState("");
  const [barcodeName, setBarcodeName] = useState("Untuk Zahra");
  const [barcodeColor, setBarcodeColor] = useState("#e8789a");
  const [cardBgColor, setCardBgColor] = useState("#faf6ec");

  // Universal barcode fields & preset sizes
  const [frontTitle, setFrontTitle] = useState("SOMETHING SPECIAL FOR U");
  const [badgeText, setBadgeText] = useState("SCAN QR CODE TO OPEN");
  const [cardNote, setCardNote] = useState("Scan QR code menggunakan kamera HP milikmu untuk membukanya");
  const [cardWeb, setCardWeb] = useState("for-you-always.my.id");
  const [cardIg, setCardIg] = useState("foryoualways.id");
  const [cardTiktok, setCardTiktok] = useState("fya2.id");
  const [frontTitleColor, setFrontTitleColor] = useState("");
  const [frontTitleSize, setFrontTitleSize] = useState(33);
  const [nameColor, setNameColor] = useState("");
  const [nameSize, setNameSize] = useState(105);
  const [badgeTextColor, setBadgeTextColor] = useState("");
  const [badgeTextSize, setBadgeTextSize] = useState(45);
  const [noteColor, setNoteColor] = useState("");
  const [noteSize, setNoteSize] = useState(48);
  const [showPerforation, setShowPerforation] = useState(true);

  const [showNew, setShowNew] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [newMode, setNewMode] = useState<'invitation' | 'rundown'>('invitation');
  const [creating, setCreating] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    setLoading(true);
    try {
      const [invRes, tokRes] = await Promise.all([
        fetch("/api/invitations").then(r => r.json()),
        fetch("/api/tokens").then(r => r.json()),
      ]);
      const invIds: string[] = invRes.ids ?? [];
      const details = await Promise.all(invIds.map(id => fetch(`/api/invitations?id=${id}`).then(r => r.json())));
      setInvitations(details.filter(Boolean));
      setTokens(tokRes.tokens ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (authed) load(); }, [authed]);

  const createToken = async () => {
    await fetch("/api/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quota: newTokenQuota, label: newTokenLabel }),
    });
    showToast("Token berhasil dibuat!");
    load();
  };


  const deleteToken = async (id: string) => {
    await fetch("/api/tokens", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    showToast("Token dihapus.");
    load();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlug) return;
    setCreating(true);
    const id = newSlug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
    try {
      await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId: id,
          mode: newMode,
          status: "draft",
          themeId: "pink",
          selectedActivities: [],
          customActivityLabels: {},
          selectedDressCodes: [],
          customDressCodes: {},
          ...(newMode === 'rundown' ? { rundownItems: [], rundownTitle: "Rundown Acara" } : {}),
        }),
      });
      await load();
      setShowNew(false);
      setNewSlug("");
      setNewMode('invitation');
      showToast("Undangan dibuat!");
    } finally {
      setCreating(false);
    }
  };

  const handleLogin = async () => {
    const isValid = await verifyPassword(pass);
    if (isValid) {
      setAuthed(true);
    } else {
      showToast("Password salah!");
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-blue-50">
        <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            <IconLock size={24} color="#e8789a" strokeWidth={2.5} /> Admin Panel
          </h1>
          <input
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="Password admin"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none text-sm mb-4"
          />
          <motion.button
            onClick={handleLogin}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02, opacity: 0.9 }}
            className="w-full py-3 rounded-2xl font-bold text-white bg-pink-400 hover:bg-pink-500 transition-colors shadow-lg shadow-pink-200"
          >
            Masuk
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl font-bold text-sm text-white bg-pink-400 shadow-xl"
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto px-5 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <IconMail size={24} color="#e8789a" strokeWidth={2.5} /> Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">invitation-edition</p>
          </div>
          <button onClick={() => setShowNew(true)} className="px-5 py-2.5 rounded-2xl font-bold text-sm text-white bg-pink-400 shadow-md hover:bg-pink-500 transition-colors">
            + Buat Undangan
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Undangan", value: invitations.length, icon: <IconMail size={24} color="#e8789a" strokeWidth={2} /> },
            { label: "Published", value: invitations.filter(i => i.status === "published").length, icon: <IconCheck size={24} color="#e8789a" strokeWidth={2.5} /> },
            { label: "Total Token", value: tokens.length, icon: <IconTicket size={24} color="#e8789a" strokeWidth={2} /> },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm text-center flex flex-col items-center">
              <div className="mb-2 bg-pink-50 p-2 rounded-full">{s.icon}</div>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(["invitations", "tokens", "barcode"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
              style={{ background: tab === t ? "#e8789a" : "#f9e4ec", color: tab === t ? "white" : "#c06080" }}
            >
              {t === "invitations" ? (
                <><IconMail size={16} strokeWidth={2} /> Undangan</>
              ) : t === "tokens" ? (
                <><IconTicket size={16} strokeWidth={2} /> Token</>
              ) : (
                <><IconSparkle size={16} strokeWidth={2} /> Barcode</>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-pink-200 border-t-pink-400 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Invitations list */}
            {tab === "invitations" && (
              <div className="flex flex-col gap-3">
                {invitations.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">Belum ada undangan yang dibuat.</div>
                ) : (
                  invitations.map(inv => (
                    <div key={inv.invitationId} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
                      {inv.photoUrl && <img src={inv.photoUrl} alt="" className="w-12 h-12 rounded-xl object-cover" />}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-800 truncate">
                          {inv.recipientName || "—"} ← {inv.senderName || "—"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{inv.invitationId}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${inv.status === "published" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                          {inv.status}
                        </span>
                        <a href={`/${inv.invitationId}`} target="_blank" rel="noopener noreferrer"
                          className="text-xs font-bold text-pink-400 underline">
                          Lihat
                        </a>
                        <a href={`/studio/${inv.invitationId}`} target="_blank" rel="noopener noreferrer"
                          className="text-xs font-bold text-blue-400 underline">
                          Edit
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tokens list */}
            {tab === "tokens" && (
              <div className="flex flex-col gap-4">
                {/* Create token */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h3 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
                    <IconSparkle size={16} color="#e8789a" strokeWidth={2} /> Buat Token Baru
                  </h3>
                  <div className="flex gap-3 mb-3">
                    <input
                      type="text"
                      value={newTokenLabel}
                      onChange={e => setNewTokenLabel(e.target.value)}
                      placeholder="Label (opsional)"
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none"
                    />
                    <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Kuota</label>
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1">
                        <button 
                          onClick={() => setNewTokenQuota(Math.max(1, newTokenQuota - 1))}
                          className="w-6 h-6 rounded-md bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-100 flex items-center justify-center transition-colors"
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          value={newTokenQuota || ""} 
                          onChange={e => setNewTokenQuota(e.target.value === "" ? 0 : parseInt(e.target.value) || 1)}
                          min={1} 
                          max={100} 
                          className="w-8 text-center text-sm font-bold outline-none bg-transparent" 
                        />
                        <button 
                          onClick={() => setNewTokenQuota(Math.min(100, newTokenQuota + 1))}
                          className="w-6 h-6 rounded-md bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-100 flex items-center justify-center transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button onClick={createToken} className="w-full py-2.5 rounded-xl font-bold text-sm text-white bg-pink-400">
                    + Buat Token
                  </button>
                </div>

                {tokens.map(t => (
                  <div key={t.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
                    <div className="flex-1">
                      <p className="font-mono font-bold text-base text-gray-800">{t.id}</p>
                      {t.label && <p className="text-xs text-gray-400">{t.label}</p>}
                      <p className="text-xs text-gray-500 mt-1">
                        Kuota: <span className="font-bold text-pink-500">{t.remainingQuota}</span>/{t.totalQuota} · {t.invitations?.length ?? 0} undangan
                      </p>
                    </div>
                    <button onClick={() => deleteToken(t.id)} className="text-xs font-bold text-red-400 hover:text-red-600">
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* Barcode Generator */}
            {tab === "barcode" && (
              <div className="flex flex-col gap-6">
                {/* Card Editor Form */}
                <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-bold text-base text-gray-800 flex items-center gap-2">
                      <IconSparkle size={18} color="#e8789a" strokeWidth={2} /> Generator Kartu Fisik & Barcode (300 DPI Ultra HD)
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-pink-50 text-pink-600 px-2.5 py-1 rounded-full border border-pink-200">
                      Print Ready / Art Paper
                    </span>
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* Link / URL */}
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-widest text-pink-400 block mb-1">
                        Link / URL Undangan (Target QR)
                      </label>
                      <input
                        type="url"
                        value={barcodeUrl}
                        onChange={e => setBarcodeUrl(e.target.value)}
                        placeholder="https://mixtape-love.com/kencan-kamu-dan-aku"
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none text-sm focus:border-pink-300 font-medium"
                      />
                    </div>

                    {/* Color Palette */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* 1. Barcode Theme Color */}
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-widest text-pink-400 block mb-1.5">
                          Warna Aksesori & QR Code
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                          {["#e8789a", "#a67c52", "#7b68ee", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#1a1a2e"].map(c => (
                            <button
                              key={c}
                              onClick={() => setBarcodeColor(c)}
                              className="w-7 h-7 rounded-full border-2 transition-all"
                              style={{
                                background: c,
                                borderColor: barcodeColor === c ? c : "transparent",
                                boxShadow: barcodeColor === c ? `0 0 0 2px white, 0 0 0 3px ${c}` : "none",
                              }}
                            />
                          ))}
                          <input
                            type="color"
                            value={barcodeColor}
                            onChange={e => setBarcodeColor(e.target.value)}
                            className="w-7 h-7 rounded-full border border-gray-200 cursor-pointer overflow-hidden"
                            title="Pilih warna kustom"
                          />
                        </div>
                      </div>

                      {/* 2. Card Background Color Selector */}
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 block mb-1.5 flex items-center justify-between">
                          <span>Warna Dasaran Kertas</span>
                          <span className="text-[9px] text-pink-500 font-semibold uppercase">✨ Krem = Luxury</span>
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                          {[
                            { name: "Putih Bersih", hex: "#ffffff" },
                            { name: "Krem Luxury ⭐", hex: "#faf6ec" },
                            { name: "Warm Ivory", hex: "#fcf9f2" },
                            { name: "Soft Rose", hex: "#fff0f5" },
                          ].map(bg => (
                            <button
                              key={bg.hex}
                              onClick={() => setCardBgColor(bg.hex)}
                              title={bg.name}
                              className="px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all flex items-center gap-1.5"
                              style={{
                                background: bg.hex,
                                color: "#333333",
                                borderColor: cardBgColor === bg.hex ? barcodeColor : "#e5e7eb",
                                boxShadow: cardBgColor === bg.hex ? `0 0 0 2px ${barcodeColor}40` : "none",
                              }}
                            >
                              <span className="w-2.5 h-2.5 rounded-full border border-gray-300" style={{ background: bg.hex }} />
                              {bg.name}
                            </button>
                          ))}
                          <input
                            type="color"
                            value={cardBgColor}
                            onChange={e => setCardBgColor(e.target.value)}
                            className="w-7 h-7 rounded-full border border-gray-200 cursor-pointer overflow-hidden"
                            title="Pilih warna background kustom"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Customization Accordion Tabs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {/* Front Settings */}
                      <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 flex flex-col gap-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-pink-600 flex items-center gap-1.5">
                          🎴 Teks Sisi Depan (Front)
                        </p>

                        {/* 1. Judul Atas Kartu */}
                        <div className="space-y-1 bg-white/60 p-2.5 rounded-xl border border-pink-100/60">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-gray-700">1. Judul Atas Kartu</label>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-gray-400 font-mono">{frontTitleSize}px</span>
                              <input
                                type="color"
                                value={frontTitleColor || barcodeColor}
                                onChange={e => setFrontTitleColor(e.target.value)}
                                className="w-5 h-5 rounded-full border border-gray-200 cursor-pointer overflow-hidden"
                                title="Warna Judul Atas"
                              />
                            </div>
                          </div>
                          <input
                            type="text"
                            value={frontTitle}
                            onChange={e => setFrontTitle(e.target.value)}
                            placeholder="SOMETHING SPECIAL FOR U"
                            className="w-full px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-800"
                          />
                          <div className="flex items-center gap-2 pt-0.5">
                            <span className="text-[8px] text-gray-400">Ukuran:</span>
                            <input
                              type="range"
                              min="24"
                              max="80"
                              value={frontTitleSize}
                              onChange={e => setFrontTitleSize(Number(e.target.value))}
                              className="w-full h-1 accent-pink-500 cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* 2. Nama / Caption Penerima */}
                        <div className="space-y-1 bg-white/60 p-2.5 rounded-xl border border-pink-100/60">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-gray-700">2. Nama / Caption Penerima</label>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-gray-400 font-mono">{nameSize}px</span>
                              <input
                                type="color"
                                value={nameColor || barcodeColor}
                                onChange={e => setNameColor(e.target.value)}
                                className="w-5 h-5 rounded-full border border-gray-200 cursor-pointer overflow-hidden"
                                title="Warna Nama Penerima"
                              />
                            </div>
                          </div>
                          <input
                            type="text"
                            value={barcodeName}
                            onChange={e => setBarcodeName(e.target.value)}
                            placeholder="Untuk Zahra"
                            className="w-full px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-800"
                          />
                          <div className="flex items-center gap-2 pt-0.5">
                            <span className="text-[8px] text-gray-400">Ukuran:</span>
                            <input
                              type="range"
                              min="60"
                              max="160"
                              value={nameSize}
                              onChange={e => setNameSize(Number(e.target.value))}
                              className="w-full h-1 accent-pink-500 cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* 3. Badge Teks Bawah */}
                        <div className="space-y-1 bg-white/60 p-2.5 rounded-xl border border-pink-100/60">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-gray-700">3. Badge Teks Bawah</label>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-gray-400 font-mono">{badgeTextSize}px</span>
                              <input
                                type="color"
                                value={badgeTextColor || barcodeColor}
                                onChange={e => setBadgeTextColor(e.target.value)}
                                className="w-5 h-5 rounded-full border border-gray-200 cursor-pointer overflow-hidden"
                                title="Warna Badge Teks"
                              />
                            </div>
                          </div>
                          <input
                            type="text"
                            value={badgeText}
                            onChange={e => setBadgeText(e.target.value)}
                            placeholder="SCAN QR CODE TO OPEN"
                            className="w-full px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-800"
                          />
                          <div className="flex items-center gap-2 pt-0.5">
                            <span className="text-[8px] text-gray-400">Ukuran:</span>
                            <input
                              type="range"
                              min="24"
                              max="70"
                              value={badgeTextSize}
                              onChange={e => setBadgeTextSize(Number(e.target.value))}
                              className="w-full h-1 accent-pink-500 cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* 4. Pesan Pendek Kartu */}
                        <div className="space-y-1 bg-white/60 p-2.5 rounded-xl border border-pink-100/60">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-gray-700">4. Pesan Pendek Kartu</label>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-gray-400 font-mono">{noteSize}px</span>
                              <input
                                type="color"
                                value={noteColor || barcodeColor}
                                onChange={e => setNoteColor(e.target.value)}
                                className="w-5 h-5 rounded-full border border-gray-200 cursor-pointer overflow-hidden"
                                title="Warna Pesan Pendek"
                              />
                            </div>
                          </div>
                          <input
                            type="text"
                            value={cardNote}
                            onChange={e => setCardNote(e.target.value)}
                            placeholder="Scan QR code menggunakan kamera HP..."
                            className="w-full px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-800"
                          />
                          <div className="flex items-center gap-2 pt-0.5">
                            <span className="text-[8px] text-gray-400">Ukuran:</span>
                            <input
                              type="range"
                              min="24"
                              max="80"
                              value={noteSize}
                              onChange={e => setNoteSize(Number(e.target.value))}
                              className="w-full h-1 accent-pink-500 cursor-pointer"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-gray-500 block mb-1">Website Domain</label>
                          <input
                            type="text"
                            value={cardWeb}
                            onChange={e => setCardWeb(e.target.value)}
                            placeholder="for-you-always.my.id"
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-800"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-gray-500 block mb-1">Instagram Username</label>
                          <input
                            type="text"
                            value={cardIg}
                            onChange={e => setCardIg(e.target.value)}
                            placeholder="foryoualways.id"
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-800"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-gray-500 block mb-1">TikTok Username</label>
                          <input
                            type="text"
                            value={cardTiktok}
                            onChange={e => setCardTiktok(e.target.value)}
                            placeholder="fya2.id"
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-800"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {barcodeUrl && (
                  <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col items-center gap-5">
                    <div className="w-full">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-pink-400 mb-3 text-center">
                        Pilih Style Kartu
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {/* 1. Gift Card */}
                        <button
                          onClick={() => setBarcodeStyle("gift")}
                          className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-2 transition-all text-center"
                          style={{
                            borderColor: barcodeStyle === "gift" ? barcodeColor : "#e5e7eb",
                            background: barcodeStyle === "gift" ? `${barcodeColor}10` : "#f9fafb",
                            boxShadow: barcodeStyle === "gift" ? `0 0 0 1px ${barcodeColor}40` : "none",
                          }}
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={barcodeStyle === "gift" ? barcodeColor : "#6b7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="8" width="18" height="13" rx="2" />
                            <path d="M12 8v13" />
                            <path d="M19 12v7" />
                            <path d="M5 12v7" />
                            <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
                          </svg>
                          <span className="text-[10px] font-black" style={{ color: barcodeStyle === "gift" ? barcodeColor : "#374151" }}>
                            Gift Card
                          </span>
                          <span className="text-[8px] font-medium text-gray-400">Standard</span>
                        </button>

                        {/* 2. Movie Ticket */}
                        <button
                          onClick={() => {
                            setBarcodeStyle("movie");
                            setCardBgColor("#faf6ec");
                            setFrontTitleSize(33);
                            setNameSize(105);
                            setBadgeTextSize(45);
                            setNoteSize(48);
                          }}
                          className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-2 transition-all text-center"
                          style={{
                            borderColor: barcodeStyle === "movie" ? barcodeColor : "#e5e7eb",
                            background: barcodeStyle === "movie" ? `${barcodeColor}10` : "#f9fafb",
                            boxShadow: barcodeStyle === "movie" ? `0 0 0 1px ${barcodeColor}40` : "none",
                          }}
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={barcodeStyle === "movie" ? barcodeColor : "#6b7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="M2 8h20" />
                            <path d="M6 4l2 4" />
                            <path d="M12 4l2 4" />
                          </svg>
                          <span className="text-[10px] font-black" style={{ color: barcodeStyle === "movie" ? barcodeColor : "#374151" }}>
                            Movie Ticket
                          </span>
                          <span className="text-[8px] font-medium text-gray-400">Landscape Stub</span>
                        </button>
                      </div>

                      {/* Movie Ticket Perforation & Notch Toggle */}
                      {barcodeStyle === "movie" && (
                        <div className="mt-3 flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
                          <div>
                            <span className="text-xs font-bold text-gray-700 block">Garis Perforasi & Coakan</span>
                            <span className="text-[10px] text-gray-400">Garis putus-putus robekan & lekukan tiket</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowPerforation(!showPerforation)}
                            className="relative w-11 h-6 rounded-full transition-colors p-0.5"
                            style={{ background: showPerforation ? barcodeColor : "#d1d5db" }}
                          >
                            <div
                              className="w-5 h-5 rounded-full bg-white shadow-xs transition-transform"
                              style={{ transform: showPerforation ? "translateX(20px)" : "translateX(0px)" }}
                            />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* ── Delegated Preview + Download ── */}
                    {barcodeStyle === "gift" && (
                      <GiftCardBarcode
                        barcodeUrl={barcodeUrl} barcodeColor={barcodeColor} cardBgColor={cardBgColor} barcodeName={barcodeName}
                        frontTitle={frontTitle} frontTitleColor={frontTitleColor} frontTitleSize={frontTitleSize}
                        nameColor={nameColor} nameSize={nameSize}
                        badgeText={badgeText} badgeTextColor={badgeTextColor} badgeTextSize={badgeTextSize}
                        cardNote={cardNote} noteColor={noteColor} noteSize={noteSize}
                        cardWeb={cardWeb} cardIg={cardIg} cardTiktok={cardTiktok}
                      />
                    )}

                    {barcodeStyle === "movie" && (
                      <MovieTicketBarcode
                        barcodeUrl={barcodeUrl} barcodeColor={barcodeColor} cardBgColor={cardBgColor} barcodeName={barcodeName}
                        frontTitle={frontTitle} frontTitleColor={frontTitleColor} frontTitleSize={frontTitleSize}
                        nameColor={nameColor} nameSize={nameSize}
                        badgeText={badgeText} badgeTextColor={badgeTextColor} badgeTextSize={badgeTextSize}
                        cardNote={cardNote} noteColor={noteColor} noteSize={noteSize}
                        cardWeb={cardWeb} cardIg={cardIg} cardTiktok={cardTiktok}
                        showPerforation={showPerforation}
                      />
                    )}

                    {/* Copy Link button */}
                    <button
                      onClick={() => { navigator.clipboard.writeText(barcodeUrl); showToast("Link berhasil disalin!"); }}
                      className="w-full max-w-md py-3 rounded-2xl font-bold text-xs border-2 transition-all text-center"
                      style={{ borderColor: `${barcodeColor}33`, color: barcodeColor }}
                    >
                      📋 Salin Link Target QR
                    </button>
                  </div>
                )}

                {!barcodeUrl && (
                  <div className="text-center py-10 text-gray-400 text-sm">
                    Masukkan link di atas untuk melihat preview & mengunduh kartu fisik 300 DPI
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <AnimatePresence>
        {showNew && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowNew(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Buat Undangan Baru</h2>
              <form onSubmit={handleCreate}>
                {/* ── Mode selector ── */}
                <div className="mb-5">
                  <label className="block text-xs uppercase tracking-widest font-bold text-pink-400 mb-2">Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['invitation', 'rundown'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setNewMode(m)}
                        className="py-3 rounded-2xl text-xs font-bold border-2 transition-all"
                        style={{
                          borderColor: newMode === m ? '#e8789a' : '#e5e7eb',
                          background: newMode === m ? '#fff0f5' : '#f9fafb',
                          color: newMode === m ? '#c85070' : '#6b7280',
                        }}
                      >
                        {m === 'invitation' ? 'Invitation' : 'Rundown'}
                        <span className="block text-[9px] font-normal mt-0.5 opacity-70">
                          {m === 'invitation' ? 'Pilihan interaktif' : 'Jadwal terstruktur'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Slug ── */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs uppercase tracking-widest font-bold text-pink-400">URL Link (Slug)</label>
                    <button type="button" onClick={() => { const rand = Math.random().toString(36).substring(2, 9); setNewSlug(`${newMode === 'rundown' ? 'rundown' : 'kencan'}-${rand}`); }}
                      className="text-[10px] text-blue-500 hover:text-blue-600 transition-colors font-bold uppercase">Auto Generate</button>
                  </div>
                  <input type="text" value={newSlug} onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} placeholder={newMode === 'rundown' ? 'contoh: rundown-dinner-sabtu' : 'contoh: kencan-aku-dan-kamu'}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-pink-300 font-bold" required />
                </div>
                <div className="flex gap-2 mt-6">
                  <button type="button" onClick={() => { setShowNew(false); setNewMode('invitation'); }} className="flex-1 px-4 py-3.5 rounded-2xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">Batal</button>
                  <button type="submit" disabled={creating || !newSlug} className="flex-1 px-4 py-3.5 rounded-2xl border-none text-xs font-bold text-white uppercase tracking-widest disabled:opacity-50 bg-pink-500 shadow-lg shadow-pink-500/30">
                    {creating ? "..." : "Buat"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
