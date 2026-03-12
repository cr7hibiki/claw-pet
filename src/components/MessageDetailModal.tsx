import { useStore } from '../state/store';
import './MessageDetailModal.css';

interface MessageDetailModalProps {
  open: boolean;
  onClose: () => void;
}

export function MessageDetailModal({ open, onClose }: MessageDetailModalProps) {
  const { messages } = useStore();

  if (!open) return null;

  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>对话历史</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-body">
          {messages.length === 0 ? (
            <div className="empty-state">
              <p>暂无对话记录</p>
            </div>
          ) : (
            <div className="message-list">
              {messages.map((message) => (
                <div key={message.id} className="history-message">
                  <span className="timestamp">
                    {new Date(message.timestamp).toLocaleTimeString('zh-CN')}
                  </span>
                  <p className="content">{message.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
