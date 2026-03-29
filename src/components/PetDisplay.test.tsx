import { beforeEach, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PetDisplay } from './PetDisplay';

const mockLoadModel = vi.fn();
const mockStartAnimationLoop = vi.fn();
const mockResize = vi.fn();
const mockDestroy = vi.fn();
const mockPlayMotion = vi.fn();
const mockSetExpression = vi.fn();

vi.mock('../lib/live2d/HaruLoader', () => ({
  default: vi.fn().mockImplementation(() => ({
    loadModel: mockLoadModel,
    startAnimationLoop: mockStartAnimationLoop,
    resize: mockResize,
    destroy: mockDestroy,
    playMotion: mockPlayMotion,
    setExpression: mockSetExpression,
  })),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockLoadModel.mockResolvedValue(false);
});

test('shows fallback overlay when live2d model fails to load', async () => {
  render(<PetDisplay />);

  expect(await screen.findByText('Live2D fallback preview')).toBeInTheDocument();
  expect(mockStartAnimationLoop).toHaveBeenCalledTimes(1);
});
