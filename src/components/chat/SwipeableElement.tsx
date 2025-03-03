'use client';

import { cn } from '@/lib/utils';
import { Reply } from 'lucide-react';
import type React from 'react';
import { useState, useCallback } from 'react';

interface SwipeableProps {
  children: React.ReactNode;
  onSwipe: () => void;
  direction?: 'left' | 'right';
  threshold?: number;
  className?: string;
}

export default function SwipeableElement({
  children,
  onSwipe,
  direction = 'right',
  threshold = 100,
  className = '',
}: SwipeableProps) {
  const [startX, setStartX] = useState<number | null>(null);
  const [currentX, setCurrentX] = useState(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (startX === null) return;

      const diff = e.touches[0].clientX - startX;

      // Set a max point
      const maxDiff =
        direction === 'right' ? -(threshold * 1.5) : threshold * 1.5;
      if (Math.abs(diff) > Math.abs(maxDiff)) return;

      const allowedDirection =
        (direction === 'right' && diff > 0) ||
        (direction === 'left' && diff < 0);
      if (allowedDirection) {
        setCurrentX(diff);
      }
    },
    [startX, direction, threshold],
  );

  const handleTouchEnd = useCallback(() => {
    if (Math.abs(currentX) >= threshold) {
      onSwipe();
    }
    setStartX(null);
    setCurrentX(0);
  }, [currentX, threshold, onSwipe]);

  return (
    <div
      className={cn('relative touch-pan-y', className)}
      style={{
        transform: `translateX(${currentX}px)`,
        transition: startX !== null ? 'none' : 'transform 0.3s ease-out',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <Reply
        className={cn(
          'absolute top-1/2 size-6 -translate-y-1/2',
          direction === 'right' ? '-left-12' : '-right-12',
          startX !== null
            ? 'opacity-100 delay-100 duration-500 motion-safe:animate-bounce motion-safe:transition-opacity'
            : 'opacity-0',
        )}
      />
      {children}
    </div>
  );
}
