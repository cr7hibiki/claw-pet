import { useEffect, useRef, useState } from 'react';
import HaruLive2DLoader from '../lib/live2d/HaruLoader';
import './PetDisplay.css';

interface PetDisplayProps {
  modelPath?: string;
  modelName?: string;
}

type ModelStatus = 'loading' | 'loaded' | 'fallback';

export function PetDisplay({ modelPath = '/models/Haru', modelName = 'Haru' }: PetDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loaderRef = useRef<HaruLive2DLoader | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [modelStatus, setModelStatus] = useState<ModelStatus>('loading');
  const [currentExpression, setCurrentExpression] = useState('正常');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const loader = new HaruLive2DLoader(canvas);
    loaderRef.current = loader;
    setModelStatus('loading');

    loader.loadModel(modelPath, modelName)
      .then((loaded) => {
        setModelStatus(loaded ? 'loaded' : 'fallback');
        loader.startAnimationLoop();
      })
      .catch((error) => {
        console.error('Failed to load Live2D model:', error);
        setModelStatus('fallback');
        loader.startAnimationLoop();
      });

    const handleResize = () => {
      loader.resize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      loader.destroy();
    };
  }, [modelPath, modelName]);

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('open-chat-dialog'));

    if (loaderRef.current) {
      loaderRef.current.playMotion('TapBody', Math.floor(Math.random() * 4));
    }
  };

  const handleExpressionChange = (expression: string) => {
    if (loaderRef.current) {
      loaderRef.current.setExpression(expression);
      setCurrentExpression(expression);
    }
  };

  return (
    <div className="pet-container">
      <button className="info-toggle" onClick={() => setShowInfo((value) => !value)}>
        {showInfo ? '隐藏状态' : '查看状态'}
      </button>

      <canvas
        ref={canvasRef}
        id="live2d-canvas"
        className="live2d-canvas"
        onClick={handleClick}
      />

      {modelStatus === 'fallback' ? (
        <div className="pet-placeholder-overlay" onClick={handleClick}>
          <div className="pet-placeholder-card">
            <div className="pet-icon">🦞</div>
            <p className="pet-label">Claw-Pet</p>
            <p className="pet-subtitle">Live2D fallback preview</p>
          </div>
        </div>
      ) : null}

      {showInfo && (
        <div className="info-panel">
          <h3>🦞 Claw-Pet 状态</h3>
          <div className="status-item">
            <span className="status-label">Live2D 模型:</span>
            <span
              className={`status-value ${
                modelStatus === 'loaded'
                  ? 'success'
                  : modelStatus === 'fallback'
                    ? 'warning'
                    : 'info'
              }`}
            >
              {modelStatus === 'loaded'
                ? '✓ Haru 已加载'
                : modelStatus === 'fallback'
                  ? '⚠ 使用占位图'
                  : '… 加载中'}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">当前表情:</span>
            <span className="status-value info">{currentExpression}</span>
          </div>
          <div className="instructions">
            <p><strong>交互功能:</strong></p>
            <ul>
              <li>点击宠物播放动作和切换信息</li>
              <li>支持 8 种表情切换</li>
              <li>包含待机、点击等动作</li>
              <li>完整的物理和姿态系统</li>
            </ul>
          </div>
          <div className="expression-buttons">
            <p><strong>表情测试:</strong></p>
            <div className="button-grid">
              {['F01', 'F02', 'F03', 'F04', 'F05', 'F06', 'F07', 'F08'].map((expr) => (
                <button
                  key={expr}
                  onClick={() => handleExpressionChange(expr)}
                  className={currentExpression === expr ? 'active' : ''}
                >
                  {expr}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
