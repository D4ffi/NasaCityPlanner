import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'mapbox-gl/dist/mapbox-gl.css'
import './index.css'
import MapboxMap from "./components/MapboxMap.tsx";
import { MapProvider } from './context/MapContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MapProvider>
      <MapboxMap />
    </MapProvider>
  </StrictMode>,
)
