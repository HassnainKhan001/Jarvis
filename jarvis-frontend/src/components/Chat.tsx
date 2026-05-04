import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { MessageSquare, User, Bot, Volume2 } from 'lucide-react';

export const Chat = () => {
  const { messages, isPlaying } = useStore();

  return (
    <div className="flex-1 overflow-y-auto jarvis-scrollbar p-6 space-y-4">
      <AnimatePresence mode="popLayout">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center h-full text-center space-y-4"
          >
            <div className="w-24 h-24 rounded-full bg-jarvis-primary/10 flex items-center justify-center border border-jarvis-primary/30 animate-pulse-glow">
              <Bot className="w-12 h-12 text-jarvis-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold text-glow">J.A.R.V.I.S.</h2>
              <p className="text-gray-400">How may I assist you today, sir?</p>
            </div>
          </motion.div>
        ) : (
          messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-start space-x-3 ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                message.role === 'user' 
                  ? 'bg-jarvis-secondary/20 border border-jarvis-secondary/50' 
                  : 'bg-jarvis-primary/20 border border-jarvis-primary/50'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-5 h-5 text-jarvis-secondary" />
                ) : (
                  <Bot className="w-5 h-5 text-jarvis-primary" />
                )}
              </div>
              
              <div className={`flex-1 max-w-[70%] jarvis-panel p-4 ${
                message.role === 'user' 
                  ? 'bg-jarvis-secondary/10 border-jarvis-secondary/30' 
                  : 'bg-jarvis-primary/10 border-jarvis-primary/30'
              }`}>
                <div className="flex items-start justify-between space-x-2">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  {message.audioUrl && (
                    <button
                      onClick={() => {/* Play audio */}}
                      className={`flex-shrink-0 p-1 rounded hover:bg-jarvis-primary/20 transition-colors ${
                        isPlaying ? 'text-jarvis-primary' : 'text-gray-400'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
};
