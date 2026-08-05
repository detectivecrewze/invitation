import { Suspense } from "react";
import { getInvitation } from "@/lib/kv";
import StudioClient from "./StudioClient";
import RundownStudioClient from "./RundownStudioClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ invitationId: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function StudioPage({ params, searchParams }: PageProps) {
  const { invitationId } = await params;
  const { token } = await searchParams;

  // Determine mode from KV — invitations without a mode field default to 'invitation'
  const raw = await getInvitation(invitationId);
  const mode = (raw as Record<string, unknown> | null)?.mode === "rundown"
    ? "rundown"
    : "invitation";

  return (
    <Suspense>
      {mode === "rundown" ? (
        <RundownStudioClient invitationId={invitationId} bundleToken={token ?? null} />
      ) : (
        <StudioClient invitationId={invitationId} bundleToken={token ?? null} />
      )}
    </Suspense>
  );
}
