import React, { useState } from 'react';
import { KeyboardSettings } from '../../types';
import {
  Settings,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  Trash2,
  Check,
  AlertTriangle,
  Info,
  Lock,
} from 'lucide-react';

interface SettingsScreenProps {
  onBack: () => void;
  settings: KeyboardSettings;
  onUpdateSettings: (updater: (prev: KeyboardSettings) => KeyboardSettings) => void;
  onClearAllLocalData: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  settings,
  onUpdateSettings,
  onClearAllLocalData,
}) => {
  const [clearedSuccess, setClearedSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const handleClearData = () => {
    if (window.confirm('کیا آپ واقعی تمام محفوظ شدہ نوٹس اور کلپ بورڈ صاف کرنا چاہتے ہیں؟')) {
      onClearAllLocalData();
      setClearedSuccess(true);
      setTimeout(() => setClearedSuccess(false), 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>Settings & Android Setup</span>
            <span className="text-sm font-nastaliq text-emerald-800">سیٹنگز اور اینڈرائیڈ گائیڈ</span>
          </h2>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Configure input method behavior, step-by-step Android device setup, and privacy safeguards.
          </p>
        </div>
      </div>

      {/* Step-by-Step Android Setup Walkthrough */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-emerald-900">
          <Smartphone className="w-5 h-5 text-[#145C3A]" />
          <h3 className="text-sm font-bold">
            اینڈرائیڈ میں کی بورڈ فعال کرنے کا طریقہ (Android IME Setup Guide)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Step 1 */}
          <div
            onClick={() => setActiveStep(1)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              activeStep === 1
                ? 'bg-emerald-50/60 border-[#145C3A] ring-1 ring-[#145C3A]'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-mono text-[#145C3A] bg-emerald-100 px-2 py-0.5 rounded-full">
                مرحلہ ۱
              </span>
              <span className="text-[10px] text-gray-400">Step 1</span>
            </div>
            <div className="font-bold text-xs text-gray-900 mb-1">
              اینڈرائیڈ سیٹنگز کھولیں
            </div>
            <div className="text-[11px] text-gray-600 leading-relaxed font-nastaliq" dir="rtl">
              سیٹنگز میں جائیں → System → Languages & Input → Manage Keyboards پر کلک کریں۔
            </div>
          </div>

          {/* Step 2 */}
          <div
            onClick={() => setActiveStep(2)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              activeStep === 2
                ? 'bg-emerald-50/60 border-[#145C3A] ring-1 ring-[#145C3A]'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-mono text-[#145C3A] bg-emerald-100 px-2 py-0.5 rounded-full">
                مرحلہ ۲
              </span>
              <span className="text-[10px] text-gray-400">Step 2</span>
            </div>
            <div className="font-bold text-xs text-gray-900 mb-1">
              آسان اردو کو آن کریں
            </div>
            <div className="text-[11px] text-gray-600 leading-relaxed font-nastaliq" dir="rtl">
              کی بورڈز کی لسٹ میں <strong>Asaan Urdu Keyboard</strong> کے سامنے سوئچ کو آن کریں۔
            </div>
          </div>

          {/* Step 3 */}
          <div
            onClick={() => setActiveStep(3)}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              activeStep === 3
                ? 'bg-emerald-50/60 border-[#145C3A] ring-1 ring-[#145C3A]'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-mono text-[#145C3A] bg-emerald-100 px-2 py-0.5 rounded-full">
                مرحلہ ۳
              </span>
              <span className="text-[10px] text-gray-400">Step 3</span>
            </div>
            <div className="font-bold text-xs text-gray-900 mb-1">
              منتخب کریں اور ٹائپ کریں
            </div>
            <div className="text-[11px] text-gray-600 leading-relaxed font-nastaliq" dir="rtl">
              کسی بھی ایپ (WhatsApp، Notes) میں سپیس بار یا گلوب بٹن دبا کر کی بورڈ منتخب کریں۔
            </div>
          </div>
        </div>

        <div className="bg-[#F7F9F5] p-3 rounded-xl border border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <Info className="w-4 h-4 text-[#145C3A] shrink-0" />
            <span>
              جب آپ اینڈرائیڈ ڈیوائس پر اے پی کے انسٹال کریں گے تو یہ مراحل خودکار طریقے سے لاگو ہوں گے۔
            </span>
          </div>
        </div>
      </div>

      {/* Zero Telemetry & Privacy Constitution Card */}
      <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-emerald-900">
          <ShieldCheck className="w-5 h-5 text-[#145C3A]" />
          <h3 className="text-sm font-bold">
            100% پرائیویٹ اور محفوظ (Zero Telemetry Privacy Guarantee)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700">
          <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100 space-y-1">
            <div className="font-bold text-emerald-950 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#145C3A]" />
              <span>کی لاگنگ ممنوع (No Keystroke Logging)</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              ہم آپ کے ٹائپ کردہ الفاظ، پاس ورڈ، پن کوڈ یا بینکنگ ڈیٹا کبھی ریکارڈ یا اسٹور نہیں کرتے۔
            </p>
          </div>

          <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100 space-y-1">
            <div className="font-bold text-emerald-950 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#145C3A]" />
              <span>مکمل آف لائن سروس (Offline Processing)</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              کی بورڈ اور ٹرانسلیٹریشن انجن بغیر انٹرنیٹ کنکشن کے مکمل طور پر فون کی میموری پر کام کرتا ہے۔
            </p>
          </div>
        </div>
      </div>

      {/* Data Management & Clear Options */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-gray-900">
          ڈیٹا مینیجمنٹ (Storage & Reset)
        </h3>
        <p className="text-xs text-gray-500">
          آپ اپنے محفوظ کردہ کلپ بورڈ، دستاویزات اور ترجیحات کو جب چاہیں ایک کلک سے مٹا سکتے ہیں:
        </p>

        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={handleClearData}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {clearedSuccess ? <Check className="w-4 h-4 text-green-600" /> : <Trash2 className="w-4 h-4" />}
            <span>تمام مقامی ڈیٹا مٹائیں (Delete All Saved Data)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
