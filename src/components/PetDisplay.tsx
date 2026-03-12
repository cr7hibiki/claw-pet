import { useEffect, useRef, useState } from 'react';
import './PetDisplay.css';

export function PetDisplay() {
  const [showInfo, setShowInfo] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    console.log('PetDisplay mounted');
    setModelLoaded(false);
  }, []);

  const handleClick = () => {
    setShowInfo(!showInfo);
    console.log('Pet clicked!');
  };

  return (
    <div className="pet-container" onClick={handleClick}>
      <div className="pet-placeholder">
        <div className="pet-icon">🦞</div>
        <p className="pet-label">Claw-Pet</p>
        <p className="pet-subtitle">点击查看状态</p>
      </div>
      
      {showInfo && (
        <div className="info-panel">
          <h3>🦞 Claw-Pet 状态</h3>
          <div className="status-item">
            <span className="status-label">Live2D 模型:</span>
            <span className={`status-value ${modelLoaded ? 'success' : 'warning'}`}>
              {modelLoaded ? '✓ 已加载' : '⚠ 使用占位符'}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">OpenClaw:</span>
            <span className="status-value info">准备中...</span>
          </div>
          <div className="instructions">
            <p><strong>提示:</strong></p>
            <ul>
              <li>点击宠物可切换显示此信息</li>
              <li>使用简单占位符 - 准备 Live2D 集成</li>
              <li>需要添加 Live2D 模型文件到 public/models/Haru/</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
