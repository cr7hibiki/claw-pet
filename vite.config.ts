import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [],
  
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
    alias: {
      '@live2d': path.resolve(__dirname, './src/lib/live2d'),
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    exclude: ['@live2d']
  },
  
  server: {
    port: 5173,
    strictPort: false
  },
  
  clearScreen: false,
  
  build: {
    target: 'ES2020',
    outDir: 'dist',
    assetsDir: 'assets'
  }
}));
