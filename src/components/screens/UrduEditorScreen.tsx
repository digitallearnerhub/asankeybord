import React, { useState } from 'react';
import {
  Copy,
  Share2,
  Trash2,
  Undo2,
  Redo2,
  Save,
  FolderOpen,
  Check,
  ZoomIn,
  ZoomOut,
  PenTool,
  Keyboard,
} from 'lucide-react';

interface UrduEditorScreenProps {
  onBack: () => void;
  initialText?: string;
  onOpenKeyboard: () => void;
  onSendToPostCreator: (text: string) => void;
}

interface SavedDoc {
  id: string;
  title: string;
  content: string;
  timestamp: number;
}

export const UrduEditorScreen: React.FC<UrduEditorScreenProps> = ({
  onBack,
  initialText = '',
  onOpenKeyboard,
  onSendToPostCreator,
}) => {
  const [content, setContent] = useState(
    initialText ||
      'بسم اللہ الرحمٰن الرحیم\n\nاردو ہماری قومی زبان اور تہذیبی ورثہ ہے۔ آسان اردو کی بورڈ کے ذریعے آپ روانی سے نستعلیق تحریر، مضامین، خطوط اور کلام تحریر کر سکتے ہیں۔'
  );
  const [history, setHistory] = useState<string[]>([content]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savedDocs, setSavedDocs] = useState<SavedDoc[]>([
    {
      id: '1',
      title: 'خوش آمدید نوٹ',
      content:
        'آسان اردو کی بورڈ میں خوش آمدید۔ آپ یہاں اپنی تمام اردو تحریریں بغیر کسی دشواری کے ٹائپ اور محفوظ کر سکتے ہیں۔',
      timestamp: Date.now() - 3600000,
    },
  ]);
  const [showSavedModal, setShowSavedModal] = useState(false);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const lineCount = content ? content.split('\n').length : 0;

  const updateContentWithHistory = (newVal: string) => {
    setContent(newVal);
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(newVal);
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setContent(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setContent(history[historyIndex + 1]);
    }
  };

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (!content) return;
    if (navigator.share) {
      navigator.share({ text: content }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  const handleSaveDoc = () => {
    const title = content.split('\n')[0]?.substring(0, 30) || 'غیر عنوان شدہ تحریر';
    const newDoc: SavedDoc = {
      id: Date.now().toString(),
      title,
      content,
      timestamp: Date.now(),
    };
    setSavedDocs([newDoc, ...savedDocs]);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-20">
      {/* Editor Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>Urdu Text Editor</span>
            <span className="text-sm font-nastaliq text-emerald-800">اردو ایڈیٹر</span>
          </h2>
          <div className="flex items-center gap-3 text-xs text-gray-500 font-mono mt-0.5">
            <span>الفاظ: {wordCount}</span>
            <span>·</span>
            <span>حروف: {charCount}</span>
            <span>·</span>
            <span>سطور: {lineCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSendToPostCreator(content)}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <PenTool className="w-3.5 h-3.5 text-[#145C3A]" />
            <span className="font-nastaliq">پوسٹ بنائیں</span>
          </button>
          <button
            onClick={handleSaveDoc}
            className="px-3.5 py-1.5 bg-[#145C3A] hover:bg-[#0f482d] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5 text-[#8CCF35]" /> : <Save className="w-3.5 h-3.5" />}
            <span className="font-nastaliq">محفوظ کریں</span>
          </button>
        </div>
      </div>

      {/* Editor Toolbar */}
      <div className="bg-white p-2.5 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-1.5 text-gray-600 hover:text-gray-900 disabled:opacity-30 rounded-lg hover:bg-gray-100"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 text-gray-600 hover:text-gray-900 disabled:opacity-30 rounded-lg hover:bg-gray-100"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <button
            onClick={() => setFontSize((prev) => Math.min(prev + 2, 32))}
            className="p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            title="Increase Font Size"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setFontSize((prev) => Math.max(prev - 2, 14))}
            className="p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            title="Decrease Font Size"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-500 font-mono px-1">{fontSize}px</span>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <button
            onClick={onOpenKeyboard}
            className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-[#145C3A] rounded-lg border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>کی بورڈ</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSavedModal(true)}
            className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>دستاویزات ({savedDocs.length})</span>
          </button>
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>کاپی</span>
          </button>
          <button
            onClick={handleShare}
            className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>شیئر</span>
          </button>
          <button
            onClick={() => updateContentWithHistory('')}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Textarea Area */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4 relative">
        <textarea
          dir="rtl"
          value={content}
          onChange={(e) => updateContentWithHistory(e.target.value)}
          rows={16}
          className="w-full font-nastaliq leading-[2.4] outline-none bg-transparent resize-y text-gray-900 placeholder:text-gray-400"
          style={{ fontSize: `${fontSize}px` }}
          placeholder="یہاں اردو تحریر شروع کریں..."
        />
      </div>

      {/* Saved Documents Modal */}
      {showSavedModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">
                محفوظ شدہ دستاویزات (Saved Documents)
              </h3>
              <button
                onClick={() => setShowSavedModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                بند کریں
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {savedDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-xl border border-gray-200 hover:border-[#145C3A] hover:bg-emerald-50/30 transition-all flex items-center justify-between cursor-pointer"
                  onClick={() => {
                    setContent(doc.content);
                    setShowSavedModal(false);
                  }}
                >
                  <div className="text-right flex-1 truncate ml-2" dir="rtl">
                    <div className="font-nastaliq font-bold text-gray-900 text-sm truncate">
                      {doc.title}
                    </div>
                    <div className="text-[11px] text-gray-500 font-sans mt-0.5">
                      {new Date(doc.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="text-xs text-[#145C3A] font-semibold shrink-0">
                    کھولیں
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
