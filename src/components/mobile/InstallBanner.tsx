
import React from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/usePWA';

const InstallBanner: React.FC = () => {
  const { isInstallable, installApp } = usePWA();
  const [dismissed, setDismissed] = React.useState(
    localStorage.getItem('install-banner-dismissed') === 'true'
  );

  const handleInstall = () => {
    installApp();
    setDismissed(true);
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('install-banner-dismissed', 'true');
  };

  if (!isInstallable || dismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 bg-primary text-primary-foreground rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Download className="h-5 w-5" />
          <div>
            <p className="font-medium text-sm">Install SustainConnect</p>
            <p className="text-xs opacity-90">Get the full app experience</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleInstall}
            className="text-xs"
          >
            Install
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InstallBanner;
