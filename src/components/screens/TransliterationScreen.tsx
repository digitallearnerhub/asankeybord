import React, { useState } from 'react';
import {
  transliterateRomanUrdu,
  getWordSuggestions,
  WORD_DICTIONARY,
  PHRASE_DICTIONARY,
} from '../../services/transliteration';
import {
  Languages,
  Copy,
  Share2,
  Trash2,
  Check,
  Sparkles,
  BookMarked,
  ArrowRightLeft,
  PenTool,
} from 'lucide-react';

interface TransliterationScreenProps {
  onBack: () => void;
  onSendToPostCreator: (text: string) => void;
  onSendToEditor: (text: string) => void;
}

export const TransliterationScreen: React.FC<TransliterationScreenProps> = ({
  onBack,
  onSendToPostCreator,
  onSendToEditor,
}) => {
  const [romanInput, setRomanInput] = useState('Assalam o alaikum! Aap kaise hain? Mujhe Urdu likhni hai.');
  const [urduOutput, setUrduOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [customWords, setCustomWords] = useState<{ roman: string; urdu: string }[]>([]);
  const [newRoman, setNewRoman] = useState('');
  const [newUrdu, setNewUrdu] = useState('');

  // Live conversion as user types
  React.useEffect(() => {
    const converted = transliterateRomanUrdu(romanInput);
    setUrduOutput(converted);
  }, [romanInput]);

  const samplePhrases = [
    'Assalam o alaikum',
    'Aap kaise hain?',
    'Mujhe Urdu likhni hai',
    'Pakistan hamara pyara mulk hai',
    'Allah ap ko khush rakhay',
    'App ka Saman agaya hai',
  ];

  const handleCopy = () => {
    if (!urduOutput) return;
    navigator.clipboard.writeText(urduOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (!urduOutput) return;
    if (navigator.share) {
      navigator.share({ text: urduOutput }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  const handleAddCustomWord = () => {
    if (!newRoman.trim() || !newUrdu.trim()) return;
    const cleanR = newRoman.trim().toLowerCase();
    const cleanU = newUrdu.trim();
    // Register into in-memory dictionary
    WORD_DICTIONARY[cleanR] = [cleanU];
    setCustomWords([...customWords, { roman: cleanR, urdu: cleanU }]);
    setNewRoman('');
    setNewUrdu('');
    // Re-run
    setUrduOutput(transliterateRomanUrdu(romanInput));
  };

  // Word token candidates for clickable interactive disambiguation
  const tokens = romanInput.split(/\s+/).filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>Roman Urdu to Nastaleeq Converter</span>
            <span className="text-sm font-nastaliq text-emerald-800">رومن اردو سے نستعلیق کنورٹر</span>
          </h2>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Rule-based phonetic mapper with context-aware vocabulary and multiple candidate suggestions.
          </p>
        </div>
      </div>

      {/* Quick Test Samples */}
      <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs">
        <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>آزمائشی جملے (Click sample to test):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {samplePhrases.map((phrase) => (
            <button
              key={phrase}
              onClick={() => setRomanInput(phrase)}
              className="px-2.5 py-1 text-xs bg-gray-50 hover:bg-emerald-50 hover:text-[#145C3A] text-gray-700 rounded-lg border border-gray-200 transition-colors font-sans"
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-side / Stacked Conversion Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Roman Urdu Input */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-700">
                1. رومن اردو ان پٹ (Roman Urdu Input)
              </label>
              <button
                onClick={() => setRomanInput('')}
                className="text-[11px] text-gray-400 hover:text-red-600"
              >
                صاف کریں
              </button>
            </div>
            <textarea
              value={romanInput}
              onChange={(e) => setRomanInput(e.target.value)}
              rows={6}
              placeholder="Type in Roman Urdu here (e.g. Aap kaise hain, kya haal hai)..."
              className="w-full p-3 text-sm font-sans rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#145C3A] outline-none bg-[#F7F9F5] text-gray-900"
            />
          </div>

          <div className="mt-3 pt-2 border-t border-gray-100 text-xs text-gray-500">
            لائیو ٹرانسلیٹریشن خودکار طور پر کام کر رہی ہے
          </div>
        </div>

        {/* Nastaleeq Urdu Result */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-emerald-900 font-nastaliq">
                2. نستعلیق اردو نتیجہ (Nastaleeq Urdu Output)
              </label>
              <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                Auto-converted
              </span>
            </div>
            <textarea
              dir="rtl"
              value={urduOutput}
              onChange={(e) => setUrduOutput(e.target.value)}
              rows={6}
              className="w-full p-3 text-lg font-nastaliq rounded-xl border border-emerald-300 focus:ring-2 focus:ring-[#145C3A] outline-none bg-emerald-50/20 text-gray-900 leading-loose"
            />
          </div>

          <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
            <div className="flex gap-1.5">
              <button
                onClick={handleCopy}
                disabled={!urduOutput}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 text-xs font-medium rounded-lg flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="font-nastaliq">کاپی</span>
              </button>
              <button
                onClick={handleShare}
                disabled={!urduOutput}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 text-xs font-medium rounded-lg flex items-center gap-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="font-nastaliq">شیئر</span>
              </button>
            </div>

            <div className="flex gap-1.5">
              <button
                onClick={() => onSendToEditor(urduOutput)}
                disabled={!urduOutput}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-800 text-xs font-medium rounded-lg font-nastaliq"
              >
                ایڈیٹر
              </button>
              <button
                onClick={() => onSendToPostCreator(urduOutput)}
                disabled={!urduOutput}
                className="px-3 py-1.5 bg-[#145C3A] hover:bg-[#0e432a] disabled:opacity-40 text-white text-xs font-semibold rounded-lg font-nastaliq shadow-xs"
              >
                پوسٹ میکر
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Disambiguation & Word Candidates Inspector */}
      {tokens.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <div className="text-xs font-bold text-gray-800 mb-2">
            الفاظ کا تفصیلی جائزہ اور متبادل تجاویز (Word Suggestions & Disambiguation):
          </div>
          <div className="flex flex-wrap gap-2">
            {tokens.map((token, i) => {
              const suggestions = getWordSuggestions(token);
              return (
                <div
                  key={`${token}-${i}`}
                  className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-xs flex flex-col gap-1"
                >
                  <span className="font-mono text-gray-500 font-semibold">{token}:</span>
                  <div className="flex gap-1">
                    {suggestions.slice(0, 3).map((sug, sIdx) => (
                      <button
                        key={`${sug}-${sIdx}`}
                        onClick={() => {
                          // Replace in output
                          setUrduOutput((prev) => prev + ' ' + sug);
                        }}
                        className="px-2 py-0.5 rounded bg-white hover:bg-emerald-100 border border-gray-200 text-emerald-900 font-nastaliq text-xs transition-colors"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Vocabulary Dictionary Manager */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <BookMarked className="w-4 h-4 text-[#145C3A]" />
          <h3 className="text-sm font-bold text-gray-900">
            ذاتی لغت میں نیا لفظ شامل کریں (Custom Vocabulary Mapping)
          </h3>
        </div>
        <p className="text-xs text-gray-500">
          اگر آپ کسی خاص نام یا لفظ کا مخصوص اردو املا چاہتے ہیں تو یہاں شامل کریں:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="Roman Urdu (e.g. zeeshan, multan)..."
            value={newRoman}
            onChange={(e) => setNewRoman(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-[#145C3A]"
          />
          <input
            type="text"
            dir="rtl"
            placeholder="اردو املا (e.g. ذیشان، ملتان)..."
            value={newUrdu}
            onChange={(e) => setNewUrdu(e.target.value)}
            className="px-3 py-2 text-sm font-nastaliq rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-[#145C3A]"
          />
          <button
            onClick={handleAddCustomWord}
            disabled={!newRoman.trim() || !newUrdu.trim()}
            className="px-4 py-2 bg-[#145C3A] hover:bg-[#0e432a] disabled:opacity-40 text-white text-xs font-semibold rounded-xl font-nastaliq transition-colors"
          >
            لغت میں شامل کریں
          </button>
        </div>

        {customWords.length > 0 && (
          <div className="pt-2 flex flex-wrap gap-2">
            {customWords.map((cw, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 font-mono"
              >
                <span>{cw.roman}</span>
                <span>→</span>
                <span className="font-nastaliq font-bold">{cw.urdu}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
