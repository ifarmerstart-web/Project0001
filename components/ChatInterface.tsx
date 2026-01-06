import React, { useEffect, useRef, useState } from 'react';
import { Message, Sender } from '../types';
import ChatMessage from './ChatMessage';
import InputArea from './InputArea';
import { startChatSession, sendMessageToGemini } from '../services/geminiService';
import { RefreshCw, Calculator, Sprout } from 'lucide-react';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStart = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const initialResponse = await startChatSession();
      setMessages([
        {
          id: Date.now().toString(),
          role: Sender.MODEL,
          text: initialResponse
        }
      ]);
      setHasStarted(true);
    } catch (e) {
      setError("연결에 실패했습니다. API 키를 확인하거나 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: Sender.USER,
      text: text
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(text);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: Sender.MODEL,
          text: responseText
        }
      ]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: Sender.MODEL,
          text: "오류가 발생했습니다. 다시 시도해주세요.",
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-emerald-50 text-stone-800">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-emerald-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
            <Calculator size={40} />
          </div>
          <h1 className="text-2xl font-bold mb-3 text-stone-900">종자기능사<br/>마스터 봇</h1>
          <p className="text-stone-600 mb-8 leading-relaxed">
            AI와 함께 계산 공식부터<br/>핵심 이론까지 완벽하게 정복하세요!
          </p>
          
          <div className="space-y-3 mb-8 text-left bg-stone-50 p-4 rounded-xl text-sm text-stone-600">
            <div className="flex items-center gap-2">
              <Sprout size={16} className="text-emerald-500" /> 
              <span>발아율, 순도 등 계산 및 유전 비율</span>
            </div>
            <div className="flex items-center gap-2">
              <Sprout size={16} className="text-emerald-500" /> 
              <span>종자 증식 체계 및 T/R율 개념</span>
            </div>
            <div className="flex items-center gap-2">
              <Sprout size={16} className="text-emerald-500" />
              <span>단명/상명/장명 종자 구분 훈련</span>
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={isLoading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : "훈련 시작하기"}
          </button>
          
          {error && (
            <p className="mt-4 text-red-500 text-sm bg-red-50 py-2 px-3 rounded-lg">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-stone-50 relative">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white/80 backdrop-blur-md border-b border-stone-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
        <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg">
          <Sprout className="fill-emerald-100" />
          <span>종자 훈련 봇</span>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="p-2 text-stone-400 hover:text-emerald-600 transition-colors"
          title="처음부터 다시 시작"
        >
          <RefreshCw size={20} />
        </button>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-6">
              <div className="flex items-center gap-2 bg-stone-100 px-4 py-3 rounded-2xl rounded-tl-none">
                <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="flex-shrink-0 bg-stone-50">
        <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
      </footer>
    </div>
  );
};

export default ChatInterface;
