import React, { useState } from 'react';
import { SavedSnippet } from '../../types';
import {
  Copy,
  Trash2,
  Pin,
  Plus,
  Check,
  ShieldAlert,
  Search,
} from 'lucide-react';

interface ClipboardScreenProps {
  onBack: () => void;
  snippets: SavedSnippet[];
  onAddSnippet: (text: string, category: string) => void;
  onDeleteSnippet: (id: string) => void;
  onTogglePin: (id: string) => void;
  onClearAll: () => void;
  onSendToEditor: (text: string) => void;
}

export const ClipboardScreen: React.FC<ClipboardScreenProps> = ({
  onBack,
  snippets,
  onAddSnippet,
  onDeleteSnippet,
  onTogglePin,
  onClearAll,
  onSendToEditor,
}) => {
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState('عام');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [search, setSearch] = useState('');

  const categories = ['all', 'عام', 'اسلامی', 'دفتری', 'شاعری'];

  const handleAdd = () => {
    if (!newText.trim()) return;
    onAddSnippet(newText.trim(), newCategory);
    setNewText('');
  };

  const handleCopy = (snip: SavedSnippet) => {
    navigator.clipboard.writeText(snip.text);
    setCopiedId(snip.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSnippets = snippets.filter((s) => {
    const matchesCat = filterCategory === 'all' || s.category === filterCategory;
    const matchesSearch = s.text.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>Clipboard Manager</span>
            <span className="text-sm font-nastaliq text-emerald-800">کلپ بورڈ مینیجر</span>
          </h2>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Store and pin your frequently used Urdu phrases and greetings.
          </p>
        </div>

        {snippets.length > 0 && (
          <button
            onClick={onClearAll}
            className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            تمام صاف کریں (Clear All)
          </button>
        )}
      </div>

      {/* Privacy Notice Banner */}
      <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200/70 text-xs text-emerald-900 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-[#145C3A] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>رازداری کی وضاحت:</strong> اینڈرائیڈ سکیورٹی پالیسی کے مطابق دیگر ایپس کا کلپ بورڈ پس منظر میں مانیٹر نہیں کیا جاتا۔ یہاں صرف وہی جملے محفوظ ہوتے ہیں جو آپ خود شامل کرتے ہیں۔
        </div>
      </div>

      {/* Add New Snippet Form */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
        <label className="block text-xs font-bold text-gray-800">
          نیا محفوظ جملہ شامل کریں (Add New Snippet)
        </label>
        <textarea
          dir="rtl"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          rows={2}
          placeholder="یہاں بار بار استعمال ہونے والا اردو جملہ لکھیں..."
          className="w-full p-3 text-sm font-nastaliq rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#145C3A] outline-none bg-[#F7F9F5] text-gray-900"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">زمرہ:</span>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 outline-none"
            >
              <option value="عام">عام</option>
              <option value="اسلامی">اسلامی</option>
              <option value="دفتری">دفتری</option>
              <option value="شاعری">شاعری</option>
            </select>
          </div>

          <button
            onClick={handleAdd}
            disabled={!newText.trim()}
            className="px-4 py-1.5 bg-[#145C3A] hover:bg-[#0e432a] disabled:opacity-40 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="font-nastaliq">شامل کریں</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="محفوظ جملے تلاش کریں..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#145C3A] outline-none bg-white text-gray-900"
          />
        </div>

        <div className="flex gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCategory(c)}
              className={`px-3 py-1.5 text-xs rounded-xl font-nastaliq border transition-colors ${
                filterCategory === c
                  ? 'bg-[#145C3A] text-white border-[#145C3A]'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {c === 'all' ? 'تمام' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Snippets List */}
      <div className="space-y-3">
        {filteredSnippets.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-gray-400 font-nastaliq">
            کوئی جملہ موجود نہیں۔ اوپر نیا جملہ شامل کریں۔
          </div>
        ) : (
          filteredSnippets.map((snip) => (
            <div
              key={snip.id}
              className={`bg-white rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                snip.isPinned ? 'border-[#8CCF35] bg-emerald-50/20' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div
                  className="font-nastaliq text-base text-gray-900 leading-loose flex-1"
                  dir="rtl"
                >
                  {snip.text}
                </div>

                <button
                  onClick={() => onTogglePin(snip.id)}
                  className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                    snip.isPinned
                      ? 'text-[#145C3A] bg-emerald-100'
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                  title={snip.isPinned ? 'Unpin' : 'Pin to top'}
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                <span className="text-[11px] font-nastaliq text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {snip.category}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(snip)}
                    className="flex items-center gap-1 px-2.5 py-1 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {copiedId === snip.id ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span className="font-nastaliq">کاپی</span>
                  </button>

                  <button
                    onClick={() => onSendToEditor(snip.text)}
                    className="px-2.5 py-1 text-[#145C3A] hover:bg-emerald-50 rounded-lg font-nastaliq transition-colors"
                  >
                    ایڈیٹر
                  </button>

                  <button
                    onClick={() => onDeleteSnippet(snip.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
