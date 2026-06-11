// Centralized SVG icon library — no emoji, clean vector icons
// All icons are 24x24 viewBox unless noted

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

const d = (size = 24, color = "currentColor", sw = 1.5) => ({
  width: size, height: size, viewBox: "0 0 24 24",
  fill: "none", stroke: color, strokeWidth: sw,
  strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
});

export const IconCalendar = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

export const IconSparkle = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
    <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0" />
    <path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
  </svg>
);

export const IconHanger = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M12 4a2 2 0 1 1 0 4" />
    <path d="M12 8L3 17h18L12 8z" />
  </svg>
);

export const IconMessage = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export const IconHeart = ({ size = 24, color = "currentColor", strokeWidth = 1.5, fill = "none" }: IconProps & { fill?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export const IconTicket = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M15 5H3a1 1 0 0 0-1 1v4a2 2 0 0 1 0 4v4a1 1 0 0 0 1 1h12" />
    <path d="M9 5h12a1 1 0 0 1 1 1v4a2 2 0 0 0 0 4v4a1 1 0 0 1-1 1H9" />
    <line x1="9" y1="5" x2="9" y2="19" strokeDasharray="2 2" />
  </svg>
);

export const IconShare = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

export const IconWhatsApp = ({ size = 24, color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

export const IconCamera = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

export const IconPalette = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="8.5" cy="9.5" r="1.5" fill={color} stroke="none" />
    <circle cx="14.5" cy="8.5" r="1.5" fill={color} stroke="none" />
    <circle cx="17.5" cy="13.5" r="1.5" fill={color} stroke="none" />
    <circle cx="8.5" cy="15" r="1.5" fill={color} stroke="none" />
  </svg>
);

export const IconUser = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const IconRocket = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

export const IconCopy = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export const IconCheck = ({ size = 24, color = "currentColor", strokeWidth = 2 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const IconArrowRight = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const IconArrowLeft = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export const IconStar = ({ size = 24, color = "currentColor", strokeWidth = 1.5, fill = "none" }: IconProps & { fill?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const IconMapPin = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const IconMail = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

export const IconTrash = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

export const IconPlus = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const IconLock = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const IconEye = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const IconEdit = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const IconLink = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

// Activity icons — specific to each activity
export const IconDinner = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M3 11l19-9-9 19-2-8-8-2z" />
  </svg>
);

export const IconCinema = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
    <polyline points="17 2 12 7 7 2" />
  </svg>
);

export const IconWalk = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <circle cx="12" cy="4" r="2" />
    <path d="M9 20l1-5 2 3 2-3 1 5" />
    <path d="M7 9l5-1 4 3" />
    <path d="M8 13H5l2 7" />
    <path d="M16 13h3l-2 7" />
  </svg>
);

export const IconGamepad = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <line x1="6" y1="12" x2="10" y2="12" />
    <line x1="8" y1="10" x2="8" y2="14" />
    <line x1="15" y1="13" x2="15.01" y2="13" strokeWidth={2.5} />
    <line x1="18" y1="11" x2="18.01" y2="11" strokeWidth={2.5} />
    <rect x="2" y="6" width="20" height="12" rx="6" />
  </svg>
);

export const IconShopping = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

export const IconCoffee = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);

export const IconPicnic = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M3 11l19-9-9 19-2-8-8-2z" />
  </svg>
);

export const IconMusic = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

// Map activity id to icon component
export const ACTIVITY_ICONS: Record<string, React.ComponentType<IconProps>> = {
  dinner: IconDinner,
  cinema: IconCinema,
  walk: IconWalk,
  gaming: IconGamepad,
  shopping: IconShopping,
  cafe: IconCoffee,
  picnic: IconPicnic,
  concert: IconMusic,
};
