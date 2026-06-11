"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { nanoid } from "nanoid";
import { IconLock, IconMail, IconCheck, IconTicket, IconSparkle } from "@/components/ui/Icon";
import { verifyPassword } from "./actions";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [invitations, setInvitations] = useState<any[]>([]);
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTokenQuota, setNewTokenQuota] = useState(1);
  const [newTokenLabel, setNewTokenLabel] = useState("");
  const [tab, setTab] = useState<"invitations" | "tokens">("invitations");
  const [toast, setToast] = useState<string | null>(null);

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

  const goToStudio = () => {
    const id = nanoid(10);
    window.open(`/studio/${id}`, "_blank");
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
          <button onClick={goToStudio} className="px-5 py-2.5 rounded-2xl font-bold text-sm text-white bg-pink-400 shadow-md">
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
          {(["invitations", "tokens"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
              style={{ background: tab === t ? "#e8789a" : "#f9e4ec", color: tab === t ? "white" : "#c06080" }}
            >
              {t === "invitations" ? (
                <><IconMail size={16} strokeWidth={2} /> Undangan</>
              ) : (
                <><IconTicket size={16} strokeWidth={2} /> Token</>
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
          </>
        )}
      </div>
    </div>
  );
}
