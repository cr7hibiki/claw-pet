import './MessageBubble.css';

interface MessageBubbleProps {
  content: string;
  isLatest?: boolean;
  onClick?: () => void;
}

export function MessageBubble({ content, isLatest, onClick }: MessageBubbleProps) {
  const displayContent = content.length > 100 
    ? content.substring(0, 100) + '...' 
    : content;

  return (
    <div 
      className={`message-bubble ${isLatest ? 'latest' : ''}`}
      onClick={onClick}
    >
      <p className="message-content">{displayContent}</p>
      {isLatest && <span className="click-hint">点击查看详情</span>}
    </div>
  );
}
