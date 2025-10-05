import React, { useState } from 'react';
import { Home, Map, ChevronLeft, ChevronRight } from 'lucide-react';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  id: string;
}

interface SidebarProps {
  onNavigate: (view: string) => void;
  activeView: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activeView }) => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems: MenuItem[] = [
    { icon: <Home size={24} />, label: 'Dashboard', id: 'dashboard' },
    { icon: <Map size={24} />, label: 'Mapa', id: 'map' },
  ];

  return (
    <div
      className={`${
        isOpen ? 'w-80' : 'w-20'
      } bg-gradient-to-b from-indigo-950 via-purple-950 to-black text-white transition-all duration-300 ease-in-out shadow-2xl flex flex-col border-r border-purple-500/20 relative overflow-hidden`}
    >
      {/* Efecto de estrellas en el fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.4 + 0.1,
            }}
          />
        ))}
      </div>

      {/* Efecto de luz de fondo */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-500/5 to-transparent blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="p-6 border-b border-indigo-500 flex items-center justify-between">
        <h1 className={`font-bold text-2xl ${!isOpen && 'hidden'} ${
          // CLASE AGREGADA: Mismo color que el footer y los elementos de navegación
          isOpen && 'bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400'
        }`}>
          Data Pathways
        </h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          aria-label={isOpen ? 'Cerrar sidebar' : 'Abrir sidebar'}
        >
          {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto relative z-10">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
              activeView === item.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-purple-500/50'
                : 'hover:bg-white/5 border border-transparent hover:border-purple-500/30'
            }`}
          >
            {/* Efecto de brillo en hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

            <span className={`flex-shrink-0 relative z-10 ${
              activeView === item.id ? 'text-white' : 'text-blue-400 group-hover:text-purple-400'
            } transition-colors`}>
              {item.icon}
            </span>

            {isOpen && (
              <span className="text-sm font-medium text-left relative z-10 flex-1">
                {item.label}
              </span>
            )}

            {isOpen && activeView === item.id && (
              <ChevronRight size={20} className="text-white relative z-10" />
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="p-4 border-t border-purple-500/30 relative z-10">
          <p className="text-xs text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            © 2025 NasaCityPlanner
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
