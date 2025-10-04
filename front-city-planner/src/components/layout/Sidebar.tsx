import React, { useState } from 'react';
import { Home, Map, Bus, Trees, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

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
    { icon: <Home size={24} />, label: 'Vivienda y crecimiento urbano', id: 'housing' },
    { icon: <Bus size={24} />, label: 'Transporte y movilidad', id: 'transport' },
    { icon: <Trees size={24} />, label: 'Áreas verdes y recreación', id: 'green' },
    { icon: <TrendingUp size={24} />, label: 'Zonas en expansión urbana', id: 'expansion' },
  ];

  return (
    <div
      className={`${
        isOpen ? 'w-80' : 'w-20'
      } bg-gradient-to-b from-indigo-600 to-indigo-800 text-white transition-all duration-300 ease-in-out shadow-xl flex flex-col`}
    >
      {/* Header */}
      <div className="p-6 border-b border-indigo-500 flex items-center justify-between">
        <h1 className={`font-bold text-2xl ${!isOpen && 'hidden'}`}>
          Side bar
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
      <nav className="p-4 space-y-3 flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-lg transition-all duration-200 ${
              activeView === item.id
                ? 'bg-indigo-700 shadow-lg'
                : 'hover:bg-indigo-700/50'
            }`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {isOpen && <span className="text-sm font-medium text-left">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="p-4 border-t border-indigo-500">
          <p className="text-xs text-indigo-200 text-center">
            © 2025 NasaCityPlanner
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
