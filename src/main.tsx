import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Live2D/Pixi currently reuses a single canvas instance, so StrictMode's dev-only
// double mount causes duplicate initialization and breaks WebGL startup.
const rootElement = document.getElementById('root') as HTMLElement
const isTauriRuntime = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window
rootElement.classList.add(isTauriRuntime ? 'runtime-tauri' : 'runtime-browser')

ReactDOM.createRoot(rootElement).render(<App />)
