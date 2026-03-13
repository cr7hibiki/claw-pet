import { useRef, useEffect, useState } from 'react';
import { HaruLive2DLoader } from '../lib/live2d/HaruLoader';
import { useStore } from '../state/store';

interface PetDisplayProps {
  modelPath: string;
  modelName: string;
}

export function Live2DPetDisplay({ modelPath = '/models/Haru', modelName = 'Haru' }: PetDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const live2dRef = useRef<HaruLive2DLoader | null>(null);
  const { currentMessage } = useStore();
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    // 加载 Live2D 模型
    async function loadModel() {
      try {
        console.log('Loading Live2D model:', { modelPath, modelName });

        if (canvasRef.current) {
          const live2d = new HaruLive2DLoader(canvasRef.current);
          live2dRef.current = live2d;
          
          await live2d.loadModel(modelPath);
          
          // 启动动画循环
          let lastTime = performance.now();
          const animate = () => {
            const currentTime = performance.now();
            const deltaTime = (currentTime - lastTime) / 1000;
            lastTime = currentTime;
            
            if (live2dRef.current) {
              live2dRef.current.update(deltaTime);
            }
            
            requestAnimationFrame(animate);
          };
          
          // 触发消息时播放动作
          if (currentMessage) {
            console.log('Playing tap motion for message:', currentMessage);
            live2dRef.current?.playMotion('tap_group', 0);
            live2dRef.current?.setExpression('happy');
          }
          
          requestAnimationFrame(animate);
          
          return () => {
            if (live2dRef.current) {
              live2dRef.current.destroy();
            }
          };
        }
      } catch (error) {
        console.error('Failed to load Live2D model:', error);
      }
    }

    loadModel();
  }, [modelPath, modelName]);

  const handlePetClick = () => {
    const event = new CustomEvent('open-chat-dialog');
    window.dispatchEvent(event);
    
    // 播放 tap 动作
    if (live2dRef.current) {
      live2dRef.current.playMotion('tap_group', 0);
    }
  };

  const handleBubbleClick = () => {
    setShowBubble(true);
    const event = new CustomEvent('toggle-bubble');
    window.dispatchEvent(event);
  };

  return (
    <div className="pet-container">
      <canvas 
        ref={canvasRef}
        width={400}
        height={400}
        className="live2d-canvas"
        onClick={handlePetClick}
      />
      
      {showBubble && currentMessage && (
        <div className="message-bubble" onClick={handleBubbleClick}>
          {currentMessage}
        </div>
      )}
    </div>
  );
}
