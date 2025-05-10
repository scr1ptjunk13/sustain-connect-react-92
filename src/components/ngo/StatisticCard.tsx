
import React from 'react';

interface StatisticCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  bgColor?: string;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  icon,
  trend,
  bgColor = 'bg-white'
}) => {
  return (
    <div className={`${bgColor} p-4 rounded-lg border shadow-sm`}>
      <div className="flex justify-between items-start mb-2">
        <div className="p-2 bg-secondary/10 rounded-full">
          {icon}
        </div>
        {trend && (
          <div className={`text-xs flex items-center ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.isPositive ? '+' : '-'}{trend.value}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  );
};

export default StatisticCard;
