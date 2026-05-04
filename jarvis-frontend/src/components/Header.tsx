import { motion } from 'framer-motion';
import { Settings, Activity, Wifi, WifiOff } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useEffect } from 'react';
import { apiClient } from '../lib/api-client';

export const Header = () => {
  const { setSettingsOpen, isHealthy, setHealthy, currentUser, systemStatus, setSystemStatus } = useStore();

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await apiClient.getHealth();
        setHealthy(health.healthy === true);
        
        const status = await apiClient.getStatus();
        setSystemStatus(status);
      } catch (error) {
        setHealthy(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [setHealthy, setSystemStatus]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="jarvis-panel border-b border-jarvis-border p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isHealthy ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`} />
            <span className="text-sm font-medium">
              {isHealthy ? 'System Online' : 'System Offline'}
            </span>
          </div>
          
          {currentUser && (
            <div className="text-sm text-gray-400">
              Active: <span className="text-jarvis-primary">{currentUser.name}</span>
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSettingsOpen(true)}
          className="p-2 hover:bg-jarvis-primary/20 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-400 hover:text-jarvis-primary" />
        </motion.button>
      </div>
    </motion.header>
  );
};
