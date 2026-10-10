import React, { useState } from 'react';
import { SAMPLE_BOOKS } from '../../data/sampleData';
import { UrduBook } from '../../types';
import {
  BookOpen,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Bookmark,
  Share2,
  Copy,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface BooksScreenProps {
  onBack: () => void;
  onSendToEditor: (text: string) => void;
}

export const BooksScreen: React.FC<BooksScreenProps> = ({
  onBack,
  onSendToEditor,
}) => {
  const [activeBook, setActiveBook] = useState<UrduBook | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState(20);
  const [isNightMode, setIsNightMode] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>Urdu Books Library</span>
            <span className="text-sm font-nastaliq text-emerald-800">اردو کتب خانہ</span>
          </h2>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Public-domain masterpieces of Urdu literature with a distraction-free Nastaliq reader mode.
          </p>
        </div>

        {activeBook && (
          <button
            onClick={() => setActiveBook(null)}
            className="px-3 py-1.5 text-xs font-semibold text-[#145C3A] bg-emerald-50 hover:bg-emerald-100 rounded-xl flex items-center gap-1 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span className="font-nastaliq">کتب کی فہرست</span>
          </button>
        )}
      </div>

      {/* Book Grid / Shelf View */}
      {!activeBook ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {SAMPLE_BOOKS.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md hover:border-[#145C3A]/50 transition-all flex flex-col justify-between"
            >
              {/* Decorative Book Cover Header */}
              <div
                className="p-6 text-white text-center flex flex-col items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: book.coverColor }}
              >
                <div className="absolute inset-2 border border-white/20 rounded-lg pointer-events-none" />
                <BookOpen className="w-8 h-8 mb-2 opacity-80" />
                <h3 className="text-lg font-bold font-nastaliq tracking-wide">
                  {book.title}
                </h3>
                <div className="text-xs opacity-90 font-nastaliq mt-1">
                  {book.author}
                </div>
                <div className="text-[10px] font-mono opacity-70 mt-1">
                  اشاعت: {book.year}
                </div>
              </div>

              {/* Description & Action */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-gray-600 font-nastaliq leading-relaxed line-clamp-3 mb-4">
                  {book.description}
                </p>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-mono">
                    {book.chapters.length} ابواب
                  </span>
                  <button
                    onClick={() => {
                      setActiveBook(book);
                      setActiveChapterIndex(0);
                    }}
                    className="px-3 py-1.5 bg-[#145C3A] hover:bg-[#0e432a] text-white text-xs font-semibold rounded-lg font-nastaliq transition-colors shadow-xs"
                  >
                    مطالعہ شروع کریں
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Active Reader Mode */
        <div
          className={`rounded-2xl border shadow-sm p-6 space-y-4 transition-colors ${
            isNightMode
              ? 'bg-[#1a202c] border-gray-700 text-gray-100'
              : 'bg-[#FCFBF7] border-amber-200 text-gray-900'
          }`}
        >
          {/* Reader Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-200/50">
            <div>
              <div className="text-xs opacity-60 font-mono">
                {activeBook.title} — {activeBook.author}
              </div>
              <h3 className="text-lg font-bold font-nastaliq text-emerald-800 dark:text-emerald-400">
                {activeBook.chapters[activeChapterIndex]?.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsNightMode(!isNightMode)}
                className="px-2.5 py-1 text-xs rounded-lg border border-gray-300 font-sans"
              >
                {isNightMode ? 'Light Mode' : 'Night Mode'}
              </button>

              <button
                onClick={() => setFontSize((prev) => Math.max(prev - 2, 16))}
                className="p-1.5 rounded-lg border border-gray-300"
                title="Decrease font"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setFontSize((prev) => Math.min(prev + 2, 34))}
                className="p-1.5 rounded-lg border border-gray-300"
                title="Increase font"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono">{fontSize}px</span>

              <button
                onClick={() =>
                  onSendToEditor(activeBook.chapters[activeChapterIndex]?.content || '')
                }
                className="px-2.5 py-1 text-xs bg-[#145C3A] text-white rounded-lg font-nastaliq"
              >
                ایڈیٹر میں کاپی
              </button>
            </div>
          </div>

          {/* Reader Text Area */}
          <div
            className="my-6 p-4 rounded-xl leading-[2.6] font-nastaliq text-center select-text"
            dir="rtl"
            style={{ fontSize: `${fontSize}px` }}
          >
            {activeBook.chapters[activeChapterIndex]?.content.split('\n\n').map((para, i) => (
              <p key={i} className="mb-6">
                {para}
              </p>
            ))}
          </div>

          {/* Chapter Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
            <button
              onClick={() => setActiveChapterIndex((prev) => Math.max(prev - 1, 0))}
              disabled={activeChapterIndex <= 0}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium disabled:opacity-30 flex items-center gap-1"
            >
              <ChevronRight className="w-4 h-4" />
              <span className="font-nastaliq">پچھلا باب</span>
            </button>

            <span className="text-xs font-mono opacity-60">
              باب {activeChapterIndex + 1} از {activeBook.chapters.length}
            </span>

            <button
              onClick={() =>
                setActiveChapterIndex((prev) =>
                  Math.min(prev + 1, activeBook.chapters.length - 1)
                )
              }
              disabled={activeChapterIndex >= activeBook.chapters.length - 1}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium disabled:opacity-30 flex items-center gap-1"
            >
              <span className="font-nastaliq">اگلا باب</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
