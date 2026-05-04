import { motion } from 'framer-motion';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useEffect, useState, useRef } from 'react';
import { SpeechRecognition } from '../lib/audio-stream';

export const VoiceButton = () => {
  const { isListening, isThinking, setListening, addMessage, setLoading, setThinking, setPlaying, currentProvider, currentUser } = useStore();
  const [isPressed, setIsPressed] = useState(false);
  const speechRecognition = useRef<SpeechRecognition | null>(null);
  const audioStreamer = useRef<any>(null);

  useEffect(() => {
    speechRecognition.current = new SpeechRecognition();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setIsPressed(true);
        startListening();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPressed(false);
        stopListening();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      speechRecognition.current?.stop();
    };
  }, []);

  const startListening = () => {
    if (!speechRecognition.current?.isSupported()) {
      alert('Speech recognition is not supported in your browser. Please use Chrome for the best experience.');
      return;
    }

    setListening(true);
    speechRecognition.current?.start(
      (transcript) => {
        // Send the transcript to the backend
        handleVoiceInput(transcript);
      },
      (error) => {
        console.error('Speech recognition error:', error);
        setListening(false);
      }
    );
  };

  const stopListening = () => {
    speechRecognition.current?.stop();
    setListening(false);
  };

  const handleVoiceInput = async (transcript: string) => {
    if (!transcript.trim()) return;

    // Add user message
    addMessage({
      role: 'user',
      content: transcript,
    });

    setLoading(true);
    setThinking(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: transcript,
          use_tts: true,
          stream_audio: true,
          ai_provider: currentProvider,
          user: currentUser?.name,
        }),
      });

      const data = await response.json();

      // Add assistant message
      addMessage({
        role: 'assistant',
        content: data.response,
        audioUrl: data.stream_url,
      });

      // Play audio if available
      if (data.stream_url) {
        setPlaying(true);
        // Use full backend URL for audio playback
        const audioUrl = `http://localhost:8000${data.stream_url}`;
        const audio = new Audio(audioUrl);
        audio.play();
        audio.onended = () => setPlaying(false);
        audio.onerror = () => {
          console.error('Audio playback failed');
          setPlaying(false);
        };
      }
    } catch (error) {
      console.error('Error sending voice input:', error);
      addMessage({
        role: 'assistant',
        content: 'I apologize, sir, but I encountered an error processing your request.',
      });
    } finally {
      setLoading(false);
      setThinking(false);
    }
  };

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Voice Button */}
      <motion.button
        onClick={handleClick}
        disabled={isThinking}
        className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
          isListening 
            ? 'bg-jarvis-primary/30 border-jarvis-primary shadow-[0_0_40px_rgba(0,212,255,0.6)]' 
            : isThinking
            ? 'bg-jarvis-secondary/30 border-jarvis-secondary shadow-[0_0_40px_rgba(255,107,53,0.6)]'
            : 'bg-jarvis-surface/50 border-jarvis-border hover:border-jarvis-primary/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]'
        } border-2`}
        whileTap={{ scale: 0.95 }}
        animate={{
          scale: isListening ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 0.5,
          repeat: isListening ? Infinity : 0,
        }}
      >
        {/* Animated rings */}
        {isListening && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-jarvis-primary/30"
              animate={{
                scale: [1, 1.5, 2],
                opacity: [1, 0.5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-jarvis-primary/20"
              animate={{
                scale: [1, 1.3, 1.6],
                opacity: [1, 0.6, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: 0.5,
              }}
            />
          </>
        )}

        {/* Icon */}
        {isThinking ? (
          <Loader2 className="w-10 h-10 text-jarvis-secondary animate-spin" />
        ) : isListening ? (
          <Mic className="w-10 h-10 text-jarvis-primary" />
        ) : (
          <MicOff className="w-10 h-10 text-gray-400" />
        )}
      </motion.button>

      {/* Status text */}
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-glow">
          {isThinking ? 'Processing...' : isListening ? 'Listening...' : 'Hold Space or Click'}
        </p>
        <p className="text-xs text-gray-500">
          Press and hold Space to speak
        </p>
      </div>
    </div>
  );
};
