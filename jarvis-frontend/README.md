# 🤖 Jarvis Frontend

A production-ready, 8K-compatible web frontend for the Jarvis Voice Assistant backend. Built with React 18, TypeScript, Tailwind CSS, and Framer Motion.

## 🎨 Features

- **Iron Man HUD Design**: Futuristic, holographic interface with glowing accents
- **Real-time Audio Streaming**: Play Jarvis responses as they're generated
- **Voice & Text Input**: Support for both voice commands (Web Speech API) and text input
- **Multi-User Support**: Switch between different user profiles
- **AI Provider Selection**: Choose between local, Anthropic, or DeepSeek AI providers
- **Responsive Design**: Works flawlessly on desktop, tablet, and mobile
- **8K/4K Ready**: Scales beautifully on high-DPI displays
- **Type-Safe**: Full TypeScript implementation with strict mode

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Jarvis backend running on `http://localhost:8000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The frontend will be available at `http://localhost:3000` and will automatically proxy API requests to the Jarvis backend at `http://localhost:8000`.

## 🏗️ Project Structure

```
jarvis-frontend/
├── src/
│   ├── components/       # React components
│   │   ├── Chat.tsx      # Chat interface
│   │   ├── VoiceButton.tsx  # Voice input button
│   │   ├── InputArea.tsx     # Text input area
│   │   ├── Settings.tsx     # Settings drawer
│   │   └── Header.tsx       # App header
│   ├── lib/              # Utilities
│   │   ├── api-client.ts    # API client with Axios
│   │   └── audio-stream.ts  # Audio streaming & speech recognition
│   ├── store/            # State management
│   │   └── useStore.ts      # Zustand store
│   ├── types/            # TypeScript types
│   │   └── api.ts           # API type definitions
│   ├── test/             # Test setup
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

## 🎯 API Integration

The frontend integrates with the Jarvis REST API using the following endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Check backend health |
| `/chat` | POST | Send text and get response |
| `/audio/stream/{request_id}` | GET | Stream audio response |
| `/providers` | GET | List available AI providers |
| `/users` | GET | List users in system |
| `/users/switch` | POST | Switch active user |
| `/status` | GET | System status and uptime |

## 🎨 Customization

### Colors

The color scheme can be customized in `tailwind.config.js`:

```javascript
colors: {
  'jarvis': {
    'primary': '#00d4ff',      // Cyan
    'secondary': '#ff6b35',    // Orange
    'accent': '#00ff88',       // Green
    'bg': '#0a0a0f',          // Dark background
    'surface': '#1a1a2e',     // Panel background
    'border': '#2a2a3e'       // Border color
  }
}
```

### Fonts

The project uses Google Fonts:
- **JetBrains Mono** for body text
- **Orbitron** for headings (display font)

## 🔧 Configuration

### Development Proxy

API requests are proxied during development to avoid CORS issues. Configure in `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### Production Deployment

For production, either:
1. Serve the built frontend from the same domain as the backend
2. Configure proper CORS headers on the backend
3. Update the API base URL in `src/lib/api-client.ts`

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

**Note**: Web Speech API (voice input) may have limited support in some browsers. Chrome provides the best experience.

## 🎮 Keyboard Shortcuts

- **Space**: Hold to activate voice input
- **Escape**: Close settings drawer

## 🔒 Security

- All API requests use HTTPS in production
- No sensitive data is stored in the frontend
- API keys are managed on the backend only

## 📄 License

MIT License - See the main Jarvis repository for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 🐛 Troubleshooting

### Backend Connection Issues

If you see "System Offline" in the header:
1. Ensure the Jarvis backend is running on `http://localhost:8000`
2. Check the browser console for CORS errors
3. Verify the proxy configuration in `vite.config.ts`

### Audio Not Playing

If audio responses don't play:
1. Check browser audio permissions
2. Ensure audio streaming is enabled in the backend
3. Check the browser console for audio-related errors

### Voice Input Not Working

If voice input doesn't work:
1. Ensure your browser supports Web Speech API
2. Grant microphone permissions
3. Try using Chrome for best compatibility

## 📞 Support

For issues related to:
- **Frontend**: Open an issue in this repository
- **Backend**: Visit the main Jarvis repository at `github.com/alexako/Jarvis`
