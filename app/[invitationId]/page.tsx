import { notFound } from "next/navigation";
import { getInvitation } from "@/lib/kv";
import GiftClient from "./GiftClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ invitationId: string }>;
}

export default async function GiftPage({ params }: PageProps) {
  const { invitationId } = await params;
  const data = await getInvitation(invitationId);
  if (!data) notFound();
  return <GiftClient data={data as any} invitationId={invitationId} />;
}
