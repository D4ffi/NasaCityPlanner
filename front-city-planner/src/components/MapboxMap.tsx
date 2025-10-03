import { useRef, useState, useEffect } from 'react';
import { useMapbox } from '../hooks/useMapbox';

interface MapboxMapProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  className?: string;
}

const MapboxMap = ({
  initialCenter = [-96.11022390967145, 19.160172792691906], // Veracruz, México
  initialZoom = 12,
  className = ''
}: MapboxMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  // Establecer el contenedor una vez que el ref esté disponible
  useEffect(() => {
    if (mapContainerRef.current) {
      setContainer(mapContainerRef.current);
    }
  }, []);

  // Usar el hook personalizado para gestionar la instancia del mapa
  useMapbox({
    container,
    initialCenter,
    initialZoom,
  });

  return (
    <div
      ref={mapContainerRef}
      className={`w-full h-full ${className}`}
    />
  );
};

export default MapboxMap;
