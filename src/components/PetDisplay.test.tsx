import { beforeEach, expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

test('plays tap motion on canvas click', async () => {
  const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

  const { container } = render(<PetDisplay />);

  await screen.findByText('Live2D fallback preview');

  const canvas = container.querySelector('#live2d-canvas');
  expect(canvas).not.toBeNull();

  fireEvent.click(canvas!);

  expect(mockPlayMotion).toHaveBeenCalledWith('TapBody', 2);

  randomSpy.mockRestore();
});

test('changes expression when expression button clicked', async () => {
  render(<PetDisplay />);

  await screen.findByText('Live2D fallback preview');
  fireEvent.click(screen.getByRole('button', { name: '查看状态' }));
  fireEvent.click(screen.getByRole('button', { name: 'F03' }));

  expect(mockSetExpression).toHaveBeenCalledWith('F03');
});
