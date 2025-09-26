
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, RefreshCw, X, Mic, MicOff, Download, Sparkles } from 'lucide-react';
import { ChatMessage } from '../../types';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import SuggestedPrompts from './SuggestedPrompts';

// Speech Recognition types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface ChatWindowProps {
  onClose: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

const initialMessage: ChatMessage = {
  id: 'initial-0',
  sender: 'bot',
  content: "Hello! I'm Limitless AI, your intelligent assistant from Limitless Infotech Solutions. Where innovation meets execution, I'm here to help you discover our cutting-edge technology solutions, explore our successful portfolio, and answer any questions about transforming your business. How can I assist you today?",
  timestamp: new Date().toISOString(),
  suggestions: ['Tell me about your services', 'Show me your portfolio', 'How much do you charge?'],
};

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => typeof window !== 'undefined' ? crypto.randomUUID() : '');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let botResponse = '';

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        content: '',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, botMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        botResponse += chunk;

        setMessages(prev => prev.map(msg =>
          msg.id === botMessage.id ? { ...msg, content: botResponse } : msg
        ));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const exportConversation = () => {
    const conversationText = messages
      .map(msg => `${msg.sender.toUpperCase()}: ${msg.content}`)
      .join('\n\n');

    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `limitless-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const startListening = () => {
    if (!recognition) return;

    try {
      recognition.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  };

  const stopListening = () => {
    if (!recognition) return;

    recognition.stop();
    setIsListening(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleNewChat = () => {
    setMessages([initialMessage]);
    setSessionId(crypto.randomUUID());
  };

  // Setup speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new (SpeechRecognition as any)();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          handleSendMessage(transcript);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      }
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      className="fixed bottom-24 right-6 w-[calc(100vw-48px)] max-w-md h-[60vh] max-h-[500px] bg-gradient-to-br from-white via-gray-50 to-accent/5 dark:from-gray-900 dark:via-gray-800 dark:to-accent/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-accent/20 dark:border-accent/10 font-sans"
      style={{ zIndex: 9999 }}
    >
      <header className="flex items-center justify-between p-4 border-b border-accent/10 dark:border-accent/20 flex-shrink-0 bg-gradient-to-r from-accent/5 to-transparent">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="p-2 bg-accent/10 rounded-full ring-2 ring-accent/20">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse"></span>
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">Limitless AI</h3>
            <p className="text-xs text-accent font-medium">Innovation Meets Execution</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button onClick={handleNewChat} className="p-2 rounded-full hover:bg-accent/10 dark:hover:bg-accent/20 transition-colors" aria-label="New Chat">
            <RefreshCw size={16} className="text-accent" />
          </button>
          <button onClick={exportConversation} className="p-2 rounded-full hover:bg-accent/10 dark:hover:bg-accent/20 transition-colors" aria-label="Export Conversation">
            <Download size={16} className="text-accent" />
          </button>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-accent/10 dark:hover:bg-accent/20 transition-colors" aria-label="Close Chat">
            <X size={18} className="text-accent" />
          </button>
        </div>
      </header>

      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-accent/30 dark:scrollbar-thumb-accent/20 scrollbar-track-transparent">
        <div className="space-y-4">
          {messages.map(msg => <Message key={msg.id} message={msg} onFeedback={() => {}} />)}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <footer className="p-3 border-t border-accent/10 dark:border-accent/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex-shrink-0">
        {messages[messages.length - 1]?.sender === 'bot' && messages[messages.length - 1].suggestions && !isLoading && (
          <SuggestedPrompts
            prompts={messages[messages.length - 1].suggestions!}
            onPromptClick={(prompt) => { handleSendMessage(prompt); }}
          />
        )}
        <div className="relative flex items-end space-x-2 mt-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(inputValue);
                setInputValue('');
              }
            }}
            placeholder="Ask me anything about Limitless..."
            className="flex-1 w-full pl-4 pr-24 py-3 bg-white dark:bg-gray-800 border border-accent/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none max-h-32 scrollbar-thin transition-all duration-200"
          />
          <div className="absolute right-2 bottom-2 flex items-center space-x-1">
            <button type="button" onClick={isListening ? stopListening : startListening} className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/20 text-red-500' : 'text-accent hover:bg-accent/10'}`} disabled={!recognition} aria-label="Voice input">
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button type="submit" onClick={() => { handleSendMessage(inputValue); setInputValue(''); }} className="p-2 bg-accent text-white rounded-full hover:bg-accent-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl" disabled={!inputValue.trim() || isLoading} aria-label="Send message">
              <Send size={20} />
            </button>
          </div>
        </div>
        <p className="text-xs text-center text-accent/60 mt-2 font-medium">Powered by Limitless Innovation</p>
      </footer>
    </motion.div>
  );
};

export default ChatWindow;
