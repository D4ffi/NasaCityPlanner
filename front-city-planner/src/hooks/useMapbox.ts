// hooks/useMapbox.ts

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useMapContext } from '../context/MapContext';
import type { Feature } from 'geojson';

// --- Interfaces (sin cambios) ---
interface UseMapboxOptions {
  container: HTMLDivElement | null;
  initialCenter?: [number, number];
  initialZoom?: number;
  style?: string;
}

interface UseMapboxReturn {
  drawnFeatures: Feature[];
}

// 1. MUEVE LOS VALORES POR DEFECTO FUERA DE LA FUNCIÓN
const DEFAULT_CENTER: [number, number] = [-96.1102, 19.1601];
const DEFAULT_ZOOM = 12;
const DEFAULT_STYLE = 'mapbox://styles/daffi/cmgb6w2zg000b01qp3e315yw8';

export const useMapbox = ({
                            container,
                            initialCenter = DEFAULT_CENTER, // 2. Usa las constantes
                            initialZoom = DEFAULT_ZOOM,
                            style = DEFAULT_STYLE,
                          }: UseMapboxOptions): UseMapboxReturn => {
  const { setMap } = useMapContext();
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [drawnFeatures, setDrawnFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    if (!container || mapInstanceRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_URL || '';

    const newMap = new mapboxgl.Map({
      container,
      style,
      center: initialCenter,
      zoom: initialZoom,
    });

    mapInstanceRef.current = newMap;
    setMap(newMap);

    newMap.on('load', () => {
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: { polygon: true, trash: true },
      });
      newMap.addControl(draw, 'top-right');

      const updateFeatures = () => {
        setDrawnFeatures(draw.getAll().features);
      };

      newMap.on('draw.create', updateFeatures);
      newMap.on('draw.delete', updateFeatures);
      newMap.on('draw.update', updateFeatures);
    });

    newMap.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');
    newMap.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    return () => {
      newMap.remove();
      setMap(null);
      mapInstanceRef.current = null;
    };
  }, [container, initialCenter, initialZoom, style, setMap]);

  return { drawnFeatures };
};
