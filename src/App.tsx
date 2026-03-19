import { useEffect, useMemo, useState } from 'react';
import { PetDisplay } from './components/PetDisplay';
import { MessageBubble } from './components/MessageBubble';
import { MessageDetailModal } from './components/MessageDetailModal';
import { ChatDialog } from './components/ChatDialog';
import { useStore } from './state/store';
import './App.css';

function App() {
  const {
    connected,
    connectionStatus,
    currentMessage,
    messages,
    connectToGateway,
    disconnectFromGateway,
  } = useStore();
  const [detailOpen, setDetailOpen] = useState(false);
  const isTauriRuntime = useMemo(
    () => typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window,
    [],
  );

  useEffect(() => {
    if (!isTauriRuntime) {
      return;
    }

    void connectToGateway();

    return () => {
      void disconnectFromGateway();
    };
  }, [connectToGateway, disconnectFromGateway, isTauriRuntime]);

  const latestMessage = messages[messages.length - 1];
  const bubbleContent = latestMessage?.content || currentMessage;
  const statusText = isTauriRuntime ? connectionStatus : 'browser preview';

  return (
    <div className="app-container" data-tauri-drag-region>
      <div className="status-bar">
        <span className={`status-dot ${connected ? 'ok' : 'warn'}`} />
        <span className="status-text">Gateway: {statusText}</span>
        {isTauriRuntime && !connected ? (
          <button className="reconnect-button" onClick={() => void connectToGateway()}>
            重连
          </button>
        ) : null}
      </div>

      <PetDisplay />

      {bubbleContent ? (
        <div className="bubble-area">
          <MessageBubble content={bubbleContent} isLatest onClick={() => setDetailOpen(true)} />
        </div>
      ) : null}

      <ChatDialog />
      <MessageDetailModal open={detailOpen} onClose={() => setDetailOpen(false)} />
    </div>
  );
}

export default App;
