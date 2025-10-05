// components/pages/PolygonLayerDemo.tsx

import { useState, useMemo } from 'react';
import MapboxMap from '../MapboxMap';
import type { Feature } from 'geojson';

// GeoJSON de prueba proporcionado (constante fuera del componente para evitar recreación)
const SAMPLE_POLYGON_FEATURES: Feature[] = [
  {
    "id": "xmKxcffk0MSHUdVYMIjN5sMPUlcHc8Cj",
    "type": "Feature",
    "properties": {},
    "geometry": {
      "coordinates": [
        [
          [-96.12664164311917, 19.216511003917276],
          [-96.16126431861021, 19.216598232539724],
          [-96.17145516204116, 19.248203596681407],
          [-96.19911360684075, 19.25724863306209],
          [-96.24297499656613, 19.232194104413296],
          [-96.27128305928139, 19.18750506924266],
          [-96.25400165416765, 19.146825144743374],
          [-96.22724259945318, 19.115750043794108],
          [-96.19673364507611, 19.11587623487887],
          [-96.1674814001534, 19.115677779365413],
          [-96.1530909620167, 19.126266641890126],
          [-96.13171534203498, 19.114511522713556],
          [-96.12257117083595, 19.11019828441148],
          [-96.12919758840484, 19.10868275367082],
          [-96.12930513560396, 19.09864118164984],
          [-96.10677385128483, 19.067446502270087],
          [-96.0908856009673, 19.059572041835636],
          [-96.06459502508886, 19.045546906913728],
          [-96.05832303707403, 19.064451516911774],
          [-96.0939902174363, 19.088620164818238],
          [-96.10028749132617, 19.107512351775185],
          [-96.10567237096586, 19.12899390608011],
          [-96.09996195991424, 19.133315526922317],
          [-96.09243109508498, 19.14929641910878],
          [-96.1040973546356, 19.16591189518242],
          [-96.11930130926629, 19.175724381328735],
          [-96.12251058311928, 19.190399758140913],
          [-96.12664164311917, 19.216511003917276]
        ]
      ],
      "type": "Polygon"
    }
  }
];

// Array vacío constante para reutilización
const EMPTY_FEATURES: Feature[] = [];

const PolygonLayerDemo = () => {
  const [showPolygon, setShowPolygon] = useState(true);
  const [enableDrawing, setEnableDrawing] = useState(false);

  // Memoizar los features que se pasan al mapa
  // Esto evita crear un nuevo array en cada render
  const polygonFeatures = useMemo(() => {
    return showPolygon ? SAMPLE_POLYGON_FEATURES : EMPTY_FEATURES;
  }, [showPolygon]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Panel de controles */}
      <div className="bg-gray-800 text-white p-4 space-y-2">
        <h2 className="text-xl font-bold mb-4">Demo: Renderizado de Polígonos por Capas</h2>

        <div className="flex gap-6 items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showPolygon}
              onChange={(e) => setShowPolygon(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Mostrar polígono morado</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={enableDrawing}
              onChange={(e) => setEnableDrawing(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Habilitar dibujo manual</span>
          </label>
        </div>

        <div className="text-sm text-gray-400 mt-2">
          <p>
            El polígono se renderiza con <span className="text-purple-400">fill-color: #8b5cf6</span> y{' '}
            <span className="text-purple-400">fill-opacity: 0.4</span>
          </p>
        </div>
      </div>

      {/* Mapa */}
      <div className="flex-1 relative">
        <MapboxMap
          className="absolute inset-0"
          polygonFeatures={polygonFeatures}
          enableDrawing={enableDrawing}
          initialCenter={[-96.15, 19.15]} // Centro aproximado del polígono de prueba
          initialZoom={11}
        />
      </div>
    </div>
  );
};

export default PolygonLayerDemo;
