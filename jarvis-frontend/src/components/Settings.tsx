import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Cpu, Settings as SettingsIcon, Activity } from 'lucide-react';
import { useStore } from '../store/useStore';
import { apiClient } from '../lib/api-client';
import { useEffect, useState } from 'react';
import type { User, AIProvider } from '../types/api';

export const Settings = () => {
  const { settingsOpen, setSettingsOpen, users, setUsers, currentUser, setCurrentUser, providers, setProviders, currentProvider, setCurrentProvider, systemStatus } = useStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (settingsOpen) {
      loadData();
    }
  }, [settingsOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, providersData] = await Promise.all([
        apiClient.getUsers(),
        apiClient.getProviders(),
      ]);
      setUsers(usersData.users);
      setCurrentUser(usersData.current_user);
      setProviders(providersData.providers);
      setCurrentProvider(providersData.current_provider);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchUser = async (userId: string) => {
    try {
      const response = await apiClient.switchUser({ user_id: userId });
      if (response.success) {
        setCurrentUser(response.user);
      }
    } catch (error) {
      console.error('Error switching user:', error);
    }
  };

  const handleSwitchProvider = async (providerId: string) => {
    setCurrentProvider(providerId);
  };

  return (
    <AnimatePresence>
      {settingsOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSettingsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          
          {/* Settings Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md jarvis-panel border-l border-jarvis-border z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-bold text-glow">Settings</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSettingsOpen(false)}
                  className="p-2 hover:bg-jarvis-primary/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* System Status */}
              <div className="jarvis-panel p-4 space-y-3">
                <div className="flex items-center space-x-2 text-jarvis-primary">
                  <Activity className="w-5 h-5" />
                  <h3 className="font-medium">System Status</h3>
                </div>
                {systemStatus && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status</span>
                      <span className="text-green-400">{systemStatus.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Uptime</span>
                      <span>{Math.floor(systemStatus.uptime / 60)}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">CPU</span>
                      <span>{systemStatus.cpu_usage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Memory</span>
                      <span>{systemStatus.memory_usage}%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* User Selection */}
              <div className="jarvis-panel p-4 space-y-3">
                <div className="flex items-center space-x-2 text-jarvis-secondary">
                  <Users className="w-5 h-5" />
                  <h3 className="font-medium">Users</h3>
                </div>
                <div className="space-y-2">
                  {loading ? (
                    <p className="text-sm text-gray-500">Loading...</p>
                  ) : (
                    users.map((user) => (
                      <motion.button
                        key={user.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSwitchUser(user.id)}
                        className={`w-full p-3 rounded-lg text-left transition-all ${
                          currentUser?.id === user.id
                            ? 'bg-jarvis-secondary/20 border-jarvis-secondary/50'
                            : 'bg-jarvis-bg/50 border-jarvis-border hover:border-jarvis-secondary/30'
                        } border`}
                      >
                        <div className="font-medium">{user.name}</div>
                        {user.aliases.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Also known as: {user.aliases.join(', ')}
                          </div>
                        )}
                      </motion.button>
                    ))
                  )}
                </div>
              </div>

              {/* AI Provider Selection */}
              <div className="jarvis-panel p-4 space-y-3">
                <div className="flex items-center space-x-2 text-jarvis-accent">
                  <Cpu className="w-5 h-5" />
                  <h3 className="font-medium">AI Provider</h3>
                </div>
                <div className="space-y-2">
                  {providers.map((provider) => (
                    <motion.button
                      key={provider.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSwitchProvider(provider.id)}
                      disabled={!provider.available}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        currentProvider === provider.id
                          ? 'bg-jarvis-accent/20 border-jarvis-accent/50'
                          : 'bg-jarvis-bg/50 border-jarvis-border hover:border-jarvis-accent/30'
                      } border ${!provider.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{provider.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{provider.type}</div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          provider.available ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
