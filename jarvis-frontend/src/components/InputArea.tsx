import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useStore } from '../store/useStore';
import { apiClient } from '../lib/api-client';
import { AudioStreamer } from '../lib/audio-stream';

export const InputArea = () => {
  const [input, setInput] = useState('');
  const { addMessage, setLoading, setThinking, setPlaying, currentProvider, currentUser } = useStore();
  const audioStreamer = new AudioStreamer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    addMessage({
      role: 'user',
      content: userMessage,
    });

    setLoading(true);
    setThinking(true);

    try {
      const response = await apiClient.sendChat({
        text: userMessage,
        use_tts: true,
        stream_audio: true,
        ai_provider: currentProvider as any,
        user: currentUser?.name,
      });

      // Add assistant message
      addMessage({
        role: 'assistant',
        content: response.response,
        audioUrl: response.stream_url,
      });

      // Play audio if available
      if (response.stream_url) {
        setPlaying(true);
        // Use full backend URL for audio playback
        const audioUrl = `http://localhost:8000${response.stream_url}`;
        await audioStreamer.playFromURL(audioUrl);
        setPlaying(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({
        role: 'assistant',
        content: 'I apologize, sir, but I encountered an error processing your request.',
      });
    } finally {
      setLoading(false);
      setThinking(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="jarvis-panel p-4 border-t border-jarvis-border"
    >
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 jarvis-input"
          disabled={useStore.getState().isThinking}
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="jarvis-button flex items-center space-x-2"
          disabled={!input.trim() || useStore.getState().isThinking}
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </motion.button>
      </form>
    </motion.div>
  );
};
