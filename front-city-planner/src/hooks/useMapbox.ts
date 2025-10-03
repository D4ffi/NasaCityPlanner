import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMapContext } from '../context/MapContext';

interface UseMapboxOptions {
  container: HTMLDivElement | null;
  initialCenter?: [number, number];
  initialZoom?: number;
  style?: string;
}

export const useMapbox = ({
  container,
  initialCenter = [-96.11022390967145, 19.160172792691906],
  initialZoom = 12,
  style = 'mapbox://styles/mapbox/streets-v12',
}: UseMapboxOptions) => {
  const { map, setMap } = useMapContext();
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!container) return;

    // Si ya existe un mapa global y no es el nuestro, usar ese
    if (map && map !== mapInstanceRef.current) {
      mapInstanceRef.current = map;
      return;
    }

    // Solo crear un nuevo mapa si no existe ninguno
    if (!map && !mapInstanceRef.current) {
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_URL || '';

      const newMap = new mapboxgl.Map({
        container,
        style,
        center: initialCenter,
        zoom: initialZoom,
      });

      // Agregar controles de navegación
      newMap.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Agregar control de pantalla completa
      newMap.addControl(
        new mapboxgl.FullscreenControl(),
        'top-right'
      );

      mapInstanceRef.current = newMap;
      setMap(newMap);
    }

    return () => {
      // Solo limpiar si somos los dueños del mapa
      if (mapInstanceRef.current && mapInstanceRef.current === map) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setMap(null);
      }
    };
  }, [container, initialCenter, initialZoom, style, map, setMap]);

  return map;
};
