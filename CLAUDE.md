# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NASA City Planner is a monorepo containing:
- **BackCityPlanner**: Spring Boot 3.5.6 backend (Java 17)
- **front-city-planner**: React 19 + TypeScript + Vite frontend

The application integrates MapboxGL for interactive 3D mapping with custom styling, terrain, and building visualization.

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
# Development mode (requires .env file in root)
npm run dev:backend
# Or directly:
cd BackCityPlanner && dotenv -e ../.env -- ./mvnw spring-boot:run

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
- **Database**: PostgreSQL hosted on Supabase (`db.kewcmyaivwpamlbekocv.supabase.co`)
- **Build Tool**: Maven with wrapper (`mvnw`)
- **Key Dependencies**: Lombok, PostgreSQL driver, Spring DevTools
- **Package Structure**: `com.daffidev.backcityplanner`
- **Port**: 8080 (configured in `application.properties`)

Database credentials are injected from environment variables:
- `DB_USERNAME` defaults to `postgres`
- `DB_PASSWORD` is required

### Frontend (front-city-planner/)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4 (using `@tailwindcss/vite` plugin)
- **Mapping**: MapboxGL 3.15.0

#### MapboxGL Integration Pattern
The frontend uses a structured approach for Mapbox integration:

1. **Context** (`src/context/MapContext.tsx`):
   - Provides global map instance state via `MapProvider`
   - Access map instance with `useMapContext()` hook

2. **Hook** (`src/hooks/useMapbox.ts`):
   - Initializes MapboxGL instance with custom configuration
   - Default center: Veracruz, México `[-96.11022390967145, 19.160172792691906]`
   - Custom style: `mapbox://styles/daffi/cmgb6w2zg000b01qp3e315yw8` (NightMap)
   - Adds 3D buildings layer (`add-3d-buildings`) at zoom 15+
   - Enables 3D terrain with `mapbox-dem` source (1.5x exaggeration)
   - Includes NavigationControl and FullscreenControl

3. **Component** (`src/components/MapboxMap.tsx`):
   - Reusable map component that accepts `initialCenter`, `initialZoom`, `className`
   - Uses ref pattern to pass container to `useMapbox` hook

#### MapboxGL Access Token
The Mapbox access token is loaded from `import.meta.env.VITE_MAPBOX_URL`. Ensure this is set in your `.env` file.

## Key Technical Details

### Backend
- JPA entities use Lombok annotations for boilerplate reduction
- Database schema managed through Spring Data JPA
- Uses Maven compiler plugin configured for Lombok annotation processing

### Frontend
- React 19 with new features enabled
- TypeScript strict mode configuration (`tsconfig.app.json`, `tsconfig.node.json`)
- ESLint configured with React hooks plugin and React refresh
- Mapbox 3D features require WebGL support
- Terrain 3D may be blocked by some browsers (handled with try-catch in `useMapbox.ts`)

## Testing

### Backend Tests
Located in `BackCityPlanner/src/test/java/com/daffidev/backcityplanner/`
- Run with `mvnw test` or `npm run test:backend`

### Frontend Tests
- Run with `npm run test:frontend` from root or `npm run test` from `front-city-planner/`
