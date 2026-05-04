import { motion } from 'framer-motion';
import { Chat } from './components/Chat';
import { VoiceButton } from './components/VoiceButton';
import { InputArea } from './components/InputArea';
import { Settings } from './components/Settings';
import { Header } from './components/Header';

function App() {
  return (
    <div className="h-screen flex flex-col bg-jarvis-bg">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.05),transparent_50%)]" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-jarvis-primary/5 to-transparent"
          animate={{
            y: ['-100%', '100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        <Chat />
      </div>

      {/* Voice Button and Input */}
      <div className="jarvis-panel border-t border-jarvis-border p-6 space-y-4 relative z-10">
        <VoiceButton />
        <InputArea />
      </div>

      {/* Settings Drawer */}
      <Settings />
    </div>
  );
}

export default App;
