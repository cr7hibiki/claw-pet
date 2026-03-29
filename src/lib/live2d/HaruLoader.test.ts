import { afterEach, beforeEach, expect, test, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  const placeholderAnchorSet = vi.fn();
  const placeholderScaleSet = vi.fn();

  return {
    registerTicker: vi.fn(),
    from: vi.fn(),
    stageRemoveChildren: vi.fn(),
    stageAddChild: vi.fn(),
    rendererResize: vi.fn(),
    tickerAdd: vi.fn(),
    appDestroy: vi.fn(),
    placeholderAnchorSet,
    placeholderScaleSet,
    spriteFrom: vi.fn(() => ({
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      rotation: 0,
      anchor: { set: placeholderAnchorSet },
      scale: { set: placeholderScaleSet },
      destroy: vi.fn(),
    })),
    modelScaleSet: vi.fn(),
    modelMotion: vi.fn(),
    modelExpression: vi.fn(),
  };
});

vi.mock('@pixi/ticker', () => ({
  Ticker: {},
}));

vi.mock('pixi-live2d-display/cubism4', () => ({
  Live2DModel: {
    registerTicker: mocks.registerTicker,
    from: mocks.from,
  },
}));

vi.mock('pixi.js', () => ({
  Application: class {
    stage = {
      removeChildren: mocks.stageRemoveChildren,
      addChild: mocks.stageAddChild,
    };

    renderer = {
      resize: mocks.rendererResize,
    };

    ticker = {
      add: mocks.tickerAdd,
    };

    destroy = mocks.appDestroy;
  },
  Sprite: {
    from: mocks.spriteFrom,
  },
}));

import { HaruLive2DLoader } from './HaruLoader';

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

test('loads Haru model from the expected model3 path and starts idle motion loop', async () => {
  vi.useFakeTimers();

  const model = {
    width: 400,
    height: 800,
    scale: { set: mocks.modelScaleSet },
    motion: mocks.modelMotion,
    expression: mocks.modelExpression,
    x: 0,
    y: 0,
  };
  mocks.from.mockResolvedValue(model);

  const loader = new HaruLive2DLoader(document.createElement('canvas'));
  const result = await loader.loadModel('/models/Haru', 'Haru');

  expect(mocks.registerTicker).toHaveBeenCalledTimes(1);
  expect(mocks.from).toHaveBeenCalledWith('/models/Haru/Haru.model3.json', expect.any(Object));
  expect(mocks.modelMotion).toHaveBeenNthCalledWith(1, 'Idle', 0);

  vi.advanceTimersByTime(10000);
  expect(mocks.modelMotion).toHaveBeenNthCalledWith(2, 'Idle', 1);

  vi.advanceTimersByTime(10000);
  expect(mocks.modelMotion).toHaveBeenNthCalledWith(3, 'Idle', 0);
  expect(result).toBe(true);

  loader.destroy();
});

test('returns false and shows placeholder when model loading throws', async () => {
  mocks.from.mockRejectedValue(new Error('load failed'));

  const loader = new HaruLive2DLoader(document.createElement('canvas'));
  const result = await loader.loadModel('/models/Haru', 'Haru');

  expect(result).toBe(false);
  expect(mocks.spriteFrom).toHaveBeenCalledWith('/models/Haru/placeholder.svg');
  expect(mocks.stageRemoveChildren).toHaveBeenCalled();
  expect(mocks.stageAddChild).toHaveBeenCalled();

  loader.destroy();
});
