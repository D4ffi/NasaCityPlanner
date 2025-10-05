import { X } from 'lucide-react';

interface FeatureProperties {
  [key: string]: any;
}

interface MapPopupProps {
  properties: FeatureProperties | null;
  onClose: () => void;
  isVisible: boolean;
}

// Mapeo de claves a nombres legibles
const FIELD_LABELS: Record<string, string> = {
  // Desigualdad
  sun: 'Ciudad',
  cvegeo: 'Clave Manzana',
  gmu: 'Grado de Marginación',
  iisu_sun: 'IISU Nacional',
  iisu_cd: 'IISU Ciudad',
  Pob_2010: 'Población 2010',
  Empleo: 'Empleos (30 min)',
  E_basica: 'Escuelas Básicas (15 min)',
  E_media: 'Escuelas Media Superior (30 min)',
  E_superior: 'Escuelas Superior (30 min)',
  Salud_cama: 'Camas Salud Pública (30 min)',
  Salud_cons: 'Consultorios Públicos (30 min)',
  Abasto: 'Unidades de Abasto (20 min)',
  Espacio_ab: 'm² Espacio Abierto (20 min)',
  Cultura: 'Instalaciones Culturales (20 min)',
  Est_Tpte: 'Estaciones Transporte (15 min)',

  // Vial
  NOMBRE: 'Nombre de la vía',
  TIPO_VIAL: 'Tipo de vía',
  ADMINISTRA: 'Administración',
  JURISDI: 'Jurisdicción',
  CONDICION: 'Condición',
  COND_PAV: 'Condición del pavimento',
  RECUBRI: 'Recubrimiento',
  CALIREPR: 'Calidad representativa',
  ANCHO: 'Ancho (m)',
  CARRILES: 'Carriles',
  VELOCIDAD: 'Velocidad',
  LONG_KM: 'Longitud (km)',
  PEAJE: 'Peaje',
  CIRCULA: 'Circulación',
  NOMGEO: 'Nombre geográfico',
};

const MapPopup = ({ properties, onClose, isVisible }: MapPopupProps) => {
  // Formatear valores
  const formatValue = (key: string, value: any): string => {
    if (value === null || value === undefined || value === '') return 'N/A';

    // Formatear números grandes con comas
    if (['Empleo', 'Espacio_ab', 'Pob_2010'].includes(key)) {
      const num = parseFloat(value);
      return !isNaN(num) ? num.toLocaleString('es-MX') : String(value);
    }

    // Formatear índices IISU como porcentaje
    if (key === 'iisu_sun' || key === 'iisu_cd') {
      const num = parseFloat(value);
      return !isNaN(num) ? `${(num * 100).toFixed(1)}%` : String(value);
    }

    // Formatear longitud y ancho
    if (key === 'LONG_KM' || key === 'ANCHO') {
      const num = parseFloat(value);
      return !isNaN(num) ? num.toFixed(2) : String(value);
    }

    return String(value);
  };

  // No renderizar contenido si no hay properties
  if (!properties) {
    return null;
  }

  // Detectar si es información vial o de desigualdad
  const isVialData = properties.TIPO_VIAL !== undefined;

  // Filtrar y ordenar propiedades relevantes para DESIGUALDAD
  const priorityFields = ['sun', 'iisu_sun', 'iisu_cd', 'gmu', 'Pob_2010'];
  const accessFields = ['Empleo', 'E_basica', 'E_media', 'E_superior', 'Salud_cama', 'Salud_cons', 'Abasto', 'Espacio_ab', 'Cultura', 'Est_Tpte'];

  // Campos para VIAL
  const vialMainFields = ['NOMBRE', 'TIPO_VIAL', 'ADMINISTRA', 'CONDICION', 'COND_PAV'];
  const vialDetailFields = ['ANCHO', 'CARRILES', 'VELOCIDAD', 'LONG_KM', 'RECUBRI', 'CIRCULA', 'PEAJE'];

  const priorityProps = priorityFields
    .filter(key => properties[key] !== null && properties[key] !== undefined && properties[key] !== '')
    .map(key => [key, properties[key]]);

  const accessProps = accessFields
    .filter(key => properties[key] !== null && properties[key] !== undefined && properties[key] !== '' && properties[key] !== '0')
    .map(key => [key, properties[key]]);

  const vialMainProps = vialMainFields
    .filter(key => properties[key] !== null && properties[key] !== undefined && properties[key] !== '')
    .map(key => [key, properties[key]]);

  const vialDetailProps = vialDetailFields
    .filter(key => properties[key] !== null && properties[key] !== undefined && properties[key] !== '')
    .map(key => [key, properties[key]]);

  return (
    <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-[9999] isolate pointer-events-auto rounded-2xl shadow-2xl max-w-lg w-full mx-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{
        background: 'linear-gradient(to bottom right, rgba(49, 46, 129, 0.95), rgba(88, 28, 135, 0.95))',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(168, 85, 247, 0.4)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-purple-500/30">
        <h3 className="text-white font-bold text-lg">
          {isVialData
            ? (properties.NOMBRE || 'Información Vial')
            : (properties.sun || 'Información del Área')
          }
        </h3>
        <button
          onClick={onClose}
          className="text-gray-300 hover:text-white transition-colors p-1 hover:bg-purple-500/20 rounded-lg"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-96 overflow-y-auto space-y-4">
        {isVialData ? (
          // INFORMACIÓN VIAL
          <>
            {/* Información Principal Vial */}
            {vialMainProps.length > 0 && (
              <div>
                <h4 className="text-amber-300 font-semibold text-sm mb-2">Información Principal</h4>
                <div className="space-y-2">
                  {vialMainProps.map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-amber-950/40 rounded-lg px-3 py-2 border border-amber-500/20 flex justify-between items-center"
                    >
                      <span className="text-amber-300 text-xs font-medium">
                        {FIELD_LABELS[key] || key}
                      </span>
                      <span className="text-white text-sm font-semibold">
                        {formatValue(key, value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detalles Viales */}
            {vialDetailProps.length > 0 && (
              <div>
                <h4 className="text-amber-300 font-semibold text-sm mb-2">Características</h4>
                <div className="space-y-2">
                  {vialDetailProps.map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-amber-950/40 rounded-lg px-3 py-2 border border-amber-500/20 flex justify-between items-center"
                    >
                      <span className="text-amber-300 text-xs font-medium">
                        {FIELD_LABELS[key] || key}
                      </span>
                      <span className="text-white text-sm font-semibold">
                        {formatValue(key, value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          // INFORMACIÓN DE DESIGUALDAD
          <>
            {/* Información General */}
            {priorityProps.length > 0 && (
              <div>
                <h4 className="text-purple-300 font-semibold text-sm mb-2">Información General</h4>
                <div className="space-y-2">
                  {priorityProps.map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-purple-950/40 rounded-lg px-3 py-2 border border-purple-500/20 flex justify-between items-center"
                    >
                      <span className="text-purple-300 text-xs font-medium">
                        {FIELD_LABELS[key] || key}
                      </span>
                      <span className="text-white text-sm font-semibold">
                        {formatValue(key, value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accesibilidad a Servicios */}
            {accessProps.length > 0 && (
              <div>
                <h4 className="text-purple-300 font-semibold text-sm mb-2">Accesibilidad a Servicios</h4>
                <div className="space-y-2">
                  {accessProps.map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-purple-950/40 rounded-lg px-3 py-2 border border-purple-500/20 flex justify-between items-center"
                    >
                      <span className="text-purple-300 text-xs font-medium">
                        {FIELD_LABELS[key] || key}
                      </span>
                      <span className="text-white text-sm font-semibold">
                        {formatValue(key, value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!isVialData && priorityProps.length === 0 && accessProps.length === 0 && (
          <p className="text-gray-300 text-sm text-center py-4">
            No hay datos disponibles para esta área
          </p>
        )}
        {isVialData && vialMainProps.length === 0 && vialDetailProps.length === 0 && (
          <p className="text-gray-300 text-sm text-center py-4">
            No hay datos disponibles para esta vía
          </p>
        )}
      </div>
    </div>
  );
};

export default MapPopup;
