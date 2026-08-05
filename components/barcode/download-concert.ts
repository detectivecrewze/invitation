/**
 * download-concert.ts
 * 300 DPI high-resolution canvas export for VIP Concert Festival Pass Lanyard layout.
 * Dimensions: 2400 x 4800 px (1:2 ratio vertical festival pass)
 * DYNAMIC FONT SLIDER BINDING: Slider values directly drive canvas font sizes.
 */

import type { ConcertTicketProps } from "./types";

type DownloadConcertArgs = ConcertTicketProps & {
  qrWrapRef: React.RefObject<HTMLDivElement | null>;
};

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

function drawMusicIcon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = size * 0.12;

  // Double music note
  ctx.beginPath();
  ctx.arc(x - size * 0.25, y + size * 0.2, size * 0.15, 0, Math.PI * 2);
  ctx.arc(x + size * 0.25, y, size * 0.15, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(x - size * 0.1, y + size * 0.2);
  ctx.lineTo(x - size * 0.1, y - size * 0.3);
  ctx.lineTo(x + size * 0.4, y - size * 0.45);
  ctx.lineTo(x + size * 0.4, y);
  ctx.stroke();

  ctx.restore();
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
  let lineCount = 0;
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
      lineCount++;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, currentY);
    lineCount++;
  }
  return { lastY: currentY, lineCount };
}

export async function downloadConcertTicket({
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
}: DownloadConcertArgs) {
  if (!barcodeUrl) return;
  await document.fonts.ready;

  const el = qrWrapRef.current?.querySelector("svg");
  if (!el) return;

  const W = 2400;
  const H = 4800;
  const RADIUS = 120;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  if (!ctx) return;

  const color = barcodeColor || "#7b68ee";
  const bg = cardBgColor || "#0c0a17";

  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(el);
  const img = new Image();
  const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  img.onload = () => {
    // 1. Background Fill
    ctx.fillStyle = bg;
    drawRoundedRect(ctx, 0, 0, W, H, RADIUS);
    ctx.fill();

    // 2. Lanyard Punch Hole Slot
    const slotW = 380;
    const slotH = 70;
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    drawRoundedRect(ctx, (W - slotW) / 2, 70, slotW, slotH, slotH / 2);
    ctx.fill();

    // 3. Radial Glow
    const glowGrad = ctx.createRadialGradient(W / 2, H * 0.4, 0, W / 2, H * 0.4, W * 0.7);
    glowGrad.addColorStop(0, `${color}40`);
    glowGrad.addColorStop(1, "transparent");
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, W, H);

    // 4. Outer Frame & Hairline
    ctx.strokeStyle = `${color}40`;
    ctx.lineWidth = 12;
    drawRoundedRect(ctx, 24, 24, W - 48, H - 48, RADIUS - 12);
    ctx.stroke();

    ctx.strokeStyle = `${color}20`;
    ctx.lineWidth = 4;
    drawRoundedRect(ctx, 56, 56, W - 112, H - 112, RADIUS - 28);
    ctx.stroke();

    const CX = W / 2;

    // Font size scaling factors for 2400x4800 px canvas
    const titleFontSize = Math.round((frontTitleSize || 46) * 2.5); // e.g. 46 -> 115px, 80 -> 200px
    const nameFontSize = Math.round((nameSize || 105) * 1.8);      // e.g. 105 -> 189px, 150 -> 270px
    const noteFontSize = Math.round((noteSize || 48) * 1.5);      // e.g. 48 -> 72px, 80 -> 120px
    const badgeFontSize = Math.round((badgeTextSize || 45) * 1.5);  // e.g. 45 -> 67px, 70 -> 105px

    // 5. Header Tag
    const titleC = frontTitleColor || color;
    drawMusicIcon(ctx, CX - 300, 240, 60, titleC);
    ctx.font = "bold 44px Inter, sans-serif";
    ctx.fillStyle = titleC;
    ctx.textAlign = "center";
    ctx.letterSpacing = "0.25em";
    ctx.fillText("VIP FESTIVAL PASS", CX + 30, 255);

    // Title
    ctx.font = `black ${titleFontSize}px Inter, sans-serif`;
    ctx.fillStyle = titleC;
    ctx.letterSpacing = "0.06em";
    const titleResult = wrapCanvasText(ctx, (frontTitle || "SOMETHING SPECIAL FOR U").toUpperCase(), CX, 380, W - 400, titleFontSize * 1.25);

    const lineY = Math.max(540, titleResult.lastY + 80);
    ctx.strokeStyle = `${titleC}40`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(300, lineY);
    ctx.lineTo(W - 300, lineY);
    ctx.stroke();

    // 6. HERO HEART BARCODE (Size 1400x1400)
    const qrSize = 1400;
    const qrX = (W - qrSize) / 2;
    const qrY = lineY + 120;
    ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

    // 7. Recipient Name (Positioned below QR code with proper spacing!)
    const nameY = qrY + qrSize + 160;
    if (barcodeName) {
      const nameC = nameColor || color;
      ctx.font = `bold ${nameFontSize}px Caveat, cursive, Georgia`;
      ctx.fillStyle = nameC;
      ctx.textAlign = "center";
      ctx.fillText(barcodeName, CX, nameY);
    }

    // 8. Badge Pill (Positioned below recipient name!)
    const badgeY = barcodeName ? (nameY + 100) : (qrY + qrSize + 140);
    const bTextColor = badgeTextColor || color;
    const badgeTextStr = badgeText || "SCAN QR CODE TO OPEN";
    const badgeW = Math.min(2000, Math.max(1300, Math.round(badgeTextStr.length * badgeFontSize * 0.72 + 180)));
    const badgeH = Math.max(130, Math.round(badgeFontSize * 1.8));
    const badgeX = (W - badgeW) / 2;

    ctx.fillStyle = `${bTextColor}22`;
    drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, badgeH / 2);
    ctx.fill();
    ctx.strokeStyle = `${bTextColor}50`;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.font = `bold ${badgeFontSize}px Inter, sans-serif`;
    ctx.fillStyle = bTextColor;
    ctx.textAlign = "center";
    ctx.letterSpacing = "0.15em";
    ctx.fillText(badgeTextStr, CX, badgeY + badgeH * 0.65);

    // 9. Short Note Quote (Positioned below badge pill!)
    const noteY = badgeY + badgeH + 100;
    if (cardNote) {
      const ntColor = noteColor || color;
      ctx.font = `italic ${noteFontSize}px Georgia, serif`;
      ctx.fillStyle = ntColor.startsWith("#") ? `${ntColor}ee` : ntColor;
      wrapCanvasText(ctx, `"${cardNote}"`, CX, noteY, 1800, noteFontSize * 1.4);
    }

    // 10. Pass Barcode Lines Decoration
    const barY = H - 360;
    const barHeights = [60, 30, 80, 40, 30, 70, 30, 60, 40, 80, 30, 60, 40, 30, 70];
    const totalBarW = barHeights.length * 24;
    let startBarX = CX - totalBarW / 2;

    barHeights.forEach(h => {
      ctx.fillStyle = `${color}60`;
      ctx.fillRect(startBarX, barY - h / 2, 12, h);
      startBarX += 24;
    });

    // 11. Website Footer
    if (cardWeb) {
      ctx.font = "bold 38px Inter, sans-serif";
      ctx.fillStyle = `${color}aa`;
      ctx.textAlign = "center";
      ctx.letterSpacing = "0.18em";
      ctx.fillText(cardWeb.replace(/^https?:\/\//i, "").trim().toUpperCase(), CX, H - 180);
    }

    URL.revokeObjectURL(svgUrl);

    // Download PNG
    const link = document.createElement("a");
    link.download = `${barcodeName ? barcodeName.replace(/\s+/g, "_") : "concert"}_ConcertTicket_300DPI.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  };

  img.src = svgUrl;
}
