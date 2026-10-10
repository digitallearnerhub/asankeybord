/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenId, KeyboardTheme, KeyboardSettings, SavedSnippet } from './types';
import { KEYBOARD_THEMES } from './data/sampleData';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { ChatSimulatorScreen } from './components/screens/ChatSimulatorScreen';
import { OcrScreen } from './components/screens/OcrScreen';
import { PostCreatorScreen } from './components/screens/PostCreatorScreen';
import { UrduEditorScreen } from './components/screens/UrduEditorScreen';
import { PoetryScreen } from './components/screens/PoetryScreen';
import { BooksScreen } from './components/screens/BooksScreen';
import { QuranScreen } from './components/screens/QuranScreen';
import { ClipboardScreen } from './components/screens/ClipboardScreen';
import { TransliterationScreen } from './components/screens/TransliterationScreen';
import { ThemesScreen } from './components/screens/ThemesScreen';
import { TypingPracticeScreen } from './components/screens/TypingPracticeScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { AndroidSourceModal } from './components/screens/AndroidSourceModal';
import { VirtualKeyboard } from './components/keyboard/VirtualKeyboard';
import {
  Keyboard,
  Package,
  Layers,
  ChevronLeft,
  Settings,
  Sparkles,
} from 'lucide-react';

const DEFAULT_SETTINGS: KeyboardSettings = {
  themeId: 'emerald',
  hapticEnabled: true,
  soundEnabled: true,
  numberRowEnabled: false,
  suggestionsEnabled: true,
  easyUrduEnabled: true,
  keyHeight: 'normal',
  fontFamily: 'nastaliq',
};

const INITIAL_SNIPPETS: SavedSnippet[] = [
  {
    id: 's1',
    text: 'السلام علیکم ورحمۃ اللہ وبرکاتہ',
    category: 'اسلامی',
    timestamp: Date.now() - 500000,
    isPinned: true,
  },
  {
    id: 's2',
    text: 'جزاک اللہ خیراً کثیرا',
    category: 'اسلامی',
    timestamp: Date.now() - 400000,
    isPinned: true,
  },
  {
    id: 's3',
    text: 'امید ہے آپ خیریت سے ہوں گے اور سب ٹھیک ٹھاک ہوگا۔',
    category: 'عام',
    timestamp: Date.now() - 300000,
  },
  {
    id: 's4',
    text: 'خودی کو کر بلند اتنا کہ ہر تقدیر سے پہلے خدا بندے سے خود پوچھے بتا تیری رضا کیا ہے',
    category: 'شاعری',
    timestamp: Date.now() - 200000,
  },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dashboard');
  const [settings, setSettings] = useState<KeyboardSettings>(() => {
    try {
      const saved = localStorage.getItem('asaan_keyboard_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [currentTheme, setCurrentTheme] = useState<KeyboardTheme>(() => {
    return (
      KEYBOARD_THEMES.find((t) => t.id === settings.themeId) ||
      KEYBOARD_THEMES[0]
    );
  });

  const [quickText, setQuickText] = useState('یہاں اردو لکھیں یا رومن اردو ٹائپ کریں');
  const [sharedTextForPost, setSharedTextForPost] = useState('');
  const [sharedAuthorForPost, setSharedAuthorForPost] = useState('');
  const [sharedTextForEditor, setSharedTextForEditor] = useState('');
  const [snippets, setSnippets] = useState<SavedSnippet[]>(() => {
    try {
      const saved = localStorage.getItem('asaan_snippets');
      return saved ? JSON.parse(saved) : INITIAL_SNIPPETS;
    } catch {
      return INITIAL_SNIPPETS;
    }
  });
  const [favorites, setFavorites] = useState<string[]>(['iqbal_1', 'ghalib_1']);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Sync settings & theme changes
  useEffect(() => {
    try {
      localStorage.setItem('asaan_keyboard_settings', JSON.stringify(settings));
    } catch {}
    const matched = KEYBOARD_THEMES.find((t) => t.id === settings.themeId);
    if (matched) setCurrentTheme(matched);
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('asaan_snippets', JSON.stringify(snippets));
    } catch {}
  }, [snippets]);

  const handleSelectTheme = (theme: KeyboardTheme) => {
    setCurrentTheme(theme);
    setSettings((prev) => ({ ...prev, themeId: theme.id }));
  };

  const handleResetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    setCurrentTheme(KEYBOARD_THEMES[0]);
  };

  const handleAddSnippet = (text: string, category: string) => {
    const newSnip: SavedSnippet = {
      id: Date.now().toString(),
      text,
      category,
      timestamp: Date.now(),
    };
    setSnippets([newSnip, ...snippets]);
  };

  const handleDeleteSnippet = (id: string) => {
    setSnippets(snippets.filter((s) => s.id !== id));
  };

  const handleTogglePin = (id: string) => {
    setSnippets(
      snippets.map((s) => (s.id === id ? { ...s, isPinned: !s.isPinned } : s))
    );
  };

  const handleClearAllLocalData = () => {
    setSnippets([]);
    setFavorites([]);
    localStorage.clear();
  };

  const handleToggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const navigateToPostCreatorWithContent = (text: string, author?: string) => {
    setSharedTextForPost(text);
    if (author) setSharedAuthorForPost(author);
    setCurrentScreen('post_creator');
  };

  const navigateToEditorWithContent = (text: string) => {
    setSharedTextForEditor(text);
    setCurrentScreen('urdu_editor');
  };

  return (
    <div className="min-h-screen bg-[#F7F9F5] text-[#1F2937] flex flex-col font-sans">
      {/* Universal Top Bar Contract: Zone 1 (Brand) - Zone 2 (Nav links) - Zone 3 (Primary Action) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            {currentScreen !== 'dashboard' && (
              <button
                onClick={() => setCurrentScreen('dashboard')}
                className="p-1.5 -ml-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Go Back to Dashboard"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setCurrentScreen('dashboard')}
              className="text-left group flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-[#145C3A] text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:scale-105 transition-transform">
                ا
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-gray-900 whitespace-nowrap block leading-tight">
                  Asaan Urdu
                </span>
                <span className="text-[10px] text-emerald-800 font-nastaliq block leading-none">
                  آسان اردو کی بورڈ
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Clean 4–5 single-line navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-gray-600">
            <button
              onClick={() => setCurrentScreen('dashboard')}
              className={`hover:text-gray-900 transition-colors whitespace-nowrap shrink-0 ${
                currentScreen === 'dashboard' ? 'text-[#145C3A] font-bold' : ''
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentScreen('chat_simulator')}
              className={`hover:text-gray-900 transition-colors whitespace-nowrap shrink-0 ${
                currentScreen === 'chat_simulator' ? 'text-[#145C3A] font-bold' : ''
              }`}
            >
              Chat Simulator
            </button>
            <button
              onClick={() => setCurrentScreen('post_creator')}
              className={`hover:text-gray-900 transition-colors whitespace-nowrap shrink-0 ${
                currentScreen === 'post_creator' ? 'text-[#145C3A] font-bold' : ''
              }`}
            >
              Post Creator
            </button>
            <button
              onClick={() => setCurrentScreen('urdu_editor')}
              className={`hover:text-gray-900 transition-colors whitespace-nowrap shrink-0 ${
                currentScreen === 'urdu_editor' ? 'text-[#145C3A] font-bold' : ''
              }`}
            >
              Urdu Editor
            </button>
            <button
              onClick={() => setCurrentScreen('android_source')}
              className={`hover:text-gray-900 transition-colors whitespace-nowrap shrink-0 ${
                currentScreen === 'android_source' ? 'text-[#145C3A] font-bold' : ''
              }`}
            >
              Android Source
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsKeyboardOpen(!isKeyboardOpen)}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              title="Toggle Live Urdu Keyboard"
            >
              <Keyboard className="w-3.5 h-3.5 text-[#145C3A]" />
              <span className="hidden sm:inline">کی بورڈ</span>
            </button>

            <button
              onClick={() => setCurrentScreen('android_source')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#145C3A] hover:bg-[#0e432a] rounded-lg transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Package className="w-3.5 h-3.5 text-[#8CCF35]" />
              <span>Android APK</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        {currentScreen === 'dashboard' && (
          <DashboardScreen
            onNavigate={(screen) => setCurrentScreen(screen)}
            quickText={quickText}
            setQuickText={setQuickText}
            onOpenKeyboard={() => setIsKeyboardOpen(true)}
            isKeyboardOpen={isKeyboardOpen}
            theme={currentTheme}
          />
        )}

        {currentScreen === 'chat_simulator' && (
          <ChatSimulatorScreen
            onBack={() => setCurrentScreen('dashboard')}
            theme={currentTheme}
            settings={settings}
            onUpdateSettings={setSettings}
          />
        )}

        {currentScreen === 'ocr' && (
          <OcrScreen
            onBack={() => setCurrentScreen('dashboard')}
            onSaveToFavorites={(text, title) => handleAddSnippet(text, 'OCR')}
            onSendToEditor={navigateToEditorWithContent}
          />
        )}

        {currentScreen === 'post_creator' && (
          <PostCreatorScreen
            onBack={() => setCurrentScreen('dashboard')}
            initialText={sharedTextForPost}
          />
        )}

        {currentScreen === 'urdu_editor' && (
          <UrduEditorScreen
            onBack={() => setCurrentScreen('dashboard')}
            initialText={sharedTextForEditor}
            onOpenKeyboard={() => setIsKeyboardOpen(true)}
            onSendToPostCreator={navigateToPostCreatorWithContent}
          />
        )}

        {currentScreen === 'poetry' && (
          <PoetryScreen
            onBack={() => setCurrentScreen('dashboard')}
            onSendToPostCreator={navigateToPostCreatorWithContent}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
          />
        )}

        {currentScreen === 'books' && (
          <BooksScreen
            onBack={() => setCurrentScreen('dashboard')}
            onSendToEditor={navigateToEditorWithContent}
          />
        )}

        {currentScreen === 'quran' && (
          <QuranScreen
            onBack={() => setCurrentScreen('dashboard')}
            onSendToPostCreator={navigateToPostCreatorWithContent}
          />
        )}

        {currentScreen === 'clipboard' && (
          <ClipboardScreen
            onBack={() => setCurrentScreen('dashboard')}
            snippets={snippets}
            onAddSnippet={handleAddSnippet}
            onDeleteSnippet={handleDeleteSnippet}
            onTogglePin={handleTogglePin}
            onClearAll={() => setSnippets([])}
            onSendToEditor={navigateToEditorWithContent}
          />
        )}

        {currentScreen === 'transliteration' && (
          <TransliterationScreen
            onBack={() => setCurrentScreen('dashboard')}
            onSendToPostCreator={navigateToPostCreatorWithContent}
            onSendToEditor={navigateToEditorWithContent}
          />
        )}

        {currentScreen === 'themes' && (
          <ThemesScreen
            onBack={() => setCurrentScreen('dashboard')}
            currentTheme={currentTheme}
            settings={settings}
            onSelectTheme={handleSelectTheme}
            onUpdateSettings={setSettings}
            onResetDefaults={handleResetDefaults}
          />
        )}

        {currentScreen === 'typing_practice' && (
          <TypingPracticeScreen
            onBack={() => setCurrentScreen('dashboard')}
            theme={currentTheme}
            settings={settings}
            onUpdateSettings={setSettings}
          />
        )}

        {currentScreen === 'favorites' && (
          <PoetryScreen
            onBack={() => setCurrentScreen('dashboard')}
            onSendToPostCreator={navigateToPostCreatorWithContent}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            onBack={() => setCurrentScreen('dashboard')}
            settings={settings}
            onUpdateSettings={setSettings}
            onClearAllLocalData={handleClearAllLocalData}
          />
        )}

        {currentScreen === 'android_source' && (
          <AndroidSourceModal onBack={() => setCurrentScreen('dashboard')} />
        )}
      </main>

      {/* Floating Docked Virtual Keyboard (When toggled from Top Bar or Quick Input) */}
      {isKeyboardOpen && currentScreen !== 'chat_simulator' && currentScreen !== 'typing_practice' && (
        <div className="fixed bottom-0 left-0 right-0 z-50 max-w-3xl mx-auto rounded-t-2xl overflow-hidden shadow-2xl border-t border-gray-300 animate-in slide-in-from-bottom-2 duration-150">
          <VirtualKeyboard
            theme={currentTheme}
            settings={settings}
            currentInputText={quickText}
            onInsertText={(t) => setQuickText((prev) => prev + t)}
            onDeleteChar={() => setQuickText((prev) => prev.slice(0, -1))}
            onEnter={() => setIsKeyboardOpen(false)}
            onClose={() => setIsKeyboardOpen(false)}
            onUpdateSettings={setSettings}
          />
        </div>
      )}
    </div>
  );
}
