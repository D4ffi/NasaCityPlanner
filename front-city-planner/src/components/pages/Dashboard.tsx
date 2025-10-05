import React from 'react';
import { Users, TrendingUp } from 'lucide-react';
import StatsCard from '../ui/StatsCard';
import ChartCard from '../ui/ChartCard';
import ComparisonCard from '../ui/ComparisonCard';
import mapaImg from '../../assets/mapa.png';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Población Veracruzana',
      value: '939,046',
      icon: <Users size={32} />,
      color: 'from-blue-600 to-purple-600'
    },
    {
      title: 'Índice de Desigualdad',
      value: 'Alto',
      icon: <TrendingUp size={32} />,
      color: 'from-red-600 to-orange-600'
    },
  ];

  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-950 via-purple-900 to-black p-8 overflow-auto relative">
      {/* Estrellas de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Efectos de luz de fondo */}
      <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-40 left-40 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse pointer-events-none"
           style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-300">Panel de control y estadísticas de la ciudad</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        {/* Comparison Card */}
        <div className="mb-8">
          <ComparisonCard
            leftTitle="Zona Metropolitana de Veracruz"
            leftValue="Alto"
            leftSubtitle="4.0/5 - Posición 20/74 ZM"
            rightTitle="Promedio Nacional (México)"
            rightValue="Medio-Alto"
            rightSubtitle="3.3/5 - 74 Zonas Metropolitanas"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Índice de Desigualdad por Zona Metropolitana"
            bgColor="from-blue-900/50 to-purple-900/50"
          >
            {/* Bar chart comparison */}
            <div className="w-full h-full flex flex-col p-3">
              <div className="space-y-3 flex-1">
                {[
                  { city: 'Oaxaca', level: 4.5, color: 'from-red-600 to-red-700', label: 'Muy Alto' },
                  { city: 'CDMX', level: 4.2, color: 'from-orange-600 to-red-600', label: 'Alto' },
                  { city: 'Veracruz', level: 4.0, color: 'from-orange-600 to-red-500', label: 'Alto' },
                  { city: 'Puebla', level: 3.8, color: 'from-orange-500 to-orange-600', label: 'Medio-Alto' },
                  { city: 'Culiacán', level: 3.0, color: 'from-yellow-500 to-yellow-600', label: 'Medio-Alto' },
                  { city: 'Monterrey', level: 2.5, color: 'from-green-500 to-yellow-500', label: 'Medio' },
                  { city: 'Querétaro', level: 2.0, color: 'from-green-600 to-green-500', label: 'Bajo' },
                ].map((item) => (
                  <div key={item.city} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-200 font-medium text-sm">{item.city}</span>
                      <span className="text-gray-400 text-xs">
                        {item.label}
                      </span>
                    </div>
                    <div className="relative h-7 bg-gray-800/50 rounded-lg overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${item.color} rounded-lg transition-all duration-1000 ease-out flex items-center justify-end pr-3`}
                        style={{ width: `${(item.level / 5) * 100}%` }}
                      >
                        <span className="text-white text-xs font-bold drop-shadow-lg">
                          {item.level.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-white/10 mt-3">
                <p className="text-xs text-gray-400 text-center">
                  Escala de 0 (menor desigualdad) a 5 (mayor desigualdad)
                </p>
                <p className="text-[10px] text-gray-500 text-center mt-1">
                  Fuente: Estimado basado en IISU WRI México
                </p>
              </div>
            </div>
          </ChartCard>

          <ChartCard
            title="Tiempo de Acceso a Servicios Públicos"
            bgColor="from-purple-900/50 to-pink-900/50"
          >
            <div className="w-full h-full flex flex-col justify-center p-6 space-y-4">
              {/* Tiempo promedio de trabajo */}
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Tiempo promedio trabajo</p>
                <div className="bg-purple-950/40 rounded-xl p-4 border border-purple-500/20">
                  <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    28.3
                  </p>
                  <p className="text-gray-300 text-sm mt-1">minutos</p>
                </div>
              </div>

              {/* Tiempo promedio de estudio */}
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Tiempo promedio estudio</p>
                <div className="bg-purple-950/40 rounded-xl p-4 border border-purple-500/20">
                  <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    17.6
                  </p>
                  <p className="text-gray-300 text-sm mt-1">minutos</p>
                </div>
              </div>

              {/* Nota al pie */}
              <div className="pt-2 border-t border-white/10">
                <p className="text-xs text-gray-500 text-center">
                  Fuente: INEGI - Censo de Población 2020
                </p>
              </div>
            </div>
          </ChartCard>

          <ChartCard
            title="Uso de Transporte en Veracruz"
            bgColor="from-indigo-900/50 to-purple-900/50"
          >
            <div className="w-full h-full flex flex-col justify-center p-6 pt-12">
              <div className="space-y-6">
                {/* Transporte Público */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 font-semibold">Transporte Público</span>
                    <span className="text-blue-400 font-bold text-lg">42.9%</span>
                  </div>
                  <div className="relative h-12 bg-gray-800/50 rounded-xl overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center transition-all duration-1000 ease-out"
                      style={{ width: '42.9%' }}
                    >
                      <span className="text-white text-sm font-bold drop-shadow-lg">Bus, Taxi, Combi</span>
                    </div>
                  </div>
                </div>

                {/* Automóvil Propio */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 font-semibold">Automóvil Propio</span>
                    <span className="text-purple-400 font-bold text-lg">35.2%</span>
                  </div>
                  <div className="relative h-12 bg-gray-800/50 rounded-xl overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl flex items-center justify-center transition-all duration-1000 ease-out"
                      style={{ width: '35.2%' }}
                    >
                      <span className="text-white text-sm font-bold drop-shadow-lg">Vehículo Particular</span>
                    </div>
                  </div>
                </div>

                {/* Otros medios */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 font-semibold">Otros Medios</span>
                    <span className="text-green-400 font-bold text-lg">21.9%</span>
                  </div>
                  <div className="relative h-12 bg-gray-800/50 rounded-xl overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl flex items-center justify-center transition-all duration-1000 ease-out"
                      style={{ width: '21.9%' }}
                    >
                      <span className="text-white text-sm font-bold drop-shadow-lg">Caminando, Bici</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-white/10 mt-4">
                <p className="text-xs text-gray-500 text-center">
                  Medio de transporte al trabajo - INEGI 2020
                </p>
              </div>
            </div>
          </ChartCard>

          <ChartCard
            title="Mapa"
            bgColor="from-blue-900/50 to-indigo-900/50"
          >
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
              <img
                src={mapaImg}
                alt="Mapa de Veracruz"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
