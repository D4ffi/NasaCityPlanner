// src/context/MapContext.tsx

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Map } from 'mapbox-gl';

// Define la estructura de datos que el contexto compartirá
interface MapContextType {
  map: Map | null;
  setMap: (map: Map | null) => void;
}

// Crea el contexto
const MapContext = createContext<MapContextType | undefined>(undefined);

// Crea el "Proveedor" que envolverá tu aplicación
export function MapProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<Map | null>(null);

  return (
    <MapContext.Provider value={{ map, setMap }}>
      {children}
    </MapContext.Provider>
  );
}

// Crea y EXPORTA el hook para consumir el contexto
export function useMapContext() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
}
