
import React, { useState } from 'react';
import { Camera, Image, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CameraCapture from './CameraCapture';
import { useCamera } from '@/hooks/useCamera';
import { toast } from '@/components/ui/use-toast';

interface PhotoUploadProps {
  onPhotoSelect: (file: File, dataUrl: string) => void;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  className?: string;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onPhotoSelect,
  maxSizeMB = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = ''
}) => {
  const [showCamera, setShowCamera] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { isSupported } = useCamera();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please select a valid image file (JPEG, PNG, or WebP)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: `Please select an image smaller than ${maxSizeMB}MB`,
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      onPhotoSelect(file, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (dataUrl: string) => {
    // Convert data URL to file
    fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
        setPreview(dataUrl);
        onPhotoSelect(file, dataUrl);
      })
      .catch(error => {
        console.error('Error converting photo:', error);
        toast({
          title: "Error",
          description: "Failed to process the photo",
          variant: "destructive"
        });
      });
  };

  const clearPhoto = () => {
    setPreview(null);
  };

  return (
    <div className={className}>
      {preview ? (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={preview}
                alt="Selected photo"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={clearPhoto}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Image className="h-8 w-8 text-muted-foreground" />
              </div>
              
              <div>
                <h3 className="font-medium">Add Photo</h3>
                <p className="text-sm text-muted-foreground">
                  Take a photo or select from gallery
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {isSupported && (
                  <Button
                    variant="outline"
                    onClick={() => setShowCamera(true)}
                    className="flex flex-col items-center space-y-2 h-auto py-4"
                  >
                    <Camera className="h-5 w-5" />
                    <span className="text-xs">Camera</span>
                  </Button>
                )}
                
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept={acceptedTypes.join(',')}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center space-y-2 h-auto py-4 px-3 border border-input rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                    <Upload className="h-5 w-5" />
                    <span className="text-xs">Gallery</span>
                  </div>
                </label>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Max size: {maxSizeMB}MB
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      <CameraCapture
        isOpen={showCamera}
        onCapture={handleCameraCapture}
        onClose={() => setShowCamera(false)}
      />
    </div>
  );
};

export default PhotoUpload;
