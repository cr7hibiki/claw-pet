import React, { useState, useEffect } from 'react';
import { useStore } from '../state/store';
import './ChatDialog.css';

export function ChatDialog() {
  const { sendMessage } = useStore();
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const handleOpenDialog = () => setOpen(true);
    window.addEventListener('open-chat-dialog', handleOpenDialog);

    return () => {
      window.removeEventListener('open-chat-dialog', handleOpenDialog);
    };
  }, []);

  const handleSend = async () => {
    if (inputText.trim()) {
      await sendMessage(inputText);
      setInputText('');
      setOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!open) return null;

  return (
    <div className="chat-dialog-overlay" onClick={() => setOpen(false)}>
      <div className="chat-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>发送消息给 Claw-Pet</h2>
          <button 
            className="close-button"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>
        
        <div className="dialog-body">
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入您的问题...（按 Enter 发送，Shift+Enter 换行）"
            autoFocus
          />
        </div>
        
        <div className="dialog-footer">
          <button 
            className="cancel-button"
            onClick={() => setOpen(false)}
          >
            取消
          </button>
          <button 
            className="send-button"
            onClick={handleSend}
            disabled={!inputText.trim()}
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
