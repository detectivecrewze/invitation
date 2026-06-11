"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { IconMail, IconSparkle, IconLock } from "@/components/ui/Icon";

// ── Types ──────────────────────────────────────────────────────────────────────
interface BundleToken {
  id: string;
  remainingQuota: number;
  totalQuota: number;
  invitations: string[];
  label?: string;
}

// ── Slot Card Component ────────────────────────────────────────────────────────
function SlotCard({
  index,
  invitationId,
  tokenId,
  isAvailable,
  onCreateClick,
}: {
  index: number;
  invitationId?: string;
  tokenId: string;
  isAvailable: boolean;
  onCreateClick: () => void;
}) {
  const isFilled = !!invitationId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      className="relative w-full max-w-[300px]"
    >
      <div
        className="relative rounded-3xl overflow-hidden flex flex-col items-center gap-6 p-7 bg-white"
        style={{
          boxShadow: "0 16px 40px rgba(232,120,154,0.08), 0 4px 12px rgba(232,120,154,0.04)",
          border: "1px solid rgba(232,120,154,0.15)",
        }}
      >
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: "#e8789a" }}>
          Undangan {index + 1}
        </p>

        <div className="relative">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500" style={{ background: isFilled ? "linear-gradient(135deg, #f9c8d8, #e8789a)" : "rgba(232,120,154,0.05)" }}>
            <IconMail size={32} color={isFilled ? "white" : "rgba(232,120,154,0.4)"} strokeWidth={1.5} />
          </div>
        </div>

        {isFilled ? (
          <div className="flex flex-col items-center gap-2 w-full mt-2">
            <span className="text-[10px] font-bold tracking-widest uppercase text-green-500 bg-green-50 px-3 py-1 rounded-full">
              ✓ Dibuat
            </span>
            <div className="flex gap-2 w-full mt-2">
              <a
                href={`/${invitationId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-transform active:scale-95"
                style={{ background: "#e8789a", color: "white" }}
              >
                Lihat Undangan
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/${invitationId}`);
                  alert("Link disalin!");
                }}
                className="px-3 rounded-xl bg-pink-50 text-pink-500 font-bold text-xs"
              >
                Copy
              </button>
            </div>
            <a
              href={`/studio/${invitationId}?token=${tokenId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2.5 rounded-xl text-xs font-medium transition-colors hover:bg-pink-50"
              style={{ border: "1px solid rgba(232,120,154,0.3)", color: "#c85070" }}
            >
              Edit di Studio
            </a>
          </div>
        ) : isAvailable ? (
          <button
            onClick={onCreateClick}
            className="w-full py-4 rounded-2xl text-xs font-bold tracking-wider uppercase transition-transform active:scale-95"
            style={{ background: "linear-gradient(135deg, #e8789a, #c85070)", color: "white", boxShadow: "0 8px 24px rgba(232,120,154,0.3)" }}
          >
            Buat Undangan
          </button>
        ) : (
          <div className="w-full text-center py-3.5 rounded-2xl text-xs font-bold bg-gray-50 text-gray-400 flex items-center justify-center gap-2">
            <IconLock size={14} /> Terkunci
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const params = useParams();
  const tokenId = (params?.tokenId as string)?.toUpperCase();

  const [token, setToken] = useState<BundleToken | null>(null);
  const [status, setStatus] = useState<"loading" | "found" | "not_found">("loading");

  const [showCreate, setShowCreate] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);

  const fetchToken = useCallback(async () => {
    if (!tokenId) return;
    try {
      const res = await fetch(`/api/tokens?id=${tokenId}`);
      if (res.ok) {
        setToken(await res.json());
        setStatus("found");
      } else {
        setStatus("not_found");
      }
    } catch {
      setStatus("not_found");
    }
  }, [tokenId]);

  useEffect(() => { fetchToken(); }, [fetchToken]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlug) return;
    setCreating(true);
    setCreateError("");
    
    const id = newSlug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
    
    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          invitationId: id, 
          bundleToken: tokenId,
          status: "draft",
          themeId: "baby-blue", // Default
          selectedActivities: [],
          customActivityLabels: {},
          selectedDressCodes: [],
          customDressCodes: {}
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setCreatedSlug(id);
        fetchToken();
      } else {
        setCreateError(data.error || "Gagal membuat undangan. Mungkin link sudah dipakai.");
      }
    } catch {
      setCreateError("Koneksi gagal. Coba lagi.");
    } finally {
      setCreating(false);
    }
  };

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "radial-gradient(ellipse at 50% 30%, #fff5f8 0%, #fef0f4 50%, #f5eeff 100%)" }}>
        <div className="w-8 h-8 border-2 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
      </main>
    );
  }

  if (status === "not_found" || !token) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center" style={{ background: "radial-gradient(ellipse at 50% 30%, #fff5f8 0%, #fef0f4 50%, #f5eeff 100%)" }}>
        <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center mb-2">
          <IconLock size={24} color="#e8789a" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Token Tidak Ditemukan</h1>
        <p className="text-sm text-gray-500 max-w-xs">Token yang kamu masukkan salah atau sudah ditarik. Silakan periksa kembali.</p>
        <a href="/" className="mt-4 px-8 py-3 rounded-2xl text-sm font-bold text-white bg-pink-500 shadow-lg shadow-pink-500/30">
          ← Kembali
        </a>
      </main>
    );
  }

  const slots = Array.from({ length: token.totalQuota }).map((_, i) => ({
    index: i,
    invitationId: token.invitations?.[i] ?? undefined,
    isAvailable: i < (token.invitations?.length || 0) + token.remainingQuota && !(token.invitations?.[i]),
  }));

  return (
    <>
      <main className="min-h-screen flex flex-col items-center px-4 py-16 overflow-x-hidden relative gap-10" style={{ background: "radial-gradient(ellipse at 50% 30%, #fff5f8 0%, #fef0f4 50%, #f5eeff 100%)" }}>
        {/* Ambient blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute w-96 h-96 rounded-full opacity-20" style={{ background: "#f4b8ce", top: "-10%", left: "-15%", filter: "blur(80px)" }} />
          <div className="absolute w-64 h-64 rounded-full opacity-15" style={{ background: "#b8c8f4", bottom: "0%", right: "-10%", filter: "blur(60px)" }} />
        </div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center relative z-10 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-pink-200/50 mb-2" style={{ background: "linear-gradient(135deg, #f9c8d8, #e8789a)" }}>
            <IconSparkle size={20} color="white" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: "#e8789a" }}>Token Dashboard</p>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#8a3050" }}>Undangan Spesialmu</h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10">
          <div className="px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase bg-white/60 backdrop-blur-md border border-white" style={{ color: token.remainingQuota === 0 ? "#a0a0a0" : "#c85070", boxShadow: "0 4px 12px rgba(232,120,154,0.05)" }}>
            {token.remainingQuota === 0 ? "Semua Kuota Terpakai ✓" : `Sisa ${token.remainingQuota} dari ${token.totalQuota} kuota`}
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 w-full max-w-4xl relative z-10">
          {slots.map((slot) => (
            <SlotCard key={slot.index} index={slot.index} invitationId={slot.invitationId} tokenId={tokenId} isAvailable={slot.isAvailable} onCreateClick={() => setShowCreate(true)} />
          ))}
        </div>
      </main>

      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowCreate(false)}>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} className="w-full max-w-sm rounded-3xl p-8 flex flex-col gap-6 relative overflow-hidden bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="text-center">
                <h2 className="text-xl font-bold" style={{ color: "#8a3050" }}>{createdSlug ? "Undangan Dibuat! 🎉" : "Buat Undangan"}</h2>
                <p className="text-xs mt-2 leading-relaxed text-gray-500">
                  {createdSlug ? "Undangan kamu sudah siap! Salin linknya atau langsung edit di studio." : "Pilih link unik untuk undanganmu."}
                </p>
              </div>

              {createdSlug ? (
                <div className="flex flex-col gap-4">
                  <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-pink-400 font-bold mb-1">Link Kamu</p>
                    <p className="text-sm font-bold text-gray-800 break-all">{typeof window !== 'undefined' ? `${window.location.origin}/studio/${createdSlug}?token=${tokenId}` : ''}</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <a href={`/studio/${createdSlug}?token=${tokenId}`} target="_blank" rel="noopener noreferrer" className="w-full text-center py-3.5 rounded-2xl text-sm font-bold tracking-wider text-white bg-pink-500 shadow-lg shadow-pink-500/30">
                      Buka Studio Editor
                    </a>
                    <button onClick={() => { if (typeof window !== 'undefined') { navigator.clipboard.writeText(`${window.location.origin}/studio/${createdSlug}?token=${tokenId}`); alert("Link disalin!"); } }} className="w-full py-3.5 rounded-2xl text-sm font-bold tracking-wider bg-gray-50 text-gray-600">
                      Salin Link
                    </button>
                    <button onClick={() => { setShowCreate(false); setCreatedSlug(null); setNewSlug(""); }} className="mt-1 text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest">
                      Tutup
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateSubmit} className="flex flex-col gap-3">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs uppercase tracking-widest text-pink-400 font-bold">Custom Link</label>
                    <button type="button" onClick={() => { const rand = Math.random().toString(36).substring(2, 9); setNewSlug(`kencan-${rand}`); setCreateError(""); }} className="text-[10px] uppercase tracking-wider font-bold text-blue-500 hover:text-blue-600">
                      Auto Generate
                    </button>
                  </div>
                  <input type="text" value={newSlug} onChange={e => { setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, '-')); setCreateError(""); }} placeholder="e.g. kencan-aku-dan-kamu" autoFocus required className="w-full px-5 py-4 rounded-2xl text-sm font-bold text-center tracking-wide outline-none border bg-gray-50/50 focus:bg-white transition-colors" style={{ borderColor: createError ? "#f48080" : "rgba(232,120,154,0.2)", color: "#8a3050" }} />
                  {createError && <p className="text-xs text-center text-red-500 font-bold">{createError}</p>}
                  <div className="flex gap-3 mt-3">
                    <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-3.5 rounded-2xl text-sm font-bold tracking-wider bg-gray-50 text-gray-500 hover:bg-gray-100">
                      Batal
                    </button>
                    <button type="submit" disabled={creating || !newSlug.trim()} className="flex-1 py-3.5 rounded-2xl text-sm font-bold tracking-wider text-white bg-pink-500 shadow-lg shadow-pink-500/30 disabled:opacity-50 hover:bg-pink-600">
                      {creating ? "..." : "Buat"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
