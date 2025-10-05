// hooks/usePolygonLayers.ts
import { useEffect, useRef } from 'react';
import type { Map, GeoJSONSource } from 'mapbox-gl';
import type { Feature } from 'geojson';

export interface LayerConfig {
  id: string;
  features: Feature[];
  fillColor?: string;
  fillOpacity?: number;
  lineColor?: string;
  lineWidth?: number;
}

const DEFAULT_PAINT = {
  fillColor: '#8b5cf6', // purple-500
  fillOpacity: 0.4,
  lineColor: '#8b5cf6',
  lineWidth: 2,
};

/**
 * Hook para renderizar múltiples capas de polígonos en Mapbox GL.
 *
 * @param map - Instancia del mapa de Mapbox.
 * @param layers - Array de configuraciones de capa.
 */
export const usePolygonLayers = (map: Map | null, layers: LayerConfig[]) => {
  const managedLayerIds = useRef(new Set<string>());

  useEffect(() => {
    if (!map || !map.isStyleLoaded()) {
      const onStyleLoad = () => {
        if (map) {
          updateLayers(map, layers, managedLayerIds);
        }
      };
      map?.on('style.load', onStyleLoad);
      return () => {
        map?.off('style.load', onStyleLoad);
      };
    }

    updateLayers(map, layers, managedLayerIds);

    // Cleanup: al desmontar el hook, eliminar todas las capas que gestionaba.
    return () => {
      if (map && map.isStyleLoaded()) {
        for (const id of managedLayerIds.current) {
          removeLayer(map, id);
        }
        managedLayerIds.current.clear();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, layers]); // Depender del array de capas para re-evaluar.
};

function updateLayers(
  map: Map,
  layers: LayerConfig[],
  managedLayerIds: React.MutableRefObject<Set<string>>
) {
  const currentLayerIds = new Set(layers.map((l) => l.id));

  // 1. Eliminar capas que ya no están en el array `layers`
  for (const id of managedLayerIds.current) {
    if (!currentLayerIds.has(id)) {
      removeLayer(map, id);
      managedLayerIds.current.delete(id);
    }
  }

  // 2. Añadir o actualizar las capas presentes en el array `layers`
  for (const layerConfig of layers) {
    const { id, features } = layerConfig;
    const sourceId = `${id}-source`;
    const source = map.getSource(sourceId) as GeoJSONSource | undefined;

    if (source) {
      // Si la fuente existe, solo actualiza los datos
      source.setData({
        type: 'FeatureCollection',
        features: features || [],
      });
    } else {
      // Si no existe, crea la fuente y las capas
      addLayer(map, layerConfig);
      managedLayerIds.current.add(id);
    }
  }
}

function addLayer(map: Map, config: LayerConfig) {
  const {
    id,
    features,
    fillColor = DEFAULT_PAINT.fillColor,
    fillOpacity = DEFAULT_PAINT.fillOpacity,
    lineColor = DEFAULT_PAINT.lineColor,
    lineWidth = DEFAULT_PAINT.lineWidth,
  } = config;

  const sourceId = `${id}-source`;
  const fillLayerId = `${id}-fill`;
  const lineLayerId = `${id}-line`;

  try {
    map.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: features || [],
      },
    });

    map.addLayer({
      id: fillLayerId,
      type: 'fill',
      source: sourceId,
      paint: {
        'fill-color': fillColor,
        'fill-opacity': fillOpacity,
      },
    });

    map.addLayer({
      id: lineLayerId,
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': lineColor,
        'line-width': lineWidth,
      },
    });
  } catch (error) {
    console.error(`Error adding layer ${id}:`, error);
  }
}

function removeLayer(map: Map, id: string) {
  const sourceId = `${id}-source`;
  const fillLayerId = `${id}-fill`;
  const lineLayerId = `${id}-line`;

  try {
    if (map.getLayer(fillLayerId)) {
      map.removeLayer(fillLayerId);
    }
    if (map.getLayer(lineLayerId)) {
      map.removeLayer(lineLayerId);
    }
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
  } catch (error) {
    console.error(`Error removing layer ${id}:`, error);
  }
}