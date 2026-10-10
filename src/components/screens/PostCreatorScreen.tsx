import React, { useState, useRef } from 'react';
import { POST_TEMPLATES } from '../../data/sampleData';
import { PostTemplate } from '../../types';
import {
  Download,
  Share2,
  Sparkles,
  AlignRight,
  AlignCenter,
  AlignLeft,
  Type,
  Palette,
  Check,
  Save,
} from 'lucide-react';

interface PostCreatorScreenProps {
  onBack: () => void;
  initialText?: string;
}

export const PostCreatorScreen: React.FC<PostCreatorScreenProps> = ({
  onBack,
  initialText = '',
}) => {
  const [postText, setPostText] = useState(
    initialText || 'خودی کو کر بلند اتنا کہ ہر تقدیر سے پہلے\nخدا بندے سے خود پوچھے بتا تیری رضا کیا ہے'
  );
  const [authorName, setAuthorName] = useState('علامہ محمد اقبال');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5' | '9:16'>('1:1');
  const [selectedBg, setSelectedBg] = useState(
    'linear-gradient(135deg, #145C3A 0%, #0c3823 100%)'
  );
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState<number>(24);
  const [textAlign, setTextAlign] = useState<'right' | 'center' | 'left'>('center');
  const [fontFamily, setFontFamily] = useState<'nastaliq' | 'arabic'>('nastaliq');
  const [hasBorder, setHasBorder] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const previewCardRef = useRef<HTMLDivElement>(null);

  const backgrounds = [
    { name: 'Emerald', value: 'linear-gradient(135deg, #145C3A 0%, #0c3823 100%)' },
    { name: 'Midnight', value: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' },
    { name: 'Deep Gold', value: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)' },
    { name: 'Royal Indigo', value: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)' },
    { name: 'Forest Dark', value: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)' },
    { name: 'Pure White', value: '#ffffff' },
    { name: 'Warm Cream', value: '#FAF5EE' },
  ];

  const handleApplyTemplate = (tmpl: PostTemplate) => {
    setPostText(tmpl.text);
    if (tmpl.author) setAuthorName(tmpl.author);
    setSelectedBg(tmpl.background);
    setTextColor(tmpl.textColor);
    setHasBorder(!!tmpl.borderColor);
  };

  const handleExportPng = async () => {
    setIsExporting(true);
    try {
      // Draw onto an offscreen canvas for high-resolution 1080px export
      const canvas = document.createElement('canvas');
      const width = 1080;
      let height = 1080;
      if (aspectRatio === '4:5') height = 1350;
      if (aspectRatio === '9:16') height = 1920;

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw background
      if (selectedBg.includes('gradient')) {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        if (selectedBg.includes('#145C3A')) {
          grad.addColorStop(0, '#145C3A');
          grad.addColorStop(1, '#0c3823');
        } else if (selectedBg.includes('#0f172a')) {
          grad.addColorStop(0, '#0f172a');
          grad.addColorStop(1, '#1e293b');
        } else if (selectedBg.includes('#78350f')) {
          grad.addColorStop(0, '#78350f');
          grad.addColorStop(1, '#451a03');
        } else if (selectedBg.includes('#312e81')) {
          grad.addColorStop(0, '#312e81');
          grad.addColorStop(1, '#1e1b4b');
        } else {
          grad.addColorStop(0, '#145C3A');
          grad.addColorStop(1, '#0c3823');
        }
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = selectedBg;
      }
      ctx.fillRect(0, 0, width, height);

      // Draw ornamental border
      if (hasBorder) {
        ctx.strokeStyle = textColor === '#ffffff' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.15)';
        ctx.lineWidth = 6;
        ctx.strokeRect(60, 60, width - 120, height - 120);
        ctx.strokeStyle = '#8CCF35';
        ctx.lineWidth = 2;
        ctx.strokeRect(75, 75, width - 150, height - 150);
      }

      // Draw Urdu Text
      ctx.fillStyle = textColor;
      ctx.textAlign = textAlign;
      ctx.direction = 'rtl';
      const scaledFontSize = Math.floor(fontSize * 2.2);
      ctx.font = `600 ${scaledFontSize}px 'Noto Nastaliq Urdu', 'Noto Sans Arabic', serif`;

      const lines = postText.split('\n');
      const startX = textAlign === 'center' ? width / 2 : textAlign === 'right' ? width - 140 : 140;
      const startY = height / 2 - (lines.length * scaledFontSize * 1.5) / 2 + 50;

      lines.forEach((line, index) => {
        ctx.fillText(line, startX, startY + index * scaledFontSize * 1.8);
      });

      // Draw Author / Footer
      if (authorName) {
        ctx.font = `400 ${Math.floor(scaledFontSize * 0.55)}px 'Noto Nastaliq Urdu', serif`;
        ctx.fillStyle = textColor === '#ffffff' ? '#8CCF35' : '#145C3A';
        ctx.fillText(`— ${authorName}`, startX, startY + lines.length * scaledFontSize * 1.8 + 60);
      }

      // Watermark badge
      ctx.font = "500 24px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = textColor === '#ffffff' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)';
      ctx.textAlign = 'center';
      ctx.fillText('Asaan Urdu Keyboard · Urdu Made Simple', width / 2, height - 90);

      // Trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `AsaanUrdu_Post_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Asaan Urdu Post',
        text: `${postText}\n\n— ${authorName}\n(Created via Asaan Urdu Keyboard)`,
      }).catch(() => {});
    } else {
      handleExportPng();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>Create Urdu Post</span>
            <span className="text-sm font-nastaliq text-emerald-800">اردو پوسٹ میکر</span>
          </h2>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Design gorgeous Nastaliq quotations, poetry cards, and announcement graphics ready to export.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPng}
            disabled={isExporting}
            className="px-4 py-2 bg-[#145C3A] hover:bg-[#0e432a] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-[#8CCF35]" /> : <Download className="w-4 h-4" />}
            <span>{isExporting ? 'ایکسپورٹ ہو رہا ہے...' : 'PNG ڈاؤن لوڈ کریں'}</span>
          </button>
          <button
            onClick={handleShare}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>شیئر</span>
          </button>
        </div>
      </div>

      {/* Preset Templates Carousel */}
      <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs">
        <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>ریڈی میڈ ٹیمپلیٹس (Preset Templates):</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {POST_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => handleApplyTemplate(tmpl)}
              className="p-2.5 rounded-xl text-left border border-gray-200 hover:border-[#145C3A] hover:shadow-xs transition-all flex flex-col justify-between"
              style={{ background: tmpl.background }}
            >
              <div
                className="text-xs font-bold font-nastaliq truncate"
                style={{ color: tmpl.textColor }}
              >
                {tmpl.name}
              </div>
              <div
                className="text-[10px] opacity-80 truncate font-nastaliq"
                style={{ color: tmpl.textColor }}
              >
                {tmpl.author || tmpl.category}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          {/* Post Text & Author Inputs */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
            <label className="block text-xs font-bold text-gray-800">
              متن اور شعر (Post Content)
            </label>
            <textarea
              dir="rtl"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              rows={4}
              className="w-full p-3 text-base font-nastaliq rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#145C3A] outline-none bg-[#F7F9F5] text-gray-900 leading-relaxed"
              placeholder="یہاں اردو شعر یا قول لکھیں..."
            />

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                شاعر یا مصنف کا نام (Author / Signature)
              </label>
              <input
                type="text"
                dir="rtl"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 text-sm font-nastaliq rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#145C3A] outline-none bg-[#F7F9F5] text-gray-900"
                placeholder="علامہ اقبال، مرزا غالب، وغیرہ..."
              />
            </div>
          </div>

          {/* Styling Controls */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-4 text-xs">
            {/* Aspect Ratio */}
            <div>
              <div className="font-bold text-gray-800 mb-2">سائز (Aspect Ratio)</div>
              <div className="flex gap-2">
                {(['1:1', '4:5', '9:16'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`flex-1 py-1.5 rounded-lg font-medium border transition-colors ${
                      aspectRatio === ratio
                        ? 'bg-[#145C3A] text-white border-[#145C3A]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {ratio === '1:1' ? 'Square 1:1' : ratio === '4:5' ? 'Portrait 4:5' : 'Story 9:16'}
                  </button>
                ))}
              </div>
            </div>

            {/* Typography & Alignment */}
            <div>
              <div className="font-bold text-gray-800 mb-2">فونٹ اور الائنمنٹ (Typography)</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex bg-gray-100 rounded-lg p-0.5 border border-gray-200">
                  <button
                    onClick={() => setTextAlign('right')}
                    className={`p-1.5 rounded ${textAlign === 'right' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-500'}`}
                    title="Align Right"
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTextAlign('center')}
                    className={`p-1.5 rounded ${textAlign === 'center' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-500'}`}
                    title="Align Center"
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTextAlign('left')}
                    className={`p-1.5 rounded ${textAlign === 'left' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-500'}`}
                    title="Align Left"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-[11px] text-gray-500">سائز:</span>
                  <input
                    type="range"
                    min="18"
                    max="36"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-[#145C3A]"
                  />
                  <span className="font-mono text-gray-700">{fontSize}px</span>
                </div>
              </div>
            </div>

            {/* Background Palette */}
            <div>
              <div className="font-bold text-gray-800 mb-2">پس منظر (Background)</div>
              <div className="flex flex-wrap gap-2">
                {backgrounds.map((bg) => (
                  <button
                    key={bg.name}
                    onClick={() => {
                      setSelectedBg(bg.value);
                      if (bg.name === 'Pure White' || bg.name === 'Warm Cream') {
                        setTextColor('#1F2937');
                      } else {
                        setTextColor('#ffffff');
                      }
                    }}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${
                      selectedBg === bg.value ? 'scale-110 ring-2 ring-[#8CCF35]' : 'border-gray-300'
                    }`}
                    style={{ background: bg.value }}
                    title={bg.name}
                  />
                ))}
              </div>
            </div>

            {/* Border toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-gray-700 font-medium">سجاوٹی بارڈر (Decorative Frame):</span>
              <button
                onClick={() => setHasBorder(!hasBorder)}
                className={`px-3 py-1 rounded-lg font-bold text-xs ${
                  hasBorder ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {hasBorder ? 'فعال (ON)' : 'بند (OFF)'}
              </button>
            </div>
          </div>
        </div>

        {/* Live Canvas / Card Preview Column */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="text-xs font-semibold text-gray-500 mb-2">
            لائیو پری ویو (Live Preview)
          </div>

          <div
            ref={previewCardRef}
            className={`w-full max-w-md rounded-2xl shadow-xl flex flex-col justify-between p-7 transition-all duration-300 relative select-none ${
              aspectRatio === '1:1'
                ? 'aspect-square'
                : aspectRatio === '4:5'
                ? 'aspect-[4/5]'
                : 'aspect-[9/16]'
            }`}
            style={{
              background: selectedBg,
              color: textColor,
            }}
          >
            {/* Ornamental Frame */}
            {hasBorder && (
              <div className="absolute inset-3 rounded-xl border border-white/20 pointer-events-none">
                <div className="absolute inset-1.5 rounded-lg border border-[#8CCF35]/40" />
              </div>
            )}

            {/* Top Logo / Decorative element */}
            <div className="flex items-center justify-between z-10 opacity-70">
              <div className="text-[10px] tracking-wider uppercase font-sans">
                Asaan Urdu
              </div>
              <div className="text-xs font-nastaliq">آسان اردو</div>
            </div>

            {/* Center Content */}
            <div
              className="my-auto z-10 px-2"
              dir="rtl"
              style={{ textAlign: textAlign }}
            >
              <div
                className="font-nastaliq leading-[2.4] whitespace-pre-line drop-shadow-xs"
                style={{
                  fontSize: `${fontSize}px`,
                  color: textColor,
                }}
              >
                {postText || 'یہاں اردو متن لکھیں'}
              </div>

              {authorName && (
                <div
                  className="font-nastaliq mt-3 text-sm font-semibold opacity-90"
                  style={{ color: textColor === '#ffffff' ? '#8CCF35' : '#145C3A' }}
                >
                  — {authorName}
                </div>
              )}
            </div>

            {/* Footer watermark */}
            <div className="flex items-center justify-center z-10 opacity-50 text-[10px] font-sans">
              Designed with Asaan Urdu Keyboard
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
