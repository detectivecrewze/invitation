/**
 * download-gift.ts
 * 300 DPI canvas export for the Gift Card style.
 * Dynamic scaling factor so user font size sliders directly drive canvas export.
 */

import type { GiftCardProps } from "./types";

type DownloadGiftArgs = GiftCardProps & {
  qrWrapRef: React.RefObject<HTMLDivElement | null>;
};

// ── Canvas helpers ─────────────────────────────────────────────────────────

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number, y: number,
  maxWidth: number, lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) ctx.fillText(line, x, currentY);
}

function drawGlobeIcon(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, size: number, color: string,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.08;
  ctx.beginPath();
  ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - size / 2, cy);
  ctx.lineTo(cx + size / 2, cy);
  ctx.stroke();
  const rx = size * 0.28;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, size / 2, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawInstagramIcon(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, size: number, color: string,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.08;
  const r = size * 0.36;
  const corner = size * 0.24;
  drawRoundedRect(ctx, cx - r, cy - r, r * 2, r * 2, corner);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + r * 0.62, cy - r * 0.62, r * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawTikTokIcon(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, size: number, color: string,
) {
  ctx.save();
  ctx.fillStyle = color;
  const s = size * 0.046;
  ctx.beginPath();
  ctx.moveTo(cx - s * 4, cy - s * 7);
  ctx.lineTo(cx + s * 2, cy - s * 7);
  ctx.lineTo(cx + s * 2, cy + s * 3);
  ctx.arc(cx - s * 0.5, cy + s * 3, s * 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ── Main export ────────────────────────────────────────────────────────────

export async function downloadGiftCard({
  qrWrapRef,
  barcodeUrl,
  barcodeColor,
  cardBgColor,
  barcodeName,
  frontTitle,
  frontTitleColor,
  frontTitleSize,
  nameColor,
  nameSize,
  badgeText,
  badgeTextColor,
  badgeTextSize,
  cardNote,
  noteColor,
  noteSize,
  cardWeb,
  cardIg,
  cardTiktok,
}: DownloadGiftArgs) {
  if (!barcodeUrl) return;
  await document.fonts.ready;

  const el = qrWrapRef.current?.querySelector("svg");
  if (!el) return;

  const canvas = document.createElement("canvas");
  canvas.width = 2400;
  canvas.height = 2800;
  const ctx = canvas.getContext("2d")!;
  if (!ctx) return;

  const color = barcodeColor || "#e8789a";

  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(el);
  const img = new Image();
  const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  img.onload = () => {
    // 1. Background
    ctx.fillStyle = cardBgColor || "#ffffff";
    ctx.fillRect(0, 0, 2400, 2800);

    // 2. Outer frame
    ctx.strokeStyle = `${color}40`;
    ctx.lineWidth = 8;
    drawRoundedRect(ctx, 100, 100, 2200, 2600, 70);
    ctx.stroke();

    ctx.strokeStyle = `${color}18`;
    ctx.lineWidth = 3;
    drawRoundedRect(ctx, 126, 126, 2148, 2548, 52);
    ctx.stroke();

    // Corner dots
    const dots = [[160, 160], [2240, 160], [160, 2640], [2240, 2640]];
    ctx.fillStyle = `${color}60`;
    dots.forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.arc(dx, dy, 8, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Top header (Scaled by frontTitleSize slider!)
    const titleC = frontTitleColor || color;
    const titleS = Math.round((frontTitleSize || 46) * 1.8); // 46 -> 82px, 80 -> 144px
    ctx.font = `bold ${titleS}px Inter, sans-serif`;
    ctx.fillStyle = titleC;
    ctx.textAlign = "center";
    ctx.letterSpacing = "0.26em";
    ctx.fillText((frontTitle || "SOMETHING SPECIAL FOR U").toUpperCase(), 1200, 270);

    ctx.strokeStyle = `${titleC}30`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(850, 330); ctx.lineTo(1130, 330);
    ctx.moveTo(1270, 330); ctx.lineTo(1550, 330);
    ctx.stroke();
    ctx.font = "30px sans-serif";
    ctx.fillStyle = titleC;
    ctx.fillText("♥", 1200, 338);

    // 4. Heart QR Code
    ctx.drawImage(img, 480, 380, 1440, 1440);

    // 5. Recipient name (Scaled by nameSize slider!)
    if (barcodeName) {
      const nameC = nameColor || color;
      const nameS = Math.round((nameSize || 105) * 1.4); // 105 -> 147px, 150 -> 210px
      ctx.strokeStyle = `${nameC}30`;
      ctx.lineWidth = 2;
      ctx.font = `bold ${nameS}px Caveat, cursive, Georgia`;
      const nameTextWidth = ctx.measureText(barcodeName).width || 400;
      const sideLineW = Math.min(260, Math.max(100, (1800 - nameTextWidth) / 2));

      ctx.beginPath();
      ctx.moveTo(1200 - nameTextWidth / 2 - sideLineW, 1890);
      ctx.lineTo(1200 - nameTextWidth / 2 - 30, 1890);
      ctx.moveTo(1200 + nameTextWidth / 2 + 30, 1890);
      ctx.lineTo(1200 + nameTextWidth / 2 + sideLineW, 1890);
      ctx.stroke();

      ctx.fillStyle = nameC;
      ctx.textAlign = "center";
      ctx.fillText(barcodeName, 1200, 1910);
    }

    const hasFooter = Boolean(cardWeb.trim() || cardIg.trim() || cardTiktok.trim());

    // 6. Badge pill (Scaled by badgeTextSize slider!)
    const bTextColor = badgeTextColor || color;
    const bTextS = Math.round((badgeTextSize || 45) * 1.3); // 45 -> 58px, 70 -> 91px
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

    // 7. Short note (Scaled by noteSize slider!)
    if (cardNote) {
      const ntColor = noteColor || color;
      const ntSize = Math.round((noteSize || 48) * 1.3); // 48 -> 62px, 80 -> 104px
      ctx.font = `italic ${ntSize}px Georgia, serif`;
      ctx.fillStyle = ntColor.startsWith("#") ? `${ntColor}ee` : ntColor;
      const noteGap = Math.max(90, Math.round(ntSize * 1.5));
      const noteY = badgeY + badgeH + noteGap;
      wrapCanvasText(ctx, `"${cardNote}"`, 1200, noteY, 1800, Math.round(ntSize * 1.33));
    }

    // 8. Website
    const noteFontSize = Math.round((noteSize || 48) * 1.3);
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
      drawGlobeIcon(ctx, startX + iconSize / 2, webY, iconSize, color);
      ctx.fillText(`: ${cleanWeb}`, startX + iconSize + 10, webY + 12);
    }

    // 9. Social handles
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

      if (cleanIg) {
        ctx.textAlign = "left";
        drawInstagramIcon(ctx, currentX + iconSize / 2, socialY - 5, iconSize, `${color}aa`);
        ctx.fillText(`: ${cleanIg}`, currentX + iconSize + 8, socialY + 6);
        currentX += igBlockW;
      }
      if (cleanIg && cleanTiktok) {
        ctx.textAlign = "center";
        ctx.fillText("•", currentX + 35, socialY + 6);
        currentX += dotW;
      }
      if (cleanTiktok) {
        ctx.textAlign = "left";
        drawTikTokIcon(ctx, currentX + iconSize / 2, socialY - 5, iconSize, `${color}aa`);
        ctx.fillText(`: ${cleanTiktok}`, currentX + iconSize + 8, socialY + 6);
      }
    }

    URL.revokeObjectURL(svgUrl);

    const link = document.createElement("a");
    link.download = `${barcodeName ? barcodeName.replace(/\s+/g, "_") : "gift_card"}_GiftCard_300DPI.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  };

  img.src = svgUrl;
}
