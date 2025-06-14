
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Server, Database, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SystemHealth {
  service: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  lastCheck: string;
  responseTime: number;
}

interface ErrorLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  service: string;
}

const SystemMonitoring: React.FC = () => {
  const [healthChecks, setHealthChecks] = useState<SystemHealth[]>([
    {
      service: 'Database',
      status: 'healthy',
      uptime: 99.9,
      lastCheck: new Date().toISOString(),
      responseTime: 45
    },
    {
      service: 'Authentication',
      status: 'healthy',
      uptime: 99.8,
      lastCheck: new Date().toISOString(),
      responseTime: 32
    },
    {
      service: 'File Storage',
      status: 'warning',
      uptime: 98.5,
      lastCheck: new Date().toISOString(),
      responseTime: 120
    },
    {
      service: 'Email Service',
      status: 'healthy',
      uptime: 99.7,
      lastCheck: new Date().toISOString(),
      responseTime: 78
    }
  ]);

  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      level: 'error',
      message: 'Failed to send notification email',
      service: 'Email Service'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      level: 'warning',
      message: 'High response time detected',
      service: 'File Storage'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      level: 'info',
      message: 'System backup completed successfully',
      service: 'Database'
    }
  ]);

  const [performanceData] = useState([
    { time: '00:00', cpu: 45, memory: 62, requests: 120 },
    { time: '04:00', cpu: 52, memory: 58, requests: 89 },
    { time: '08:00', cpu: 78, memory: 71, requests: 245 },
    { time: '12:00', cpu: 65, memory: 69, requests: 189 },
    { time: '16:00', cpu: 59, memory: 65, requests: 156 },
    { time: '20:00', cpu: 48, memory: 61, requests: 134 }
  ]);

  const getStatusIcon = (status: SystemHealth['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: SystemHealth['status']) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
    }
  };

  const getLevelColor = (level: ErrorLog['level']) => {
    switch (level) {
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
    }
  };

  const refreshHealthChecks = () => {
    // Simulate refreshing health checks
    setHealthChecks(prev => prev.map(check => ({
      ...check,
      lastCheck: new Date().toISOString(),
      responseTime: Math.floor(Math.random() * 100) + 20
    })));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6" />
          <h2 className="text-2xl font-bold">System Monitoring</h2>
        </div>
        <Button onClick={refreshHealthChecks} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {healthChecks.map((check) => (
          <Card key={check.service}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{check.service}</CardTitle>
              {getStatusIcon(check.status)}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge className={getStatusColor(check.status)}>
                  {check.status.toUpperCase()}
                </Badge>
                <div className="text-xs text-muted-foreground">
                  <div>Uptime: {check.uptime}%</div>
                  <div>Response: {check.responseTime}ms</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Charts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Performance (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="cpu" 
                  stroke="#8884d8" 
                  name="CPU %" 
                />
                <Line 
                  type="monotone" 
                  dataKey="memory" 
                  stroke="#82ca9d" 
                  name="Memory %" 
                />
                <Line 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="#ffc658" 
                  name="Requests/min" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Error Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Recent Error Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {errorLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <Badge className={getLevelColor(log.level)}>
                  {log.level.toUpperCase()}
                </Badge>
                <div className="flex-1">
                  <div className="font-medium">{log.message}</div>
                  <div className="text-sm text-muted-foreground">
                    {log.service} • {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMonitoring;
