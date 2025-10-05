import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  return (
    <div
      className={`bg-gradient-to-br ${color} rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="bg-white/20 p-3 rounded-lg">
          {icon}
        </div>
      </div>
      <h3 className="text-3xl font-bold mb-2">{value}</h3>
      <p className="text-sm opacity-90">{title}</p>
    </div>
  );
};

export default StatsCard;
