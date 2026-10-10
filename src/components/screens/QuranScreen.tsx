import React, { useState } from 'react';
import { SAMPLE_QURAN_VERSES } from '../../data/sampleData';
import { QuranVerse } from '../../types';
import {
  Search,
  Copy,
  Share2,
  Check,
  BookOpen,
  Volume2,
  Bookmark,
  ShieldCheck,
} from 'lucide-react';

interface QuranScreenProps {
  onBack: () => void;
  onSendToPostCreator: (text: string, ref: string) => void;
}

export const QuranScreen: React.FC<QuranScreenProps> = ({
  onBack,
  onSendToPostCreator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const filteredVerses = SAMPLE_QURAN_VERSES.filter((v) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      v.surahNameArabic.includes(q) ||
      v.surahNameEnglish.toLowerCase().includes(q) ||
      v.surahNumber.toString() === q ||
      v.arabicText.includes(q) ||
      v.urduTranslation.includes(q)
    );
  });

  const handleCopy = (verse: QuranVerse) => {
    const text = `${verse.arabicText}\n\nترجمہ: ${verse.urduTranslation}\n[سورۃ ${verse.surahNameArabic} (${verse.surahNameEnglish})، آیت: ${verse.ayahNumber} - ترجمہ: ${verse.translator}]`;
    navigator.clipboard.writeText(text);
    setCopiedId(verse.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (verse: QuranVerse) => {
    const text = `${verse.arabicText}\n\nترجمہ: ${verse.urduTranslation}\n[سورۃ ${verse.surahNameArabic} (${verse.surahNameEnglish}) - ترجمہ: ${verse.translator}]`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      handleCopy(verse);
    }
  };

  const toggleSimulatedAudio = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      setTimeout(() => setPlayingId(null), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>Search Quran Ayat</span>
            <span className="text-sm font-nastaliq text-emerald-800">تلاش قرآنی آیات و اردو ترجمہ</span>
          </h2>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Verified Arabic Uthmani text with authentic Urdu translation by Maulana Fateh Muhammad Jalandhari.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 text-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>مصدقہ متن و ترجمہ</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="سورۃ کا نام، نمبر، یا لفظ تلاش کریں (e.g. Fatiha, اخلاص, 1, نور, صبر)..."
          className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#145C3A] outline-none bg-white text-gray-900"
        />
      </div>

      {/* Verses List */}
      <div className="space-y-4">
        {filteredVerses.map((verse) => (
          <div
            key={verse.id}
            className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            {/* Verse Header Badge */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#145C3A] text-white flex items-center justify-center font-mono text-xs font-bold">
                  {verse.surahNumber}
                </span>
                <div>
                  <div className="text-sm font-bold font-arabic text-gray-900">
                    سُورَةُ {verse.surahNameArabic}
                  </div>
                  <div className="text-[11px] text-gray-500 font-sans">
                    {verse.surahNameEnglish} · آیت {verse.ayahNumber}
                  </div>
                </div>
              </div>

              <button
                onClick={() => toggleSimulatedAudio(verse.id)}
                className={`p-2 rounded-xl transition-colors ${
                  playingId === verse.id
                    ? 'bg-emerald-100 text-[#145C3A]'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="تلاوت سنیں"
              >
                <Volume2 className={`w-4 h-4 ${playingId === verse.id ? 'animate-pulse' : ''}`} />
              </button>
            </div>

            {/* Arabic Uthmani Text */}
            <div
              className="my-3 font-arabic text-xl sm:text-2xl text-emerald-950 text-center leading-[2.4] select-text px-2"
              dir="rtl"
            >
              {verse.arabicText}
            </div>

            {/* Urdu Translation */}
            <div
              className="my-3 font-nastaliq text-base sm:text-lg text-gray-800 text-center leading-[2.4] select-text px-2 border-t border-gray-100 pt-3"
              dir="rtl"
            >
              <div className="text-xs text-gray-400 font-sans mb-1 text-center">
                اردو ترجمہ (مترجم: {verse.translator}):
              </div>
              {verse.urduTranslation}
            </div>

            {/* Actions Toolbar */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2 text-xs">
              <div className="text-[11px] text-gray-400 font-sans">
                Source: Tanzil Verified Quranic Text & Translation
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopy(verse)}
                  className="flex items-center gap-1 px-3 py-1.5 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {copiedId === verse.id ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span className="font-nastaliq">کاپی</span>
                </button>

                <button
                  onClick={() => handleShare(verse)}
                  className="flex items-center gap-1 px-3 py-1.5 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="font-nastaliq">شیئر</span>
                </button>

                <button
                  onClick={() =>
                    onSendToPostCreator(
                      `${verse.arabicText}\n\n${verse.urduTranslation}`,
                      `سورۃ ${verse.surahNameArabic}`
                    )
                  }
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#145C3A] hover:bg-[#0e432a] text-white rounded-lg font-medium shadow-xs transition-colors"
                >
                  <span className="font-nastaliq">پوسٹ بنائیں</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
