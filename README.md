# Data Pathways - Sistema de Planificación Urbana para Veracruz

## Propósito del Proyecto

Data Pathways es una herramienta de análisis y visualización geoespacial diseñada para identificar oportunidades de expansión urbana en la Zona Metropolitana de Veracruz, con enfoque en la reducción de la desigualdad social y la mejora del acceso a servicios públicos.

### Objetivos Principales

1. **Análisis de Desigualdad Urbana**
   - Visualizar el Índice de Inclusión Social Urbana (IISU) en diferentes zonas de la ciudad
   - Identificar áreas con alta desigualdad que requieren intervención prioritaria
   - Mapear la distribución de servicios públicos y su accesibilidad

2. **Optimización de Servicios Públicos**
   - Evaluar cómo la desigualdad social afecta el acceso a servicios básicos en diferentes sectores
   - Proponer ubicaciones estratégicas para nuevos servicios (consultorios, escuelas, áreas verdes)
   - Reducir tiempos de desplazamiento a trabajo y educación

3. **Movilidad Urbana Sostenible**
   - Demostrar cómo la ubicación estratégica de servicios cerca de zonas residenciales puede reducir el uso del automóvil
   - Promover el transporte público y medios alternativos (caminata, bicicleta)
   - Mejorar la calidad de vida reduciendo tiempos de traslado

### Contexto

Veracruz presenta un Índice de Desigualdad de 4.0/5 (Alto), ocupando la posición 20 de 74 zonas metropolitanas en México. Los datos muestran que:

- **Tiempo promedio al trabajo**: 28.3 minutos
- **Tiempo promedio a escuelas**: 17.6 minutos
- **Uso de transporte público**: 42.9%
- **Uso de automóvil privado**: 35.2%
- **Población**: 939,046 habitantes (Censo 2020)

Estos indicadores revelan la necesidad de una planificación urbana basada en datos que priorice la equidad y accesibilidad.

## Funcionalidades

### Dashboard de Estadísticas
- Visualización de población e índice de desigualdad
- Comparativa Veracruz vs promedio nacional
- Gráficos de desigualdad por zona metropolitana
- Tiempos de acceso a servicios públicos
- Distribución de uso de transporte

### Mapa Interactivo
Capas de información disponibles:

1. **Índice de Desigualdad**: Visualización por manzanas con gradiente de rojo según nivel de desigualdad
2. **Información Vial**: Red de carreteras y vías principales con características técnicas
3. **Referencias de Mejora**: Propuestas de ubicación para servicios públicos
   - Consultorios (rojo)
   - Escuelas (azul)
   - Áreas abiertas (naranja)
   - Áreas verdes (verde)

### Análisis Basado en Evidencia

El sistema utiliza datos de:
- INEGI (Instituto Nacional de Estadística y Geografía) - Censo 2020
- IISU (Índice de Inclusión Social Urbana) - WRI México 2021
- Red Nacional de Caminos 2021
- Datos geoespaciales de Veracruz

## Impacto Esperado

### Reducción de Desigualdad
Al ubicar servicios públicos estratégicamente en zonas de alta desigualdad, se busca:
- Mejorar acceso a salud, educación y recreación
- Reducir brechas de accesibilidad entre diferentes sectores socioeconómicos
- Generar desarrollo equitativo en toda la zona metropolitana

### Mejora en Movilidad
La planificación basada en proximidad permite:
- Disminuir dependencia del automóvil particular
- Reducir tiempos de traslado y congestión vehicular
- Fomentar el uso de transporte público y medios no motorizados
- Reducir emisiones de CO2 y mejorar la calidad del aire

### Inclusión Social
El proyecto demuestra cómo los datos geoespaciales pueden:
- Informar decisiones de política pública con evidencia concreta
- Identificar zonas prioritarias de inversión social
- Promover ciudades más inclusivas y accesibles para todos

## Tecnologías Utilizadas

### Backend
- Spring Boot 3.5.6
- Java 17
- PostgreSQL (Supabase)
- Maven

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Mapbox GL JS 3.15.0

### Datos Geoespaciales
- Tilesets vectoriales de Mapbox
- GeoJSON/Shapefile processing
- TIFF para datos de población (WorldPop)

## Estructura del Proyecto

```
NasaCityPlanner/
├── BackCityPlanner/          # Backend Spring Boot
│   ├── src/main/java/        # Código fuente Java
│   ├── src/main/resources/   # Configuración y recursos
│   └── pom.xml               # Dependencias Maven
│
├── front-city-planner/       # Frontend React
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── context/          # Contextos (MapContext)
│   │   ├── hooks/            # Custom hooks (useMapbox)
│   │   └── assets/           # Recursos estáticos
│   └── package.json
│
└── README.md                 # Este archivo
```

## Instalación y Uso

### Requisitos Previos
- Node.js 18+
- Java 17
- PostgreSQL (o cuenta Supabase)
- Cuenta de Mapbox (para access token)

### Configuración

1. Clonar el repositorio
2. Crear archivo `.env` en la raíz con:
```env
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
VITE_MAPBOX_URL=tu_mapbox_access_token
```

3. Instalar dependencias:
```bash
npm run install:all
```

4. Ejecutar el proyecto:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173` y el backend en `http://localhost:8080`.

## Scripts Disponibles

```bash
# Ejecutar todo el stack
npm run dev

# Solo backend
npm run dev:backend

# Solo frontend
npm run dev:frontend

# Tests
npm run test:backend
npm run test:frontend

# Build producción
npm run build:backend
npm run build:frontend
```

## Contribuciones

Este proyecto fue desarrollado como propuesta de mejora urbana para la Zona Metropolitana de Veracruz, demostrando cómo la tecnología y el análisis de datos pueden contribuir a la planificación de ciudades más equitativas, sostenibles e inclusivas.

## Fuentes de Datos

- **INEGI**: Censo de Población y Vivienda 2020
- **WRI México**: Índice de Inclusión Social Urbana (IISU) 2021
- **SCT**: Red Nacional de Caminos 2021
- **WorldPop**: Datos de densidad poblacional
- **Mapbox**: Servicios de mapeo y tilesets vectoriales

## Licencia

Este proyecto es de código abierto y está disponible para fines educativos y de investigación en planificación urbana.

---

**Data Pathways** - Transformando la desigualdad en oportunidades a través del análisis de datos geoespaciales
