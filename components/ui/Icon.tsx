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
];

// ─── Outfit SVG Icons for Dress Code Selection ────────────────────────────────

export const IconShirt = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
  </svg>
);

export const IconDress = ({ size = 24, color = "currentColor", strokeWidth = 1.5 }: IconProps) => (
  <svg {...d(size, color, strokeWidth)}>
    <path d="M12 2a2 2 0 0 1 2 2v1l3.5 2.5a1 1 0 0 1 .3 1.2L16 12v9a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-9L6.2 8.7a1 1 0 0 1 .3-1.2L10 5V4a2 2 0 0 1 2-2z" />
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
};

export const DRESSCODE_SVG_OPTIONS: Array<{ key: string; label: string; Icon: React.ComponentType<IconProps> }> = [
  { key: "hanger", label: "Gantungan / Baju", Icon: IconHanger },
  { key: "shirt", label: "Kemeja / Kaos", Icon: IconShirt },
  { key: "dress", label: "Gaun / Dress", Icon: IconDress },
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

  const isEmojiChar = /\p{Extended_Pictographic}/u.test(raw);
  if (isEmojiChar) {
    return (
      <span className={className} style={{ fontSize: `${size}px`, lineHeight: 1 }}>
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
