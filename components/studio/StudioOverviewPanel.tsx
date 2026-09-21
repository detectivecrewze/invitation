"use client";

import { useEffect } from "react";

import { IconCalendar, IconCamera, IconCheck, IconSparkle } from "@/components/ui/Icon";
import { formatIndonesianDate } from "@/lib/constants";
import type { Locale } from "@/lib/locale";

interface StudioOverviewPanelProps {
  mode: "invitation" | "rundown";
  theme: { bg: string; card: string; accent: string; text: string };
  locale: Locale;
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
  recipientName: string;
  senderName: string;
  title: string;
  eventDate?: string;
  photoUrl?: string | null;
  musicTitle?: string | null;
  primaryCount: number;
  secondaryCount: number;
  published: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200/80 py-3 last:border-b-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="max-w-[60%] truncate text-right text-sm font-semibold text-slate-800">
        {value}
      </span>
    </div>
  );
}

function OverviewContent({
  mode,
  theme,
  locale,
  currentStep,
  totalSteps,
  stepLabel,
  recipientName,
  senderName,
  title,
  eventDate,
  photoUrl,
  musicTitle,
  primaryCount,
  secondaryCount,
  published,
  mobile = false,
  onClose,
}: StudioOverviewPanelProps & { mobile?: boolean; onClose?: () => void }) {
  const isId = locale === "id";
  const modeLabel = mode === "rundown" ? "Rundown" : "Invitation";
  const formattedDate = eventDate ? formatIndonesianDate(eventDate, locale) : "";

  return (
      <div className={`${mobile ? "overflow-hidden rounded-t-[28px]" : "sticky top-28 overflow-hidden rounded-[28px] border border-slate-200 shadow-[0_24px_70px_rgba(15,23,42,0.08)]"} bg-white`}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              {isId ? "Ringkasan proyek" : "Project overview"}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {modeLabel} Studio
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: `${theme.accent}14`, color: theme.accent }}
            >
              {published ? (isId ? "Terbit" : "Published") : "Draft"}
            </span>
            {mobile && (
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-xl leading-none text-slate-600"
                aria-label={isId ? "Tutup ringkasan" : "Close overview"}
              >
                {"\u00d7"}
              </button>
            )}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div
            className="relative overflow-hidden rounded-2xl border"
            style={{
              background: `linear-gradient(145deg, ${theme.bg}, #ffffff)`,
              borderColor: `${theme.accent}30`,
            }}
          >
            <div className={`relative overflow-hidden bg-slate-100 ${mobile ? "aspect-[16/8]" : "aspect-[16/10]"}`}>
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                  <IconCamera size={28} color="#94a3b8" strokeWidth={1.5} />
                  <span className="text-xs">{isId ? "Foto belum dipilih" : "No photo selected"}</span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 text-white">
                <p className="text-xs font-medium text-white/75">
                  {mode === "rundown"
                    ? (isId ? "Rencana spesial untuk" : "A special plan for")
                    : (isId ? "Undangan untuk" : "An invitation for")}
                </p>
                <p className="mt-0.5 truncate text-xl font-semibold">
                  {recipientName || (isId ? "Nama penerima" : "Recipient name")}
                </p>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: theme.accent }}>
                  {title || modeLabel}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {senderName
                    ? `${isId ? "Dibuat oleh" : "Created by"} ${senderName}`
                    : (isId ? "Nama pengirim belum diisi" : "Sender name is empty")}
                </p>
              </div>

              {formattedDate && (
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <IconCalendar size={16} color={theme.accent} strokeWidth={2} />
                  <span>{formattedDate}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 px-4">
            <SummaryRow
              label={mode === "rundown" ? (isId ? "Agenda" : "Schedule") : (isId ? "Aktivitas" : "Activities")}
              value={String(primaryCount)}
            />
            <SummaryRow
              label={isId ? "Pilihan outfit" : "Outfit choices"}
              value={String(secondaryCount)}
            />
            <SummaryRow
              label={isId ? "Musik" : "Music"}
              value={musicTitle || (isId ? "Belum dipilih" : "Not selected")}
            />
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-2xl bg-slate-950 px-4 py-4 text-white">
            <div
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ background: theme.accent }}
            >
              {published ? (
                <IconCheck size={16} color="white" strokeWidth={2.4} />
              ) : (
                <IconSparkle size={16} color="white" strokeWidth={2} />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
                {isId ? `Langkah ${currentStep} dari ${totalSteps}` : `Step ${currentStep} of ${totalSteps}`}
              </p>
              <p className="mt-1 text-sm font-semibold">{stepLabel}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/65">
                {isId
                  ? "Ringkasan ini mengikuti perubahan form. Preview gift penuh akan disatukan pada tahap berikutnya."
                  : "This overview follows the form. The full gift preview will be connected in the next stage."}
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}

export default function StudioOverviewPanel(props: StudioOverviewPanelProps) {
  const { mobileOpen = false, onMobileClose, locale } = props;

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onMobileClose?.();
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen, onMobileClose]);

  return (
    <>
      <aside className="hidden min-w-0 lg:block">
        <OverviewContent {...props} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label={locale === "id" ? "Ringkasan proyek" : "Project overview"}>
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
            onClick={onMobileClose}
            aria-label={locale === "id" ? "Tutup ringkasan" : "Close overview"}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto overscroll-contain rounded-t-[28px] bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-24px_70px_rgba(15,23,42,0.24)]">
            <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-slate-300" />
            <OverviewContent {...props} mobile onClose={onMobileClose} />
          </div>
        </div>
      )}
    </>
  );
}
