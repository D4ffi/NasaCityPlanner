import React from 'react';

interface ComparisonCardProps {
  leftTitle: string;
  leftValue: string;
  leftSubtitle?: string;
  rightTitle: string;
  rightValue: string;
  rightSubtitle?: string;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({
  leftTitle,
  leftValue,
  leftSubtitle,
  rightTitle,
  rightValue,
  rightSubtitle,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-sm border border-purple-500/30 shadow-xl">
      {/* Diagonal divider */}
      <div className="absolute inset-0">
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <line
            x1="0"
            y1="100"
            x2="100"
            y2="0"
            stroke="rgba(168, 85, 247, 0.3)"
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 h-full min-h-[280px] flex flex-col">
        <h3 className="text-white font-bold text-xl mb-6 text-center">
          Comparativa de Desigualdad
        </h3>

        <div className="flex-1 grid grid-cols-2 gap-4">
          {/* Left side - Veracruz */}
          <div className="flex flex-col justify-center items-center text-center pr-4">
            <p className="text-purple-300 text-sm font-medium mb-2">{leftTitle}</p>
            <div className="bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-xl p-6 w-full border border-blue-500/20">
              <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {leftValue}
              </p>
              {leftSubtitle && (
                <p className="text-xs text-gray-400 mt-2">{leftSubtitle}</p>
              )}
            </div>
          </div>

          {/* Right side - México */}
          <div className="flex flex-col justify-start items-center text-center pl-4 pt-8">
            <p className="text-orange-300 text-sm font-medium mb-2">{rightTitle}</p>
            <div className="bg-gradient-to-br from-red-600/30 to-orange-600/30 rounded-xl p-6 w-full border border-red-500/20">
              <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                {rightValue}
              </p>
              {rightSubtitle && (
                <p className="text-xs text-gray-400 mt-2">{rightSubtitle}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Fuente: Índice de Desigualdad Urbana - WRI México 2021
          </p>
        </div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
};

export default ComparisonCard;
