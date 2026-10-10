export type ScreenId =
  | 'dashboard'
  | 'chat_simulator'
  | 'ocr'
  | 'post_creator'
  | 'urdu_editor'
  | 'poetry'
  | 'books'
  | 'quran'
  | 'clipboard'
  | 'transliteration'
  | 'themes'
  | 'typing_practice'
  | 'favorites'
  | 'settings'
  | 'onboarding'
  | 'android_source';

export type KeyboardMode = 'urdu' | 'english' | 'symbols' | 'emojis';

export interface KeyboardTheme {
  id: string;
  name: string;
  primary: string;
  accent: string;
  bg: string;
  cardBg: string;
  keyBg: string;
  keyText: string;
  keySpecialBg: string;
  spaceBg: string;
  border: string;
}

export interface KeyboardSettings {
  themeId: string;
  hapticEnabled: boolean;
  soundEnabled: boolean;
  numberRowEnabled: boolean;
  suggestionsEnabled: boolean;
  easyUrduEnabled: boolean; // Transliteration toggle
  keyHeight: 'compact' | 'normal' | 'tall';
  fontFamily: 'nastaliq' | 'arabic';
}

export interface SavedSnippet {
  id: string;
  text: string;
  category: string;
  timestamp: number;
  isPinned?: boolean;
}

export interface PoetryItem {
  id: string;
  poet: string;
  title: string;
  category: string;
  verses: string[];
  isFavorite?: boolean;
}

export interface UrduBook {
  id: string;
  title: string;
  author: string;
  year: string;
  description: string;
  coverColor: string;
  chapters: { title: string; content: string }[];
}

export interface QuranVerse {
  id: string;
  surahNameArabic: string;
  surahNameEnglish: string;
  surahNumber: number;
  ayahNumber: number;
  arabicText: string;
  urduTranslation: string;
  translator: string;
}

export interface PostTemplate {
  id: string;
  name: string;
  category: string;
  background: string;
  textColor: string;
  borderColor?: string;
  text: string;
  author?: string;
}
