import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message, Sender } from '../types';
import { Bot, User, AlertCircle } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Sender.USER;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-emerald-600 text-white' 
            : message.isError 
              ? 'bg-red-100 text-red-600' 
              : 'bg-stone-200 text-stone-600'
        }`}>
          {isUser ? <User size={20} /> : message.isError ? <AlertCircle size={20} /> : <Bot size={20} />}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-5 py-3 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm overflow-hidden ${
            isUser 
              ? 'bg-emerald-600 text-white rounded-tr-none' 
              : message.isError
                ? 'bg-red-50 border border-red-200 text-red-800 rounded-tl-none'
                : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none'
          }`}>
             {message.isError ? (
               <p>{message.text}</p>
             ) : (
               <div className="prose prose-sm md:prose-base max-w-none prose-emerald dark:prose-invert break-words">
                 <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({node, ...props}) => <p className={`mb-2 last:mb-0 ${isUser ? 'text-white' : 'text-stone-800'}`} {...props} />,
                      strong: ({node, ...props}) => <strong className={`font-bold ${isUser ? 'text-white' : 'text-emerald-700'}`} {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                      li: ({node, ...props}) => <li className="mb-1" {...props} />,
                      code: ({node, ...props}) => <code className={`px-1 py-0.5 rounded font-mono text-xs ${isUser ? 'bg-emerald-700' : 'bg-stone-100 text-pink-600'}`} {...props} />
                    }}
                 >
                   {message.text}
                 </ReactMarkdown>
               </div>
             )}
          </div>
          <span className="text-xs text-stone-400 mt-1 px-1">
            {isUser ? '나' : '훈련 봇'}
          </span>
        </div>

      </div>
    </div>
  );
};

export default ChatMessage;
