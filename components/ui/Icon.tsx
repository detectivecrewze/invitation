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

export const IconCar = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M14 16H9m10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-14 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM5 16l1.5-6h11L19 16M5 16H3v-4c0-.6.4-1 1-1h1l2-3.5c.3-.5.9-.8 1.5-.8h7c.6 0 1.2.3 1.5.8L19 11h1c.6 0 1 .4 1 1v4h-2" />
  </svg>
);

export const IconHome = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const IconClock = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const IconIceCream = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M7 11c0-2.8 2.2-5 5-5s5 2.2 5 5" />
    <path d="M12 21l5-10H7l5 10z" />
  </svg>
);

export const IconSun = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

export const IconGift = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect x="2" y="7" width="20" height="5" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
);

export const IconUtensils = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" />
    <path d="M15 2v18" />
    <path d="M7 2v20" />
    <path d="M4 2v6a3 3 0 0 0 6 0V2" />
  </svg>
);

export const IconCup = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
    <line x1="6" y1="2" x2="6" y2="4" />
    <line x1="10" y1="2" x2="10" y2="4" />
    <line x1="14" y1="2" x2="14" y2="4" />
  </svg>
);

export const IconBike = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="18.5" cy="17.5" r="3.5" />
    <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5L8.5 11H12l3-5h3.5" />
    <path d="M5.5 17.5L9.5 7h4l5 10.5" />
  </svg>
);

export const IconTree = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M12 19v3" />
    <path d="M12 19a7 7 0 1 0-7-7c0 2 1 3.8 2.5 5L12 19z" />
    <path d="M12 19a7 7 0 1 1 7-7c0 2-1 3.8-2.5 5L12 19z" />
  </svg>
);

export const IconWaves = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M2 6c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
  </svg>
);

export const IconBed = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M2 4v16" />
    <path d="M2 8h18a2 2 0 0 1 2 2v10" />
    <path d="M2 17h20" />
    <path d="M6 8v9" />
  </svg>
);

export const IconFlower = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    <path d="M12 6a3 3 0 0 0-3-3 3 3 0 0 0-3 3c0 1.7 1.3 3 3 3" />
    <path d="M18 12a3 3 0 0 0 3-3 3 3 0 0 0-3-3c-1.7 0-3 1.3-3 3" />
    <path d="M12 18a3 3 0 0 0 3 3 3 3 0 0 0 3-3c0-1.7-1.3-3-3-3" />
    <path d="M6 12a3 3 0 0 0-3 3 3 3 0 0 0 3 3c1.7 0 3-1.3 3-3" />
  </svg>
);

export const IconBook = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

export const IconPlane = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M17.8 19.2L16 11l3.5-3.5a2.1 2.1 0 0 0 0-3 2.1 2.1 0 0 0-3 0L13 8 4.8 6.2a1 1 0 0 0-1.1.5L2.3 8.1a1 1 0 0 0 .3 1.3l6 4.3-3 3-2.5-.5a1 1 0 0 0-1.1.5l-.6 1.1a.5.5 0 0 0 .7.7l3.2-1.6 3.2 3.2a.5.5 0 0 0 .7-.7l-1.6-.6 3-3 4.3 6a1 1 0 0 0 1.3.3l1.4-1.4a1 1 0 0 0 .5-1.1z" />
  </svg>
);

export const IconPaw = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <circle cx="11" cy="4" r="2" />
    <circle cx="18" cy="8" r="2" />
    <circle cx="20" cy="16" r="2" />
    <path d="M9 10a5 5 0 0 1 5 5v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3a5 5 0 0 1 6-5z" />
  </svg>
);

// Map activity id to icon component
export const ACTIVITY_ICONS: Record<string, React.ComponentType<IconProps>> = {
  dinner: IconDinner,
  food: IconUtensils,
  utensils: IconUtensils,
  eat: IconUtensils,
  drink: IconCup,
  cup: IconCup,
  cinema: IconCinema,
  movie: IconCinema,
  walk: IconWalk,
  gaming: IconGamepad,
  game: IconGamepad,
  shopping: IconShopping,
  cafe: IconCoffee,
  coffee: IconCoffee,
  bike: IconBike,
  bicycle: IconBike,
  picnic: IconTree,
  tree: IconTree,
  beach: IconWaves,
  wave: IconWaves,
  hotel: IconBed,
  bed: IconBed,
  flower: IconFlower,
  book: IconBook,
  plane: IconPlane,
  paw: IconPaw,
  concert: IconMusic,
  music: IconMusic,
  car: IconCar,
  home: IconHome,
  clock: IconClock,
  icecream: IconIceCream,
  sun: IconSun,
  gift: IconGift,
  heart: IconHeart,
  sparkle: IconSparkle,
};

// Comprehensive list of available SVG Icons for Rundown activity selection
export const RUNDOWN_SVG_OPTIONS: Array<{ key: string; label: string; Icon: React.ComponentType<IconProps> }> = [
  { key: "car", label: "Penjemputan / Drive", Icon: IconCar },
  { key: "food", label: "Makan (Utensils / Kuliner)", Icon: IconUtensils },
  { key: "drink", label: "Minum / Boba / Juice", Icon: IconCup },
  { key: "coffee", label: "Kopi / Cafe / Rest Area", Icon: IconCoffee },
  { key: "bike", label: "Sepeda / Cycling", Icon: IconBike },
  { key: "movie", label: "Nonton Bioskop / Cinema", Icon: IconCinema },
  { key: "shopping", label: "Belanja / Mall", Icon: IconShopping },
  { key: "home", label: "Antar Pulang / Rumah", Icon: IconHome },
  { key: "heart", label: "Romantic / Quality Time", Icon: IconHeart },
  { key: "icecream", label: "Dessert / Ice Cream", Icon: IconIceCream },
  { key: "music", label: "Konser / Musik", Icon: IconMusic },
  { key: "camera", label: "Foto-foto / Photo Booth", Icon: IconCamera },
  { key: "sun", label: "Sunset / Taman Outdoor", Icon: IconSun },
  { key: "gift", label: "Hadiah / Kejutan", Icon: IconGift },
  { key: "game", label: "Main Game / Arcade", Icon: IconGamepad },
  { key: "walk", label: "Jalan-jalan Santai", Icon: IconWalk },
  { key: "tree", label: "Piknik / Taman", Icon: IconTree },
  { key: "beach", label: "Pantai / Laut", Icon: IconWaves },
  { key: "hotel", label: "Staycation / Hotel", Icon: IconBed },
  { key: "flower", label: "Bunga / Garden", Icon: IconFlower },
  { key: "book", label: "Perpustakaan / Museum", Icon: IconBook },
  { key: "plane", label: "Traveling / Wisata", Icon: IconPlane },
  { key: "paw", label: "Pet Cafe / Anabul", Icon: IconPaw },
  { key: "clock", label: "Jadwal Fleksibel", Icon: IconClock },
  { key: "sparkle", label: "Aktivitas Spesial", Icon: IconSparkle },
];export const IconShirt = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
  </svg>
);

export const IconDress = ({ size = 24, color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 98 100" fill={color}>
    <path d="m41.805 23.922c0.015624 1.0508-1.6367 1.0547-1.625 0l0.003906-11.73c-0.015625-1.0508 1.6367-1.0547 1.625 0zm27.906-15.238c-1.2383-0.070313-0.94141-1.8516 0.25781-1.625 1.2383 0.074218 0.94141 1.8555-0.25781 1.625zm28.164 3.5078c-0.019531-1.0312 1.6445-1.0703 1.625 0v47.316c0 2.8242-2.3125 5.1289-5.1328 5.1328h-44.883c-0.44531 0-0.8125-0.36328-0.8125-0.8125s0.36328-0.8125 0.8125-0.8125h44.879c1.9297 0 3.5078-1.5781 3.5078-3.5078z" fillRule="evenodd"/>
    <path d="m52.188 34.555c-0.6875-0.77734 0.54297-1.8672 1.2227-1.0586l14.668 16.875c1.0586 1.1484 2.4766 1.1562 3.5352-0.015625l26.262-30.215v-9.5469c0-0.95703-0.42188-1.6914-1.0742-2.2578-1.5117-1.4727-7.2148-2.6406-9.1875-3.4414-0.75-0.25391-1.543 0.007813-2.0469 0.60547-0.28906 0.49219-0.66797 1.0859-1.3242 0.77734-1.0742-0.60547-0.007813-1.8594 0.65625-2.3633 2.0156-1.9102 6.582 0.77734 9.5742 1.4492 2.5195 0.79297 5.0156 2.2734 5.0234 5.2266v9.8477c-0.003906 0.1875-0.066406 0.375-0.19922 0.52734l-26.539 30.531c-1.7031 1.8008-4.125 1.8398-5.8398 0 0.003906 0.003906-14.73-16.941-14.73-16.941zm25.496-13.121c-2.5078 3.8906-4.5547 6.9062-7.8398 10.289-2.75-2.875-5.7383-6.6523-8.1484-10.16-5.4375-2.1914 6.9922 11.414 7.5742 11.891 0.31641 0.3125 0.83203 0.3125 1.1445-0.003906 3.6797-3.6719 5.918-6.9297 8.6289-11.137 0.57812-0.86719-0.79297-1.7656-1.3594-0.87891zm-21.863-16.234c-0.71875-1.5586-2.6055-2.4141-4.2422-1.8516-2.3828 0.92188-7.8906 2.0156-9.7656 3.7656-0.99219 0.86328-1.6328 1.9922-1.6328 3.4805v9.8477c-0.10547 0.51172 2.1875 2.6758 2.4219 3.0859 0.67578 0.79688 1.918-0.26953 1.2227-1.0586l-2.0234-2.3242v-9.5469c0-0.95312 0.42578-1.6875 1.0742-2.2578 1.5234-1.4297 7.2031-2.6719 9.1875-3.4375 0.89062-0.3125 1.8945 0.15625 2.293 0.99219 0.42969 0.94922 1.9258 0.25 1.4648-0.69531z" fillRule="evenodd"/>
    <path d="m69.027 32.883c-0.015625-1.043 1.6367-1.0586 1.625 0v30.949c0.015625 1.043-1.6367 1.0586-1.625 0z" fillRule="evenodd"/>
    <path d="m60.363 22.477c-0.60156-0.85547 0.75391-1.7891 1.3359-0.91406 2.4062 3.5078 5.3906 7.2852 8.1406 10.164 3.2852-3.3828 5.332-6.3984 7.8398-10.289 5.2188-2.293-5.9414 10.996-7.2266 11.973-0.30469 0.35938-0.85938 0.38281-1.1914 0.046875-2.8906-2.9141-6.3438-7.25-8.8984-10.98zm24.797-16.922c0.007813 1.0469-1.625 1.0508-1.6172 0 0.19531-1.5977-0.38672-3.4258-2.2773-3.4297h-22.852c-1.2539 0-2.2734 1.0195-2.2773 2.2656 0.003906 0.65234 0.19141 1.9922-0.8125 1.9727-1.0156 0.019531-0.79688-1.3203-0.80859-1.9727 0.003906-2.1406 1.75-3.8906 3.8945-3.8906h22.855c2.7109-0.027344 4.2422 2.5586 3.8945 5.0547z" fillRule="evenodd"/>
    <path d="m64.488 19.367c0.92188-0.48828 1.6758 0.98828 0.73047 1.4453l-7.4883 3.7773c-2.8281 1.5352-6.5781 0.30469-8.0898-2.4609-1.3672-1.8516-0.55469-9.0859-0.76172-11.277-0.15625-4.4062 4.9883-7.5781 8.8516-5.4453l7.4883 3.7773c0.9375 0.46484 0.20312 1.9297-0.73047 1.4453l-7.4883-3.7773c-1.4375-0.72656-2.9961-0.66016-4.3672 0.18359-1.3672 0.84375-2.1289 2.2031-2.1289 3.8164v8.293c-0.082031 2.3672 1.9766 4.4102 4.2812 4.4961 1.6797 0.32031 8.1484-3.6797 9.7031-4.2734z" fillRule="evenodd"/>
    <path d="m74.461 20.812c-0.9375-0.46094-0.20313-1.9297 0.73047-1.4453l7.4844 3.7773c2.0938 1.1406 4.8555 0.21094 5.9688-1.8398 0.99219-1.3242 0.36719-8.8359 0.53125-10.453 0-0.80469-0.19141-1.5547-0.54688-2.1953-1.1211-2.0273-3.8711-2.9453-5.9492-1.8086l-7.4844 3.7773c-0.39844 0.20312-0.88672 0.039062-1.0859-0.35938-0.20312-0.39844-0.039063-0.88672 0.35938-1.0859l7.4844-3.7773c2.8281-1.5391 6.582-0.30078 8.0938 2.4609 1.3633 1.8516 0.55078 9.0898 0.75781 11.277 0 1.0664-0.25781 2.0664-0.73828 2.9453-1.4961 2.793-5.2734 4.043-8.1133 2.5z" fillRule="evenodd"/>
    <path d="m69.84 7.0586c10.434 0.17969 10.43 15.699 0 15.879-10.438-0.18359-10.426-15.699 0-15.879zm4.4648 3.4727c-5.9648-5.7773-14.707 2.9766-8.9297 8.9297 5.9609 5.7773 14.707-2.9727 8.9297-8.9297z" fillRule="evenodd"/>
    <path d="m16.113 44.844c0.36719 4.7461 0.86719 12.176-2.2852 16.168-2.0938 2.4844-4.043 5.5508-5.9297 9.4727-1.8984 3.9531-3.7383 8.7812-5.5859 14.77-0.34375 1.1172-0.21484 2.2773 0.27344 3.2461 0.83984 2.4414 6.8008 3.418 8.7891 4.3789 9.4102 3.332 14.117 5 18.723 5 4.6055 0 9.3125-1.668 18.723-5l6.3398-2.2305c2.2109-0.76953 3.4141-3.1602 2.7227-5.3945-3.1016-9.7266-5.9766-17.449-11.516-24.242-3.1602-4.0078-2.6484-11.457-2.2812-16.207 0.03125-0.32813 0.25391-0.58984 0.54297-0.69141 3.1484-1.0781 5.2891-3.6406 6.4688-6.7656 1.3164-4.168 2.4336-11.629-1.9023-14.27-4.8203-1.3203-13.488 4.2461-16.988 8-0.55078 0.60156-1.3008 0.92578-2.1133 0.92578-0.82812 0-1.6094-0.34375-2.1523-0.97266-3.5-3.7383-12.156-9.2852-16.949-7.9531-4.3398 2.6211-3.1992 10.125-1.8984 14.27 1.1797 3.1211 3.3203 5.6875 6.4688 6.7656 0.32812 0.10547 0.53906 0.40625 0.55078 0.73047zm-1.6055 9.707c0.39453-2.9648 0.27734-6.3477 0.039063-9.0938-8.0742-3.2969-10.422-15.363-6.1875-22.402 5.332-5.3203 16.324 2.4922 20.773 6.8789 0.46875 0.57422 1.4062 0.60938 1.8984 0.042968 4.4492-4.3984 15.461-12.25 20.816-6.9219 4.2422 7.043 1.875 19.105-6.1875 22.406-0.28516 4.2852-0.75 10.949 1.9531 14.508 2.1797 2.5898 4.207 5.7656 6.1523 9.8164 1.9336 4.0234 3.8008 8.9258 5.6758 14.992 0.47266 1.5312 0.29688 3.1211-0.375 4.4531-1.0859 3.082-7.1211 4.0273-9.6953 5.1758-19.109 6.7891-19.414 6.7891-38.523 0l-6.3359-2.2305c-3.0352-1.0547-4.6875-4.3281-3.7383-7.3984 3.1602-9.9414 6.1406-17.844 11.828-24.809 1.0273-1.2266 1.6094-3.1953 1.9062-5.418z" fillRule="evenodd"/>
    <path d="m23.922 43.895c0.42578-0.13672 0.88281 0.097657 1.0195 0.52344 0.13672 0.42578-0.097656 0.88281-0.52344 1.0195-1.6914 0.55078-3.625 0.85547-5.3438 0.85547-1.207-0.14453-4.8008 0.035156-4.5352-1.6719 0.14453-0.42188 0.60547-0.64844 1.0273-0.50781 2.668 0.90234 5.6562 0.625 8.3555-0.21875z" fillRule="evenodd"/>
    <path d="m35.785 45.434c-1-0.30469-0.50391-1.875 0.49609-1.5391 2.6953 0.84375 5.6875 1.1211 8.3555 0.21875 0.42188-0.14062 0.88281 0.085938 1.0273 0.50781 0.14063 0.42188-0.085937 0.88281-0.50781 1.0273-2.9883 1.0117-6.3398 0.73828-9.3711-0.21484z" fillRule="evenodd"/>
  </svg>
);

export const IconPants = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M5 2h14v4l-2 15h-3l-2-10-2 10H7L5 6V2z" />
  </svg>
);

export const IconShoes = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M3 17a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3l-3-4h-5l-2-3H6a2 2 0 0 0-2 2v8z" />
    <circle cx="7.5" cy="14.5" r="1.5" />
  </svg>
);

export const IconGlasses = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <circle cx="6" cy="14" r="4" />
    <circle cx="18" cy="14" r="4" />
    <line x1="10" y1="14" x2="14" y2="14" />
    <path d="M2 14l2-6h3" />
    <path d="M22 14l-2-6h-3" />
  </svg>
);

export const IconWatch = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <circle cx="12" cy="12" r="6" />
    <polyline points="12 9 12 12 14 14" />
    <path d="M9 6V2h6v4" />
    <path d="M9 18v4h6v-4" />
  </svg>
);

export const IconHat = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M2 17h20a1 1 0 0 0 1-1c0-4.4-3.6-8-8-8H9c-4.4 0-8 3.6-8 8a1 1 0 0 0 1 1z" />
    <path d="M12 8V4" />
  </svg>
);

export const IconFormal = ({ size = 24, color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill={color}>
    <path d="M84,93H16a3,3,0,0,1-3-3V70.62a3,3,0,0,1,1-2.25L47,40.16V10a3,3,0,0,1,3-3h0a3,3,0,0,1,3,3V40.16l33,28.21a3,3,0,0,1,1,2.25V90A3,3,0,0,1,84,93ZM19,87H81V71.86L50.41,45.72a3,3,0,0,1-1.07-2.31h0V13h0V43.41a3,3,0,0,1-1.07,2.31L19,71.86Z"/>
    <path d="M68,36a3,3,0,0,1-1.63-.48L50,24.58l-16.37,11A3,3,0,0,1,29.34,31L48.34,18.27a3,3,0,0,1,3.32,0L70.66,31A3,3,0,0,1,68,36Z"/>
  </svg>
);

export const DRESS_CODE_ICONS: Record<string, React.ComponentType<IconProps>> = {
  hanger: IconHanger,
  shirt: IconShirt,
  dress: IconDress,
  pants: IconPants,
  shoes: IconShoes,
  glasses: IconGlasses,
  watch: IconWatch,
  hat: IconHat,
  sparkle: IconSparkle,
  formal: IconFormal,
  semiformal: IconFormal,
  "semi formal": IconFormal,
  suit: IconFormal,
  jas: IconFormal,
};

export const DRESSCODE_SVG_OPTIONS: Array<{ key: string; label: string; Icon: React.ComponentType<IconProps> }> = [
  { key: "hanger", label: "Gantungan / Baju", Icon: IconHanger },
  { key: "shirt", label: "Kemeja / Kaos", Icon: IconShirt },
  { key: "dress", label: "Gaun / Dress", Icon: IconDress },
  { key: "formal", label: "Formal / Jas / Semi Formal", Icon: IconFormal },
  { key: "pants", label: "Celana / Pants", Icon: IconPants },
  { key: "shoes", label: "Sepatu / Sneakers", Icon: IconShoes },
  { key: "glasses", label: "Kacamata / Eyewear", Icon: IconGlasses },
  { key: "watch", label: "Jam Tangan", Icon: IconWatch },
  { key: "hat", label: "Topi / Headwear", Icon: IconHat },
  { key: "sparkle", label: "Styling Spesial", Icon: IconSparkle },
];

export function DressCodeIconSvg({
  iconKey,
  size = 18,
  color = "currentColor",
  strokeWidth = 1.5,
  className,
}: {
  iconKey?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}) {
  const raw = (iconKey || "hanger").trim();
  const normalizedKey = raw.toLowerCase();

  const isKnownSvg = !!DRESS_CODE_ICONS[normalizedKey];
  if (!isKnownSvg) {
    return (
      <span className={className} style={{ fontSize: `${size}px`, lineHeight: 1, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        {raw}
      </span>
    );
  }

  const Component = DRESS_CODE_ICONS[normalizedKey] || IconHanger;
  return <Component size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}

// Helper renderer for SVG Activity Icon (supports both SVG Vector keys & raw Emojis)
export function ActivityIconSvg({
  iconKey,
  size = 20,
  color = "currentColor",
  strokeWidth = 1.5,
  className,
}: {
  iconKey?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}) {
  const raw = (iconKey || "sparkle").trim();
  const normalizedKey = raw.toLowerCase();

  // Check if iconKey contains explicit emoji characters
  const isEmojiChar = /\p{Extended_Pictographic}/u.test(raw);
  if (isEmojiChar) {
    return (
      <span className={className} style={{ fontSize: `${size}px`, lineHeight: 1 }}>
        {raw}
      </span>
    );
  }

  const Component = ACTIVITY_ICONS[normalizedKey] || IconSparkle;
  return <Component size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}
