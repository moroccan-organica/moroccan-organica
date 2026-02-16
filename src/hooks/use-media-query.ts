import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Set value if it changed since initialization
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // Create listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Use preferred method for modern browsers
    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } else {
      // Fallback for older browsers
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, [query, matches]);

  return matches;
}
