import React, { useState, useRef, useEffect } from 'react';
import { Send, StopCircle } from 'lucide-react';

interface InputAreaProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || disabled) return;
    onSendMessage(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 md:pb-6">
      <div className="relative bg-white rounded-2xl shadow-lg border border-stone-200 p-2 flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "대화가 종료되었습니다." : "정답을 입력하거나 '그만'을 외쳐주세요..."}
          disabled={disabled || isLoading}
          className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-3 px-3 text-stone-800 placeholder-stone-400 disabled:bg-transparent"
          rows={1}
        />
        
        <button
          onClick={() => handleSubmit()}
          disabled={!input.trim() || isLoading || disabled}
          className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
            !input.trim() || isLoading || disabled
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg transform active:scale-95'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={20} className={input.trim() ? "ml-0.5" : ""} />
          )}
        </button>
      </div>
      <div className="text-center mt-2 text-xs text-stone-400">
        AI는 실수를 할 수 있습니다. 계산 결과를 항상 확인하세요.
      </div>
    </div>
  );
};

export default InputArea;
