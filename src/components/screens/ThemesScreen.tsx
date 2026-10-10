import React from 'react';
import { KEYBOARD_THEMES } from '../../data/sampleData';
import { KeyboardTheme, KeyboardSettings } from '../../types';
import { VirtualKeyboard } from '../keyboard/VirtualKeyboard';
import {
  Palette,
  Volume2,
  Vibrate,
  Sliders,
  RotateCcw,
  Sparkles,
  Check,
} from 'lucide-react';

interface ThemesScreenProps {
  onBack: () => void;
  currentTheme: KeyboardTheme;
  settings: KeyboardSettings;
  onSelectTheme: (theme: KeyboardTheme) => void;
  onUpdateSettings: (updater: (prev: KeyboardSettings) => KeyboardSettings) => void;
  onResetDefaults: () => void;
}

export const ThemesScreen: React.FC<ThemesScreenProps> = ({
  onBack,
  currentTheme,
  settings,
  onSelectTheme,
  onUpdateSettings,
  onResetDefaults,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>Themes & Keyboard Customization</span>
            <span className="text-sm font-nastaliq text-emerald-800">تھیمز اور کی بورڈ کی ترتیبات</span>
          </h2>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Personalize your keyboard colors, key heights, feedback vibrations, and typing preferences.
          </p>
        </div>

        <button
          onClick={onResetDefaults}
          className="px-3 py-1.5 text-xs text-gray-600 hover:text-red-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>ری سیٹ (Defaults)</span>
        </button>
      </div>

      {/* Theme Cards Palette */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-[#145C3A]" />
          <span>کی بورڈ تھیم منتخب کریں (Select Theme Colorway)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {KEYBOARD_THEMES.map((theme) => {
            const isSelected = currentTheme.id === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => onSelectTheme(theme)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between h-28 ${
                  isSelected
                    ? 'ring-2 ring-[#8CCF35] border-transparent shadow-md'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
                style={{ backgroundColor: theme.cardBg }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-bold truncate drop-shadow-xs"
                    style={{ color: theme.keyText }}
                  >
                    {theme.name}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#8CCF35] text-[#145C3A] flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Key Preview Swatches */}
                <div className="flex gap-1.5 pt-2">
                  <div
                    className="w-7 h-6 rounded flex items-center justify-center text-[10px] font-bold shadow-xs"
                    style={{ backgroundColor: theme.keyBg, color: theme.keyText }}
                  >
                    ا
                  </div>
                  <div
                    className="w-7 h-6 rounded flex items-center justify-center text-[10px] font-bold shadow-xs"
                    style={{ backgroundColor: theme.keyBg, color: theme.keyText }}
                  >
                    ب
                  </div>
                  <div
                    className="flex-1 h-6 rounded flex items-center justify-center text-[9px] shadow-xs"
                    style={{ backgroundColor: theme.spaceBg, color: theme.keyText }}
                  >
                    سپیس
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Behavior & Feedback Settings */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-[#145C3A]" />
          <span>ٹائپنگ فیڈ بیک اور ترتیبات (Feedback & Sizing)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Key Height */}
          <div className="p-3 bg-gray-50 rounded-xl space-y-2">
            <span className="font-bold text-gray-800">کیز کی اونچائی (Key Height):</span>
            <div className="flex gap-2">
              {(['compact', 'normal', 'tall'] as const).map((h) => (
                <button
                  key={h}
                  onClick={() =>
                    onUpdateSettings((prev) => ({ ...prev, keyHeight: h }))
                  }
                  className={`flex-1 py-1.5 rounded-lg border font-medium transition-colors ${
                    settings.keyHeight === h
                      ? 'bg-[#145C3A] text-white border-[#145C3A]'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {h === 'compact' ? 'Compact' : h === 'normal' ? 'Normal' : 'Tall'}
                </button>
              ))}
            </div>
          </div>

          {/* Sound toggle */}
          <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-gray-800">کی ساؤنڈ (Key Click Sound)</div>
              <div className="text-[11px] text-gray-500">حروف دبانے پر کلک آواز</div>
            </div>
            <button
              onClick={() =>
                onUpdateSettings((prev) => ({
                  ...prev,
                  soundEnabled: !prev.soundEnabled,
                }))
              }
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                settings.soundEnabled
                  ? 'bg-emerald-100 text-[#145C3A]'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {settings.soundEnabled ? 'فعال (ON)' : 'بند (OFF)'}
            </button>
          </div>

          {/* Vibration toggle */}
          <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-gray-800">ہَیپٹک وائبریشن (Haptic Vibration)</div>
              <div className="text-[11px] text-gray-500">کی پریس پر ہلکی تھرتھراہٹ</div>
            </div>
            <button
              onClick={() =>
                onUpdateSettings((prev) => ({
                  ...prev,
                  hapticEnabled: !prev.hapticEnabled,
                }))
              }
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                settings.hapticEnabled
                  ? 'bg-emerald-100 text-[#145C3A]'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {settings.hapticEnabled ? 'فعال (ON)' : 'بند (OFF)'}
            </button>
          </div>

          {/* Number Row toggle */}
          <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-gray-800">نمبر رو (Top Number Row)</div>
              <div className="text-[11px] text-gray-500">کی بورڈ کے اوپر ہندسوں کی قطار</div>
            </div>
            <button
              onClick={() =>
                onUpdateSettings((prev) => ({
                  ...prev,
                  numberRowEnabled: !prev.numberRowEnabled,
                }))
              }
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                settings.numberRowEnabled
                  ? 'bg-emerald-100 text-[#145C3A]'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {settings.numberRowEnabled ? 'فعال (ON)' : 'بند (OFF)'}
            </button>
          </div>
        </div>
      </div>

      {/* Live Interactive Keyboard Preview */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>لائیو کی بورڈ پری ویو (Try typing below with current theme):</span>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-300">
          <VirtualKeyboard
            theme={currentTheme}
            settings={settings}
            onInsertText={() => {}}
            onDeleteChar={() => {}}
            onEnter={() => {}}
            onUpdateSettings={onUpdateSettings}
          />
        </div>
      </div>
    </div>
  );
};
