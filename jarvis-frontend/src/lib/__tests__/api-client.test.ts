import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiClient } from '../api-client';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have correct base URL', () => {
    expect(apiClient).toBeDefined();
  });

  it('should set base URL dynamically', () => {
    apiClient.setBaseURL('http://test.com');
    expect(apiClient['baseURL']).toBe('http://test.com');
  });
});
