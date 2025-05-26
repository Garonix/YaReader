export enum FontFamily {
  SANS = "font-sans",
  SERIF = "font-serif",
  MONO = "font-mono",
}

export type ThemeOption = 'light' | 'sepia' | 'dark';

export interface ReaderSettings {
  fontSize: number; // in px
  lineHeight: number; // multiplier, e.g., 1.6
  paddingX: number; // in px
  paddingY: number; // in px
  fontFamily: FontFamily;
  theme: ThemeOption;
}

export interface RecentFile {
  name: string;
  content: string;
  lastAccessed: number; // Timestamp
  scrollTop: number;
}
