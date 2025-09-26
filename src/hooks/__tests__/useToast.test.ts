import { renderHook, act } from '@testing-library/react';
import { useToast } from '../useToast';

describe('useToast', () => {
  beforeEach(() => {
    // Clear any existing toasts
    jest.clearAllTimers();
  });

  it('should initialize with empty toasts array', () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.toasts).toEqual([]);
  });

  it('should add a toast with addToast method', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.addToast('success', 'Test Toast', 'This is a test');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      id: expect.any(String),
      type: 'success',
      title: 'Test Toast',
      message: 'This is a test',
    });
  });

  it('should add a toast with convenience methods', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Success!', 'Operation completed');
    });

    expect(result.current.toasts[0]).toMatchObject({
      title: 'Success!',
      message: 'Operation completed',
      type: 'success',
    });
  });

  it('should remove a toast by id', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.addToast('info', 'Test Toast');
    });

    const toastId = result.current.toasts[0].id;

    act(() => {
      result.current.removeToast(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('should clear all toasts', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.addToast('success', 'Toast 1');
      result.current.addToast('error', 'Toast 2');
      result.current.addToast('warning', 'Toast 3');
    });

    expect(result.current.toasts).toHaveLength(3);

    act(() => {
      result.current.clearAllToasts();
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('should support different toast types', () => {
    const { result } = renderHook(() => useToast());
    const types = ['success', 'error', 'warning', 'info'] as const;

    types.forEach((type) => {
      act(() => {
        result.current[type]('Test message');
      });
    });

    expect(result.current.toasts).toHaveLength(types.length);
    types.forEach((type, index) => {
      expect(result.current.toasts[index].type).toBe(type);
    });
  });
});
