import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Live2D/Pixi currently reuses a single canvas instance, so StrictMode's dev-only
// double mount causes duplicate initialization and breaks WebGL startup.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)
