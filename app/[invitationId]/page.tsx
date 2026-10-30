import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getInvitation } from "@/lib/kv";
import { normaliseInvitation } from "@/lib/types";
import GiftClient from "./GiftClient";
import RundownGiftClient from "./RundownGiftClient";
import CatBirthdayGiftClient from "./CatBirthdayGiftClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ invitationId: string }>;
}

const siteUrl = "https://invitation.for-you-always.my.id";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { invitationId } = await params;
  const raw = await getInvitation(invitationId);
  if (!raw) return { title: "Invitation" };

  const data = normaliseInvitation(raw);
  const recipient = data.recipientName?.trim();
  const title = recipient
    ? `A Special Invitation for ${recipient}`
    : data.invitationTitle || "A Special Invitation, Made for You";
  const description = data.subText?.trim() ||
    (data.mode === "rundown"
      ? "A thoughtful day, planned just for you. Open your invitation to see the details."
      : "Someone has planned a little something special for you. Open your invitation to find out more.");
  const url = `${siteUrl}/${encodeURIComponent(invitationId)}`;
  const image = `${url}/opengraph-image`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: "For you, Always.",
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function GiftPage({ params }: PageProps) {
  const { invitationId } = await params;
  const raw = await getInvitation(invitationId);
  if (!raw) notFound();

  const data = normaliseInvitation(raw);

  if (data.mode === "rundown") {
    return <RundownGiftClient data={data} invitationId={invitationId} />;
  }

  if (data.experienceVariant === "cat-birthday-dinner" && data.vipExperience) {
    return <CatBirthdayGiftClient data={data} invitationId={invitationId} />;
  }

  return <GiftClient data={data as any} invitationId={invitationId} />;
}
