// services/capaApi.ts

import type { Feature } from 'geojson';
import type { CapaDTO, SaveCapaResponse } from '../types/capa';

const API_BASE_URL = 'http://localhost:8081/api/capas';

/**
 * Guarda una nueva capa en la base de datos
 *
 * @param features - Array de features GeoJSON
 * @param type - Tipo de capa ("pob", "vivienda", etc.)
 * @returns Promise con la respuesta del servidor
 */
export async function saveCapa(
  features: Feature[],
  type: string
): Promise<SaveCapaResponse> {
  const response = await fetch(`${API_BASE_URL}/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type,
      features: JSON.stringify(features),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al guardar capa');
  }

  return response.json();
}

/**
 * Obtiene todas las capas guardadas
 *
 * @returns Promise con array de capas
 */
export async function getAllCapas(): Promise<CapaDTO[]> {
  const response = await fetch(API_BASE_URL);

  if (!response.ok) {
    throw new Error('Error al obtener capas');
  }

  return response.json();
}

/**
 * Obtiene capas de un tipo específico
 *
 * @param type - Tipo de capa
 * @returns Promise con array de capas del tipo especificado
 */
export async function getCapasByType(type: string): Promise<CapaDTO[]> {
  const response = await fetch(`${API_BASE_URL}/type/${type}`);

  if (!response.ok) {
    throw new Error(`Error al obtener capas del tipo ${type}`);
  }

  return response.json();
}

/**
 * Elimina una capa por ID
 *
 * @param id - ID de la capa a eliminar
 * @returns Promise que se resuelve cuando la capa se elimina
 */
export async function deleteCapa(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al eliminar capa');
  }
}
