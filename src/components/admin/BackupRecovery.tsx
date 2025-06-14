
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Database, Download, Upload, Calendar, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BackupRecord {
  id: string;
  name: string;
  size: string;
  created_at: string;
  type: 'automatic' | 'manual';
  status: 'completed' | 'in_progress' | 'failed';
}

const BackupRecovery: React.FC = () => {
  const [backups, setBackups] = useState<BackupRecord[]>([
    {
      id: '1',
      name: 'Full Database Backup - 2024-06-14',
      size: '2.4 GB',
      created_at: '2024-06-14T02:00:00Z',
      type: 'automatic',
      status: 'completed'
    },
    {
      id: '2',
      name: 'User Data Backup - 2024-06-13',
      size: '1.8 GB',
      created_at: '2024-06-13T02:00:00Z',
      type: 'automatic',
      status: 'completed'
    },
    {
      id: '3',
      name: 'Manual Backup - Pre-Update',
      size: '2.1 GB',
      created_at: '2024-06-12T14:30:00Z',
      type: 'manual',
      status: 'completed'
    }
  ]);

  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const createManualBackup = async () => {
    setIsBackingUp(true);
    setBackupProgress(0);

    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          
          // Add new backup to list
          const newBackup: BackupRecord = {
            id: Date.now().toString(),
            name: `Manual Backup - ${new Date().toLocaleDateString()}`,
            size: '2.3 GB',
            created_at: new Date().toISOString(),
            type: 'manual',
            status: 'completed'
          };
          
          setBackups(prev => [newBackup, ...prev]);
          
          toast({
            title: "Backup Completed",
            description: "Manual backup has been created successfully"
          });
          
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const downloadBackup = (backup: BackupRecord) => {
    // In a real implementation, this would download the backup file
    toast({
      title: "Download Started",
      description: `Downloading ${backup.name}`
    });
  };

  const restoreBackup = async (backup: BackupRecord) => {
    setIsRestoring(true);
    
    // Simulate restore process
    setTimeout(() => {
      setIsRestoring(false);
      toast({
        title: "Restore Completed",
        description: `System restored from ${backup.name}`
      });
    }, 3000);
  };

  const getStatusColor = (status: BackupRecord['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'failed':
        return 'bg-red-500';
    }
  };

  const getTypeColor = (type: BackupRecord['type']) => {
    return type === 'automatic' ? 'bg-blue-500' : 'bg-purple-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Database className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Backup & Recovery</h2>
      </div>

      {/* Backup Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-semibold">Automatic Backups</p>
                <p className="text-sm text-muted-foreground">Daily at 2:00 AM</p>
              </div>
            </div>
            <Badge className="bg-green-500">Enabled</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-8 w-8 text-purple-500" />
              <div>
                <p className="font-semibold">Last Backup</p>
                <p className="text-sm text-muted-foreground">14 hours ago</p>
              </div>
            </div>
            <Badge className="bg-green-500">Success</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="h-8 w-8 text-orange-500" />
              <div>
                <p className="font-semibold">Total Backups</p>
                <p className="text-sm text-muted-foreground">{backups.length} available</p>
              </div>
            </div>
            <Button 
              onClick={createManualBackup} 
              disabled={isBackingUp}
              className="w-full"
            >
              Create Backup
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Backup Progress */}
      {isBackingUp && (
        <Card>
          <CardHeader>
            <CardTitle>Creating Backup...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{backupProgress}%</span>
              </div>
              <Progress value={backupProgress} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Restore Progress */}
      {isRestoring && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Restoring System...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Please do not close this window. The system will be unavailable during restoration.
              </p>
              <Progress value={66} className="animate-pulse" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Backup List */}
      <Card>
        <CardHeader>
          <CardTitle>Backup History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {backups.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{backup.name}</h3>
                    <Badge className={getTypeColor(backup.type)}>
                      {backup.type}
                    </Badge>
                    <Badge className={getStatusColor(backup.status)}>
                      {backup.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span>Size: {backup.size}</span>
                    <span className="mx-2">•</span>
                    <span>Created: {new Date(backup.created_at).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadBackup(backup)}
                    className="flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        disabled={isRestoring}
                      >
                        <Upload className="h-4 w-4" />
                        Restore
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Restore System</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to restore the system from "{backup.name}"? 
                          This will overwrite all current data and cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => restoreBackup(backup)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Restore
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupRecovery;
