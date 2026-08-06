// ─── Shared ───────────────────────────────────────────────────────────────────

export interface BaseData {
  invitationId: string;
  mode: 'invitation' | 'rundown';
  themeId: string;
  recipientName: string;
  senderName: string;
  subText: string;
  eventDate?: string;
  photoUrl: string | null;
  dressCodes: string[];
  dressCodeIcons?: Record<string, string>;
  status: 'draft' | 'published';
  musicUrl: string | null;
  musicTitle: string | null;
  invitationTitle: string;
  closingNote: string;
  openingShape: 'heart' | 'star';
  ticketTitle: string;
  updatedAt: string;
  createdAt?: string;
  source?: string;
}

// ─── Mode: invitation ─────────────────────────────────────────────────────────

export interface ActivityItem {
  id: string;
  label: string;
  emoji: string;
}

export interface InvitationData extends BaseData {
  mode: 'invitation';
  suggestedDates?: string[];
  activities: ActivityItem[];
  activityTitle: string;
  dateTitle: string;
}

// ─── Mode: rundown ────────────────────────────────────────────────────────────

export interface RundownItem {
  id: string;
  time: string;     // e.g. "18:00" or "07:30 - 08:10"
  title: string;    // e.g. "Makan malam"
  location: string; // e.g. "Restoran X"
  note: string;     // optional note, can be empty string
  emoji?: string;   // optional emoji key or emoji string
  icon?: string;    // optional SVG icon key
}

export interface RundownData extends BaseData {
  mode: 'rundown';
  rundownItems: RundownItem[];
  rundownTitle: string; // heading shown above the schedule
}

// ─── Union ────────────────────────────────────────────────────────────────────

export type AnyInvitation = InvitationData | RundownData;

// ─── Type Guards ──────────────────────────────────────────────────────────────

export function isRundown(data: AnyInvitation): data is RundownData {
  return data.mode === 'rundown';
}

export function isInvitation(data: AnyInvitation): data is InvitationData {
  return data.mode === 'invitation';
}

/**
 * Normalise raw KV data into a typed union. Invitations without a `mode`
 * field (created before this feature) default to 'invitation'.
 */
export function normaliseInvitation(raw: unknown): AnyInvitation {
  const d = raw as Record<string, unknown>;
  const mode = d.mode === 'rundown' ? 'rundown' : 'invitation';
  return { ...d, mode } as AnyInvitation;
}
