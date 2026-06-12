"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { nanoid } from "nanoid";
import { IconLock, IconMail, IconCheck, IconTicket, IconSparkle } from "@/components/ui/Icon";
import { verifyPassword } from "./actions";
import HeartQRCode from "@/components/ui/HeartQRCode";

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

  // Barcode generator state
  const [barcodeUrl, setBarcodeUrl] = useState("");
  const [barcodeName, setBarcodeName] = useState("");
  const [barcodeColor, setBarcodeColor] = useState("#e8789a");
  const qrWrapRef = useRef<HTMLDivElement>(null);

  const [showNew, setShowNew] = useState(false);
  const [newSlug, setNewSlug] = useState("");
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

  const downloadQR = async () => {
    const el = qrWrapRef.current?.querySelector("svg");
    if (!el) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(el);
    const img = new Image();
    const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = barcodeName ? 680 : 600;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 600, 600);
      if (barcodeName) {
        ctx.font = "bold 28px sans-serif";
        ctx.fillStyle = barcodeColor;
        ctx.textAlign = "center";
        ctx.fillText(barcodeName, 300, 650);
      }
      URL.revokeObjectURL(svgUrl);
      const link = document.createElement("a");
      link.download = `${barcodeName || "barcode"}-qr.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = svgUrl;
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
          status: "draft",
          themeId: "baby-blue",
          selectedActivities: [],
          customActivityLabels: {},
          selectedDressCodes: [],
          customDressCodes: {}
        }),
      });
      await load();
      setShowNew(false);
      setNewSlug("");
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
              <div className="flex flex-col gap-5">
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                  <h3 className="font-bold text-base text-gray-800 mb-4 flex items-center gap-2">
                    <IconSparkle size={18} color="#e8789a" strokeWidth={2} /> Generator Barcode Hati
                  </h3>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-widest text-pink-400 block mb-1.5">Link / URL</label>
                      <input
                        type="url"
                        value={barcodeUrl}
                        onChange={e => setBarcodeUrl(e.target.value)}
                        placeholder="https://contoh.com/link-undangan"
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none text-sm focus:border-pink-300 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-widest text-pink-400 block mb-1.5">Nama / Caption (opsional)</label>
                      <input
                        type="text"
                        value={barcodeName}
                        onChange={e => setBarcodeName(e.target.value)}
                        placeholder="contoh: Untuk Zahra"
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none text-sm focus:border-pink-300 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-widest text-pink-400 block mb-1.5">Warna</label>
                      <div className="flex items-center gap-3">
                        {["#e8789a", "#7b68ee", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#1a1a2e"].map(c => (
                          <button
                            key={c}
                            onClick={() => setBarcodeColor(c)}
                            className="w-8 h-8 rounded-full border-4 transition-all"
                            style={{ background: c, borderColor: barcodeColor === c ? c : "transparent", boxShadow: barcodeColor === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : "none" }}
                          />
                        ))}
                        <input
                          type="color"
                          value={barcodeColor}
                          onChange={e => setBarcodeColor(e.target.value)}
                          className="w-8 h-8 rounded-full border-2 border-gray-200 cursor-pointer overflow-hidden"
                          title="Pilih warna kustom"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {barcodeUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-6 shadow-sm flex flex-col items-center gap-4"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-widest text-center" style={{ color: barcodeColor, opacity: 0.7 }}>Preview Barcode</p>
                    <div ref={qrWrapRef} className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl" style={{ border: `2px dashed ${barcodeColor}40` }}>
                      <HeartQRCode url={barcodeUrl} color={barcodeColor} bgColor="#ffffff" size={220} />
                      {barcodeName && (
                        <p className="mt-3 font-bold text-base tracking-wide" style={{ color: barcodeColor }}>{barcodeName}</p>
                      )}
                    </div>
                    <button
                      onClick={downloadQR}
                      className="w-full py-3 rounded-2xl font-bold text-sm text-white shadow-lg transition-all"
                      style={{ background: `linear-gradient(135deg, ${barcodeColor}dd, ${barcodeColor})`, boxShadow: `0 6px 16px ${barcodeColor}44` }}
                    >
                      ⬇ Download Barcode (PNG)
                    </button>
                    <button
                      onClick={() => { navigator.clipboard.writeText(barcodeUrl); showToast("Link berhasil disalin!"); }}
                      className="w-full py-3 rounded-2xl font-bold text-sm border-2 transition-all"
                      style={{ borderColor: `${barcodeColor}33`, color: barcodeColor }}
                    >
                      📋 Salin Link
                    </button>
                  </motion.div>
                )}

                {!barcodeUrl && (
                  <div className="text-center py-10 text-gray-400 text-sm">
                    Masukkan link di atas untuk melihat preview barcode-nya
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
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs uppercase tracking-widest font-bold text-pink-400">URL Link (Slug)</label>
                    <button type="button" onClick={() => { const rand = Math.random().toString(36).substring(2, 9); setNewSlug(`kencan-${rand}`); }}
                      className="text-[10px] text-blue-500 hover:text-blue-600 transition-colors font-bold uppercase">Auto Generate</button>
                  </div>
                  <input type="text" value={newSlug} onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} placeholder="contoh: kencan-aku-dan-kamu"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-pink-300 font-bold" required />
                </div>
                <div className="flex gap-2 mt-6">
                  <button type="button" onClick={() => setShowNew(false)} className="flex-1 px-4 py-3.5 rounded-2xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">Batal</button>
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
