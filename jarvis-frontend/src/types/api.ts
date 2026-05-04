// API Response Types
export interface HealthResponse {
  status: string;
  version: string;
  uptime: number;
}

export interface ChatRequest {
  text: string;
  use_tts?: boolean;
  stream_audio?: boolean;
  ai_provider?: 'local' | 'anthropic' | 'deepseek';
  user?: string;
}

export interface ChatResponse {
  response: string;
  request_id: string;
  stream_url?: string;
  audio_file?: string;
  ai_provider: string;
  processing_time: number;
}

export interface User {
  id: string;
  name: string;
  aliases: string[];
  created_at: string;
  last_active: string;
}

export interface UsersResponse {
  users: User[];
  current_user: User | null;
}

export interface SwitchUserRequest {
  user_id: string;
}

export interface SwitchUserResponse {
  success: boolean;
  user: User;
  message: string;
}

export interface AIProvider {
  id: string;
  name: string;
  type: 'local' | 'cloud';
  available: boolean;
  description?: string;
}

export interface ProvidersResponse {
  providers: AIProvider[];
  current_provider: string;
}

export interface SystemStatus {
  status: string;
  uptime: number;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  active_users: number;
  total_requests: number;
}

export interface ErrorResponse {
  detail: string;
  error_type?: string;
  status_code?: number;
}

// Audio Streaming Types
export interface AudioStreamOptions {
  autoPlay?: boolean;
  volume?: number;
  onEnd?: () => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
}
