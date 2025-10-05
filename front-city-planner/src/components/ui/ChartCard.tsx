import React from 'react';

interface ChartCardProps {
  title: string;
  children?: React.ReactNode;
  bgColor?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
                                               title,
                                               children,
                                               bgColor = 'from-gray-900/50 to-gray-800/50'
                                             }) => {
  return (
    <div className="bg-gray-900/40 backdrop-blur-sm border border-purple-500/20 rounded-xl shadow-2xl p-6 hover:border-purple-500/40 transition-all duration-300">
      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
        {title}
      </h2>
      <div className={`h-64 bg-gradient-to-br ${bgColor} rounded-lg flex items-center justify-center border border-white/5`}>
        {children || <p className="text-gray-400">Gráfica de estadísticas</p>}
      </div>
    </div>
  );
};

export default ChartCard;
