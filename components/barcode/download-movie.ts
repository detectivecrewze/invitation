/**
 * download-movie.ts
 * 300 DPI high-resolution canvas export for Landscape Cinema Ticket Stub.
 * Dimensions: 3200 x 1800 px (16:9 ratio)
 * Enlarged, perfectly centered Hero Heart QR Code on Right Ticket Stub.
 */

import type { MovieTicketProps } from "./types";

type DownloadMovieArgs = MovieTicketProps & {
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

function drawFilmIcon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.12;
  ctx.strokeRect(x, y, size, size * 0.75);
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.3);
  ctx.lineTo(x + size, y + size * 0.3);
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

export async function downloadMovieTicket({
  qrWrapRef,
  barcodeUrl,
  barcodeColor,
  cardBgColor,
  barcodeName,
  frontTitle,
  frontTitleColor,
  frontTitleSize,
  nameColor,
  badgeText,
  badgeTextColor,
  badgeTextSize,
  cardNote,
  noteColor,
  cardWeb,
  cardIg,
  showPerforation,
}: DownloadMovieArgs) {
  if (!barcodeUrl) return;
  await document.fonts.ready;

  const el = qrWrapRef.current?.querySelector("svg");
  if (!el) return;

  const W = 3200;
  const H = 1800;
  const STUB_X = 2140; // 67% perforation line position

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  if (!ctx) return;

  const color = barcodeColor || "#e8789a";
  const bg = cardBgColor || "#faf6ec";

  // SVG to Image
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(el);
  const img = new Image();
  const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  img.onload = () => {
    // 1. Background Fill
    ctx.fillStyle = bg;
    drawRoundedRect(ctx, 0, 0, W, H, 80);
    ctx.fill();

    // 2. Outer Frame Stroke
    ctx.strokeStyle = `${color}45`;
    ctx.lineWidth = 12;
    drawRoundedRect(ctx, 24, 24, W - 48, H - 48, 70);
    ctx.stroke();

    // 3. Right Stub Background Shading
    ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    ctx.fillRect(STUB_X, 24, W - STUB_X - 24, H - 48);

    // 4. Dashed Perforation Line & Notches (Optional)
    if (showPerforation !== false) {
      ctx.save();
      ctx.strokeStyle = `${color}50`;
      ctx.lineWidth = 8;
      ctx.setLineDash([32, 20]);
      ctx.beginPath();
      ctx.moveTo(STUB_X, 24);
      ctx.lineTo(STUB_X, H - 24);
      ctx.stroke();
      ctx.restore();

      // Perforation Notches (Top & Bottom Circles)
      const notchR = 85;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(STUB_X, 0, notchR, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(STUB_X, H, notchR, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── LEFT TICKET BODY ──
    const leftPad = 140;
    const bodyWidth = STUB_X - leftPad - 120;
    const titleC = frontTitleColor || color;
    const titleS = Math.round((frontTitleSize || 46) * 3.2); // 46 -> 147px, 80 -> 256px!

    // A. Header Tag (y = 150)
    drawFilmIcon(ctx, leftPad, 150, 60, titleC);
    ctx.font = "bold 48px Inter, sans-serif";
    ctx.fillStyle = titleC;
    ctx.textAlign = "left";
    ctx.letterSpacing = "0.22em";
    ctx.fillText("CINEMA ADMIT ONE", leftPad + 90, 195);

    // Bolder Divider Line DIRECTLY BELOW CINEMA ADMIT ONE (y = 240)
    ctx.strokeStyle = `${titleC}55`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(leftPad, 240);
    ctx.lineTo(leftPad + bodyWidth, 240);
    ctx.stroke();

    // B. Large Movie Title (Exact user casing preserved!)
    ctx.font = `bold ${titleS}px Inter, sans-serif`;
    ctx.fillStyle = titleC;
    ctx.letterSpacing = "0.02em";
    const userTitleText = frontTitle || "Something Special For u";
    wrapCanvasText(ctx, userTitleText, leftPad, 360, bodyWidth, titleS * 1.22);

    // C. Recipient Name Section (y = 660 & y = 840)
    const nameC = nameColor || color;
    if (barcodeName) {
      ctx.font = "bold 42px Inter, sans-serif";
      ctx.fillStyle = `${nameC}bb`;
      ctx.letterSpacing = "0.20em";
      ctx.fillText("FOR / PENERIMA", leftPad, 660);

      ctx.font = "bold 150px Caveat, cursive, Georgia";
      ctx.fillStyle = nameC;
      ctx.letterSpacing = "0.02em";
      ctx.fillText(barcodeName, leftPad, 840);
    }

    // D. Short Note Quote Section (Fixed anchor at y = 1140!)
    if (cardNote) {
      const ntColor = noteColor || color;
      ctx.font = "italic 70px Georgia, serif";
      ctx.fillStyle = ntColor.startsWith("#") ? `${ntColor}ee` : ntColor;
      wrapCanvasText(ctx, `"${cardNote}"`, leftPad, 1140, bodyWidth, 95);
    }

    // E. Social Handles Footer Line (Bolder line at y = 1520 & text at y = 1620)
    if (cardWeb || cardIg) {
      ctx.strokeStyle = `${color}45`;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(leftPad, 1520);
      ctx.lineTo(leftPad + bodyWidth, 1520);
      ctx.stroke();

      ctx.font = "bold 42px Inter, sans-serif";
      ctx.fillStyle = `${color}dd`;
      ctx.letterSpacing = "0.15em";
      const footText = [
        cardWeb ? cardWeb.replace(/^https?:\/\//i, "").trim() : "",
        cardIg ? `@${cardIg.replace(/^@/, "").trim()}` : "",
      ].filter(Boolean).join("   •   ");

      ctx.fillText(footText, leftPad, 1610);
    }

    // ── RIGHT STUB PANEL ──
    const stubCenter = STUB_X + (W - STUB_X) / 2;

    ctx.font = "bold 48px Inter, sans-serif";
    ctx.fillStyle = `${color}ee`;
    ctx.textAlign = "center";
    ctx.letterSpacing = "0.24em";
    ctx.fillText("TICKET STUB", stubCenter, 175);

    // ENLARGED HERO HEART BARCODE (Size 980x980, perfectly centered)
    const qrSize = 980;
    const qrX = stubCenter - qrSize / 2;
    const qrY = 270;
    ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

    // Golden Ratio Badge Pill (53px font, perfectly proportioned below QR)
    const bTextColor = badgeTextColor || color;
    const badgeTextStr = badgeText || "SCAN QR CODE TO OPEN";
    const bTextS = Math.round((badgeTextSize || 45) * 1.18); // ~53px
    const badgeW = Math.min(940, (W - STUB_X - 80));
    const badgeH = 125;
    const badgeX = stubCenter - badgeW / 2;
    const badgeY = 1420;

    ctx.fillStyle = `${bTextColor}20`;
    drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, badgeH / 2);
    ctx.fill();
    ctx.strokeStyle = `${bTextColor}55`;
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.font = `bold ${bTextS}px Inter, sans-serif`;
    ctx.fillStyle = bTextColor;
    ctx.textAlign = "center";
    ctx.letterSpacing = "0.16em";
    ctx.fillText(badgeTextStr, stubCenter, badgeY + 80);

    URL.revokeObjectURL(svgUrl);

    // Download PNG
    const link = document.createElement("a");
    link.download = `${barcodeName ? barcodeName.replace(/\s+/g, "_") : "movie"}_MovieTicket_300DPI.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  };

  img.src = svgUrl;
}
