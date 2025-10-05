// hooks/useCapas.ts

import { useState, useCallback } from 'react';
import type { Feature } from 'geojson';
import type { CapaDTO, CapaParsed, LayerType } from '../types/capa';
import * as capaApi from '../services/capaApi';

interface UseCapasReturn {
  capas: CapaParsed[];
  loading: boolean;
  error: string | null;
  saveCapa: (features: Feature[], type: LayerType) => Promise<void>;
  loadAllCapas: () => Promise<void>;
  loadCapasByType: (type: LayerType) => Promise<void>;
  deleteCapa: (id: number) => Promise<void>;
  getFeaturesByType: (type: LayerType) => Feature[];
}

/**
 * Hook personalizado para manejar operaciones de capas
 */
export const useCapas = (): UseCapasReturn => {
  const [capas, setCapas] = useState<CapaParsed[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Parsea una CapaDTO a CapaParsed convirtiendo el JSON string a Features
   */
  const parseCapaDTO = (capaDTO: CapaDTO): CapaParsed => {
    try {
      const features = JSON.parse(capaDTO.json) as Feature[];
      return {
        id: capaDTO.id!,
        type: capaDTO.type,
        features,
        createdAt: capaDTO.createdAt,
      };
    } catch (e) {
      console.error('Error parsing capa JSON:', e);
      throw new Error('Error al parsear capa');
    }
  };

  /**
   * Guarda una nueva capa
   */
  const saveCapa = useCallback(async (features: Feature[], type: LayerType) => {
    setLoading(true);
    setError(null);

    try {
      if (!features || features.length === 0) {
        throw new Error('No hay features para guardar');
      }

      await capaApi.saveCapa(features, type);

      // Recargar capas después de guardar
      await loadAllCapas();

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Error desconocido';
      setError(errorMessage);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carga todas las capas
   */
  const loadAllCapas = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const capasDTO = await capaApi.getAllCapas();
      const capasParsed = capasDTO.map(parseCapaDTO);
      setCapas(capasParsed);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Error al cargar capas';
      setError(errorMessage);
      console.error('Error loading capas:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carga capas de un tipo específico
   */
  const loadCapasByType = useCallback(async (type: LayerType) => {
    setLoading(true);
    setError(null);

    try {
      const capasDTO = await capaApi.getCapasByType(type);
      const capasParsed = capasDTO.map(parseCapaDTO);
      setCapas(capasParsed);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Error al cargar capas';
      setError(errorMessage);
      console.error('Error loading capas by type:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Elimina una capa
   */
  const deleteCapa = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await capaApi.deleteCapa(id);

      // Actualizar estado local removiendo la capa eliminada
      setCapas(prev => prev.filter(capa => capa.id !== id));

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Error al eliminar capa';
      setError(errorMessage);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene todas las features de un tipo específico (para renderizar)
   */
  const getFeaturesByType = useCallback((type: LayerType): Feature[] => {
    return capas
      .filter(capa => capa.type === type)
      .flatMap(capa => capa.features);
  }, [capas]);

  return {
    capas,
    loading,
    error,
    saveCapa,
    loadAllCapas,
    loadCapasByType,
    deleteCapa,
    getFeaturesByType,
  };
};
