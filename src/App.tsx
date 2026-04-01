import { useEffect, useMemo, useState } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { PetDisplay } from './components/PetDisplay';
import { MessageBubble } from './components/MessageBubble';
import { MessageDetailModal } from './components/MessageDetailModal';
import { ChatDialog } from './components/ChatDialog';
import { useStore } from './state/store';
import './App.css';

function App() {
  const {
    connected,
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

  useEffect(() => {
    if (!isTauriRuntime) {
      return;
    }

    void getCurrentWindow().setShadow(false);
  }, [isTauriRuntime]);

  const latestMessage = messages[messages.length - 1];
  const bubbleContent = latestMessage?.content || currentMessage;
  const statusText = 'browser preview';
  const appClassName = `app-container ${isTauriRuntime ? 'runtime-tauri' : 'runtime-browser'}`;

  return (
    <div className={appClassName} data-tauri-drag-region>
      {!isTauriRuntime ? (
        <div className="status-bar">
          <span className={`status-dot ${connected ? 'ok' : 'warn'}`} />
          <span className="status-text">Gateway: {statusText}</span>
          {!connected ? (
            <button className="reconnect-button" onClick={() => void connectToGateway()}>
              重连
            </button>
          ) : null}
        </div>
      ) : null}

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
