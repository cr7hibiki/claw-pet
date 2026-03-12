# Live2D Haru Model 示例

这是一个简单的示例，展示如何使用 `Haru` 模型在 Claw-Pet 桌面宠物中显示。

## 模型信息

- **模型名称**：Haru
- **来源**：Live2D Cubism Web Samples
- **类型**：Live2D v3
- **包含资源**：
  - 8 个表情（F01-F08）
  - 27 个动作（idle + 26 个动作）
  - 2 个纹理（2048x2048）
  - 物理文件（physics3.json、pose3.json）
  - 音效文件（.wav）

## 文件结构

模型文件应该放在 `public/models/Haru/` 目录中，结构如下：

```
public/models/Haru/
├── Haru.moc3              # 模型文件
├── Haru.model3.json     # 模型配置
├── Haru.physics3.json  # 物理模拟
├── Haru.pose3.json        # 姿态定义
├── Haru.2048/              # 纹理目录（2048x2048/）
├── Haru.2048/texture_00.png    # 纹理文件
├── Haru.2048/texture_01.png
├── motions/              # 动作目录
│   ├── haru_g_idle.motion3.json
│   ├── haru_g_m01.motion3.json
│   ├── ... (其他动作)
├── expressions/          # 表情目录
│   ├── haru_f01.exp3.json
│   ├── ... (其他表情）
└── sounds/              # 音效目录
    ├── haru_normal_6.wav
    ├── haru_Info_04.wav
    └── haru_talk_13.wav
```

## 使用方式

### 1. 在 Vite 项目中使用

将模型文件复制到 `public/models/Haru/` 目录，然后：

```typescript
import { useRef, useEffect } from 'react';
import { Live2DLoader } from '../lib/live2d/HaruLoader';

export function HaruComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const live2dRef = useRef<Live2DLoader | null>(null);
  
  useEffect(() => {
    async function initLive2D() {
      if (!canvasRef.current) {
        return;
      }
      
      try {
        if (!live2dRef.current) {
          live2dRef.current = new Live2DLoader(canvasRef.current);
        }
        
        await live2dRef.current.loadModel('/models/Haru/', 'Haru');
        
        console.log('Haru model loaded!');
        
        // 启动渲染循环
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
        
        animate();
      } catch (error) {
        console.error('Failed to load Haru model:', error);
      }
    }

    initLive2D();
    
    return (
      <div className="pet-container">
        <canvas 
          ref={canvasRef}
          width={400}
          height={400}
          className="live2d-canvas"
        />
      </div>
    );
}
```

### 2. 配置 Vite 支持 Live2D SDK

需要确保 `vite.config.ts` 包含以下配置：

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
    alias: {
      '@live2d': path.resolve(__dirname, './src/lib/live2d'),
      '@': path.resolve(__dirname, './src')
    },
  server: {
    port: 1420,
    strictPort: true
  }
});
```

### 3. 注意事项

1. **模型文件必须放置在 `public/` 目录** 才能在浏览器中访问
2. **确保使用 `http://localhost:1420` 访问，而不是 `file://` 协议
3. **Live2D 模型文件较大**，首次加载可能需要时间
4. **动作触发需要正确的动作名称和索引**

## 预期效果

- ✅ Haru 模型在画布上显示
- ✅ 点击时播放动作和表情
- ✅ 宠物会根据消息内容做出反应
- ✅ 流畅的动画效果

## 下一步

完成 Haru 模型集成后，你将拥有：
1. 🎨 一个完整的 Live2D 宠物
2. 🎭 动态的交互体验
3. 🚀 可爱的 AI 桌面宠物

开始吧！
