# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NASA City Planner is a full-stack monorepo application combining:
- **Backend**: Spring Boot 3.5.6 (Java 17) with JPA, PostgreSQL, and Lombok
- **Frontend**: React 19 + TypeScript + Vite with Tailwind CSS 4 and Mapbox GL

The project integrates Mapbox GL for interactive 3D city visualization with custom NightMap styling, 3D buildings, and terrain support.

## Architecture

### Monorepo Structure
```
.
├── BackCityPlanner/          # Spring Boot backend
│   └── src/main/java/com/daffidev/backcityplanner/
└── front-city-planner/       # React + Vite frontend
    └── src/
        ├── components/       # React components (MapboxMap, etc.)
        ├── context/          # React context providers (MapContext)
        ├── hooks/            # Custom React hooks (useMapbox)
        └── App.tsx
```

### Frontend Architecture

**Mapbox Integration Pattern**:
- `MapContext` (context/MapContext.tsx): Global map state management via React Context
- `useMapbox` hook (hooks/useMapbox.ts): Encapsulates map initialization, 3D buildings, terrain, and controls
- `MapboxMap` component: Renders the map container
- Environment variable: `VITE_MAPBOX_URL` contains the Mapbox access token

**Key Implementation Details**:
- Custom Mapbox style: `mapbox://styles/daffi/cmgb6w2zf000b01qp3e315yw8` (NightMap)
- Default center: `[-96.11022390967145, 19.160172792691906]`
- 3D features: Buildings (layer 'add-3d-buildings') and terrain (mapbox-dem source)
- Navigation and fullscreen controls included

### Backend Architecture

**Spring Boot Configuration**:
- Database: PostgreSQL hosted on Supabase
- Environment variables required: `DB_USERNAME` (defaults to 'postgres'), `DB_PASSWORD`
- Main application class: `BackCityPlannerApplication.java`
- Server port: 8080
- Lombok is used for reducing boilerplate code

## Development Commands

### Run Development Environment
```bash
npm run dev                    # Start both backend and frontend concurrently
npm run dev:backend            # Start backend only (Spring Boot on port 8080)
npm run dev:frontend           # Start frontend only (Vite dev server)
```

### Build
```bash
npm run build                  # Build both backend and frontend
npm run build:backend          # Maven clean package (skips tests)
npm run build:frontend         # TypeScript compile + Vite build
```

### Testing
```bash
npm run test:backend           # Run backend Maven tests
npm run test:frontend          # Run frontend tests
```

### Linting
```bash
npm run lint:frontend          # Run ESLint on frontend
```

### Backend-Specific (from BackCityPlanner directory)
```bash
./mvnw spring-boot:run         # Run Spring Boot app
./mvnw test                    # Run tests
./mvnw clean package           # Build JAR
```

### Frontend-Specific (from front-city-planner directory)
```bash
npm run dev                    # Start Vite dev server
npm run build                  # Build for production
npm run preview                # Preview production build
npm run lint                   # Run ESLint
```

### Installation
```bash
npm run install:all            # Install frontend dependencies
npm run install:frontend       # Same as above
```

### Cleanup
```bash
npm run clean                  # Clean both backend and frontend
npm run clean:backend          # Maven clean
npm run clean:frontend         # Remove node_modules and dist
```

## Environment Setup

### Required Environment Variables

**Root `.env` file** (for backend):
```
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

**Frontend `.env` file** (`front-city-planner/.env`):
```
VITE_MAPBOX_URL=your_mapbox_access_token
```

## Technology Stack

### Backend
- Spring Boot 3.5.6
- Spring Data JPA
- Spring Web
- Spring Boot DevTools
- PostgreSQL
- Lombok
- Java 17

### Frontend
- React 19.1.1
- TypeScript 5.8.3
- Vite 7.1.7
- Tailwind CSS 4.1.14
- Mapbox GL 3.15.0
- ESLint

## Git Workflow

- Main branch: `main`
- Current working branch: `Nabi-Main`
- Untracked files noted: `front-city-planner/.env` (intentionally ignored)
