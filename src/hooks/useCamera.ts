
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface CameraOptions {
  facingMode?: 'user' | 'environment';
  width?: number;
  height?: number;
  quality?: number;
}

export const useCamera = () => {
  const [isSupported, setIsSupported] = useState(
    !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  );
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async (options: CameraOptions = {}) => {
    if (!isSupported) {
      setError('Camera not supported on this device');
      toast({
        title: "Camera Not Available",
        description: "Your device doesn't support camera access",
        variant: "destructive"
      });
      return null;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: options.facingMode || 'environment',
          width: options.width || 1280,
          height: options.height || 720
        }
      });

      setStream(mediaStream);
      setIsActive(true);
      setError(null);
      return mediaStream;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to access camera';
      setError(errorMessage);
      
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to take photos",
        variant: "destructive"
      });
      
      return null;
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsActive(false);
    }
  };

  const capturePhoto = (videoElement: HTMLVideoElement): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      
      context.drawImage(videoElement, 0, 0);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      resolve(dataUrl);
    });
  };

  const takePhotoFromFile = (): Promise<string | null> => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        } else {
          resolve(null);
        }
      };
      
      input.click();
    });
  };

  return {
    isSupported,
    isActive,
    stream,
    error,
    startCamera,
    stopCamera,
    capturePhoto,
    takePhotoFromFile
  };
};
