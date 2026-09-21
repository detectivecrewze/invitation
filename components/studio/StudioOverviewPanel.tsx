"use client";

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

export default function StudioOverviewPanel({
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
}: StudioOverviewPanelProps) {
  const isId = locale === "id";
  const modeLabel = mode === "rundown" ? "Rundown" : "Invitation";
  const formattedDate = eventDate ? formatIndonesianDate(eventDate, locale) : "";

  return (
    <aside className="hidden min-w-0 lg:block">
      <div className="sticky top-28 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              {isId ? "Ringkasan proyek" : "Project overview"}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {modeLabel} Studio
            </p>
          </div>
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: `${theme.accent}14`, color: theme.accent }}
          >
            {published ? (isId ? "Terbit" : "Published") : "Draft"}
          </span>
        </div>

        <div className="p-6">
          <div
            className="relative overflow-hidden rounded-2xl border"
            style={{
              background: `linear-gradient(145deg, ${theme.bg}, #ffffff)`,
              borderColor: `${theme.accent}30`,
            }}
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
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
    </aside>
  );
}
