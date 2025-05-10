
import React from 'react';

interface StatisticCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  icon
}) => {
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="p-2 bg-primary/10 rounded-full w-fit mb-2">
        {icon}
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  );
};

export default StatisticCard;
