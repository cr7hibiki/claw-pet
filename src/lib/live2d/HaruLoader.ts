import * as PIXI from 'pixi.js';

export class HaruLive2DLoader {
  private app: PIXI.Application | null = null;
  private placeholder: PIXI.Sprite | null = null;
  private modelLoaded: boolean = false;
 
  constructor(canvas: HTMLCanvasElement) {
    // 初始化 Pixi 应用
    this.app = new PIXI.Application({
      view: canvas,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
  }

  async loadModel(modelDir: string, modelName: string = 'Haru'): Promise<boolean> {
    try {
      console.log(`Attempting to load model from: ${modelDir}/${modelName}`);

      // 尝试加载 Live2D 模型
      try {
        const { Live2DModel } = await import('pixi-live2d-display');
        const live2dModel = await Live2DModel.from(`${modelDir}/${modelName}.model3.json`);

        if (this.app) {
          this.app.stage.removeChildren();
          this.app.stage.addChild(live2dModel as any);
          
          // 调整模型大小和位置
          const scale = Math.min(
            (window.innerWidth * 0.8) / (live2dModel as any).width,
            (window.innerHeight * 0.8) / (live2dModel as any).height
          );
          live2dModel.scale.set(scale);
          live2dModel.x = (window.innerWidth - (live2dModel as any).width * scale) / 2;
          live2dModel.y = (window.innerHeight - (live2dModel as any).height * scale) / 2;
        }

        this.modelLoaded = true;
        console.log('Live2D model loaded successfully!');
        return true;
      } catch (live2dError) {
        console.warn('Live2D model loading failed, using placeholder:', live2dError);
        throw live2dError;
      }
    } catch (error) {
      console.error('Failed to load model, using placeholder:', error);
      this.showPlaceholder();
      return false;
    }
  }

  private showPlaceholder(): void {
    if (this.app) {
      this.app.stage.removeChildren();
      
      // 创建占位符图片
      const placeholder = PIXI.Sprite.from('/models/Haru/placeholder.svg');
      placeholder.anchor.set(0.5);
      
      const scale = Math.min(
        (window.innerWidth * 0.6) / placeholder.width,
        (window.innerHeight * 0.6) / placeholder.height
      );
      placeholder.scale.set(scale);
      placeholder.x = window.innerWidth / 2;
      placeholder.y = window.innerHeight / 2;
      
      this.placeholder = placeholder;
      this.app.stage.addChild(placeholder);
      this.modelLoaded = false;
      
      console.log('Using placeholder instead of Live2D model');
    }
  }

  update(_deltaTime: number): void {
    // 占位符不需要更新
    if (this.placeholder) {
      this.placeholder.rotation += 0.001;
    }
  }

  playMotion(groupName: string, motionIndex: number = 0): void {
    console.log(`Motion requested: ${groupName}[${motionIndex}], but using placeholder`);
    if (this.placeholder) {
      this.placeholder.scale.set(1.2);
      setTimeout(() => {
        if (this.placeholder) {
          const currentScale = Math.min(
            (window.innerWidth * 0.6) / this.placeholder.width,
            (window.innerHeight * 0.6) / this.placeholder.height
          );
          this.placeholder.scale.set(currentScale);
        }
      }, 300);
    }
  }

  setExpression(name: string): void {
    console.log(`Expression requested: ${name}, but using placeholder`);
  }

  destroy(): void {
    if (this.placeholder) {
      this.placeholder.destroy();
      this.placeholder = null;
    }
    if (this.app) {
      this.app.destroy(true);
      this.app = null;
    }
  }

  resize(width: number, height: number): void {
    if (this.app) {
      this.app.renderer.resize(width, height);
      if (this.placeholder) {
        this.placeholder.x = width / 2;
        this.placeholder.y = height / 2;
        const scale = Math.min(
          (width * 0.6) / this.placeholder.width,
          (height * 0.6) / this.placeholder.height
        );
        this.placeholder.scale.set(scale);
      }
    }
  }

  startAnimationLoop(): void {
    if (this.app) {
      this.app.ticker.add((deltaTime) => {
        this.update(deltaTime);
      });
    }
  }
  
  isModelLoaded(): boolean {
    return this.modelLoaded;
  }
}

export default HaruLive2DLoader;
