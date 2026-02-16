'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseAutosaveStatusProps {
  delay?: number;
  onSave?: () => void;
}

export function useAutosaveStatus({ delay = 600, onSave }: UseAutosaveStatusProps = {}) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleAutoSave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setLastSaved(new Date());
      onSave?.();
    }, delay);
  }, [delay, onSave]);

  const formatLastSaved = useCallback(() => {
    if (!lastSaved) return null;
    const time = lastSaved.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const date = lastSaved.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    return `Draft saved at ${time}. Last edited on ${date}`;
  }, [lastSaved]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return {
    lastSaved,
    scheduleAutoSave,
    formatLastSaved,
  };
}
