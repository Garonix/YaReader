import { ReaderSettings, FontFamily, ThemeOption } from './types';

export const DEFAULT_FONT_FAMILY = FontFamily.SANS;
export const DEFAULT_THEME: ThemeOption = 'light';

export const DEFAULT_SETTINGS: ReaderSettings = {
  fontSize: 18, // px
  lineHeight: 1.6, // multiplier
  paddingX: 24, // px (good for mobile, user can increase for desktop)
  paddingY: 32, // px
  fontFamily: DEFAULT_FONT_FAMILY,
  theme: DEFAULT_THEME,
};

export const FONT_SIZE_STEP = 2; // px
export const MIN_FONT_SIZE = 12; // px
export const MAX_FONT_SIZE = 36; // px

// These are target multiplier values. We'll map them to closest Tailwind classes.
export const LINE_HEIGHT_VALUES = [1.0, 1.25, 1.375, 1.5, 1.625, 2.0];
export const MIN_LINE_HEIGHT = 1.0;
export const MAX_LINE_HEIGHT = 2.0;

export const PADDING_STEP = 8; // px
export const MIN_PADDING = 0; // px
export const MAX_PADDING_X = 128; // px (tailwind px-32)
export const MAX_PADDING_Y = 96; // px (tailwind py-24)

export const FONT_FAMILIES: { label: string; value: FontFamily }[] = [
  { label: "无衬线体", value: FontFamily.SANS },
  { label: "衬线体", value: FontFamily.SERIF },
  { label: "等宽字体", value: FontFamily.MONO },
];

export const THEME_OPTIONS: { label: string; value: ThemeOption }[] = [
  { label: "日间", value: 'light' },
  { label: "护眼", value: 'sepia' },
  { label: "夜间", value: 'dark' },
];

export const RECENT_FILES_STORAGE_KEY = 'yaYueRecentFiles';
export const MAX_RECENT_FILES = 5;
