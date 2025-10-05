// components/MapboxMap.tsx

import { useRef, useState, useEffect } from 'react';
import { useMapbox } from '../hooks/useMapbox';

// 1. IMPORTANTE: Añadir los estilos para el mapa y los controles de dibujo
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

interface MapboxMapProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  className?: string;
}

const MapboxMap = ({
                     initialCenter,
                     initialZoom,
                     className = ''
                   }: MapboxMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      setContainer(mapContainerRef.current);
    }
  }, []);

  // 2. OBTENEMOS LAS GEOMETRÍAS DEL HOOK
  const { drawnFeatures } = useMapbox({
    container,
    initialCenter,
    initialZoom,
  });

  return (
    <div className="w-full h-full flex flex-col">
      {/* El contenedor donde se renderiza el mapa */}
      <div
        ref={mapContainerRef}
        className={`flex-grow ${className}`}
      />

      {/* 3. ÁREA DE DEPURACIÓN: Muestra el GeoJSON de lo que dibujas en tiempo real */}
      <div className="h-48 overflow-auto p-2 bg-gray-900 text-green-400 font-mono text-xs">
        <h3>GeoJSON Dibujado:</h3>
        <pre>{JSON.stringify(drawnFeatures, null, 2)}</pre>
      </div>
    </div>
  );
};

export default MapboxMap;
