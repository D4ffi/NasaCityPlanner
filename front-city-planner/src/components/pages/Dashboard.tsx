import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Home, Activity } from 'lucide-react';
import StatsCard from '../ui/StatsCard';
import ChartCard from '../ui/ChartCard';

const Dashboard: React.FC = () => {
  const [mapUrls, setMapUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMapUrls = async () => {
      try {
        setLoading(true);
        console.log('Fetching map URLs for year 2020...');
        const response = await fetch('http://localhost:8080/api/graphics/urls?year=2020', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status);

        if (response.status === 204) {
          setMapUrls([]);
          setError('No hay mapas disponibles para el año 2020');
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const urls = await response.json();
        console.log('Received URLs:', urls);
        setMapUrls(urls);
        setError(null);
      } catch (err) {
        console.error('Error fetching map URLs:', err);
        setError(`Error al cargar los mapas: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMapUrls();
  }, []);

  const stats = [
    {
      title: 'Vivienda y crecimiento urbano',
      value: '12,543',
      icon: <Home size={32} />,
      color: 'from-blue-600 to-purple-600'
    },
    {
      title: 'Transporte y movilidad',
      value: '8,234',
      icon: <Activity size={32} />,
      color: 'from-purple-600 to-pink-600'
    },
    {
      title: 'Áreas verdes y recreación',
      value: '4,567',
      icon: <TrendingUp size={32} />,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Zonas en expansión urbana',
      value: '2,891',
      icon: <Users size={32} />,
      color: 'from-indigo-600 to-purple-700'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Estadísticas de Vivienda"
            bgColor="from-blue-900/50 to-purple-900/50"
          />

          <ChartCard
            title="Resultados de Tipo"
            bgColor="from-purple-900/50 to-pink-900/50"
          />

          <ChartCard
            title="Estadísticas de U y C"
            bgColor="from-indigo-900/50 to-purple-900/50"
          />

          <ChartCard
            title="Mapa de Población 2020"
            bgColor="from-blue-900/50 to-indigo-900/50"
            height="h-[270px]"
          >
            {loading ? (
              <p className="text-gray-300">Cargando mapas...</p>
            ) : error ? (
              <p className="text-red-400">{error}</p>
            ) : mapUrls.length > 0 ? (
              <div className="w-full h-full overflow-hidden relative">
                <img
                  src={mapUrls[0]}
                  alt="Mapa de población"
                  className="w-full h-full object-cover"
                  style={{
                    objectFit: 'cover',
                    objectPosition: '50% 40%'
                  }}
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
                    e.currentTarget.alt = 'Error al cargar imagen';
                  }}
                />
              </div>
            ) : (
              <p className="text-gray-400">No hay mapas disponibles</p>
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
