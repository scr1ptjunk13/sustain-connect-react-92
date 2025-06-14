
import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, RotateCcw, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCamera } from '@/hooks/useCamera';

interface CameraCaptureProps {
  onCapture: (photoData: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose, isOpen }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const { isSupported, stream, startCamera, stopCamera, capturePhoto, takePhotoFromFile } = useCamera();

  useEffect(() => {
    if (isOpen && isSupported) {
      initCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const initCamera = async () => {
    const mediaStream = await startCamera({ facingMode });
    if (mediaStream && videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    }
  };

  const handleCapture = async () => {
    if (videoRef.current) {
      const photoData = await capturePhoto(videoRef.current);
      onCapture(photoData);
      stopCamera();
      onClose();
    }
  };

  const handleFileCapture = async () => {
    const photoData = await takePhotoFromFile();
    if (photoData) {
      onCapture(photoData);
      onClose();
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="relative h-full w-full">
        {isSupported ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
            
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 text-white hover:bg-black/70"
                onClick={onClose}
              >
                <X className="h-6 w-6" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 text-white hover:bg-black/70"
                onClick={toggleCamera}
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-8">
              <Button
                variant="outline"
                size="icon"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                onClick={handleFileCapture}
              >
                <Image className="h-6 w-6" />
              </Button>
              
              <Button
                size="icon"
                className="w-16 h-16 rounded-full bg-white text-black hover:bg-gray-200"
                onClick={handleCapture}
              >
                <Camera className="h-8 w-8" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <Camera className="h-16 w-16 mb-4 text-gray-400" />
            <p className="text-lg mb-4">Camera not available</p>
            <Button
              variant="outline"
              onClick={handleFileCapture}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Image className="h-4 w-4 mr-2" />
              Select from Gallery
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
