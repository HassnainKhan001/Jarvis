import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Chat } from '../Chat';
import { useStore } from '../../store/useStore';

describe('Chat Component', () => {
  beforeEach(() => {
    // Reset store before each test
    useStore.getState().clearMessages();
  });

  it('renders empty state when no messages', () => {
    render(<Chat />);
    expect(screen.getByText('J.A.R.V.I.S.')).toBeInTheDocument();
    expect(screen.getByText(/How may I assist you today/)).toBeInTheDocument();
  });

  it('renders user messages correctly', () => {
    useStore.getState().addMessage({
      role: 'user',
      content: 'Hello Jarvis',
    });

    render(<Chat />);
    expect(screen.getByText('Hello Jarvis')).toBeInTheDocument();
  });

  it('renders assistant messages correctly', () => {
    useStore.getState().addMessage({
      role: 'assistant',
      content: 'Hello, sir',
    });

    render(<Chat />);
    expect(screen.getByText('Hello, sir')).toBeInTheDocument();
  });

  it('displays message timestamps', () => {
    useStore.getState().addMessage({
      role: 'user',
      content: 'Test message',
    });

    render(<Chat />);
    const timestamp = screen.getByText(/\d{1,2}:\d{2}:\d{2}/);
    expect(timestamp).toBeInTheDocument();
  });
});
