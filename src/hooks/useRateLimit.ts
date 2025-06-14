
import { useState, useEffect } from 'react';

interface RateLimitState {
  remaining: number;
  resetTime: number;
  isLimited: boolean;
}

export const useRateLimit = (key: string, limit: number = 60, windowMs: number = 60000) => {
  const [state, setState] = useState<RateLimitState>({
    remaining: limit,
    resetTime: Date.now() + windowMs,
    isLimited: false
  });

  const checkRateLimit = () => {
    const now = Date.now();
    const storageKey = `rateLimit_${key}`;
    const stored = localStorage.getItem(storageKey);
    
    let currentState = { count: 0, resetTime: now + windowMs };
    
    if (stored) {
      currentState = JSON.parse(stored);
      
      // Reset if window has passed
      if (now > currentState.resetTime) {
        currentState = { count: 0, resetTime: now + windowMs };
      }
    }

    const remaining = Math.max(0, limit - currentState.count);
    const isLimited = remaining === 0;

    setState({
      remaining,
      resetTime: currentState.resetTime,
      isLimited
    });

    return { allowed: !isLimited, remaining };
  };

  const consumeToken = () => {
    const { allowed } = checkRateLimit();
    
    if (allowed) {
      const storageKey = `rateLimit_${key}`;
      const stored = localStorage.getItem(storageKey);
      let currentState = { count: 0, resetTime: Date.now() + windowMs };
      
      if (stored) {
        currentState = JSON.parse(stored);
      }
      
      currentState.count += 1;
      localStorage.setItem(storageKey, JSON.stringify(currentState));
      
      checkRateLimit();
      return true;
    }
    
    return false;
  };

  useEffect(() => {
    checkRateLimit();
  }, [key]);

  return {
    ...state,
    consumeToken,
    checkRateLimit
  };
};
