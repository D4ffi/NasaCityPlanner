// types/capa.ts

import type { Feature } from 'geojson';

/**
 * DTO para capa almacenada en base de datos
 */
export interface CapaDTO {
  id?: number;
  type: string;  // "pob", "vivienda", "transport", "green", etc.
  json: string;  // GeoJSON stringified
  createdAt?: string;
}

/**
 * Request para guardar una capa
 */
export interface SaveCapaRequest {
  type: string;
  features: string;  // JSON stringified de Features array
}

/**
 * Response al guardar una capa
 */
export interface SaveCapaResponse {
  id: number;
  message: string;
  type: string;
}

/**
 * Capa parseada con features listos para renderizar
 */
export interface CapaParsed {
  id: number;
  type: string;
  features: Feature[];
  createdAt?: string;
}

/**
 * Tipos de capas disponibles con sus configuraciones
 */
export const LAYER_TYPES = {
  pob: {
    label: 'Población',
    color: '#8b5cf6',  // purple-500
    opacity: 0.4,
  },
  vivienda: {
    label: 'Vivienda',
    color: '#10b981',  // green-500
    opacity: 0.4,
  },
  transport: {
    label: 'Transporte',
    color: '#3b82f6',  // blue-500
    opacity: 0.4,
  },
  green: {
    label: 'Áreas Verdes',
    color: '#22c55e',  // green-400
    opacity: 0.4,
  },
  expansion: {
    label: 'Expansión Urbana',
    color: '#f59e0b',  // amber-500
    opacity: 0.4,
  },
} as const;

export type LayerType = keyof typeof LAYER_TYPES;
