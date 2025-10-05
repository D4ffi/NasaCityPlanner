import { useState, useEffect, useCallback } from 'react';
import { useMapContext } from '../context/MapContext';
import type { MapLayerMouseEvent } from 'mapbox-gl';

interface FeatureProperties {
  [key: string]: any;
}

interface MapLeyendaProps {
  onFeatureClick?: (properties: FeatureProperties) => void;
}

const MapLeyenda = ({ onFeatureClick }: MapLeyendaProps) => {
  const { map } = useMapContext();
  const [showDesigualdad, setShowDesigualdad] = useState(false);
  const [showVial, setShowVial] = useState(false);

  const DESIGUALDAD_LAYER_ID = 'desigualdad-layer';
  const DESIGUALDAD_SOURCE_ID = 'desigualdad-source';
  const DESIGUALDAD_TILESET_ID = 'daffi.7mlmdiqo';

  const VIAL_LAYER_ID = 'vial-layer';
  const VIAL_SOURCE_ID = 'vial-source';
  const VIAL_TILESET_ID = 'daffi.ah2lqp8o';

  // Handler para click en el layer
  const handleLayerClick = useCallback((e: MapLayerMouseEvent) => {
    if (!e.features || e.features.length === 0) return;

    const feature = e.features[0];
    const properties = feature.properties || {};

    // Llamar callback si existe
    if (onFeatureClick) {
      onFeatureClick(properties);
    }

    // Log para debugging - mostrar todas las propiedades disponibles
    console.log('Feature clicked - All properties:', properties);
    console.log('Available property keys:', Object.keys(properties));
  }, [onFeatureClick]);

  // Toggle layer visibility - Desigualdad
  const toggleDesigualdadLayer = useCallback((show: boolean) => {
    if (!map) return;

    if (show) {
      // Agregar source si no existe
      if (!map.getSource(DESIGUALDAD_SOURCE_ID)) {
        map.addSource(DESIGUALDAD_SOURCE_ID, {
          type: 'vector',
          url: `mapbox://${DESIGUALDAD_TILESET_ID}`
        });

        // Log para inspeccionar las capas disponibles
        map.on('sourcedata', function logSourceLayers(e) {
          if (e.sourceId === DESIGUALDAD_SOURCE_ID && e.isSourceLoaded) {
            const source = map.getSource(DESIGUALDAD_SOURCE_ID) as any;
            if (source && source.vectorLayerIds) {
              console.log('Desigualdad - Available source layers:', source.vectorLayerIds);
            }
            map.off('sourcedata', logSourceLayers);
          }
        });
      }

      const addLayers = () => {
        if (!map.getLayer(DESIGUALDAD_LAYER_ID)) {
          const sourceLayerName = 'm3007veracruz-bq1px0';

          try {
            map.addLayer({
              id: DESIGUALDAD_LAYER_ID,
              type: 'fill',
              source: DESIGUALDAD_SOURCE_ID,
              'source-layer': sourceLayerName,
              paint: {
                'fill-color': [
                  'match',
                  ['get', 'iisu_sun'],
                  'Muy alto', '#dc2626',    // Rojo intenso
                  'Alto', '#dc2626',        // Rojo intenso
                  'Medio', '#dc2626',       // Rojo intenso
                  'Bajo', '#dc2626',        // Rojo intenso
                  'Muy bajo', '#dc2626',    // Rojo intenso
                  'S/P', '#cccccc',         // Gris (Sin Población)
                  '#999999'                 // Default gris oscuro
                ],
                'fill-opacity': [
                  'match',
                  ['get', 'iisu_sun'],
                  'Muy alto', 0.8,     // Mayor opacidad para mayor desigualdad
                  'Alto', 0.6,
                  'Medio', 0.4,
                  'Bajo', 0.3,
                  'Muy bajo', 0.2,     // Menor opacidad para menor desigualdad
                  'S/P', 0.1,
                  0.2                  // Default
                ]
              }
            });

            map.addLayer({
              id: `${DESIGUALDAD_LAYER_ID}-outline`,
              type: 'line',
              source: DESIGUALDAD_SOURCE_ID,
              'source-layer': sourceLayerName,
              paint: {
                'line-color': '#ffffff',
                'line-width': 1,
                'line-opacity': 0.5
              }
            });

            console.log('Desigualdad layers added successfully');
          } catch (error) {
            console.error('Error adding desigualdad layers:', error);
          }
        }
      };

      if (map.isSourceLoaded(DESIGUALDAD_SOURCE_ID)) {
        addLayers();
      } else {
        map.on('sourcedata', function waitForSource(e) {
          if (e.sourceId === DESIGUALDAD_SOURCE_ID && e.isSourceLoaded) {
            addLayers();
            map.off('sourcedata', waitForSource);
          }
        });
      }

      map.on('click', DESIGUALDAD_LAYER_ID, handleLayerClick);
      map.on('mouseenter', DESIGUALDAD_LAYER_ID, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', DESIGUALDAD_LAYER_ID, () => {
        map.getCanvas().style.cursor = '';
      });
    } else {
      if (map.getLayer(`${DESIGUALDAD_LAYER_ID}-outline`)) {
        map.removeLayer(`${DESIGUALDAD_LAYER_ID}-outline`);
      }
      if (map.getLayer(DESIGUALDAD_LAYER_ID)) {
        map.removeLayer(DESIGUALDAD_LAYER_ID);
      }
      if (map.getSource(DESIGUALDAD_SOURCE_ID)) {
        map.removeSource(DESIGUALDAD_SOURCE_ID);
      }
      map.off('click', DESIGUALDAD_LAYER_ID, handleLayerClick);
      map.off('mouseenter', DESIGUALDAD_LAYER_ID, () => {});
      map.off('mouseleave', DESIGUALDAD_LAYER_ID, () => {});
    }
  }, [map, handleLayerClick]);

  // Toggle layer visibility - Vial
  const toggleVialLayer = useCallback((show: boolean) => {
    if (!map) return;

    if (show) {
      // Agregar source si no existe
      if (!map.getSource(VIAL_SOURCE_ID)) {
        map.addSource(VIAL_SOURCE_ID, {
          type: 'vector',
          url: `mapbox://${VIAL_TILESET_ID}`
        });

        // Log para inspeccionar las capas disponibles
        map.on('sourcedata', function logSourceLayers(e) {
          if (e.sourceId === VIAL_SOURCE_ID && e.isSourceLoaded) {
            const source = map.getSource(VIAL_SOURCE_ID) as any;
            if (source && source.vectorLayerIds) {
              console.log('Vial - Available source layers:', source.vectorLayerIds);
            }
            map.off('sourcedata', logSourceLayers);
          }
        });
      }

      const addLayers = () => {
        if (!map.getLayer(VIAL_LAYER_ID)) {
          // Necesitarás ajustar el source-layer-name según lo que muestre el log
          const sourceLayerName = 'RNC2021_Veracruz-0dd0d8';

          try {
            // Agregar antes de la capa de desigualdad si existe
            const beforeId = map.getLayer(DESIGUALDAD_LAYER_ID) ? DESIGUALDAD_LAYER_ID : undefined;

            map.addLayer({
              id: VIAL_LAYER_ID,
              type: 'line',
              source: VIAL_SOURCE_ID,
              'source-layer': sourceLayerName,
              paint: {
                'line-color': '#fbbf24',  // Amarillo intenso (amber-400)
                'line-width': 2.5,
                'line-opacity': 0.9
              }
            }, beforeId);

            console.log('Vial layer added successfully');
          } catch (error) {
            console.error('Error adding vial layer:', error);
          }
        }
      };

      if (map.isSourceLoaded(VIAL_SOURCE_ID)) {
        addLayers();
      } else {
        map.on('sourcedata', function waitForSource(e) {
          if (e.sourceId === VIAL_SOURCE_ID && e.isSourceLoaded) {
            addLayers();
            map.off('sourcedata', waitForSource);
          }
        });
      }

      map.on('click', VIAL_LAYER_ID, handleLayerClick);
      map.on('mouseenter', VIAL_LAYER_ID, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', VIAL_LAYER_ID, () => {
        map.getCanvas().style.cursor = '';
      });
    } else {
      if (map.getLayer(VIAL_LAYER_ID)) {
        map.removeLayer(VIAL_LAYER_ID);
      }
      if (map.getSource(VIAL_SOURCE_ID)) {
        map.removeSource(VIAL_SOURCE_ID);
      }
      map.off('click', VIAL_LAYER_ID, handleLayerClick);
      map.off('mouseenter', VIAL_LAYER_ID, () => {});
      map.off('mouseleave', VIAL_LAYER_ID, () => {});
    }
  }, [map, handleLayerClick]);

  // Effect para manejar el toggle de desigualdad
  useEffect(() => {
    if (!map || !map.isStyleLoaded()) return;
    toggleDesigualdadLayer(showDesigualdad);
  }, [map, showDesigualdad, toggleDesigualdadLayer]);

  // Effect para manejar el toggle de vial
  useEffect(() => {
    if (!map || !map.isStyleLoaded()) return;
    toggleVialLayer(showVial);
  }, [map, showVial, toggleVialLayer]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (!map || !map.getStyle()) return;

      try {
        // Remover layers de desigualdad
        if (map.getLayer(`${DESIGUALDAD_LAYER_ID}-outline`)) {
          map.removeLayer(`${DESIGUALDAD_LAYER_ID}-outline`);
        }
        if (map.getLayer(DESIGUALDAD_LAYER_ID)) {
          map.removeLayer(DESIGUALDAD_LAYER_ID);
        }
        if (map.getSource(DESIGUALDAD_SOURCE_ID)) {
          map.removeSource(DESIGUALDAD_SOURCE_ID);
        }

        // Remover layer vial
        if (map.getLayer(VIAL_LAYER_ID)) {
          map.removeLayer(VIAL_LAYER_ID);
        }
        if (map.getSource(VIAL_SOURCE_ID)) {
          map.removeSource(VIAL_SOURCE_ID);
        }

        // Remover event listeners
        map.off('click', DESIGUALDAD_LAYER_ID, handleLayerClick);
        map.off('click', VIAL_LAYER_ID, handleLayerClick);
      } catch (error) {
        console.log('Cleanup error (safe to ignore):', error);
      }
    };
  }, [map, handleLayerClick]);

  return (
    <div className="absolute bottom-6 right-6 z-50 pointer-events-auto bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 shadow-xl">
      <h3 className="text-white font-semibold mb-3 text-sm">Capas del Mapa</h3>

      <div className="space-y-2">
        {/* Capa de Desigualdad */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="desigualdad-layer"
            checked={showDesigualdad}
            onChange={(e) => setShowDesigualdad(e.target.checked)}
            className="w-4 h-4 rounded border-purple-400 bg-purple-950/50 text-purple-500 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
          />
          <label
            htmlFor="desigualdad-layer"
            className="text-gray-200 text-sm cursor-pointer select-none hover:text-white transition-colors"
          >
            Índice de desigualdad
          </label>
        </div>

        {/* Capa Vial */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="vial-layer"
            checked={showVial}
            onChange={(e) => setShowVial(e.target.checked)}
            className="w-4 h-4 rounded border-purple-400 bg-purple-950/50 text-purple-500 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
          />
          <label
            htmlFor="vial-layer"
            className="text-gray-200 text-sm cursor-pointer select-none hover:text-white transition-colors"
          >
            Información vial
          </label>
        </div>
      </div>
    </div>
  );
};

export default MapLeyenda;
