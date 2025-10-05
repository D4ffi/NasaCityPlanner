// components/pages/MapWithLayers.tsx

import { useState, useRef, useEffect, useMemo } from 'react';
import { Save, Layers, Trash2, Eye, EyeOff } from 'lucide-react';
import { useMapbox } from '../../hooks/useMapbox';
import { usePolygonLayers } from '../../hooks/usePolygonLayers';
import { useMapContext } from '../../context/MapContext';
import { useCapas } from '../../hooks/useCapas';
import { LAYER_TYPES, type LayerType } from '../../types/capa';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

const INITIAL_CENTER: [number, number] = [-96.15, 19.15];

const MapWithLayers = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [showSavedLayers, setShowSavedLayers] = useState(false);
  const [selectedLayerType, setSelectedLayerType] = useState<LayerType>('pob');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    capas,
    loading,
    error,
    saveCapa,
    loadAllCapas,
    getFeaturesByType,
  } = useCapas();

  useEffect(() => {
    if (mapContainerRef.current) {
      setContainer(mapContainerRef.current);
    }
  }, []);

  // Inicializar mapa con dibujo habilitado
  const { drawnFeatures } = useMapbox({
    container,
    initialCenter: INITIAL_CENTER,
    initialZoom: 11,
    enableDrawing: true,
  });

  const { map } = useMapContext();

  // Cargar capas al montar si showSavedLayers está activo
  useEffect(() => {
    if (showSavedLayers) {
      loadAllCapas();
    }
  }, [showSavedLayers, loadAllCapas]);

  // Construir configuraciones de capa para el hook
  const layerConfigs = useMemo(() => {
    if (!showSavedLayers) {
      return [];
    }

    return Object.entries(LAYER_TYPES).map(([type, config]) => ({
      id: type,
      features: getFeaturesByType(type as LayerType),
      fillColor: config.color,
      fillOpacity: config.opacity,
      lineColor: config.color, // Opcional: usar un color de línea diferente
    }));
  }, [showSavedLayers, getFeaturesByType, capas]);

  // Renderizar todas las capas con un solo hook
  usePolygonLayers(map, layerConfigs);

  // Manejar guardado de capa
  const handleSave = async () => {
    if (drawnFeatures.length === 0) {
      alert('No hay polígonos dibujados para guardar');
      return;
    }

    const confirmed = window.confirm(
      `¿Guardar ${drawnFeatures.length} polígono(s) como capa tipo "${LAYER_TYPES[selectedLayerType].label}"?`
    );

    if (!confirmed) return;

    try {
      await saveCapa(drawnFeatures, selectedLayerType);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      // Opcional: limpiar el dibujo después de guardar
      // (requeriría exponer el control draw desde useMapbox)
    } catch (e) {
      console.error('Error saving capa:', e);
      alert('Error al guardar la capa. Ver consola para detalles.');
    }
  };

  const canSave = drawnFeatures.length > 0 && !loading;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Panel de controles */}
      <div className="bg-gray-800 text-white p-4 space-y-3">
        <h2 className="text-xl font-bold mb-2">Mapa con Capas</h2>

        {/* Fila de controles */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Checkbox mostrar capas */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showSavedLayers}
              onChange={(e) => setShowSavedLayers(e.target.checked)}
              className="w-4 h-4"
            />
            {showSavedLayers ? <Eye size={18} /> : <EyeOff size={18} />}
            <span>Mostrar Capas Guardadas</span>
          </label>

          {/* Selector de tipo de capa */}
          <div className="flex items-center gap-2">
            <Layers size={18} />
            <span className="text-sm">Tipo:</span>
            <select
              value={selectedLayerType}
              onChange={(e) => setSelectedLayerType(e.target.value as LayerType)}
              className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 text-sm"
            >
              {Object.entries(LAYER_TYPES).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          {/* Botón guardar */}
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`flex items-center gap-2 px-4 py-2 rounded font-medium transition ${
              canSave
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Save size={18} />
            Guardar Capa ({drawnFeatures.length})
          </button>

          {/* Indicador de éxito */}
          {saveSuccess && (
            <span className="text-green-400 text-sm font-medium">
              ✓ Capa guardada exitosamente
            </span>
          )}

          {/* Indicador de carga */}
          {loading && (
            <span className="text-blue-400 text-sm">Cargando...</span>
          )}

          {/* Error */}
          {error && (
            <span className="text-red-400 text-sm">Error: {error}</span>
          )}
        </div>

        {/* Leyenda de colores */}
        {showSavedLayers && (
          <div className="flex gap-4 text-xs mt-2 flex-wrap">
            <span className="font-semibold">Leyenda:</span>
            {Object.entries(LAYER_TYPES).map(([key, config]) => (
              <div key={key} className="flex items-center gap-1">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: config.color, opacity: config.opacity }}
                />
                <span>{config.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Info sobre capas cargadas */}
        {showSavedLayers && capas.length > 0 && (
          <div className="text-sm text-gray-400">
            {capas.length} capa(s) cargada(s) • Total de polígonos: {
              capas.reduce((sum, c) => sum + c.features.length, 0)
            }
          </div>
        )}
      </div>

      {/* Mapa */}
      <div className="flex-1 relative">
        <div ref={mapContainerRef} className="absolute inset-0" />
      </div>
    </div>
  );
};

export default MapWithLayers;
