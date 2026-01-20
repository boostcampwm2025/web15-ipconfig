import { useMemo } from 'react';
import { throttle } from '@/common/lib/timing';

export function useThrottledCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
): (...args: Args) => void {
  return useMemo(() => throttle(callback, delay), [callback, delay]);
}
