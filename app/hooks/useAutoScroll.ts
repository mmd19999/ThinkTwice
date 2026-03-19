'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Auto-scroll to the latest active section.
 * Disables auto-scroll when user manually scrolls up,
 * re-enables when user scrolls back to the bottom.
 */
export function useAutoScroll(trigger: unknown) {
  const targetRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef(false);
  const lastTriggerRef = useRef(trigger);

  // Track user scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom =
        window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;

      // User is "at bottom" if within 200px of the bottom
      if (docHeight - scrollBottom < 200) {
        userScrolledRef.current = false;
      } else {
        userScrolledRef.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll when trigger changes
  useEffect(() => {
    if (trigger === lastTriggerRef.current) return;
    lastTriggerRef.current = trigger;

    if (userScrolledRef.current) return;

    const timeout = setTimeout(() => {
      targetRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [trigger]);

  const scrollToTarget = useCallback(() => {
    userScrolledRef.current = false;
    targetRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  return { targetRef, scrollToTarget };
}
