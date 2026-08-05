// ─── Shared Barcode Types ────────────────────────────────────────────────────

export type BarcodeStyle = "gift" | "movie";

/** Universal Card Props used across Gift Card and Movie Ticket */
export interface BarcodeBaseProps {
  barcodeUrl: string;
  barcodeColor: string;
  cardBgColor: string;
  barcodeName: string;
  frontTitle: string;
  frontTitleColor?: string;
  frontTitleSize?: number;
  nameColor?: string;
  nameSize?: number;
  badgeText: string;
  badgeTextColor?: string;
  badgeTextSize?: number;
  cardNote: string;
  noteColor?: string;
  noteSize?: number;
  cardWeb: string;
  cardIg: string;
  cardTiktok: string;
  showPerforation?: boolean;
}

export type GiftCardProps = BarcodeBaseProps;
export type MovieTicketProps = BarcodeBaseProps;
export type ConcertTicketProps = BarcodeBaseProps;
