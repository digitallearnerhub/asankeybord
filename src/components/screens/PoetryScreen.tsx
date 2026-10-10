import React, { useState } from 'react';
import { SAMPLE_POETRY } from '../../data/sampleData';
import { PoetryItem } from '../../types';
import {
  Search,
  Bookmark,
  Share2,
  Copy,
  PenTool,
  Check,
  Heart,
} from 'lucide-react';

interface PoetryScreenProps {
  onBack: () => void;
  onSendToPostCreator: (text: string, poet: string) => void;
  onToggleFavorite: (id: string) => void;
  favorites: string[];
}

export const PoetryScreen: React.FC<PoetryScreenProps> = ({
  onBack,
  onSendToPostCreator,
  onToggleFavorite,
  favorites,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoet, setSelectedPoet] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const poets = [
    { id: 'all', name: 'تمام شعراء (All Poets)' },
    { id: 'اقبال', name: 'علامہ محمد اقبال' },
    { id: 'غالب', name: 'مرزا غالب' },
    { id: 'فیض', name: 'فیض احمد فیض' },
    { id: 'فراز', name: 'احمد فراز' },
  ];

  const filteredPoetry = SAMPLE_POETRY.filter((item) => {
    const matchesPoet =
      selectedPoet === 'all' || item.poet.includes(selectedPoet);
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.poet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.verses.some((v) => v.includes(searchQuery));
    return matchesPoet && matchesSearch;
  });

  const handleCopy = (item: PoetryItem) => {
    const text = `${item.verses.join('\n')}\n— ${item.poet}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (item: PoetryItem) => {
    const text = `${item.verses.join('\n')}\n— ${item.poet}`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      handleCopy(item);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>Urdu Ghazals & Poetry</span>
            <span className="text-sm font-nastaliq text-emerald-800">اردو غزلیں و شاعری</span>
          </h2>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Verified classical and modern Urdu poetry from renowned masters with correct Nastaliq calligraphy.
          </p>
        </div>
      </div>

      {/* Search and Poet Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="شعر یا شاعر تلاش کریں (Search verse, title, or poet)..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#145C3A] outline-none bg-white text-gray-900"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {poets.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPoet(p.id)}
              className={`px-3 py-1.5 text-xs rounded-xl font-nastaliq whitespace-nowrap transition-colors border ${
                selectedPoet === p.id
                  ? 'bg-[#145C3A] text-white border-[#145C3A] font-bold'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Poetry Feed */}
      <div className="space-y-4">
        {filteredPoetry.map((item) => {
          const isFav = favorites.includes(item.id);
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-xs hover:border-[#145C3A]/40 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900 font-nastaliq">
                    {item.poet}
                  </span>
                  <span className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-nastaliq">
                    {item.category}
                  </span>
                </div>
                <div className="text-xs text-gray-400 font-nastaliq">
                  {item.title}
                </div>
              </div>

              {/* Verses in Large Nastaliq */}
              <div
                className="my-3 text-center font-nastaliq text-lg sm:text-xl text-gray-900 leading-[2.6] space-y-1 select-text"
                dir="rtl"
              >
                {item.verses.map((verse, idx) => (
                  <p key={idx} className="tracking-wide">
                    {verse}
                  </p>
                ))}
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2 text-xs">
                <button
                  onClick={() => onToggleFavorite(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
                    isFav
                      ? 'bg-rose-50 text-rose-600 font-semibold'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500' : ''}`} />
                  <span className="font-nastaliq">پسندیدہ</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(item)}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="font-nastaliq">کاپی</span>
                  </button>

                  <button
                    onClick={() => handleShare(item)}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="font-nastaliq">شیئر</span>
                  </button>

                  <button
                    onClick={() => onSendToPostCreator(item.verses.join('\n'), item.poet)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#145C3A] hover:bg-[#0e432a] text-white rounded-lg font-medium shadow-xs transition-colors"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span className="font-nastaliq">پوسٹ بنائیں</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
