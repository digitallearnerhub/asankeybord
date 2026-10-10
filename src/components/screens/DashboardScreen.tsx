import React from 'react';
import { ScreenId, KeyboardTheme } from '../../types';
import {
  Camera,
  PenTool,
  BookOpen,
  FileText,
  Search,
  Clipboard,
  Languages,
  Palette,
  Activity,
  Bookmark,
  Settings,
  MessageSquare,
  Package,
  Copy,
  Share2,
  Check,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
} from 'lucide-react';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenId) => void;
  quickText: string;
  setQuickText: (text: string) => void;
  onOpenKeyboard: () => void;
  isKeyboardOpen: boolean;
  theme: KeyboardTheme;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  quickText,
  setQuickText,
  onOpenKeyboard,
  isKeyboardOpen,
  theme,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [isQuickEnabled, setIsQuickEnabled] = React.useState(true);

  const handleCopy = () => {
    if (!quickText) return;
    navigator.clipboard.writeText(quickText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (!quickText) return;
    if (navigator.share) {
      navigator.share({
        title: 'Asaan Urdu Text',
        text: quickText,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  const features = [
    {
      id: 'ocr' as ScreenId,
      title: 'Image to Urdu Text',
      urduTitle: 'تصویر سے اردو متن (OCR)',
      icon: Camera,
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'تصویر سے تحریر نکالیں اور کاپی کریں',
      badge: 'OCR',
    },
    {
      id: 'post_creator' as ScreenId,
      title: 'Create Urdu Post',
      urduTitle: 'اردو پوسٹ بنائیں',
      icon: PenTool,
      iconBg: 'bg-lime-50 text-lime-700 border-lime-200',
      description: 'خوبصورت نستعلیق پوسٹ، اقوال و شاعری کارڈز',
      badge: 'Design',
    },
    {
      id: 'urdu_editor' as ScreenId,
      title: 'Urdu Editor',
      urduTitle: 'مکمل اردو ایڈیٹر',
      icon: FileText,
      iconBg: 'bg-blue-50 text-blue-700 border-blue-200',
      description: 'بڑا ٹیکسٹ ایڈیٹر، لفظ شماری اور دستاویزات',
      badge: 'Editor',
    },
    {
      id: 'poetry' as ScreenId,
      title: 'Urdu Ghazals',
      urduTitle: 'اردو غزلیں و شاعری',
      icon: BookOpen,
      iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
      description: 'اقبال، غالب اور فیض کا منتخب کلام',
      badge: 'غزل',
    },
    {
      id: 'books' as ScreenId,
      title: 'Urdu Books',
      urduTitle: 'اردو کتب خانہ',
      icon: BookOpen,
      iconBg: 'bg-teal-50 text-teal-700 border-teal-200',
      description: 'بانگِ درا، دیوانِ غالب اور کلاسک کتب',
      badge: 'Library',
    },
    {
      id: 'quran' as ScreenId,
      title: 'Search Quran Ayat',
      urduTitle: 'قرآنی آیات و ترجمہ',
      icon: Search,
      iconBg: 'bg-green-50 text-green-800 border-green-200',
      description: 'عربی متن مع مصدقہ اردو ترجمہ جالندھری',
      badge: 'قرآن',
    },
    {
      id: 'chat_simulator' as ScreenId,
      title: 'Chat Simulator',
      urduTitle: 'چیٹ و کی بورڈ ٹیسٹر',
      icon: MessageSquare,
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'واٹس ایپ انداز میں کی بورڈ اور رومن اردو آزمائیں',
      badge: 'Interactive',
    },
    {
      id: 'transliteration' as ScreenId,
      title: 'Roman Urdu Converter',
      urduTitle: 'رومن اردو سے نستعلیق',
      icon: Languages,
      iconBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      description: 'انگریزی الفاظ کو فوراً نستعلیق اردو بنائیں',
      badge: 'Smart Engine',
    },
    {
      id: 'clipboard' as ScreenId,
      title: 'Clipboard Manager',
      urduTitle: 'کلپ بورڈ مینیجر',
      icon: Clipboard,
      iconBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      description: 'محفوظ جملے، فوری اقوال اور نوٹس',
      badge: 'Clips',
    },
    {
      id: 'themes' as ScreenId,
      title: 'Themes & Styles',
      urduTitle: 'تھیمز اور کی بورڈ ڈیزائن',
      icon: Palette,
      iconBg: 'bg-purple-50 text-purple-700 border-purple-200',
      description: 'زمردی سبز، ڈارک، نیلے اور دیگر رنگ',
      badge: 'Custom',
    },
    {
      id: 'typing_practice' as ScreenId,
      title: 'Typing Practice',
      urduTitle: 'اردو ٹائپنگ مشق',
      icon: Activity,
      iconBg: 'bg-rose-50 text-rose-700 border-rose-200',
      description: 'رفتار، درستگی اور ڈبلیو پی ایم ٹیسٹ',
      badge: 'WPM Test',
    },
    {
      id: 'favorites' as ScreenId,
      title: 'Favorites & Saved',
      urduTitle: 'پسندیدہ اشعار و متن',
      icon: Bookmark,
      iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
      description: 'محفوظ شدہ اشعار، اقوال اور تراجم',
      badge: 'Saved',
    },
    {
      id: 'settings' as ScreenId,
      title: 'Keyboard Settings',
      urduTitle: 'سیٹنگز اور اینڈرائیڈ گائیڈ',
      icon: Settings,
      iconBg: 'bg-slate-50 text-slate-700 border-slate-200',
      description: 'کی بورڈ فعال کرنے کی ہدایات اور ترجیحات',
      badge: 'Setup',
    },
    {
      id: 'android_source' as ScreenId,
      title: 'Android Studio Source',
      urduTitle: 'اینڈرائیڈ پروجیکٹ اور اے پی کے کوڈ',
      icon: Package,
      iconBg: 'bg-emerald-900 text-[#8CCF35] border-emerald-800',
      description: 'مکمل Kotlin/Compose پروجیکٹ ڈاؤن لوڈ کریں',
      badge: 'APK Source',
    },
  ];

  return (
    <div className="flex flex-col min-h-full pb-36">
      {/* Hero Banner with Islamic geometric aesthetic */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#145C3A] via-[#1a6e46] to-[#0d4028] text-white p-5 rounded-2xl shadow-sm mb-6 border border-emerald-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8CCF35]">
                Urdu Made Simple
              </span>
              <span className="text-xs text-emerald-300">·</span>
              <span className="text-xs text-emerald-200 font-nastaliq">
                آسان اردو کی بورڈ
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
              Asaan Urdu Keyboard
            </h1>
            <p className="text-sm text-emerald-100 max-w-xl font-nastaliq leading-relaxed">
              تیز رفتار رومن اردو ٹرانسلیٹریشن، مکمل نستعلیق کی بورڈ، او سی آر، اور شاعری و تحریر کا مکمل سوٹ
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('chat_simulator')}
              className="px-4 py-2 text-xs font-semibold bg-[#8CCF35] hover:bg-[#7ebd2e] text-[#145C3A] rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>ٹیسٹ چیٹ کھولیں</span>
            </button>
            <button
              onClick={() => onNavigate('android_source')}
              className="px-3.5 py-2 text-xs font-medium bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
            >
              <Package className="w-4 h-4" />
              <span>Android APK Source</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Grid (Inspired by Reference Screenshots 1 & 3) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <span>فیچرز اور ٹولز</span>
            <span className="text-xs font-normal text-gray-500 font-sans">
              (Features & Tools)
            </span>
          </h2>
          <span className="text-xs text-gray-500 font-sans">
            14 Active Modules
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <button
                key={feat.id}
                onClick={() => onNavigate(feat.id)}
                className="group text-left p-4 rounded-2xl bg-white border border-gray-200/80 hover:border-[#145C3A]/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-[152px] relative overflow-hidden"
              >
                <div className="flex items-start justify-between w-full">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border ${feat.iconBg} group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-sans">
                    {feat.badge}
                  </span>
                </div>

                <div className="mt-2">
                  <div className="text-xs text-gray-500 font-sans font-medium">
                    {feat.title}
                  </div>
                  <div className="text-sm font-bold text-gray-900 font-nastaliq leading-snug line-clamp-1">
                    {feat.urduTitle}
                  </div>
                  <div className="text-[11px] text-gray-500 font-nastaliq truncate mt-0.5">
                    {feat.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Persistent Quick Urdu Typing Box (Matching Reference Screenshot 1) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-xl max-w-5xl mx-auto rounded-t-2xl">
        <div className="flex flex-col gap-2">
          <div className="relative">
            <textarea
              dir="rtl"
              value={quickText}
              onChange={(e) => setQuickText(e.target.value)}
              onFocus={onOpenKeyboard}
              placeholder="یہاں اردو میں ٹائپ کریں... (Type in Urdu here)"
              rows={2}
              className="w-full p-2.5 text-base font-nastaliq rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#145C3A] focus:border-transparent resize-none bg-[#F7F9F5] text-gray-900 placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                disabled={!quickText}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 rounded-lg transition-colors"
                title="Copy text"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="font-nastaliq">کاپی</span>
              </button>

              <button
                onClick={() => setIsQuickEnabled(!isQuickEnabled)}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                {isQuickEnabled ? (
                  <ToggleRight className="w-4 h-4 text-[#145C3A]" />
                ) : (
                  <ToggleLeft className="w-4 h-4 text-gray-400" />
                )}
                <span className="font-nastaliq">
                  {isQuickEnabled ? 'فعال' : 'غیر فعال'}
                </span>
              </button>

              <button
                onClick={() => setQuickText('')}
                disabled={!quickText}
                className="px-2 py-1.5 text-gray-500 hover:text-red-600 disabled:opacity-40 font-nastaliq"
              >
                صاف کریں
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleShare}
                disabled={!quickText}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 rounded-lg transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="font-nastaliq">شیئر</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('post_creator');
                }}
                className="flex items-center gap-1 px-3.5 py-1.5 bg-[#145C3A] hover:bg-[#0f482d] text-white rounded-lg font-medium shadow-sm transition-all"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span className="font-nastaliq">پوسٹ بنائیں</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
