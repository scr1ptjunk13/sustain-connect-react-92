
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export const useServiceWorker = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const swRegistration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker registered:', swRegistration);
      setRegistration(swRegistration);
      setIsRegistered(true);

      // Listen for service worker updates
      swRegistration.addEventListener('updatefound', () => {
        const newWorker = swRegistration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              toast({
                title: "App Updated",
                description: "A new version is available. Refresh to update."
              });
            }
          });
        }
      });

    } catch (error) {
      console.error('Service Worker registration failed:', error);
      toast({
        title: "Service Worker Error",
        description: "Failed to register service worker for notifications",
        variant: "destructive"
      });
    }
  };

  return {
    isRegistered,
    registration
  };
};
