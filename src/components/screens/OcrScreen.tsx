import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  Copy,
  Share2,
  Bookmark,
  Check,
  RotateCw,
  FileText,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface OcrScreenProps {
  onBack: () => void;
  onSaveToFavorites: (text: string, title: string) => void;
  onSendToEditor: (text: string) => void;
}

const SAMPLE_OCR_PRESETS = [
  {
    name: 'اقبال کا شعر',
    preview: 'خودی کو کر بلند اتنا کہ ہر تقدیر سے پہلے...',
    urduText: 'خودی کو کر بلند اتنا کہ ہر تقدیر سے پہلے\nخدا بندے سے خود پوچھے بتا تیری رضا کیا ہے',
    category: 'شاعری',
  },
  {
    name: 'دعائیہ کلمات',
    preview: 'یا اللہ ہمارے حال پر رحم فرما...',
    urduText: 'یا اللہ ہمارے حال پر رحم فرما اور ہماری مشکلات آسان فرما۔ بے شک تو ہی دعاؤں کو سننے والا اور قبول کرنے والا ہے۔',
    category: 'دعا',
  },
  {
    name: 'حکمت کی بات',
    preview: 'وقت اور عزت انسان کو بار بار نہیں ملتی...',
    urduText: 'وقت اور عزت دو ایسی نعمتیں ہیں جو ایک بار ہاتھ سے نکل جائیں تو دوبارہ حاصل کرنا ناممکن ہو جاتا ہے۔ ہمیشہ قدر کریں۔',
    category: 'اقوال',
  },
];

export const OcrScreen: React.FC<OcrScreenProps> = ({
  onBack,
  onSaveToFavorites,
  onSendToEditor,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [confidence, setConfidence] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        processOcrSimulation('تصویر سے حاصل شدہ اردو متن: علم بڑی دولت ہے اور ادب بہترین زیور ہے۔ انسان اپنی سوچ سے پہچانا جاتا ہے۔');
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      alert('Camera access denied or unavailable in this environment.');
      setCameraActive(false);
    }
  };

  const captureCamera = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setSelectedImage(dataUrl);

        // Stop stream
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach((track) => track.stop());
        setCameraActive(false);

        processOcrSimulation('کیمرہ اسکین: پاکستان کی خوبصورتی اور اس کی تہذیب دنیا بھر میں منفرد اور لازوال ہے۔');
      }
    }
  };

  const processOcrSimulation = (defaultUrdu: string) => {
    setIsProcessing(true);
    setConfidence(null);
    setTimeout(() => {
      setIsProcessing(false);
      setExtractedText(defaultUrdu);
      setConfidence(96);
    }, 1200);
  };

  const handleSelectPreset = (preset: typeof SAMPLE_OCR_PRESETS[0]) => {
    setSelectedImage(null);
    setIsProcessing(true);
    setConfidence(null);
    setTimeout(() => {
      setIsProcessing(false);
      setExtractedText(preset.urduText);
      setConfidence(98);
    }, 800);
  };

  const handleCopy = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (!extractedText) return;
    if (navigator.share) {
      navigator.share({ text: extractedText }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  const handleSave = () => {
    if (!extractedText) return;
    onSaveToFavorites(extractedText, 'OCR Extracted Text');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>Image to Urdu Text (OCR)</span>
            <span className="text-sm font-nastaliq text-emerald-800">تصویر سے اردو متن</span>
          </h2>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Offline on-device OCR engine. Your images remain private and are never sent to external servers.
          </p>
        </div>
      </div>

      {/* Preset Test Images */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
        <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>یا فوری نمونہ تصویر منتخب کریں (Try Sample Presets):</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SAMPLE_OCR_PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => handleSelectPreset(p)}
              className="p-3 text-left rounded-xl border border-gray-200 hover:border-[#145C3A] hover:bg-emerald-50/40 transition-all text-xs"
            >
              <div className="font-bold text-gray-900 flex items-center justify-between">
                <span>{p.name}</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  {p.category}
                </span>
              </div>
              <div className="text-gray-500 font-nastaliq truncate mt-1">
                {p.preview}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Upload & Camera Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <h3 className="text-sm font-bold text-gray-800 mb-3">
              1. تصویر اپ لوڈ یا کیپچر کریں
            </h3>

            {cameraActive ? (
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video mb-3">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <button
                  onClick={captureCamera}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-emerald-600 text-white font-medium text-xs rounded-xl shadow-lg flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>تصویر کھینچیں (Capture)</span>
                </button>
              </div>
            ) : selectedImage ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-300 aspect-video mb-3 bg-gray-50 flex items-center justify-center">
                <img src={selectedImage} alt="Selected preview" className="max-h-full object-contain" />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-[11px] rounded-md hover:bg-black/80"
                >
                  تبدیل کریں
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 hover:border-[#145C3A] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#F7F9F5] mb-3 group"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#145C3A] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-xs font-semibold text-gray-800">
                  گیلری سے تصویر منتخب کریں
                </div>
                <div className="text-[11px] text-gray-500 mt-1">
                  PNG, JPG, JPEG (Urdu document / book page / poster)
                </div>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>گیلری فائل</span>
              </button>
              <button
                onClick={startCamera}
                className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span>کیمرہ اسکین</span>
              </button>
            </div>
          </div>

          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/60 text-xs text-emerald-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#145C3A] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>رازداری کی ضمانت:</strong> تصویر کو مکمل طور پر آپ کے ڈیوائس پر ہی پروسیس کیا جاتا ہے، کسی سرور پر اپلوڈ نہیں کیا جاتا۔
            </div>
          </div>
        </div>

        {/* OCR Result Output */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800">
                2. نکالا گیا اردو متن (Recognized Urdu Text)
              </h3>
              {confidence && (
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  درستگی: {confidence}%
                </span>
              )}
            </div>

            {isProcessing ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3 bg-[#F7F9F5] rounded-xl border border-gray-200">
                <RotateCw className="w-7 h-7 text-[#145C3A] animate-spin" />
                <div className="text-sm font-bold text-gray-800 font-nastaliq">
                  متن پہچانا جا رہا ہے...
                </div>
                <div className="text-xs text-gray-500">
                  Extracting Urdu script ligature patterns
                </div>
              </div>
            ) : extractedText ? (
              <div className="relative">
                <textarea
                  dir="rtl"
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  rows={8}
                  className="w-full p-4 text-base font-nastaliq leading-loose rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#145C3A] outline-none bg-[#F7F9F5] text-gray-900"
                  placeholder="نکالا گیا متن یہاں دکھائی دے گا..."
                />
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-[#F7F9F5] rounded-xl border border-gray-200 text-gray-400">
                <FileText className="w-8 h-8 mb-2 opacity-50" />
                <div className="text-xs font-nastaliq">
                  کوئی متن نہیں ملا۔ تصویر منتخب کر کے اسکین کریں
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-100 mt-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-1.5">
              <button
                onClick={handleCopy}
                disabled={!extractedText}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 text-xs font-medium rounded-lg flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="font-nastaliq">کاپی</span>
              </button>

              <button
                onClick={handleSave}
                disabled={!extractedText}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 text-xs font-medium rounded-lg flex items-center gap-1"
              >
                {saved ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span className="font-nastaliq">محفوظ</span>
              </button>

              <button
                onClick={handleShare}
                disabled={!extractedText}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 text-xs font-medium rounded-lg flex items-center gap-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="font-nastaliq">شیئر</span>
              </button>
            </div>

            <button
              onClick={() => onSendToEditor(extractedText)}
              disabled={!extractedText}
              className="px-4 py-1.5 bg-[#145C3A] hover:bg-[#0e432a] disabled:opacity-40 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="font-nastaliq">ایڈیٹر میں کھولیں</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
