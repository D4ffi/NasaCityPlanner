import { useState } from 'react';
import { Rocket, Map, Globe } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage = ({ onStart }: LandingPageProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => {
    setIsLoading(true);
    // Simular carga de 3 segundos
    setTimeout(() => {
      onStart();
    }, 3000);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-900 to-black">
      {/* Estrellas de fondo */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Planeta decorativo */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-400/20 to-pink-600/20 blur-3xl animate-pulse"
           style={{ animationDelay: '1s' }} />

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* Icono de mapa flotante */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-xl animate-pulse" />
          <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-full">
            <Map size={64} className="text-white" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 tracking-tight">
          Data Pathways
        </h1>

        {/* Subtítulo */}
        <p className="text-xl md:text-2xl text-gray-300 mb-12 text-center max-w-2xl">
          Explora el universo de datos urbanos
          <br />
          <span className="text-blue-400">Navega por información geoespacial en tiempo real</span>
        </p>

        {/* Botón de comenzar */}
        <button
          onClick={handleStart}
          disabled={isLoading}
          className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white text-xl font-bold shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        >
          {/* Efecto de brillo */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

          <div className="flex items-center gap-4">
            {isLoading ? (
              <>
                <Rocket
                  size={32}
                  className="animate-bounce"
                  style={{
                    animation: 'rocket-launch 3s ease-in-out forwards'
                  }}
                />
                <span>Despegando...</span>
              </>
            ) : (
              <>
                <Rocket size={32} className="group-hover:rotate-45 transition-transform duration-300" />
                <span>Comenzar Exploración</span>
              </>
            )}
          </div>
        </button>

        {/* Barra de progreso */}
        {isLoading && (
          <div className="mt-8 w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-progress"
              style={{
                animation: 'progress 3s ease-in-out forwards'
              }}
            />
          </div>
        )}

        {/* Iconos decorativos flotantes */}
        <div className="absolute bottom-10 left-10 opacity-30">
          <Globe size={48} className="text-blue-400 animate-spin" style={{ animationDuration: '20s' }} />
        </div>
        <div className="absolute top-10 left-1/4 opacity-30">
          <Map size={40} className="text-purple-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>

      {/* Estilos de animación personalizados */}
      <style>{`
        @keyframes rocket-launch {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          100% {
            transform: translateY(-100vh) rotate(-45deg);
            opacity: 0;
          }
        }

        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
