import React, { useState } from 'react';
import { KeyboardTheme, KeyboardSettings } from '../../types';
import { VirtualKeyboard } from '../keyboard/VirtualKeyboard';
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Camera,
  Send,
  Smile,
  CheckCheck,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { transliterateRomanUrdu } from '../../services/transliteration';

interface ChatSimulatorScreenProps {
  onBack: () => void;
  theme: KeyboardTheme;
  settings: KeyboardSettings;
  onUpdateSettings: (updater: (prev: KeyboardSettings) => KeyboardSettings) => void;
}

interface Message {
  id: string;
  sender: 'other' | 'me';
  text: string;
  time: string;
  isUrdu?: boolean;
}

export const ChatSimulatorScreen: React.FC<ChatSimulatorScreenProps> = ({
  onBack,
  theme,
  settings,
  onUpdateSettings,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'other',
      text: 'Assalam o alaikum',
      time: '12:25 PM',
    },
    {
      id: '2',
      sender: 'other',
      text: 'kaise hain aap?',
      time: '12:26 PM',
    },
    {
      id: '3',
      sender: 'me',
      text: 'و علیکم السلام',
      time: '12:26 PM',
      isUrdu: true,
    },
    {
      id: '4',
      sender: 'me',
      text: 'الحمد للہ، ٹھیک ٹھاک ہوں میں۔',
      time: '12:26 PM',
      isUrdu: true,
    },
  ]);

  const [inputText, setInputText] = useState('App ka Saman agaya hai');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(true);

  const handleSend = () => {
    if (!inputText.trim()) return;
    // If Easy Urdu transliteration is enabled and text looks like roman urdu, convert it
    const finalContent = settings.easyUrduEnabled
      ? transliterateRomanUrdu(inputText)
      : inputText;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'me',
      text: finalContent,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUrdu: /[\u0600-\u06FF]/.test(finalContent),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  const handleResetChat = () => {
    setMessages([
      { id: '1', sender: 'other', text: 'Assalam o alaikum', time: '12:25 PM' },
      { id: '2', sender: 'other', text: 'kaise hain aap?', time: '12:26 PM' },
      { id: '3', sender: 'me', text: 'و علیکم السلام', time: '12:26 PM', isUrdu: true },
      { id: '4', sender: 'me', text: 'الحمد للہ، ٹھیک ٹھاک ہوں میں۔', time: '12:26 PM', isUrdu: true },
    ]);
    setInputText('App ka Saman agaya hai');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-lg mx-auto bg-[#ECE5DD] rounded-2xl overflow-hidden shadow-2xl border border-gray-300">
      {/* WhatsApp Style Top App Bar (Screenshot 2) */}
      <div className="bg-[#075E54] text-white px-3 py-2 flex items-center justify-between shrink-0 shadow">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1 -ml-1 text-white hover:bg-black/10 rounded-full"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 rounded-full bg-[#128C7E] flex items-center justify-center font-bold text-sm text-white">
            MR
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">Mr Rover</div>
            <div className="text-[11px] text-white/80 leading-none">Online</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-white">
          <button onClick={handleResetChat} title="Reset Chat" className="p-1 hover:bg-black/10 rounded">
            <RotateCcw className="w-4 h-4 text-emerald-200" />
          </button>
          <Video className="w-5 h-5 cursor-pointer opacity-90 hover:opacity-100" />
          <Phone className="w-4 h-4 cursor-pointer opacity-90 hover:opacity-100" />
          <MoreVertical className="w-5 h-5 cursor-pointer opacity-90 hover:opacity-100" />
        </div>
      </div>

      {/* Floating Mode Guidance Banner */}
      <div className="bg-emerald-50 border-b border-emerald-200 px-3 py-1.5 flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#145C3A]" />
          <span>
            {settings.easyUrduEnabled
              ? 'Easy Urdu آن ہے: رومن اردو لکھیں گے تو نستعلیق بن جائے گی'
              : 'Easy Urdu بند ہے: براہ راست عام حروف'}
          </span>
        </div>
        <button
          onClick={() =>
            onUpdateSettings((prev) => ({
              ...prev,
              easyUrduEnabled: !prev.easyUrduEnabled,
            }))
          }
          className={`text-[11px] px-2 py-0.5 rounded font-bold transition-colors ${
            settings.easyUrduEnabled
              ? 'bg-[#145C3A] text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {settings.easyUrduEnabled ? 'Easy Urdu ON' : 'Easy Urdu OFF'}
        </button>
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        <div className="text-center my-1">
          <span className="text-[10px] bg-white/70 text-gray-600 px-2 py-0.5 rounded-md shadow-xs">
            TODAY
          </span>
        </div>

        {messages.map((msg) => {
          const isMe = msg.sender === 'me';
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[78%] rounded-xl px-3 py-1.5 shadow-sm relative ${
                  isMe ? 'bg-[#E7FFDB] text-gray-900 rounded-tr-none' : 'bg-white text-gray-900 rounded-tl-none'
                }`}
                dir={msg.isUrdu ? 'rtl' : 'ltr'}
              >
                <div
                  className={`text-sm ${
                    msg.isUrdu ? 'font-nastaliq text-base leading-relaxed' : 'font-sans'
                  }`}
                >
                  {msg.text}
                </div>
                <div className="flex items-center justify-end gap-1 text-[10px] text-gray-500 mt-0.5" dir="ltr">
                  <span>{msg.time}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-blue-500" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat Input Bar */}
      <div className="p-2 bg-[#F0F2F5] border-t border-gray-200 flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => setIsKeyboardVisible(!isKeyboardVisible)}
          className="p-1.5 text-gray-600 hover:text-gray-800"
          title="Toggle Urdu Keyboard"
        >
          <Smile className="w-5 h-5" />
        </button>

        <div className="flex-1 bg-white rounded-2xl px-3 py-1.5 flex items-center gap-2 border border-gray-300 focus-within:ring-2 focus-within:ring-[#075E54]">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onFocus={() => setIsKeyboardVisible(true)}
            placeholder="Type a message or use keyboard..."
            className="flex-1 text-sm bg-transparent outline-none text-gray-900"
            dir={/[\u0600-\u06FF]/.test(inputText) ? 'rtl' : 'ltr'}
          />
          <Paperclip className="w-4 h-4 text-gray-400 cursor-pointer" />
          <Camera className="w-4 h-4 text-gray-400 cursor-pointer" />
        </div>

        <button
          onClick={handleSend}
          className="w-10 h-10 rounded-full bg-[#075E54] hover:bg-[#064e46] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform shrink-0"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </div>

      {/* Docked Virtual Urdu Keyboard */}
      {isKeyboardVisible && (
        <div className="shrink-0 animate-in slide-in-from-bottom-2 duration-150">
          <VirtualKeyboard
            theme={theme}
            settings={settings}
            currentInputText={inputText}
            onInsertText={(txt) => setInputText((prev) => prev + txt)}
            onDeleteChar={() => setInputText((prev) => prev.slice(0, -1))}
            onEnter={handleSend}
            onClose={() => setIsKeyboardVisible(false)}
            onUpdateSettings={onUpdateSettings}
          />
        </div>
      )}
    </div>
  );
};
