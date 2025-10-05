// components/MapboxMap.tsx

import { useRef, useState, useEffect, useMemo } from 'react';
import { useMapbox } from '../hooks/useMapbox';
import { usePolygonLayers } from '../hooks/usePolygonLayers';
import { useMapContext } from '../context/MapContext';
import type { Feature } from 'geojson';

// 1. IMPORTANTE: Añadir los estilos para el mapa y los controles de dibujo
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

interface MapboxMapProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  className?: string;
  polygonFeatures?: Feature[]; // Array de GeoJSON features para renderizar como capas
  enableDrawing?: boolean; // Habilitar controles de dibujo manual
}

const MapboxMap = ({
                     initialCenter,
                     initialZoom,
                     className = '',
                     polygonFeatures,
                     enableDrawing = true,
                   }: MapboxMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      setContainer(mapContainerRef.current);
    }
  }, []);

  // 2. OBTENEMOS LAS GEOMETRÍAS DEL HOOK (solo si dibujo está habilitado)
  const { drawnFeatures } = useMapbox({
    container,
    initialCenter,
    initialZoom,
    enableDrawing,
  });

  // 3. OBTENER INSTANCIA DEL MAPA DESDE EL CONTEXTO
  const { map } = useMapContext();

  // 4. MEMOIZAR polygonFeatures para evitar re-renders innecesarios
  // Si no se proporciona, usar array vacío estable
  const memoizedFeatures = useMemo(() => {
    return polygonFeatures || [];
  }, [polygonFeatures]);

  // 5. RENDERIZAR CAPAS DE POLÍGONOS (con features memoizados)
  usePolygonLayers(map, memoizedFeatures);

  return (
    <div className="w-full h-full flex flex-col">
      {/* El contenedor donde se renderiza el mapa */}
      <div
        ref={mapContainerRef}
        className={`flex-grow ${className}`}
      />

      {/* 6. ÁREA DE DEPURACIÓN: Muestra el GeoJSON de lo que dibujas en tiempo real */}
      {enableDrawing && (
        <div className="h-48 overflow-auto p-2 bg-gray-900 text-green-400 font-mono text-xs">
          <h3>GeoJSON Dibujado manualmente:</h3>
          <pre>{JSON.stringify(drawnFeatures, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default MapboxMap;
