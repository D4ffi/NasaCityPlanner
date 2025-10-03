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
  style = 'mapbox://styles/daffi/cmgb6w2zg000b01qp3e315yw8', // NightMap - Estilo personalizado
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
        antialias: true, // Mejora la calidad visual del 3D
      });

      // Esperar a que el mapa esté cargado para agregar el 3D
      newMap.on('load', () => {
        // Habilitar edificios 3D
        const layers = newMap.getStyle().layers;
        if (layers) {
          // Buscar la primera capa de símbolos para insertar los edificios antes
          const labelLayerId = layers.find(
            (layer) => layer.type === 'symbol' && layer.layout && layer.layout['text-field']
          )?.id;

          // Agregar capa de edificios 3D si no existe
          if (!newMap.getLayer('add-3d-buildings')) {
            newMap.addLayer(
              {
                id: 'add-3d-buildings',
                source: 'composite',
                'source-layer': 'building',
                filter: ['==', 'extrude', 'true'],
                type: 'fill-extrusion',
                minzoom: 15,
                paint: {
                  'fill-extrusion-color': '#aaa',
                  'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05,
                    ['get', 'height'],
                  ],
                  'fill-extrusion-base': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05,
                    ['get', 'min_height'],
                  ],
                  'fill-extrusion-opacity': 0.6,
                },
              },
              labelLayerId
            );
          }
        }

        // Habilitar terreno 3D (solo si es soportado)
        try {
          newMap.addSource('mapbox-dem', {
            type: 'raster-dem',
            url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
            tileSize: 512,
            maxzoom: 14,
          });
          newMap.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
        } catch (error) {
          console.warn('Terrain 3D no disponible (puede estar bloqueado por el navegador):', error);
        }
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
