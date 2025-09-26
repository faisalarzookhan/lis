'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Minimize2 } from 'lucide-react';
import ChatWindow from './ChatWindow';

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);

  useEffect(() => {
    const pulseTimer = setTimeout(() => setIsPulsing(false), 5000); // Stop pulsing after 5 seconds
    return () => clearTimeout(pulseTimer);
  }, []);

  const toggleChat = () => {
    if (isOpen && !isMinimized) {
      setIsMinimized(true);
    } else if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(true);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            aria-hidden="true"
            onClick={closeChat}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence mode="wait">
          {isOpen && isMinimized ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
              onClick={toggleChat}
              aria-label="Maximize Chat"
            >
              <MessageSquare size={28} />
            </motion.div>
          ) : (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleChat}
              className={`bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl ${isPulsing ? 'animate-pulse' : ''}`}
              aria-label="Toggle Chat"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div key="minimize" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <Minimize2 size={28} />
                  </motion.div>
                ) : (
                  <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <MessageSquare size={28} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && !isMinimized && <ChatWindow onClose={closeChat} onMinimize={() => setIsMinimized(true)} />}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
