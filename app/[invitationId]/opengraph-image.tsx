import { ImageResponse } from "next/og";
import { getInvitation } from "@/lib/kv";
import { normaliseInvitation } from "@/lib/types";

export const runtime = "nodejs";
export const alt = "A personal invitation, made with love";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface ImageProps {
  params: Promise<{ invitationId: string }>;
}

export default async function OpenGraphImage({ params }: ImageProps) {
  const { invitationId } = await params;
  const raw = await getInvitation(invitationId);
  const data = raw ? normaliseInvitation(raw) : null;
  const recipient = data?.recipientName?.trim();
  const heading = recipient ? `A little something for ${recipient}` : "A little something for you";
  const photo = data?.photoUrl && /^https?:\/\//i.test(data.photoUrl) ? data.photoUrl : null;

  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", display: "flex", position: "relative",
        alignItems: "center", justifyContent: "center", overflow: "hidden",
        background: "#f5e5dc", color: "#51392f", fontFamily: "serif",
      }}>
        {photo ? (
          <img src={photo} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ position: "absolute", inset: 28, border: "1px solid #d9b6a8", borderRadius: 28, background: "linear-gradient(145deg,#fff9f1 0%,#f4ded5 100%)" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: photo ? "linear-gradient(0deg,rgba(35,20,18,.68),rgba(35,20,18,.08) 72%)" : "transparent" }} />
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
          position: "absolute", left: 72, right: 72, bottom: 56,
          padding: "28px 36px", borderRadius: 22,
          background: photo ? "rgba(45,29,27,.36)" : "transparent",
          color: photo ? "#fffaf4" : "#51392f",
        }}>
          <div style={{ fontFamily: "sans-serif", fontSize: 18, letterSpacing: 7, textTransform: "uppercase", marginBottom: 16 }}>For you, Always.</div>
          <div style={{ fontSize: 54, lineHeight: 1.12 }}>{heading}</div>
          <div style={{ fontFamily: "sans-serif", fontSize: 22, marginTop: 16, opacity: 0.92 }}>A personal invitation, made with love</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
