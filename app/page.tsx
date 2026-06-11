"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { nanoid } from "nanoid";
import {
  IconMail, IconLock, IconArrowRight
} from "@/components/ui/Icon";

export default function HomePage() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const handleStart = async () => {
    const t = token.toUpperCase().trim();
    if (!t) { setError("Masukkan token kamu terlebih dahulu."); return; }
    setChecking(true);
    setError("");
    try {
      const res = await fetch("/api/tokens").then(r => r.json());
      const found = res.tokens?.find((tok: { id: string; remainingQuota: number }) => tok.id === t && tok.remainingQuota > 0);
      if (!found) { setError("Token tidak valid atau tidak ditemukan."); return; }
      window.location.href = `/dashboard/${t}`;
    } finally {
      setChecking(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 30%, #fff5f8 0%, #fef0f4 50%, #f5eeff 100%)" }}
    >
      {/* Subtle ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full opacity-20" style={{ background: "#f4b8ce", top: "-10%", left: "-15%", filter: "blur(80px)" }} />
        <div className="absolute w-64 h-64 rounded-full opacity-15" style={{ background: "#b8c8f4", bottom: "0%", right: "-10%", filter: "blur(60px)" }} />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-sm"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
      >
        {/* Logo / brand */}
        <div className="text-center mb-10">
          {/* SVG heart logo */}
          <div className="flex justify-center mb-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #f9c8d8, #e8789a)", boxShadow: "0 12px 32px rgba(232,120,154,0.35)" }}
            >
              <IconMail size={28} color="white" strokeWidth={1.5} />
            </div>
          </div>

          <h1
            style={{ fontFamily: "var(--font-caveat)", fontSize: "2.2rem", color: "#8a3050", letterSpacing: "0.01em" }}
          >
            Date Invitation
          </h1>
          <p
            className="mt-2 text-sm font-medium leading-relaxed"
            style={{ color: "#8a3050", opacity: 0.5, letterSpacing: "0.01em" }}
          >
            Buat undangan kencan yang manis<br />dan interaktif untuk orang spesialmu
          </p>
        </div>

        {/* Card */}
        <div
          className="bg-white rounded-3xl px-7 py-8"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.09), 0 4px 16px rgba(0,0,0,0.05)", border: "1px solid rgba(232,120,154,0.12)" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <IconLock size={14} color="#e8789a" strokeWidth={2} />
            <label className="text-[10px] tracking-[0.25em] uppercase font-bold" style={{ color: "#e8789a" }}>
              Token Akses
            </label>
          </div>

          <input
            type="text"
            value={token}
            onChange={e => { setToken(e.target.value.toUpperCase()); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleStart()}
            placeholder="Contoh: ABCD1234"
            className="w-full px-4 py-3.5 rounded-xl text-sm font-mono font-bold tracking-[0.15em] outline-none transition-colors mb-2"
            style={{
              border: `1.5px solid ${error ? "#f48080" : "rgba(232,120,154,0.2)"}`,
              background: "rgba(249,200,216,0.05)",
              color: "#5c2d3f",
            }}
          />

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold mb-3"
              style={{ color: "#e06060" }}
            >
              {error}
            </motion.p>
          )}

          <motion.button
            onClick={handleStart}
            disabled={checking}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02, opacity: 0.9 }}
            className="w-full py-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-3 mt-3 tracking-wide transition-all"
            style={{
              background: "linear-gradient(135deg, #e8789a, #c85070)",
              boxShadow: "0 8px 24px rgba(232,120,154,0.45)",
              letterSpacing: "0.05em",
              opacity: checking ? 0.7 : 1,
            }}
          >
            {checking ? "Memeriksa..." : "Buat Undangan"}
            {!checking && <IconArrowRight size={16} color="white" strokeWidth={2} />}
          </motion.button>
        </div>

        <p className="text-center text-xs mt-5" style={{ color: "#8a3050", opacity: 0.4, letterSpacing: "0.03em" }}>
          Belum punya token?{" "}
          <a href="/admin" className="font-bold underline underline-offset-2" style={{ opacity: 1 }}>
            Hubungi admin
          </a>
        </p>
      </motion.div>
    </div>
  );
}
