import { useEffect, useRef, useState, useCallback } from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import type { Map } from 'mapbox-gl';

interface UseMapboxDrawOptions {
  map: Map | null;
  onDrawCreate?: (features: any) => void;
  onDrawUpdate?: (features: any) => void;
  onDrawDelete?: (features: any) => void;
}

export const useMapboxDraw = ({
  map,
  onDrawCreate,
  onDrawUpdate,
  onDrawDelete,
}: UseMapboxDrawOptions) => {
  const drawRef = useRef<MapboxDraw | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const isInitializedRef = useRef(false);

  // Usar callbacks para evitar re-renders
  const handleCreate = useCallback((e: any) => {
    setIsDrawing(false);
    onDrawCreate?.(e.features);
  }, [onDrawCreate]);

  const handleUpdate = useCallback((e: any) => {
    onDrawUpdate?.(e.features);
  }, [onDrawUpdate]);

  const handleDelete = useCallback((e: any) => {
    onDrawDelete?.(e.features);
  }, [onDrawDelete]);

  useEffect(() => {
    if (!map || isInitializedRef.current) return;

    // Esperar a que el mapa esté completamente cargado
    const initDraw = () => {
      if (drawRef.current) return; // Ya existe

      // Crear instancia de MapboxDraw
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
        defaultMode: 'simple_select',
      });

      drawRef.current = draw;
      map.addControl(draw, 'top-left');
      isInitializedRef.current = true;

      // Event listeners
      map.on('draw.create', handleCreate);
      map.on('draw.update', handleUpdate);
      map.on('draw.delete', handleDelete);
    };

    if (map.loaded()) {
      initDraw();
    } else {
      map.on('load', initDraw);
    }

    return () => {
      if (drawRef.current && map) {
        map.off('draw.create', handleCreate);
        map.off('draw.update', handleUpdate);
        map.off('draw.delete', handleDelete);
        try {
          map.removeControl(drawRef.current);
        } catch (e) {
          // Control ya removido
        }
        drawRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, [map, handleCreate, handleUpdate, handleDelete]);

  // Métodos útiles
  const startDrawingPolygon = useCallback(() => {
    console.log('startDrawingPolygon llamado, drawRef.current:', drawRef.current);
    if (drawRef.current) {
      try {
        drawRef.current.changeMode('draw_polygon');
        setIsDrawing(true);
        console.log('Modo de dibujo activado');
      } catch (error) {
        console.error('Error al cambiar a modo de dibujo:', error);
      }
    } else {
      console.warn('drawRef.current es null - el control aún no está inicializado');
    }
  }, []);

  const getAllFeatures = () => {
    return drawRef.current?.getAll();
  };

  const deleteAll = () => {
    drawRef.current?.deleteAll();
  };

  const getSelectedFeatures = () => {
    return drawRef.current?.getSelected();
  };

  return {
    draw: drawRef.current,
    startDrawingPolygon,
    getAllFeatures,
    deleteAll,
    getSelectedFeatures,
    isDrawing,
  };
};
