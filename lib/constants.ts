export const THEMES = [
  { id: 'pink',     label: 'Peach Blossom',   bg: '#fff0f3', card: '#ffe4ec', accent: '#e8789a', text: '#5c2d3f' },
  { id: 'blue',     label: 'Baby Blue',        bg: '#f0f4ff', card: '#e0eaff', accent: '#6b8ddb', text: '#1e3a6e' },
  { id: 'lavender', label: 'Lavender Dream',   bg: '#f5f0ff', card: '#ede5ff', accent: '#9b72d0', text: '#3d1d6e' },
  { id: 'sage',     label: 'Sage Garden',      bg: '#f0fff4', card: '#dcf5e4', accent: '#5dab78', text: '#1a4a2e' },
  { id: 'peach',    label: 'Sunset Peach',     bg: '#fff7f0', card: '#ffe8d6', accent: '#e07b4a', text: '#5c2a0e' },
  { id: 'mint',     label: 'Mint Breeze',      bg: '#f0fffc', card: '#d6fff5', accent: '#3bbda0', text: '#0d4035' },
] as const;

export type ThemeId = typeof THEMES[number]['id'];

export function getTheme(id: ThemeId | string) {
  return THEMES.find(t => t.id === id) ?? THEMES[0];
}

export const ACTIVITIES = [
  { id: 'dinner',   label: 'Makan Malam',  emoji: '🍽️' },
  { id: 'cinema',   label: 'Nonton Film',  emoji: '🎬' },
  { id: 'walk',     label: 'Jalan-Jalan',  emoji: '🚶' },
  { id: 'gaming',   label: 'Main Game',    emoji: '🎮' },
  { id: 'shopping', label: 'Belanja',      emoji: '🛍️' },
  { id: 'cafe',     label: 'Ngopi Bareng', emoji: '☕' },
  { id: 'picnic',   label: 'Piknik',       emoji: '🧺' },
  { id: 'concert',  label: 'Konser',       emoji: '🎵' },
] as const;

export const DRESS_CODES = [
  'Casual', 'Semi-formal', 'Couple Outfit', 'Formal', 'Bebas',
] as const;

export const PRESET_PLAYLIST = [
  {
    title: "Everything u are",
    artist: "Hindia",
    audioUrl: "https://arcade-edition.aldoramadhan16.workers.dev/files/1773903597346-a20vzf.mp3",
    coverUrl: "https://arcade-edition.aldoramadhan16.workers.dev/files/1773903605475-oxmn9.jpg",
  },
  {
    title: "Sailor Song",
    artist: "Gigi Perez",
    audioUrl: "https://arcade-edition.aldoramadhan16.workers.dev/files/1773903733301-stjon.m4a",
    coverUrl: "https://arcade-edition.aldoramadhan16.workers.dev/files/1773903741228-k7f4yv.jpg",
  },
  {
    title: "Semua Aku Dirayakan",
    artist: "Nadin Amizah",
    audioUrl: "https://arcade-edition.aldoramadhan16.workers.dev/files/1774553179591-lqro2.mp3",
    coverUrl: "https://arcade-edition.aldoramadhan16.workers.dev/files/1774553222239-jk1brr.jpg",
  },
  {
    title: "AH",
    artist: "Nadin Amizah",
    audioUrl: "https://arcade-edition.aldoramadhan16.workers.dev/files/1773903992490-jk4w6.mp3",
    coverUrl: "https://arcade-edition.aldoramadhan16.workers.dev/files/1773904041101-m1ymhh.jpg",
  },
  {
    title: "Bertaut",
    artist: "Nadin Amizah",
    audioUrl: "https://arcade-edition.aldoramadhan16.workers.dev/files/1773962352405-wsgbf9.mp3",
    coverUrl: "https://arcade-edition.aldoramadhan16.workers.dev/files/1773962285511-u1zq3o.jpg",
  },
  {
    title: "Ribuan Memori",
    artist: "Lomba Sihir",
    audioUrl: "https://arcade-edition.aldoramadhan16.workers.dev/files/1773903769416-102pcp.mp3",
    coverUrl: "https://arcade-edition.aldoramadhan16.workers.dev/files/1773903933096-6yny7.jpg",
  },
  {
    title: "Sampai Jadi Debu",
    artist: "Banda Neira",
    audioUrl: "https://arcade-edition.aldoramadhan16.workers.dev/files/1773904281711-n2sulb.mp3",
    coverUrl: "https://arcade-edition.aldoramadhan16.workers.dev/files/1773904328731-9htah9.jpg",
  },
  {
    title: "From The Start",
    artist: "Laufey",
    audioUrl: "https://arcade-edition.aldoramadhan16.workers.dev/files/1773962382711-27k51o.mp3",
    coverUrl: "https://arcade-edition.aldoramadhan16.workers.dev/files/1773962434553-ifeabi.jpg",
  },
  {
    title: "Besok Kita Pergi Makan",
    artist: "Sal Priadi",
    audioUrl: "https://arcade-edition.aldoramadhan16.workers.dev/files/1779632179973-11pcfk.mp3",
    coverUrl: "https://arcade-edition.aldoramadhan16.workers.dev/files/1779632211258-ap5mt.jpg",
  },
];

export function formatIndonesianDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        const d = new Date(year, month, day);
        return d.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
