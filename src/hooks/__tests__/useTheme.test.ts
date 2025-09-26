import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../useTheme';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('useTheme', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset document classList
    document.documentElement.className = '';
  });

  it('should initialize with system theme by default', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('system');
  });

  it('should load theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('dark');

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
  });

  it('should apply light theme to document', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('light');
    });

    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('should apply dark theme to document', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('should handle system theme preference', () => {
    // Mock system prefers dark
    window.matchMedia.mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('system');
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should persist theme changes to localStorage', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');

    act(() => {
      result.current.setTheme('light');
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
  });
});
