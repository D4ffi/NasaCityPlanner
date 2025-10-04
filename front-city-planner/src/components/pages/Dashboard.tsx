import React from 'react';
import { TrendingUp, Users, Home, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Vivienda y crecimiento urbano', value: '12,543', icon: <Home size={32} />, color: 'from-blue-500 to-blue-600' },
    { title: 'Transporte y movilidad', value: '8,234', icon: <Activity size={32} />, color: 'from-green-500 to-green-600' },
    { title: 'Áreas verdes y recreación', value: '4,567', icon: <TrendingUp size={32} />, color: 'from-purple-500 to-purple-600' },
    { title: 'Zonas en expansión urbana', value: '2,891', icon: <Users size={32} />, color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="flex-1 bg-gray-50 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Panel de control y estadísticas de la ciudad</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.color} rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
              <p className="text-sm opacity-90">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Estadísticas de Vivienda</h2>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Gráfica de estadísticas</p>
            </div>
          </div>

          {/* Chart 2 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Resultados de Tipo</h2>
            <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Gráfica de resultados</p>
            </div>
          </div>

          {/* Chart 3 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Estadísticas de U y C</h2>
            <div className="h-64 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Gráfica de estadísticas</p>
            </div>
          </div>

          {/* Map Preview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Mapa (no interactivo)</h2>
            <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Vista previa del mapa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
