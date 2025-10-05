# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NASA City Planner is a monorepo containing:
- **BackCityPlanner**: Spring Boot 3.5.6 backend (Java 17)
- **front-city-planner**: React 19 + TypeScript + Vite frontend

The application integrates MapboxGL for interactive 3D mapping with custom styling, terrain, and building visualization. It features WorldPop API integration for population density data visualization and TIFF image processing capabilities.

## Core Features

### Population Mapping
- **WorldPop Integration**: Fetches population and population density data from WorldPop API
- **Image Processing**: Downloads and converts TIFF population maps to PNG format
- **Data Persistence**: Stores population graphics metadata in Supabase PostgreSQL database
- **ISO3 Country Codes**: Supports querying by ISO3 country codes (e.g., MEX for Mexico)

### Interactive Mapping
- **3D Visualization**: MapboxGL with 3D buildings and terrain
- **Drawing Tools**: Polygon drawing on maps using Mapbox GL Draw
- **Custom Styling**: Night theme map style with custom terrain exaggeration
- **Navigation Controls**: Full-screen, zoom, and navigation controls

### Data Flow
1. Frontend requests population data by ISO3 code
2. Backend queries WorldPop API for population density images
3. TIFF images are downloaded and converted to PNG
4. Metadata stored in database for future reference
5. PNG images served to frontend for visualization

## Development Commands

### Running the Full Stack
```bash
# Install frontend dependencies
npm run install:all

# Run both backend and frontend concurrently
npm run dev
```

### Backend (Spring Boot)
```bash
# Development mode (requires ..env file in root)
npm run dev:backend
# Or directly:
cd BackCityPlanner && dotenv -e ../..env -- ./mvnw spring-boot:run

# Run tests
npm run test:backend
# Or: cd BackCityPlanner && ./mvnw test

# Build
npm run build:backend
# Or: cd BackCityPlanner && ./mvnw clean package -DskipTests

# Clean
cd BackCityPlanner && ./mvnw clean
```

### Frontend (React + Vite)
```bash
# Development mode
npm run dev:frontend
# Or: cd front-city-planner && npm run dev

# Run tests
npm run test:frontend

# Build production
npm run build:frontend
# Or: cd front-city-planner && npm run build

# Lint
npm run lint:frontend

# Preview production build
npm run preview:frontend
```

## Environment Configuration

### Required .env File
Create a `.env` file in the **repository root** with:
```
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
VITE_MAPBOX_URL=your_mapbox_access_token
```

The backend uses `dotenv-cli` to load these variables when running via `npm run dev:backend`.

## Architecture

### Backend (BackCityPlanner/)
- **Framework**: Spring Boot 3.5.6 with Spring Web and Spring Data JPA
- **Database**: PostgreSQL hosted on Supabase (`aws-1-us-east-2.pooler.supabase.com`)
- **Build Tool**: Maven with wrapper (`mvnw`)
- **Key Dependencies**: Lombok, PostgreSQL driver, Spring DevTools, TwelveMonkeys ImageIO
- **Package Structure**: `com.daffidev.backcityplanner`
- **Port**: 8080 (configured in `application.properties`)

Database credentials are injected from environment variables:
- `DB_USERNAME` defaults to `postgres`
- `DB_PASSWORD` is required

#### API Endpoints

**ImageController** (`/api/images`)
- `GET /api/images/map?iso3={code}` - Retrieves population density map image URLs for specified country
  - Returns list of `PopulationImageDto` with year and image URL
  - Default: `iso3=MEX`
  - Example: `/api/images/map?iso3=MEX`

**MapController** (`/api/worldpop/`)
- `GET /api/worldpop?iso3={code}` - Fetches WorldPop population data as JSON
- `GET /api/worldpop/files?iso3={code}` - Retrieves WorldPop files metadata
- `GET /api/worldpop/tiff/convert?url={tiff_url}` - Downloads TIFF from URL and converts to PNG
- `POST /api/worldpop/tiff/upload` - Accepts TIFF file upload and converts to PNG
  - Content-Type: `multipart/form-data`
  - Parameter: `file` (TIFF file)

**TestingController** (`/`)
- Root-level testing endpoints (currently commented out for production)

#### Services & Components

**WorldPopClient** - HTTP client for WorldPop API integration
- `fetchPopulationByIso3(String iso3)` - Fetches basic population data
- `fetchPopulationDensityByIso3(String iso3)` - Fetches population density data with image URLs
- Base URLs:
  - Population: `https://www.worldpop.org/rest/data/pop/WPGP`
  - Population Density: `https://www.worldpop.org/rest/data/pop_density/pd_ic_1km`
- Timeouts: 5s connect, 10s read

**TiffConverter** - TIFF to PNG image conversion utility
- Uses TwelveMonkeys ImageIO library for TIFF support
- Methods: `convertTiffToPng(byte[])`, `convertTiffToPng(File)`, `convertTiffToPng(InputStream)`
- Supports saving converted images to file system

**MapService** - Main orchestration service
- `getPopulationImages(String iso3)` - Fetches population density images with URLs
- `downloadAndConvertTiffToPng(String url)` - Downloads and converts TIFF to PNG
- `getPopulationMapAsPng(String iso3)` - Complete workflow: fetch → download → convert

**GraficoService** - Database operations for population graphics
- `savePopulationGraphics(String name, List<PopulationImageDto>)` - Saves graphics to database
- `getGraphicsByName(String name)` - Retrieves graphics by name/ISO3
- `deleteGraphicsByName(String name)` - Deletes all graphics for given name
- Uses `@Transactional` for atomicity

#### Data Models

**Entities:**
- `Grafico` - JPA entity for `grafico` table in Supabase
  - Fields: `id`, `createdAt`, `name`, `year`, `url`
  - Stores population graphics metadata

**DTOs:**
- `PopulationImageDto` - Population density image data
  - Fields: `popYear` (Integer), `urlImage` (String)
  - JSON mapping: `popyear`, `url_img`

**Repositories:**
- `GraficoRepository` - Spring Data JPA repository for Grafico entity
  - Custom queries: `findByName(String)`, `deleteByName(String)`
- `IMapRepository` - Repository interface for map-related data operations

#### Additional Dependencies
- **TwelveMonkeys ImageIO** (v3.12.0): TIFF image format support
  - `imageio-tiff` - TIFF reader/writer plugin
  - `imageio-core` - Core ImageIO extensions

### Frontend (front-city-planner/)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4 (using `@tailwindcss/vite` plugin)
- **Mapping**: MapboxGL 3.15.0, Mapbox GL Draw 1.5.0
- **Icons**: Lucide React

#### MapboxGL Integration Pattern
The frontend uses a structured approach for Mapbox integration:

1. **Context** (`src/context/MapContext.tsx`):
   - Provides global map instance state via `MapProvider`
   - Access map instance with `useMapContext()` hook

2. **Hooks**:

   **useMapbox** (`src/hooks/useMapbox.ts`):
   - Initializes MapboxGL instance with custom configuration
   - Default center: Veracruz, México `[-96.11022390967145, 19.160172792691906]`
   - Custom style: `mapbox://styles/daffi/cmgb6w2zg000b01qp3e315yw8` (NightMap)
   - Adds 3D buildings layer (`add-3d-buildings`) at zoom 15+
   - Enables 3D terrain with `mapbox-dem` source (1.5x exaggeration)
   - Includes NavigationControl and FullscreenControl

   **useMapboxDraw** (`src/hooks/useMapboxDraw.ts`):
   - Integrates Mapbox GL Draw for drawing shapes on the map
   - Supports polygon drawing with user-defined boundaries
   - Event handlers: `onDrawCreate`, `onDrawUpdate`, `onDrawDelete`
   - Methods:
     - `startDrawingPolygon()` - Activates polygon drawing mode
     - `getAllFeatures()` - Returns all drawn features
     - `deleteAll()` - Clears all drawn features
     - `getSelectedFeatures()` - Returns currently selected features
   - State: `isDrawing` - boolean flag indicating active drawing state
   - Controls: Polygon tool and trash/delete tool enabled by default

3. **Component** (`src/components/MapboxMap.tsx`):
   - Reusable map component that accepts `initialCenter`, `initialZoom`, `className`
   - Uses ref pattern to pass container to `useMapbox` hook

#### MapboxGL Access Token
The Mapbox access token is loaded from `import.meta.env.VITE_MAPBOX_URL`. Ensure this is set in your `.env` file.

#### Key Frontend Dependencies
- **@mapbox/mapbox-gl-draw** (v1.5.0): Drawing tools for MapboxGL
  - Note: Currently installed but not in package.json - should be added as dependency
- **lucide-react** (v0.544.0): Icon library for UI components

## Key Technical Details

### Backend
- JPA entities use Lombok annotations for boilerplate reduction
- Database schema managed through Spring Data JPA with `spring.jpa.hibernate.ddl-auto=update`
- Uses Maven compiler plugin configured for Lombok annotation processing
- RestTemplate configured with timeouts for external API calls (WorldPop)
- Image processing using Java ImageIO with TwelveMonkeys plugins
- Transaction management with `@Transactional` for data consistency
- Logging pattern: `WAKO_LOGS | timestamp | level | logger | message`
- SQL logging enabled in development (`spring.jpa.show-sql=true`)

### Frontend
- React 19 with new features enabled
- TypeScript strict mode configuration (`tsconfig.app.json`, `tsconfig.node.json`)
- ESLint configured with React hooks plugin and React refresh
- Mapbox 3D features require WebGL support
- Terrain 3D may be blocked by some browsers (handled with try-catch in `useMapbox.ts`)
- Custom hooks pattern for Mapbox features (map initialization, drawing tools)
- State management using React Context API for map instance sharing
- Callback-based event handlers to prevent unnecessary re-renders in drawing tools

## Testing

### Backend Tests
Located in `BackCityPlanner/src/test/java/com/daffidev/backcityplanner/`
- Run with `mvnw test` or `npm run test:backend`

### Frontend Tests
- Run with `npm run test:frontend` from root or `npm run test` from `front-city-planner/`
