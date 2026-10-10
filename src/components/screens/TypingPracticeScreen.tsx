import React, { useState, useEffect } from 'react';
import { TYPING_PRACTICE_LESSONS } from '../../data/sampleData';
import { KeyboardTheme, KeyboardSettings } from '../../types';
import { VirtualKeyboard } from '../keyboard/VirtualKeyboard';
import {
  Activity,
  RotateCcw,
  CheckCircle2,
  Trophy,
  Timer,
  Zap,
  Target,
} from 'lucide-react';

interface TypingPracticeScreenProps {
  onBack: () => void;
  theme: KeyboardTheme;
  settings: KeyboardSettings;
  onUpdateSettings: (updater: (prev: KeyboardSettings) => KeyboardSettings) => void;
}

export const TypingPracticeScreen: React.FC<TypingPracticeScreenProps> = ({
  onBack,
  theme,
  settings,
  onUpdateSettings,
}) => {
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const activeLesson = TYPING_PRACTICE_LESSONS[selectedLessonIndex];

  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true);

  // Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (startTime && !isCompleted) {
      timer = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime, isCompleted]);

  const handleInputChange = (text: string) => {
    if (!startTime) {
      setStartTime(Date.now());
    }
    setUserInput(text);

    if (text === activeLesson.targetText) {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setUserInput('');
    setStartTime(null);
    setElapsedSeconds(0);
    setIsCompleted(false);
  };

  // Accuracy and stats calculation
  let correctChars = 0;
  let incorrectChars = 0;
  for (let i = 0; i < userInput.length; i++) {
    if (i < activeLesson.targetText.length) {
      if (userInput[i] === activeLesson.targetText[i]) {
        correctChars++;
      } else {
        incorrectChars++;
      }
    }
  }

  const accuracy =
    userInput.length > 0
      ? Math.max(0, Math.round((correctChars / userInput.length) * 100))
      : 100;

  const wordsTyped = userInput.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(elapsedSeconds / 60, 0.05);
  const wpm = startTime ? Math.round(wordsTyped / minutes) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>Urdu Typing Practice</span>
            <span className="text-sm font-nastaliq text-emerald-800">اردو ٹائپنگ مشق و ٹیسٹ</span>
          </h2>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Boost your Urdu typing speed and accuracy with guided exercises and live WPM analysis.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center gap-1.5 transition-colors font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>دوبارہ شروع کریں</span>
        </button>
      </div>

      {/* Lesson Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TYPING_PRACTICE_LESSONS.map((lesson, idx) => (
          <button
            key={lesson.id}
            onClick={() => {
              setSelectedLessonIndex(idx);
              handleReset();
            }}
            className={`px-3 py-2 rounded-xl text-left border transition-all shrink-0 ${
              selectedLessonIndex === idx
                ? 'bg-[#145C3A] text-white border-[#145C3A] shadow-xs'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="text-xs font-bold font-nastaliq">{lesson.level}</div>
            <div
              className={`text-[10px] font-sans truncate ${
                selectedLessonIndex === idx ? 'text-emerald-100' : 'text-gray-500'
              }`}
            >
              {lesson.description}
            </div>
          </button>
        ))}
      </div>

      {/* Real-time Stats Strip */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-xs text-center">
          <div className="flex items-center justify-center text-emerald-600 mb-1">
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold font-mono text-gray-900">{wpm}</div>
          <div className="text-[11px] text-gray-500 font-sans">WPM (رفتار)</div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-xs text-center">
          <div className="flex items-center justify-center text-blue-600 mb-1">
            <Target className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold font-mono text-gray-900">{accuracy}%</div>
          <div className="text-[11px] text-gray-500 font-sans">درستگی (Accuracy)</div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-xs text-center">
          <div className="flex items-center justify-center text-amber-600 mb-1">
            <Timer className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold font-mono text-gray-900">{elapsedSeconds}s</div>
          <div className="text-[11px] text-gray-500 font-sans">وقت (Time)</div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-xs text-center">
          <div className="flex items-center justify-center text-rose-600 mb-1">
            <Activity className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold font-mono text-gray-900">{incorrectChars}</div>
          <div className="text-[11px] text-gray-500 font-sans">غلطیاں (Errors)</div>
        </div>
      </div>

      {/* Target Urdu Text Display Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs text-center space-y-4">
        <div className="text-xs text-gray-400 font-sans">
          مطلوبہ اردو متن (Type this text below):
        </div>

        <div
          className="font-nastaliq text-2xl sm:text-3xl text-emerald-950 leading-[2.6] px-4 select-none tracking-wide"
          dir="rtl"
        >
          {activeLesson.targetText.split('').map((char, index) => {
            let colorClass = 'text-gray-400';
            if (index < userInput.length) {
              colorClass =
                userInput[index] === char ? 'text-[#145C3A] font-bold' : 'text-red-500 underline';
            }
            return (
              <span key={index} className={colorClass}>
                {char}
              </span>
            );
          })}
        </div>

        {/* User Typing Input Area */}
        <div className="pt-2">
          <textarea
            dir="rtl"
            value={userInput}
            onChange={(e) => handleInputChange(e.target.value)}
            disabled={isCompleted}
            rows={2}
            placeholder="نیچے کی بورڈ سے ٹائپ کرنا شروع کریں..."
            className="w-full p-4 text-xl font-nastaliq text-center rounded-xl border-2 border-emerald-300 focus:outline-none focus:ring-2 focus:ring-[#145C3A] bg-[#F7F9F5] text-gray-900"
          />
        </div>

        {/* Congratulations Banner upon completion */}
        {isCompleted && (
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300 text-emerald-900 animate-in fade-in flex items-center justify-center gap-3">
            <Trophy className="w-6 h-6 text-amber-500 shrink-0" />
            <div className="text-right" dir="rtl">
              <div className="font-bold text-sm font-nastaliq">
                بہت خوب! آپ نے یہ مرحلہ کامیابی سے مکمل کر لیا ہے۔
              </div>
              <div className="text-xs font-sans text-emerald-700">
                WPM: {wpm} · درستگی: {accuracy}% · وقت: {elapsedSeconds} سیکنڈ
              </div>
            </div>
            <button
              onClick={() => {
                if (selectedLessonIndex < TYPING_PRACTICE_LESSONS.length - 1) {
                  setSelectedLessonIndex(selectedLessonIndex + 1);
                  handleReset();
                } else {
                  handleReset();
                }
              }}
              className="px-3.5 py-1.5 bg-[#145C3A] text-white text-xs font-bold rounded-lg mr-2 font-nastaliq shadow-xs"
            >
              اگلا مرحلہ →
            </button>
          </div>
        )}
      </div>

      {/* Docked Virtual Keyboard for typing practice */}
      {showKeyboard && (
        <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-300">
          <VirtualKeyboard
            theme={theme}
            settings={settings}
            currentInputText={userInput}
            onInsertText={(t) => handleInputChange(userInput + t)}
            onDeleteChar={() => handleInputChange(userInput.slice(0, -1))}
            onEnter={() => {}}
            onUpdateSettings={onUpdateSettings}
          />
        </div>
      )}
    </div>
  );
};
