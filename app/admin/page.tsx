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

  // Barcode & Physical Gift Card generator state
  const [barcodeUrl, setBarcodeUrl] = useState("");
  const [barcodeName, setBarcodeName] = useState("Untuk Zahra");
  const [barcodeColor, setBarcodeColor] = useState("#e8789a");
  const [cardBgColor, setCardBgColor] = useState("#ffffff");
  const [cardSide, setCardSide] = useState<"front" | "back">("front");
  
  // Custom Card Fields
  const [frontTitle, setFrontTitle] = useState("SOMETHING SPECIAL FOR U");
  const [badgeText, setBadgeText] = useState("SCAN QR CODE TO OPEN");
  const [cardNote, setCardNote] = useState("Scan QR code menggunakan kamera HP milikmu untuk membukanya");
  const [cardWeb, setCardWeb] = useState("for-you-always.my.id");
  const [cardIg, setCardIg] = useState("foryoualways.id");
  const [cardTiktok, setCardTiktok] = useState("fya2.id");
  const [backBrandTitle, setBackBrandTitle] = useState("For you, Always.");
  const [backSubtitle, setBackSubtitle] = useState("SPECIAL EDITION GIFT CARD");
  const [backMessage, setBackMessage] = useState(
    "Scan QR code yang ada di sisi depan kartu ini menggunakan kamera smartphone-mu untuk membuka kado & pesan digital spesial yang telah disiapkan khusus untukmu."
  );
  const [backFooter, setBackFooter] = useState("Crafted with Love · for-you-always.my.id");
  
  // Custom Typography Color & Size Overrides
  const [frontTitleColor, setFrontTitleColor] = useState("");
  const [frontTitleSize, setFrontTitleSize] = useState(46);

  const [nameColor, setNameColor] = useState("");
  const [nameSize, setNameSize] = useState(105);

  const [badgeTextColor, setBadgeTextColor] = useState("");
  const [badgeTextSize, setBadgeTextSize] = useState(45);

  const [noteColor, setNoteColor] = useState("");
  const [noteSize, setNoteSize] = useState(48);
  
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

  const downloadCardSide = async (side: "front" | "back") => {
    if (!barcodeUrl) return;
    await document.fonts.ready;

    const canvas = document.createElement("canvas");
    canvas.width = 2400;
    canvas.height = side === "front" ? 2800 : 3200;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    const color = barcodeColor || "#e8789a";

    if (side === "front") {
      const el = qrWrapRef.current?.querySelector("svg");
      if (!el) return;

      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(el);
      const img = new Image();
      const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // 1. Background Fill
        ctx.fillStyle = cardBgColor || "#ffffff";
        ctx.fillRect(0, 0, 2400, 2800);

        // 2. Outer Frame (Shorter 2800px compact card)
        ctx.strokeStyle = `${color}40`;
        ctx.lineWidth = 8;
        drawRoundedRect(ctx, 100, 100, 2200, 2600, 70);
        ctx.stroke();

        // Inner Hairline Frame
        ctx.strokeStyle = `${color}18`;
        ctx.lineWidth = 3;
        drawRoundedRect(ctx, 126, 126, 2148, 2548, 52);
        ctx.stroke();

        // Corner Flourish Dots
        const dots = [
          [160, 160], [2240, 160], [160, 2640], [2240, 2640]
        ];
        ctx.fillStyle = `${color}60`;
        dots.forEach(([dx, dy]) => {
          ctx.beginPath();
          ctx.arc(dx, dy, 8, 0, Math.PI * 2);
          ctx.fill();
        });

        // 3. Top Header Title
        const titleC = frontTitleColor || color;
        const titleS = frontTitleSize || 46;
        ctx.font = `bold ${titleS}px Inter, sans-serif`;
        ctx.fillStyle = titleC;
        ctx.textAlign = "center";
        ctx.letterSpacing = "0.26em";
        ctx.fillText((frontTitle || "SOMETHING SPECIAL FOR U").toUpperCase(), 1200, 270);

        // Top Ornamental Line: ─── ♥ ───
        ctx.strokeStyle = `${titleC}30`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(850, 330);
        ctx.lineTo(1130, 330);
        ctx.moveTo(1270, 330);
        ctx.lineTo(1550, 330);
        ctx.stroke();

        ctx.font = "30px sans-serif";
        ctx.fillStyle = titleC;
        ctx.fillText("♥", 1200, 338);

        // 4. Center Hero Heart QR Code (Size 1440x1440px, y = 380 to 1820)
        ctx.drawImage(img, 480, 380, 1440, 1440);

        // 5. Recipient Name / Caption (y = 1910)
        if (barcodeName) {
          const nameC = nameColor || color;
          const nameS = nameSize || 105;
          ctx.strokeStyle = `${nameC}30`;
          ctx.lineWidth = 2;
          ctx.font = `bold ${nameS}px Caveat, cursive, Georgia`;
          const nameTextWidth = ctx.measureText(barcodeName).width || 400;
          const sideLineW = Math.min(260, Math.max(100, (1800 - nameTextWidth) / 2));
          
          ctx.beginPath();
          ctx.moveTo(1200 - nameTextWidth/2 - sideLineW, 1890);
          ctx.lineTo(1200 - nameTextWidth/2 - 30, 1890);
          ctx.moveTo(1200 + nameTextWidth/2 + 30, 1890);
          ctx.lineTo(1200 + nameTextWidth/2 + sideLineW, 1890);
          ctx.stroke();

          ctx.fillStyle = nameC;
          ctx.textAlign = "center";
          ctx.fillText(barcodeName, 1200, 1910);
        }

        const hasFooter = Boolean(cardWeb.trim() || cardIg.trim() || cardTiktok.trim());

        // 6. Instruction Badge Pill (Dynamic Pill size & position)
        const bTextColor = badgeTextColor || color;
        const bTextS = badgeTextSize || 45;
        const badgeTextStr = badgeText || "SCAN QR CODE TO OPEN";
        const badgeW = Math.min(2100, Math.max(1400, Math.round(badgeTextStr.length * bTextS * 0.72 + 180)));
        const badgeH = Math.max(120, Math.round(bTextS * 2.2));
        const badgeX = (2400 - badgeW) / 2;
        const badgeY = hasFooter ? 2000 : 2050;
        
        ctx.fillStyle = `${bTextColor}12`;
        drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, Math.round(badgeH / 2));
        ctx.fill();
        ctx.strokeStyle = `${bTextColor}40`;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.font = `bold ${bTextS}px Inter, sans-serif`;
        ctx.fillStyle = bTextColor;
        ctx.textAlign = "center";
        ctx.letterSpacing = "0.10em";
        ctx.fillText(badgeTextStr, 1200, badgeY + Math.round(badgeH * 0.63));

        // 7. Short Note Message / Quote (Dynamic Y position computed relative to badge bottom!)
        if (cardNote) {
          const ntColor = noteColor || color;
          const ntSize = noteSize || 48;
          ctx.font = `italic ${ntSize}px Georgia, serif`;
          ctx.fillStyle = ntColor.startsWith("#") ? `${ntColor}ee` : ntColor;
          
          // Dynamically place note below badge bottom + generous breathing padding
          const noteGap = Math.max(90, Math.round(ntSize * 1.5));
          const noteY = badgeY + badgeH + noteGap;
          wrapCanvasText(ctx, `"${cardNote}"`, 1200, noteY, 1800, Math.round(ntSize * 1.33));
        }

        // 8. Website Link with Globe Icon (Dynamic Y relative to content above)
        const noteFontSize = noteSize || 48;
        const notePadding = Math.max(90, Math.round(noteFontSize * 1.5));
        const lastContentY = cardNote 
          ? (badgeY + badgeH + notePadding + Math.round(noteFontSize * 2.2) + 60)
          : (badgeY + badgeH + 90);

        const webY = Math.max(2470, lastContentY);

        if (cardWeb) {
          const cleanWeb = cardWeb.replace(/^https?:\/\//i, "").trim().toLowerCase();
          ctx.font = "bold 34px Inter, sans-serif";
          ctx.fillStyle = color;
          ctx.textAlign = "left";
          ctx.letterSpacing = "0.18em";

          const textW = ctx.measureText(`: ${cleanWeb}`).width || 450;
          const iconSize = 36;
          const totalW = iconSize + 10 + textW;
          const startX = (2400 - totalW) / 2;

          drawGlobeIcon(ctx, startX + iconSize/2, webY, iconSize, color);
          ctx.fillText(`: ${cleanWeb}`, startX + iconSize + 10, webY + 12);
        }

        // 9. Social Media Handles: IG & TikTok (Dynamic Y relative to website)
        const socialY = cardWeb ? (webY + 95) : webY;

        if (cardIg || cardTiktok) {
          ctx.font = "bold 30px Inter, sans-serif";
          ctx.fillStyle = `${color}aa`;
          ctx.letterSpacing = "0.12em";

          const cleanIg = (cardIg || "").replace(/^@/, "").trim().toLowerCase();
          const cleanTiktok = (cardTiktok || "").replace(/^@/, "").trim().toLowerCase();

          const iconSize = 34;
          const igTextW = cleanIg ? ctx.measureText(`: ${cleanIg}`).width || 250 : 0;
          const ttTextW = cleanTiktok ? ctx.measureText(`: ${cleanTiktok}`).width || 150 : 0;
          const dotW = (cleanIg && cleanTiktok) ? 70 : 0;

          const igBlockW = cleanIg ? (iconSize + 8 + igTextW) : 0;
          const ttBlockW = cleanTiktok ? (iconSize + 8 + ttTextW) : 0;
          const totalW = igBlockW + dotW + ttBlockW;
          let currentX = (2400 - totalW) / 2;

          // Draw IG Part
          if (cleanIg) {
            ctx.textAlign = "left";
            drawInstagramIcon(ctx, currentX + iconSize/2, socialY - 5, iconSize, `${color}aa`);
            ctx.fillText(`: ${cleanIg}`, currentX + iconSize + 8, socialY + 6);
            currentX += igBlockW;
          }

          // Draw Separator Dot
          if (cleanIg && cleanTiktok) {
            ctx.textAlign = "center";
            ctx.fillText("•", currentX + 35, socialY + 6);
            currentX += dotW;
          }

          // Draw TikTok Part
          if (cleanTiktok) {
            ctx.textAlign = "left";
            drawTikTokIcon(ctx, currentX + iconSize/2, socialY - 5, iconSize, `${color}aa`);
            ctx.fillText(`: ${cleanTiktok}`, currentX + iconSize + 8, socialY + 6);
          }
        }

        URL.revokeObjectURL(svgUrl);

        const link = document.createElement("a");
        link.download = `${barcodeName ? barcodeName.replace(/\s+/g, '_') : 'gift_card'}_DEPAN_300DPI.png`;
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
      };
      img.src = svgUrl;
    } else {
      // BACK SIDE
      ctx.fillStyle = "#faf7f9";
      ctx.fillRect(0, 0, 2400, 3200);

      // Outer Border Frame
      ctx.strokeStyle = `${color}40`;
      ctx.lineWidth = 12;
      drawRoundedRect(ctx, 100, 100, 2200, 3000, 80);
      ctx.stroke();

      // Inner Accent Line
      ctx.strokeStyle = `${color}20`;
      ctx.lineWidth = 4;
      drawRoundedRect(ctx, 130, 130, 2140, 2940, 60);
      ctx.stroke();

      // Top Brand Header
      ctx.font = "bold 96px Georgia, serif";
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.fillText(backBrandTitle || "For you, Always.", 1200, 420);

      ctx.font = "bold 42px Inter, sans-serif";
      ctx.fillStyle = `${color}aa`;
      ctx.fillText((backSubtitle || "SPECIAL EDITION GIFT CARD").toUpperCase(), 1200, 510);

      // Divider Line with Heart
      ctx.strokeStyle = `${color}40`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(700, 600);
      ctx.lineTo(1700, 600);
      ctx.stroke();

      ctx.font = "36px sans-serif";
      ctx.fillStyle = color;
      ctx.fillText("♥", 1200, 612);

      // Center Message Box
      const boxX = 220;
      const boxY = 720;
      const boxW = 1960;
      const boxH = 1500;

      ctx.fillStyle = "#ffffff";
      drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 60);
      ctx.fill();

      ctx.strokeStyle = `${color}30`;
      ctx.lineWidth = 4;
      ctx.setLineDash([16, 12]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = "bold 44px Inter, sans-serif";
      ctx.fillStyle = `${color}cc`;
      ctx.fillText("✉ SURAT / PETUNJUK PENERIMA", 1200, 840);

      ctx.font = "56px Georgia, serif";
      ctx.fillStyle = "#333333";
      ctx.textAlign = "center";
      const msg = backMessage || "Scan QR code yang ada di sisi depan kartu ini menggunakan kamera smartphone-mu untuk membuka kado & pesan digital spesial yang telah disiapkan khusus untukmu.";
      wrapCanvasText(ctx, msg, 1200, 980, 1700, 95);

      // Circular Stamp
      const stampY = 2500;
      ctx.beginPath();
      ctx.arc(1200, stampY, 130, 0, Math.PI * 2);
      ctx.strokeStyle = `${color}55`;
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(1200, stampY, 115, 0, Math.PI * 2);
      ctx.strokeStyle = `${color}33`;
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = "60px sans-serif";
      ctx.fillStyle = color;
      ctx.fillText("✨", 1200, stampY + 20);

      // Bottom Footer
      ctx.font = "bold 46px Georgia, serif";
      ctx.fillStyle = `${color}ee`;
      ctx.fillText(backFooter || "Crafted with Love · for-you-always.my.id", 1200, 2920);

      const link = document.createElement("a");
      link.download = `${barcodeName ? barcodeName.replace(/\s+/g, '_') : 'gift_card'}_BELAKANG_300DPI.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
    }
  };

  const downloadBothSides = async () => {
    showToast("Mengunduh Kartu Depan (300 DPI)...");
    await downloadCardSide("front");
    setTimeout(async () => {
      showToast("Mengunduh Kartu Belakang (300 DPI)...");
      await downloadCardSide("back");
      showToast("✓ Kartu Depan & Belakang berhasil diunduh!");
    }, 1200);
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
                          {["#e8789a", "#7b68ee", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#1a1a2e"].map(c => (
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

                      {/* Back Settings */}
                      <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex flex-col gap-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
                          🎴 Teks Sisi Belakang (Back)
                        </p>

                        <div>
                          <label className="text-[10px] font-bold text-gray-500 block mb-1">Nama Brand Utama</label>
                          <input
                            type="text"
                            value={backBrandTitle}
                            onChange={e => setBackBrandTitle(e.target.value)}
                            placeholder="For you, Always."
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-800"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-gray-500 block mb-1">Subtitle Brand</label>
                          <input
                            type="text"
                            value={backSubtitle}
                            onChange={e => setBackSubtitle(e.target.value)}
                            placeholder="SPECIAL EDITION GIFT CARD"
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-800"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-gray-500 block mb-1">Pesan / Surat Petunjuk</label>
                          <textarea
                            value={backMessage}
                            onChange={e => setBackMessage(e.target.value)}
                            rows={3}
                            placeholder="Scan QR code yang ada di sisi depan kartu ini..."
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-800 resize-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-gray-500 block mb-1">Footer / Website Link</label>
                          <input
                            type="text"
                            value={backFooter}
                            onChange={e => setBackFooter(e.target.value)}
                            placeholder="Crafted with Love · for-you-always.my.id"
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-800"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {barcodeUrl && (
                  <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col items-center gap-6">
                    {/* Toggle Sisi Preview */}
                    <div className="flex items-center justify-center p-1 bg-gray-100 rounded-2xl w-full max-w-xs">
                      <button
                        onClick={() => setCardSide("front")}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${cardSide === "front" ? "bg-white shadow-xs text-pink-600" : "text-gray-500"}`}
                      >
                        🎴 Sisi Depan (Front)
                      </button>
                      <button
                        onClick={() => setCardSide("back")}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${cardSide === "back" ? "bg-white shadow-xs text-purple-600" : "text-gray-500"}`}
                      >
                        🎴 Sisi Belakang (Back)
                      </button>
                    </div>

                    {/* Interactive Live Card Preview */}
                    <div className="relative w-full max-w-[340px] rounded-3xl p-5 shadow-xl flex flex-col justify-between overflow-hidden transition-all border-4"
                      style={{
                        aspectRatio: cardSide === "front" ? "24/28" : "3/4",
                        background: cardSide === "front" ? (cardBgColor || "#ffffff") : "#faf7f9",
                        borderColor: `${barcodeColor}33`,
                        boxShadow: `0 20px 50px ${barcodeColor}20`,
                      }}
                    >
                      {/* Inner Accent Line */}
                      <div className="absolute inset-2.5 rounded-2xl border-2 pointer-events-none" style={{ borderColor: `${barcodeColor}20` }} />

                      {/* Corner Flourish Dots */}
                      <div className="absolute top-4 left-4 w-1.5 h-1.5 rounded-full pointer-events-none opacity-50" style={{ background: barcodeColor }} />
                      <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full pointer-events-none opacity-50" style={{ background: barcodeColor }} />
                      <div className="absolute bottom-4 left-4 w-1.5 h-1.5 rounded-full pointer-events-none opacity-50" style={{ background: barcodeColor }} />
                      <div className="absolute bottom-4 right-4 w-1.5 h-1.5 rounded-full pointer-events-none opacity-50" style={{ background: barcodeColor }} />

                      {cardSide === "front" ? (
                        /* FRONT CARD PREVIEW */
                        <div className="flex flex-col items-center justify-between h-full relative z-10 pt-1 pb-1">
                          {/* Top Header */}
                          <div className="text-center">
                            <span className="font-bold uppercase tracking-[0.24em] block transition-all" style={{ color: frontTitleColor || barcodeColor, fontSize: `${Math.round((frontTitleSize || 46) * 0.19)}px` }}>
                              {frontTitle || "SOMETHING SPECIAL FOR U"}
                            </span>
                            <div className="flex items-center justify-center gap-1.5 opacity-40 my-0.5">
                              <span className="w-8 h-[1px]" style={{ background: frontTitleColor || barcodeColor }} />
                              <span className="text-[8px]" style={{ color: frontTitleColor || barcodeColor }}>♥</span>
                              <span className="w-8 h-[1px]" style={{ background: frontTitleColor || barcodeColor }} />
                            </div>
                          </div>

                          {/* Heart QR Code - Large & Proportional (size 200) */}
                          <div ref={qrWrapRef} className="flex flex-col items-center justify-center my-auto">
                            <HeartQRCode url={barcodeUrl} color={barcodeColor} bgColor={cardBgColor || "#ffffff"} size={200} />
                          </div>

                          {/* Lower Section: Name, Badge, Short Note, Footer, Social */}
                          <div className={`text-center w-full flex flex-col items-center gap-1 transition-all ${Boolean(cardWeb.trim() || cardIg.trim() || cardTiktok.trim()) ? 'pb-0.5' : 'pb-4 my-auto gap-1.5'}`}>
                            {barcodeName && (
                              <div className="flex items-center justify-center gap-2 w-full">
                                <span className="w-8 h-[1px] opacity-30" style={{ background: nameColor || barcodeColor }} />
                                <p className="font-bold tracking-wide -my-1 transition-all" style={{ color: nameColor || barcodeColor, fontFamily: "var(--font-caveat)", fontSize: `${Math.round((nameSize || 105) * 0.23)}px` }}>
                                  {barcodeName}
                                </p>
                                <span className="w-8 h-[1px] opacity-30" style={{ background: nameColor || barcodeColor }} />
                              </div>
                            )}
                            <div className="w-full py-1.5 px-2 rounded-full font-bold text-center uppercase tracking-wider shadow-xs transition-all"
                              style={{
                                background: `${badgeTextColor || barcodeColor}12`,
                                color: badgeTextColor || barcodeColor,
                                border: `1px solid ${badgeTextColor || barcodeColor}40`,
                                fontSize: `${Math.round((badgeTextSize || 45) * 0.19)}px`
                              }}
                            >
                              {badgeText || "SCAN QR CODE TO OPEN"}
                            </div>

                            {/* Short Note Message */}
                            {cardNote && (
                              <p className="font-medium italic font-serif opacity-90 px-2 line-clamp-2 leading-tight my-0.5 transition-all" style={{ color: noteColor || barcodeColor, fontSize: `${Math.round((noteSize || 48) * 0.21)}px` }}>
                                "{cardNote}"
                              </p>
                            )}

                            {/* Footer Website & Social Handles */}
                            <div className="flex flex-col items-center gap-0.5 mt-0.5">
                              {/* Website Domain with Globe Icon */}
                              {cardWeb && (
                                <div className="flex items-center justify-center gap-1 opacity-90" style={{ color: barcodeColor }}>
                                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="2" y1="12" x2="22" y2="12"/>
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"/>
                                  </svg>
                                  <span className="text-[7.5px] font-bold uppercase tracking-widest">
                                    : {cardWeb.replace(/^https?:\/\//i, "").trim()}
                                  </span>
                                </div>
                              )}

                              {/* IG & TikTok */}
                              {(cardIg || cardTiktok) && (
                                <div className="flex items-center justify-center gap-2 opacity-75 mt-0.5" style={{ color: barcodeColor }}>
                                  {cardIg && (
                                    <div className="flex items-center gap-1">
                                      <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                                      </svg>
                                      <span className="text-[7px] font-bold uppercase tracking-wider">
                                        : {cardIg.replace(/^@/, "").trim()}
                                      </span>
                                    </div>
                                  )}

                                  {cardIg && cardTiktok && <span className="text-[7px] opacity-40">•</span>}

                                  {cardTiktok && (
                                    <div className="flex items-center gap-1">
                                      <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.901 2.846 2.894 2.894 0 0 1-2.894-2.894 2.894 2.894 0 0 1 2.894-2.894c.244 0 .478.031.704.086V9.28a6.34 6.34 0 0 0-.704-.039 6.339 6.339 0 0 0-6.339 6.339 6.339 6.339 0 0 0 6.339 6.339 6.339 6.339 0 0 0 6.339-6.339V9.01a8.163 8.163 0 0 0 4.777 1.518V7.08a4.826 4.826 0 0 1-1.004-.394z"/>
                                      </svg>
                                      <span className="text-[7px] font-bold uppercase tracking-wider">
                                        : {cardTiktok.replace(/^@/, "").trim()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* BACK CARD PREVIEW */
                        <div className="flex flex-col items-center justify-between h-full relative z-10 py-2 text-center">
                          <div>
                            <h4 className="text-2xl font-bold font-serif" style={{ color: barcodeColor }}>
                              {backBrandTitle || "Mixtape Love"}
                            </h4>
                            <p className="text-[9px] font-bold uppercase tracking-widest mt-0.5" style={{ color: `${barcodeColor}aa` }}>
                              {backSubtitle || "SPECIAL EDITION GIFT CARD"}
                            </p>
                            <div className="w-24 h-[1px] my-2 mx-auto" style={{ background: `${barcodeColor}40` }} />
                          </div>

                          {/* Message Box */}
                          <div className="w-full p-4 rounded-2xl bg-white border-2 border-dashed flex flex-col items-center gap-2 my-auto shadow-xs"
                            style={{ borderColor: `${barcodeColor}40` }}
                          >
                            <span className="text-[9px] font-bold uppercase tracking-wider text-pink-600">✉ SURAT / PETUNJUK PENERIMA</span>
                            <p className="text-xs text-gray-700 italic leading-relaxed font-serif whitespace-pre-line">
                              {backMessage || "Scan QR code yang ada di sisi depan kartu ini..."}
                            </p>
                          </div>

                          {/* Bottom Emblem & Footer */}
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-8 h-8 rounded-full border border-dashed flex items-center justify-center text-xs mb-1"
                              style={{ borderColor: barcodeColor, color: barcodeColor }}
                            >
                              ✨
                            </div>
                            <p className="text-[10px] font-bold text-gray-500 font-serif">
                              {backFooter || "Crafted with Love · mixtape-love.com"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* High Resolution Download Actions */}
                    <div className="w-full flex flex-col gap-2.5 max-w-md">
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          onClick={() => downloadCardSide("front")}
                          className="py-3 px-4 rounded-2xl font-bold text-xs text-white shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5"
                          style={{ background: `linear-gradient(135deg, ${barcodeColor}dd, ${barcodeColor})` }}
                        >
                          🖼️ Download Depan (300DPI)
                        </button>
                        <button
                          onClick={() => downloadCardSide("back")}
                          className="py-3 px-4 rounded-2xl font-bold text-xs text-white shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5"
                          style={{ background: "linear-gradient(135deg, #7b68ee, #6366f1)" }}
                        >
                          🖼️ Download Belakang (300DPI)
                        </button>
                      </div>

                      <button
                        onClick={downloadBothSides}
                        className="w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg transition-transform active:scale-95"
                        style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 6px 18px rgba(16,185,129,0.3)" }}
                      >
                        📦 Download Paket Lengkap (Depan + Belakang HD)
                      </button>

                      <button
                        onClick={() => { navigator.clipboard.writeText(barcodeUrl); showToast("Link berhasil disalin!"); }}
                        className="w-full py-3 rounded-2xl font-bold text-xs border-2 transition-all text-center"
                        style={{ borderColor: `${barcodeColor}33`, color: barcodeColor }}
                      >
                        📋 Salin Link Target QR
                      </button>
                    </div>
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

// ── Top-level Canvas Helpers for 300 DPI Print Quality Rendering ──────────────
function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapCanvasText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const paragraphs = text.split("\n");
  let currentY = y;

  for (const para of paragraphs) {
    const words = para.split(" ");
    let line = "";

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + " ";
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
    currentY += lineHeight * 1.25;
  }
}

function drawGlobeIcon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.08;

  // Outer circle
  ctx.beginPath();
  ctx.arc(x, y, size * 0.45, 0, Math.PI * 2);
  ctx.stroke();

  // Equator line
  ctx.beginPath();
  ctx.moveTo(x - size * 0.45, y);
  ctx.lineTo(x + size * 0.45, y);
  ctx.stroke();

  // Longitude ellipse
  ctx.beginPath();
  ctx.ellipse(x, y, size * 0.22, size * 0.45, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawInstagramIcon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.09;
  ctx.fillStyle = color;

  // Outer rounded rect
  drawRoundedRect(ctx, x - size/2, y - size/2, size, size, size * 0.28);
  ctx.stroke();

  // Center circle
  ctx.beginPath();
  ctx.arc(x, y, size * 0.26, 0, Math.PI * 2);
  ctx.stroke();

  // Top-right dot
  ctx.beginPath();
  ctx.arc(x + size * 0.25, y - size * 0.25, size * 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawTikTokIcon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.translate(x - size/2, y - size/2);
  const s = size / 24;
  ctx.scale(s, s);
  
  const path = new Path2D(
    "M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.901 2.846 2.894 2.894 0 0 1-2.894-2.894 2.894 2.894 0 0 1 2.894-2.894c.244 0 .478.031.704.086V9.28a6.34 6.34 0 0 0-.704-.039 6.339 6.339 0 0 0-6.339 6.339 6.339 6.339 0 0 0 6.339 6.339 6.339 6.339 0 0 0 6.339-6.339V9.01a8.163 8.163 0 0 0 4.777 1.518V7.08a4.826 4.826 0 0 1-1.004-.394z"
  );
  ctx.fill(path);
  ctx.restore();
}
