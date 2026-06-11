import { Suspense } from "react";
import StudioClient from "./StudioClient";

interface PageProps {
  params: Promise<{ invitationId: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function StudioPage({ params, searchParams }: PageProps) {
  const { invitationId } = await params;
  const { token } = await searchParams;
  return (
    <Suspense>
      <StudioClient invitationId={invitationId} bundleToken={token ?? null} />
    </Suspense>
  );
}
