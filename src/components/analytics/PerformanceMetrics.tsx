
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';

interface MetricData {
  label: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

interface PerformanceMetricsProps {
  metrics: MetricData[];
  title: string;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics, title }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      default: return <AlertCircle className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric, index) => {
          const percentage = Math.min((metric.value / metric.target) * 100, 100);
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{metric.label}</span>
                <div className="flex items-center gap-1">
                  {getTrendIcon(metric.trend)}
                  <Badge variant="outline" className={getStatusColor(metric.status)}>
                    {metric.value}{metric.unit}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-1">
                <Progress value={percentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Current: {metric.value}{metric.unit}</span>
                  <span>Target: {metric.target}{metric.unit}</span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
