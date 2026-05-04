import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import type {
  HealthResponse,
  ChatRequest,
  ChatResponse,
  UsersResponse,
  SwitchUserRequest,
  SwitchUserResponse,
  ProvidersResponse,
  SystemStatus,
  ErrorResponse
} from '../types/api';

class JarvisAPIClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:8000') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add any auth headers here if needed
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ErrorResponse>) => {
        if (error.response?.data) {
          console.error('API Error:', error.response.data);
        }
        return Promise.reject(error);
      }
    );
  }

  // Health Check
  async getHealth(): Promise<HealthResponse> {
    const response: AxiosResponse<HealthResponse> = await this.client.get('/health');
    return response.data;
  }

  // Chat Endpoints
  async sendChat(request: ChatRequest): Promise<ChatResponse> {
    const response: AxiosResponse<ChatResponse> = await this.client.post('/chat', request);
    return response.data;
  }

  // User Management
  async getUsers(): Promise<UsersResponse> {
    const response: AxiosResponse<UsersResponse> = await this.client.get('/users');
    return response.data;
  }

  async switchUser(request: SwitchUserRequest): Promise<SwitchUserResponse> {
    const response: AxiosResponse<SwitchUserResponse> = await this.client.post('/users/switch', request);
    return response.data;
  }

  // AI Providers
  async getProviders(): Promise<ProvidersResponse> {
    const response: AxiosResponse<ProvidersResponse> = await this.client.get('/providers');
    return response.data;
  }

  // System Status
  async getStatus(): Promise<SystemStatus> {
    const response: AxiosResponse<SystemStatus> = await this.client.get('/status');
    return response.data;
  }

  // Audio Streaming
  async getAudioStream(requestId: string): Promise<ReadableStream> {
    const response = await this.client.get(`/audio/stream/${requestId}`, {
      responseType: 'stream',
    });
    return response.data;
  }

  // Set base URL dynamically
  setBaseURL(url: string): void {
    this.baseURL = url;
    this.client.defaults.baseURL = url;
  }
}

// Export singleton instance
export const apiClient = new JarvisAPIClient();
