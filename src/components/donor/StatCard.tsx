
import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon,
  className,
  trend
}) => {
  return (
    <div className={cn(
      "bg-white rounded-lg p-4 shadow-sm border",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-1">
              <span className={trend.isPositive ? "text-primary-500" : "text-destructive"}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className="bg-primary-50 p-3 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
