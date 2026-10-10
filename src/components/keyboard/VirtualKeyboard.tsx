import React, { useState } from 'react';
import {
  KeyboardMode,
  KeyboardTheme,
  KeyboardSettings,
} from '../../types';
import {
  getWordSuggestions,
  transliterateRomanUrdu,
} from '../../services/transliteration';
import { playKeyClickSound, triggerHapticFeedback } from '../../services/sound';
import { INSTANT_MESSAGES } from '../../data/sampleData';
import {
  Delete,
  CornerDownLeft,
  Globe,
  Smile,
  Sparkles,
  ChevronDown,
  Volume2,
  VolumeX,
  Vibrate,
  Layers,
} from 'lucide-react';

interface VirtualKeyboardProps {
  theme: KeyboardTheme;
  settings: KeyboardSettings;
  onInsertText: (text: string) => void;
  onDeleteChar: () => void;
  onEnter: () => void;
  onClose?: () => void;
  currentInputText?: string;
  onUpdateSettings?: (updater: (prev: KeyboardSettings) => KeyboardSettings) => void;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  theme,
  settings,
  onInsertText,
  onDeleteChar,
  onEnter,
  onClose,
  currentInputText = '',
  onUpdateSettings,
}) => {
  const [mode, setMode] = useState<KeyboardMode>('urdu');
  const [isShift, setIsShift] = useState(false);
  const [showInstantMessages, setShowInstantMessages] = useState(false);
  const [selectedQuickCategory, setSelectedQuickCategory] = useState(0);

  // Roman Urdu buffer when typing in English with Easy Urdu enabled
  const [composingBuffer, setComposingBuffer] = useState('');

  // Extract last Roman word for real-time suggestions
  const words = currentInputText.split(/\s+/);
  const lastWord = composingBuffer || words[words.length - 1] || '';
  const suggestions = settings.easyUrduEnabled && lastWord ? getWordSuggestions(lastWord) : [];

  const handleKeyTap = (char: string) => {
    if (settings.soundEnabled) playKeyClickSound('char');
    if (settings.hapticEnabled) triggerHapticFeedback(10);

    if (mode === 'english' && settings.easyUrduEnabled) {
      // In English mode with Easy Urdu ON: buffer character and update composing
      const nextBuffer = composingBuffer + (isShift ? char.toUpperCase() : char.toLowerCase());
      setComposingBuffer(nextBuffer);
      onInsertText(isShift ? char.toUpperCase() : char.toLowerCase());
    } else {
      setComposingBuffer('');
      onInsertText(char);
    }
  };

  const handleSpace = () => {
    if (settings.soundEnabled) playKeyClickSound('space');
    if (settings.hapticEnabled) triggerHapticFeedback(12);

    if (mode === 'english' && settings.easyUrduEnabled && composingBuffer) {
      // Auto-transliterate the composed Roman word
      const converted = transliterateRomanUrdu(composingBuffer);
      // Replace last word
      setComposingBuffer('');
      // In this virtual simulation, we append a space
      onInsertText(' ');
    } else {
      setComposingBuffer('');
      onInsertText(' ');
    }
  };

  const handleDelete = () => {
    if (settings.soundEnabled) playKeyClickSound('delete');
    if (settings.hapticEnabled) triggerHapticFeedback(15);

    if (composingBuffer.length > 0) {
      setComposingBuffer((prev) => prev.slice(0, -1));
    }
    onDeleteChar();
  };

  const handleEnterKey = () => {
    if (settings.soundEnabled) playKeyClickSound('enter');
    if (settings.hapticEnabled) triggerHapticFeedback(20);
    setComposingBuffer('');
    onEnter();
  };

  const handleSelectSuggestion = (word: string) => {
    if (settings.soundEnabled) playKeyClickSound('char');
    if (settings.hapticEnabled) triggerHapticFeedback(12);
    // Insert suggestion plus space
    onInsertText(word + ' ');
    setComposingBuffer('');
  };

  // Urdu Layout Rows (Screenshot 4)
  const urduRow1 = ['خ', 'ح', 'چ', 'ج', 'ث', 'ٹ', 'ت', 'پ', 'ب', 'ا'];
  const urduRow2 = ['ص', 'ش', 'س', 'ژ', 'ز', 'ڑ', 'ر', 'ذ', 'ڈ', 'د'];
  const urduRow3 = ['ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل'];
  const urduRow4 = ['م', 'ن', 'و', 'ہ', 'ھ', 'ء', 'ی', 'ے', 'ں'];

  // English Layout Rows
  const englishRow1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const englishRow2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  const englishRow3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

  // Numbers & Symbols
  const symbolsRow1 = ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰'];
  const symbolsRow2 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const symbolsRow3 = ['؟', '،', '؛', '!', '@', '#', '%', '&', '*', '۔'];
  const symbolsRow4 = ['(', ')', '-', '+', '=', '/', ':', '"', '\'', '?'];

  // Key height classes
  const keyHeightClass =
    settings.keyHeight === 'compact'
      ? 'h-10 text-base'
      : settings.keyHeight === 'tall'
      ? 'h-13 text-xl'
      : 'h-11 text-lg';

  return (
    <div
      className="w-full select-none transition-colors duration-200 border-t shadow-2xl"
      style={{
        backgroundColor: theme.bg,
        borderColor: theme.border,
      }}
    >
      {/* 1. Quick Toolbar Header */}
      <div
        className="flex items-center justify-between px-3 py-1.5 border-b"
        style={{
          backgroundColor: theme.cardBg,
          borderColor: theme.border,
        }}
      >
        <div className="flex items-center gap-1.5">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-black/10 text-white/80 transition-colors"
              title="Hide Keyboard"
              aria-label="Hide Keyboard"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}

          {/* Easy Urdu Toggle Button with LED Switch */}
          <button
            onClick={() => {
              if (onUpdateSettings) {
                onUpdateSettings((prev) => ({
                  ...prev,
                  easyUrduEnabled: !prev.easyUrduEnabled,
                }));
              }
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              settings.easyUrduEnabled
                ? 'bg-[#8CCF35] text-[#145C3A] shadow-sm'
                : 'bg-black/20 text-white/70'
            }`}
            title="Toggle Roman Urdu to Nastaleeq Transliteration"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Easy Urdu</span>
            <div
              className={`w-2 h-2 rounded-full ${
                settings.easyUrduEnabled ? 'bg-[#145C3A]' : 'bg-gray-400'
              }`}
            />
          </button>

          {/* Quick Phrases Toggle */}
          <button
            onClick={() => setShowInstantMessages(!showInstantMessages)}
            className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
              showInstantMessages
                ? 'bg-white/20 text-white'
                : 'hover:bg-white/10 text-white/80'
            }`}
          >
            پیغامات
          </button>
        </div>

        {/* Right side utility toggles */}
        <div className="flex items-center gap-2">
          {onUpdateSettings && (
            <>
              <button
                onClick={() =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    soundEnabled: !prev.soundEnabled,
                  }))
                }
                className="p-1 text-white/75 hover:text-white"
                title={settings.soundEnabled ? 'Key Sound On' : 'Key Sound Off'}
              >
                {settings.soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={() =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    hapticEnabled: !prev.hapticEnabled,
                  }))
                }
                className={`p-1 ${
                  settings.hapticEnabled ? 'text-[#8CCF35]' : 'text-white/40'
                }`}
                title="Haptic Feedback"
              >
                <Vibrate className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <span className="text-[11px] font-mono uppercase tracking-wider text-white/60 px-1">
            {mode}
          </span>
        </div>
      </div>

      {/* 2. Instant Messages Drawer (if toggled) */}
      {showInstantMessages && (
        <div
          className="p-2 border-b animate-in fade-in slide-in-from-top-1"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
        >
          <div className="flex gap-2 overflow-x-auto pb-1 mb-1.5 scrollbar-none">
            {INSTANT_MESSAGES.map((cat, idx) => (
              <button
                key={cat.category}
                onClick={() => setSelectedQuickCategory(idx)}
                className={`px-2.5 py-1 text-xs whitespace-nowrap rounded font-nastaliq transition-colors ${
                  selectedQuickCategory === idx
                    ? 'bg-[#8CCF35] text-[#145C3A] font-bold'
                    : 'bg-black/20 text-white/80 hover:bg-black/30'
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1.5 max-h-24 overflow-y-auto">
            {INSTANT_MESSAGES[selectedQuickCategory]?.phrases.map((phrase) => (
              <button
                key={phrase}
                onClick={() => {
                  onInsertText(phrase + ' ');
                  if (settings.soundEnabled) playKeyClickSound('char');
                }}
                className="px-2 py-1.5 bg-black/20 hover:bg-black/40 text-white text-xs font-nastaliq rounded text-center truncate border border-white/10 active:scale-95 transition-transform"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Suggestions Bar */}
      {settings.suggestionsEnabled && (
        <div
          className="flex items-center gap-2 px-2 py-1.5 overflow-x-auto min-h-[38px] border-b"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
        >
          {suggestions.length > 0 ? (
            suggestions.slice(0, 5).map((sug, idx) => (
              <button
                key={`${sug}-${idx}`}
                onClick={() => handleSelectSuggestion(sug)}
                className={`px-3 py-1 rounded-full text-sm font-nastaliq whitespace-nowrap transition-transform active:scale-95 ${
                  idx === 0
                    ? 'bg-[#8CCF35] text-[#145C3A] font-bold shadow-sm'
                    : 'bg-black/20 text-white/90 hover:bg-black/30'
                }`}
              >
                {sug}
              </button>
            ))
          ) : (
            <div className="flex items-center gap-2 text-xs text-white/50 px-2 font-nastaliq">
              <span>یہاں تجاویز ظاہر ہوں گی</span>
              {settings.easyUrduEnabled && (
                <span className="text-[10px] text-[#8CCF35]">
                  (Easy Urdu چالو ہے)
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. Keyboard Character Keys Container */}
      <div className="p-1.5 space-y-1.5">
        {/* Optional Top Number Row */}
        {settings.numberRowEnabled && mode !== 'symbols' && (
          <div className="flex justify-between gap-1">
            {symbolsRow1.map((num, i) => (
              <button
                key={num}
                onClick={() => handleKeyTap(mode === 'urdu' ? num : symbolsRow2[i])}
                className={`flex-1 ${keyHeightClass} rounded-md font-nastaliq font-medium transition-all active:scale-95 flex items-center justify-center shadow-sm`}
                style={{
                  backgroundColor: theme.keyBg,
                  color: theme.keyText,
                  border: `1px solid ${theme.border}`,
                }}
              >
                {mode === 'urdu' ? num : symbolsRow2[i]}
              </button>
            ))}
          </div>
        )}

        {/* URDU LAYOUT */}
        {mode === 'urdu' && (
          <>
            {/* Row 1 */}
            <div className="flex justify-between gap-1" dir="rtl">
              {urduRow1.map((k) => (
                <button
                  key={k}
                  onClick={() => handleKeyTap(k)}
                  className={`flex-1 ${keyHeightClass} rounded-md font-nastaliq text-lg font-medium transition-all active:scale-95 flex items-center justify-center shadow-sm`}
                  style={{
                    backgroundColor: theme.keyBg,
                    color: theme.keyText,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  {k}
                </button>
              ))}
            </div>

            {/* Row 2 */}
            <div className="flex justify-between gap-1" dir="rtl">
              {urduRow2.map((k) => (
                <button
                  key={k}
                  onClick={() => handleKeyTap(k)}
                  className={`flex-1 ${keyHeightClass} rounded-md font-nastaliq text-lg font-medium transition-all active:scale-95 flex items-center justify-center shadow-sm`}
                  style={{
                    backgroundColor: theme.keyBg,
                    color: theme.keyText,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  {k}
                </button>
              ))}
            </div>

            {/* Row 3 */}
            <div className="flex justify-between gap-1" dir="rtl">
              {urduRow3.map((k) => (
                <button
                  key={k}
                  onClick={() => handleKeyTap(k)}
                  className={`flex-1 ${keyHeightClass} rounded-md font-nastaliq text-lg font-medium transition-all active:scale-95 flex items-center justify-center shadow-sm`}
                  style={{
                    backgroundColor: theme.keyBg,
                    color: theme.keyText,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  {k}
                </button>
              ))}
            </div>

            {/* Row 4: Letters + Backspace */}
            <div className="flex justify-between gap-1" dir="rtl">
              {urduRow4.map((k) => (
                <button
                  key={k}
                  onClick={() => handleKeyTap(k)}
                  className={`flex-1 ${keyHeightClass} rounded-md font-nastaliq text-lg font-medium transition-all active:scale-95 flex items-center justify-center shadow-sm`}
                  style={{
                    backgroundColor: theme.keyBg,
                    color: theme.keyText,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  {k}
                </button>
              ))}
              <button
                onClick={handleDelete}
                className={`w-12 ${keyHeightClass} rounded-md transition-all active:scale-95 flex items-center justify-center shadow-sm`}
                style={{
                  backgroundColor: theme.keySpecialBg,
                  color: theme.keyText,
                  border: `1px solid ${theme.border}`,
                }}
                title="Backspace"
                aria-label="Backspace"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>
          </>
        )}

        {/* ENGLISH QWERTY LAYOUT */}
        {mode === 'english' && (
          <>
            {/* Row 1 */}
            <div className="flex justify-between gap-1">
              {englishRow1.map((k) => {
                const char = isShift ? k.toUpperCase() : k;
                return (
                  <button
                    key={k}
                    onClick={() => handleKeyTap(char)}
                    className={`flex-1 ${keyHeightClass} rounded-md font-sans text-base font-medium transition-all active:scale-95 flex items-center justify-center shadow-sm`}
                    style={{
                      backgroundColor: theme.keyBg,
                      color: theme.keyText,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    {char}
                  </button>
                );
              })}
            </div>

            {/* Row 2 */}
            <div className="flex justify-center gap-1 px-3">
              {englishRow2.map((k) => {
                const char = isShift ? k.toUpperCase() : k;
                return (
                  <button
                    key={k}
                    onClick={() => handleKeyTap(char)}
                    className={`flex-1 ${keyHeightClass} rounded-md font-sans text-base font-medium transition-all active:scale-95 flex items-center justify-center shadow-sm`}
                    style={{
                      backgroundColor: theme.keyBg,
                      color: theme.keyText,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    {char}
                  </button>
                );
              })}
            </div>

            {/* Row 3: Shift + Keys + Delete */}
            <div className="flex justify-between gap-1">
              <button
                onClick={() => setIsShift(!isShift)}
                className={`w-12 ${keyHeightClass} rounded-md text-xs font-bold transition-all active:scale-95 flex items-center justify-center shadow-sm ${
                  isShift ? 'ring-2 ring-[#8CCF35]' : ''
                }`}
                style={{
                  backgroundColor: theme.keySpecialBg,
                  color: theme.keyText,
                  border: `1px solid ${theme.border}`,
                }}
              >
                ⇧
              </button>
              {englishRow3.map((k) => {
                const char = isShift ? k.toUpperCase() : k;
                return (
                  <button
                    key={k}
                    onClick={() => handleKeyTap(char)}
                    className={`flex-1 ${keyHeightClass} rounded-md font-sans text-base font-medium transition-all active:scale-95 flex items-center justify-center shadow-sm`}
                    style={{
                      backgroundColor: theme.keyBg,
                      color: theme.keyText,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    {char}
                  </button>
                );
              })}
              <button
                onClick={handleDelete}
                className={`w-12 ${keyHeightClass} rounded-md transition-all active:scale-95 flex items-center justify-center shadow-sm`}
                style={{
                  backgroundColor: theme.keySpecialBg,
                  color: theme.keyText,
                  border: `1px solid ${theme.border}`,
                }}
                title="Backspace"
                aria-label="Backspace"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>
          </>
        )}

        {/* SYMBOLS & NUMBERS LAYOUT */}
        {mode === 'symbols' && (
          <>
            <div className="flex justify-between gap-1">
              {symbolsRow1.map((k) => (
                <button
                  key={k}
                  onClick={() => handleKeyTap(k)}
                  className={`flex-1 ${keyHeightClass} rounded-md font-nastaliq text-base font-medium transition-all active:scale-95 flex items-center justify-center shadow-sm`}
                  style={{
                    backgroundColor: theme.keyBg,
                    color: theme.keyText,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  {k}
                </button>
              ))}
            </div>
            <div className="flex justify-between gap-1">
              {symbolsRow2.map((k) => (
                <button
                  key={k}
                  onClick={() => handleKeyTap(k)}
                  className={`flex-1 ${keyHeightClass} rounded-md font-sans text-base font-medium transition-all active:scale-95 flex items-center justify-center shadow-sm`}
                  style={{
                    backgroundColor: theme.keyBg,
                    color: theme.keyText,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  {k}
                </button>
              ))}
            </div>
            <div className="flex justify-between gap-1">
              {symbolsRow3.map((k) => (
                <button
                  key={k}
                  onClick={() => handleKeyTap(k)}
                  className={`flex-1 ${keyHeightClass} rounded-md font-nastaliq text-base font-medium transition-all active:scale-95 flex items-center justify-center shadow-sm`}
                  style={{
                    backgroundColor: theme.keyBg,
                    color: theme.keyText,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  {k}
                </button>
              ))}
            </div>
            <div className="flex justify-between gap-1">
              {symbolsRow4.map((k) => (
                <button
                  key={k}
                  onClick={() => handleKeyTap(k)}
                  className={`flex-1 ${keyHeightClass} rounded-md font-sans text-base font-medium transition-all active:scale-95 flex items-center justify-center shadow-sm`}
                  style={{
                    backgroundColor: theme.keyBg,
                    color: theme.keyText,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  {k}
                </button>
              ))}
              <button
                onClick={handleDelete}
                className={`w-12 ${keyHeightClass} rounded-md transition-all active:scale-95 flex items-center justify-center shadow-sm`}
                style={{
                  backgroundColor: theme.keySpecialBg,
                  color: theme.keyText,
                  border: `1px solid ${theme.border}`,
                }}
                title="Backspace"
                aria-label="Backspace"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>
          </>
        )}

        {/* EMOJIS PANEL */}
        {mode === 'emojis' && (
          <div className="h-36 overflow-y-auto p-1 grid grid-cols-8 gap-2 bg-black/20 rounded-lg">
            {[
              '😊', '😂', '❤️', '🤲', '🇵🇰', '🌙', '🕌', '🌹',
              '👍', '🙏', '✨', '💐', '🎉', '😍', '😇', '🤝',
              '💚', '⭐', '📖', '🖋️', '☕', '🔥', '💯', '🌸',
              '🥰', '😎', '🤩', '🥺', '😭', '🙌', '👏', '💪'
            ].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleKeyTap(emoji)}
                className="text-2xl p-1 rounded hover:bg-white/20 active:scale-90 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* 5. Bottom Control Row */}
        <div className="flex items-center justify-between gap-1 pt-0.5">
          {/* Symbols Toggle (?123) */}
          <button
            onClick={() => setMode(mode === 'symbols' ? 'urdu' : 'symbols')}
            className={`w-14 ${keyHeightClass} rounded-md text-xs font-bold transition-all active:scale-95 flex items-center justify-center shadow-sm`}
            style={{
              backgroundColor: theme.keySpecialBg,
              color: theme.keyText,
              border: `1px solid ${theme.border}`,
            }}
          >
            {mode === 'symbols' ? 'اردو' : '?123'}
          </button>

          {/* Language Switcher (اردو / ABC) */}
          <button
            onClick={() => setMode(mode === 'urdu' ? 'english' : 'urdu')}
            className={`w-14 ${keyHeightClass} rounded-md text-xs font-bold transition-all active:scale-95 flex items-center justify-center shadow-sm gap-1`}
            style={{
              backgroundColor: theme.keySpecialBg,
              color: theme.keyText,
              border: `1px solid ${theme.border}`,
            }}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{mode === 'urdu' ? 'ABC' : 'اردو'}</span>
          </button>

          {/* Spacebar */}
          <button
            onClick={handleSpace}
            className={`flex-1 ${keyHeightClass} rounded-md transition-all active:scale-98 flex items-center justify-center shadow-sm`}
            style={{
              backgroundColor: theme.spaceBg,
              color: theme.keyText,
              border: `1px solid ${theme.border}`,
            }}
          >
            <span className="text-xs font-nastaliq opacity-85">
              {mode === 'urdu'
                ? 'آسان اردو سپیس'
                : settings.easyUrduEnabled
                ? 'Easy Urdu (Space)'
                : 'English Space'}
            </span>
          </button>

          {/* Emoji Toggle */}
          <button
            onClick={() => setMode(mode === 'emojis' ? 'urdu' : 'emojis')}
            className={`w-12 ${keyHeightClass} rounded-md transition-all active:scale-95 flex items-center justify-center shadow-sm`}
            style={{
              backgroundColor: theme.keySpecialBg,
              color: theme.keyText,
              border: `1px solid ${theme.border}`,
            }}
            title="Emoji Picker"
            aria-label="Emoji Picker"
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Enter Key */}
          <button
            onClick={handleEnterKey}
            className={`w-14 ${keyHeightClass} rounded-md transition-all active:scale-95 flex items-center justify-center shadow-sm`}
            style={{
              backgroundColor: theme.accent,
              color: '#145C3A',
              fontWeight: 'bold',
            }}
            title="Enter"
            aria-label="Enter"
          >
            <CornerDownLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
