# 🚀 Jarvis Frontend Installation Guide

## Prerequisites

Before installing the Jarvis frontend, ensure you have:

1. **Node.js 18+** installed
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify with: `node --version`

2. **npm, yarn, or pnpm** package manager
   - npm comes with Node.js
   - Or install yarn: `npm install -g yarn`
   - Or install pnpm: `npm install -g pnpm`

3. **Jarvis Backend Running**
   - The Jarvis backend must be running on `http://localhost:8000`
   - See the main Jarvis repository for backend setup

## Installation Steps

### 1. Navigate to the Frontend Directory

```bash
cd jarvis-frontend
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

Using pnpm:
```bash
pnpm install
```

### 3. Start Development Server

Using npm:
```bash
npm run dev
```

Using yarn:
```bash
yarn dev
```

Using pnpm:
```bash
pnpm dev
```

The frontend will be available at `http://localhost:3000`

### 4. Build for Production

Using npm:
```bash
npm run build
```

Using yarn:
```bash
yarn build
```

Using pnpm:
```bash
pnpm build
```

The production build will be in the `dist/` directory.

## Configuration

### Development Proxy

The frontend automatically proxies API requests to `http://localhost:8000` during development. If your backend is running on a different port, update `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:YOUR_PORT',  // Change this
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### Production API URL

For production deployment, update the API base URL in `src/lib/api-client.ts`:

```typescript
const apiClient = new JarvisAPIClient('https://your-api-domain.com');
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Kill the process using the port
npx kill-port 3000

# Or use a different port
npm run dev -- --port 3001
```

### Dependency Installation Issues

If you encounter dependency installation errors:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use yarn
rm -rf node_modules yarn.lock
yarn install
```

### TypeScript Errors

If you see TypeScript errors:

```bash
# Run TypeScript compiler to check
npx tsc --noEmit

# Ensure all dependencies are installed
npm install
```

### CORS Errors

If you see CORS errors in the browser console:

1. Ensure the backend is running
2. Check that the proxy configuration in `vite.config.ts` is correct
3. For production, configure CORS headers on the backend

## Next Steps

After installation:

1. Open `http://localhost:3000` in your browser
2. Verify the system status shows "System Online"
3. Test voice input (requires microphone permission)
4. Test text input by typing a message
5. Explore the settings panel to switch users and AI providers

## Support

For issues or questions:
- Check the main README.md for documentation
- Open an issue in the repository
- Review the main Jarvis repository for backend-related issues
