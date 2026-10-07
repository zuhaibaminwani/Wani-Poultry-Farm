import React, { useState, useRef, useEffect } from 'react';
import { askWaniPoultryAI } from '../services/api';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Minimize2, 
  HelpCircle, 
  CheckCircle,
  MessageCircle,
  Phone,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import { FARM_CONTACT, IMAGES } from '../data/poultryData';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

const DEFAULT_CHIPS = [
  'Wyandotte egg price?',
  'How to incubate fertile eggs?',
  'Kashmir winter poultry care',
  'Table egg rates vs fertile egg rates',
  'Brahma & Buff prices?',
  'Track order status',
];

export const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am **Wani Poultry AI**, the official virtual assistant for **WANI POULTRY FARM** in Razloo Kund, Kulgam (Owner: Zuhaib Amin Wani).\n\nHow can I help you today? You can ask about our 9 poultry breeds, official egg prices, incubation guidelines, Kashmir winter flock care, or track your Order ID!`,
      time: 'Just now',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Voice speech synthesis helper
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    // Clean markdown stars/brackets for smooth natural speech
    const cleanText = text.replace(/[*#`_]/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Voice Speech Recognition helper
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          handleSend(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const reply = await askWaniPoultryAI(text);
      const assistantMessage: Message = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      if (audioFeedback) {
        speakText(reply);
      }
    } catch (err) {
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `I'm having a brief connection issue. You can place your orders directly through the website or track your order with your Order ID.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-red-700 to-red-900 text-white shadow-2xl shadow-red-950/40 hover:scale-105 transition-all border-2 border-amber-400 flex items-center gap-3 cursor-pointer group animate-bounce-subtle"
          aria-label="Open Wani Poultry AI Assistant"
        >
          <div className="relative">
            <span className="text-2xl">🤖🐔</span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>
          <div className="text-left hidden sm:block pr-1">
            <span className="text-xs font-bold text-amber-300 block leading-tight">Wani Poultry AI</span>
            <span className="text-[10px] text-red-200 block">Voice & text enabled</span>
          </div>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[440px] h-[580px] max-h-[90vh] bg-white rounded-3xl shadow-2xl border-2 border-red-800/40 flex flex-col overflow-hidden animate-slideUp">
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-red-950 to-[#450a0a] text-white p-4 flex items-center justify-between border-b border-red-700/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-xl shadow overflow-hidden border border-amber-300">
                🐔
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-bold text-sm text-white">Wani Poultry AI</h3>
                  <span className="bg-red-800 text-amber-300 text-[9px] font-bold px-1.5 py-0.2 rounded border border-amber-400/40">
                    Verified
                  </span>
                </div>
                <p className="text-[11px] text-red-200/90">
                  Razloo Kund, Kulgam • Official Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Voice Read Aloud Toggle */}
              <button
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking();
                  }
                  setAudioFeedback(!audioFeedback);
                }}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  audioFeedback
                    ? 'bg-amber-500 text-red-950 font-bold'
                    : 'text-red-200 hover:text-white hover:bg-white/10'
                }`}
                title={audioFeedback ? 'Voice auto-read enabled' : 'Enable voice responses'}
              >
                {audioFeedback ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg text-red-200 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-stone-50 text-xs sm:text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line shadow-sm relative group ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-red-700 to-red-800 text-white rounded-tr-none'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-1 right-2 p-1 text-stone-400 hover:text-red-800 cursor-pointer"
                      title="Read aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-stone-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-2xl rounded-tl-none border border-stone-200 text-xs text-stone-500 w-fit">
                <span className="animate-spin text-base">🐔</span>
                <span>Wani Poultry AI is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="p-2 bg-white border-t border-stone-200 overflow-x-auto flex gap-1.5 scrollbar-none">
            {DEFAULT_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-900 border border-stone-200 transition-colors shrink-0 cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Bar with Voice Mic Support */}
          <div className="p-3 bg-white border-t border-stone-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={isListening ? 'Listening to your voice...' : 'Ask about prices, breeds, incubation, or order...'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={`flex-1 py-2 px-3.5 rounded-xl border text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-red-600 bg-stone-50 ${
                  isListening ? 'border-red-500 ring-2 ring-red-300' : 'border-stone-300'
                }`}
              />

              {/* Speech Recognition Mic Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer shadow ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300'
                }`}
                title={isListening ? 'Stop listening' : 'Speak your question'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-red-950 font-bold transition-all shrink-0 cursor-pointer shadow"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};
