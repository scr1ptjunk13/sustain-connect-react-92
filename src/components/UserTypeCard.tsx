
import React from 'react';
import { ArrowRight, Heart, Building, Truck } from 'lucide-react';

interface UserTypeCardProps {
  type: 'donor' | 'ngo' | 'delivery';
  onSelect: () => void;
}

const UserTypeCard: React.FC<UserTypeCardProps> = ({ type, onSelect }) => {
  const types = {
    donor: {
      title: 'Donor',
      description: 'Donate items, funds, or resources to support communities in need.',
      icon: <Heart className="w-6 h-6 text-primary-500" />,
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200',
    },
    ngo: {
      title: 'NGO',
      description: 'Manage donations, organize distribution, and track impacts.',
      icon: <Building className="w-6 h-6 text-secondary-500" />,
      bgColor: 'bg-secondary-50',
      borderColor: 'border-secondary-200',
    },
    delivery: {
      title: 'Delivery Personnel',
      description: 'Transport donations from donors to NGOs or directly to recipients.',
      icon: <Truck className="w-6 h-6 text-muted-foreground" />,
      bgColor: 'bg-muted',
      borderColor: 'border-muted',
    },
  };

  const { title, description, icon, bgColor, borderColor } = types[type];

  return (
    <button 
      onClick={onSelect}
      className={`w-full p-5 ${bgColor} rounded-xl border ${borderColor} hover:shadow-md transition-all duration-300 flex items-start justify-between gap-3`}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1">{icon}</div>
        <div className="text-left">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
        </div>
      </div>
      <ArrowRight className="w-5 h-5 text-gray-400 mt-1.5" />
    </button>
  );
};

export default UserTypeCard;
