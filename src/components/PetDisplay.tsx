import { useEffect, useRef, useState } from 'react';
import HaruLive2DLoader from '../lib/live2d/HaruLoader';
import './PetDisplay.css';

export function PetDisplay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loaderRef = useRef<HaruLive2DLoader | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [currentExpression, setCurrentExpression] = useState('正常');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const loader = new HaruLive2DLoader(canvas);
    loaderRef.current = loader;

    loader.loadModel('/models/Haru', 'Haru')
      .then((loaded) => {
        setModelLoaded(loaded);
        if (loaded) {
          loader.startAnimationLoop();
        }
      })
      .catch((error) => {
        console.error('Failed to load Live2D model:', error);
        setModelLoaded(false);
      });

    const handleResize = () => {
      loader.resize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      loader.destroy();
    };
  }, []);

  const handleClick = () => {
    setShowInfo(!showInfo);
    
    if (loaderRef.current) {
      loaderRef.current.playMotion('TapBody', 0);
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
      <canvas 
        ref={canvasRef}
        id="live2d-canvas"
        className="live2d-canvas"
        onClick={handleClick}
      />
      
      {showInfo && (
        <div className="info-panel">
          <h3>🦞 Claw-Pet 状态</h3>
          <div className="status-item">
            <span className="status-label">Live2D 模型:</span>
            <span className={`status-value ${modelLoaded ? 'success' : 'warning'}`}>
              {modelLoaded ? '✓ Haru 已加载' : '⚠ 加载中'}
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
