import * as PIXI from 'pixi.js';
import { Ticker } from '@pixi/ticker';

export class HaruLive2DLoader {
  private app: PIXI.Application | null = null;
  private placeholder: PIXI.Sprite | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private model: any = null;
  private modelLoaded = false;
  private animationFrame: number | null = null;
  private idleTimer: number | null = null;
  private destroyed = false;

  constructor(private canvas: HTMLCanvasElement) {
    this.destroyed = false;
    this.initializePixi();
  }

  private initializePixi(): void {
    try {
      this.app = new PIXI.Application({
        view: this.canvas,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundAlpha: 0,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });
    } catch (error) {
      console.error('Failed to initialize PIXI application, falling back to UI placeholder:', error);
      this.app = null;
    }
  }

  async loadModel(modelDir: string, modelName: string = 'Haru'): Promise<boolean> {
    console.log(`Attempting to load model from: ${modelDir}/${modelName}`);

    if (!this.app || this.destroyed) {
      return false;
    }

    try {
      const { Live2DModel } = await import('pixi-live2d-display/cubism4');
      Live2DModel.registerTicker(Ticker);
      const live2dModel = await Live2DModel.from(`${modelDir}/${modelName}.model3.json`, {
        autoInteract: false,
      });

      if (!this.app || this.destroyed) {
        return false;
      }

      this.app.stage.removeChildren();
      this.app.stage.addChild(live2dModel as any);

      this.model = live2dModel;
      this.positionModel();

      this.modelLoaded = true;
      this.startIdleAnimation();
      console.log('Live2D model loaded successfully!');
      return true;
    } catch (error) {
      console.warn('Live2D model loading failed, using placeholder:', error);
      this.showPlaceholder();
      return false;
    }
  }

  private showPlaceholder(): void {
    if (!this.app) {
      this.drawCanvasPlaceholder();
      this.modelLoaded = false;
      console.log('Using canvas placeholder instead of Live2D model');
      return;
    }

    this.app.stage.removeChildren();

    const placeholder = PIXI.Sprite.from('/models/Haru/placeholder.svg');
    placeholder.anchor.set(0.5);

    const scale = Math.min(
      (window.innerWidth * 0.6) / placeholder.width,
      (window.innerHeight * 0.6) / placeholder.height,
    );
    placeholder.scale.set(scale);
    placeholder.x = window.innerWidth / 2;
    placeholder.y = window.innerHeight / 2;

    this.placeholder = placeholder;
    this.app.stage.addChild(placeholder);
    this.modelLoaded = false;

    console.log('Using PIXI placeholder instead of Live2D model');
  }

  private drawCanvasPlaceholder(): void {
    const context = this.canvas.getContext('2d');
    if (!context) {
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(dpr, dpr);
    context.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    context.beginPath();
    context.arc(centerX, centerY, Math.min(width, height) * 0.16, 0, Math.PI * 2);
    context.fillStyle = 'rgba(255, 255, 255, 0.14)';
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    context.stroke();

    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = '96px sans-serif';
    context.fillText('🦞', centerX, centerY - 20);

    context.font = '600 24px sans-serif';
    context.fillStyle = 'rgba(255, 255, 255, 0.92)';
    context.fillText('Claw-Pet', centerX, centerY + 78);

    context.font = '14px sans-serif';
    context.fillStyle = 'rgba(255, 255, 255, 0.72)';
    context.fillText('Live2D fallback preview', centerX, centerY + 106);
  }

  private positionModel(): void {
    if (!this.model) return;
    const scale = Math.min(
      (window.innerWidth * 0.8) / this.model.width,
      (window.innerHeight * 0.8) / this.model.height,
    );
    this.model.scale.set(scale);
    this.model.x = (window.innerWidth - this.model.width * scale) / 2;
    this.model.y = (window.innerHeight - this.model.height * scale) / 2;
  }

  private startIdleAnimation(): void {
    this.stopIdleAnimation();
    let index = 0;
    const playIdle = () => {
      if (this.model && !this.destroyed) {
        this.model.motion('Idle', index);
        index = (index + 1) % 2;
      }
    };
    playIdle();
    this.idleTimer = window.setInterval(playIdle, 10000);
  }

  private stopIdleAnimation(): void {
    if (this.idleTimer !== null) {
      window.clearInterval(this.idleTimer);
      this.idleTimer = null;
    }
  }

  update(_deltaTime: number): void {
    if (this.placeholder) {
      this.placeholder.rotation += 0.001;
    }
  }

  playMotion(groupName: string, motionIndex: number = 0): void {
    if (this.model) {
      this.model.motion(groupName, motionIndex);
    }
  }

  setExpression(name: string): void {
    if (this.model) {
      this.model.expression(name);
    }
  }

  destroy(): void {
    this.destroyed = true;
    this.stopIdleAnimation();

    if (this.animationFrame !== null) {
      window.cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    this.model = null;

    if (this.placeholder) {
      this.placeholder.destroy();
      this.placeholder = null;
    }

    if (this.app) {
      this.app.destroy(false);
      this.app = null;
    }
  }

  resize(width: number, height: number): void {
    if (this.app) {
      this.app.renderer.resize(width, height);
      if (this.model) {
        this.positionModel();
      } else if (this.placeholder) {
        this.placeholder.x = width / 2;
        this.placeholder.y = height / 2;
        const scale = Math.min(
          (width * 0.6) / this.placeholder.width,
          (height * 0.6) / this.placeholder.height,
        );
        this.placeholder.scale.set(scale);
      }
      return;
    }

    this.drawCanvasPlaceholder();
  }

  startAnimationLoop(): void {
    if (this.app) {
      this.app.ticker.add((deltaTime) => {
        this.update(deltaTime);
      });
      return;
    }

    const tick = () => {
      this.update(0);
      this.animationFrame = window.requestAnimationFrame(tick);
    };

    if (this.animationFrame === null) {
      tick();
    }
  }

  isModelLoaded(): boolean {
    return this.modelLoaded;
  }
}

export default HaruLive2DLoader;
