console.log('main.tsx loaded');
console.log('React version:', typeof React);

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded');
  
  const root = document.getElementById('root');
  if (!root) {
    console.error('Root element not found!');
    return;
  }
  
  console.log('Root element found, creating simple content');
  
  // 简单的HTML渲染测试
  root.innerHTML = `
    <div style="
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-family: Arial, sans-serif;
    ">
      <div style="
        text-align: center;
        padding: 60px;
        border-radius: 30px;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 255, 255, 0.3);
      ">
        <div style="font-size: 120px; margin-bottom: 20px;">🦞</div>
        <h1 style="margin: 0 0 10px 0; font-size: 32px;">Claw-Pet</h1>
        <p style="margin: 0 0 20px 0; font-size: 18px; opacity: 0.9;">
          Live2D 桌面宠物应用
        </p>
        <p style="margin: 0; font-size: 16px; color: #81c784; font-weight: bold;">
          ✓ 状态: HTML渲染正常
        </p>
        <p style="margin-top: 15px; font-size: 14px; opacity: 0.7;">
          这是一个简化的测试版本
        </p>
      </div>
    </div>
  `;
  
  console.log('Content rendered successfully');
});

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
