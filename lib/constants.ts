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
