import { notFound } from "next/navigation";
import { getInvitation } from "@/lib/kv";
import { normaliseInvitation } from "@/lib/types";
import GiftClient from "./GiftClient";
import RundownGiftClient from "./RundownGiftClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ invitationId: string }>;
}

export default async function GiftPage({ params }: PageProps) {
  const { invitationId } = await params;
  const raw = await getInvitation(invitationId);
  if (!raw) notFound();

  const data = normaliseInvitation(raw);

  if (data.mode === "rundown") {
    return <RundownGiftClient data={data} invitationId={invitationId} />;
  }

  return <GiftClient data={data as any} invitationId={invitationId} />;
}
