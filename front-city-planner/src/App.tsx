import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './components/pages/Dashboard'
import LandingPage from './components/pages/LandingPage'
import PolygonLayerDemo from './components/pages/PolygonLayerDemo'
import MapWithLayers from './components/pages/MapWithLayers'
import MapboxMap from './components/MapboxMap'
import './App.css'

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');

  if (showLanding) {
    return <LandingPage onStart={() => setShowLanding(false)} />;
  }

  // Función para renderizar la vista activa
  const renderActiveView = () => {
    switch (activeView) {
      case 'map':
        return (
          <div className="flex-1 relative">
            <MapboxMap className="absolute inset-0" />
          </div>
        );
      case 'map-layers':
        return <MapWithLayers />;
      case 'polygon-demo':
        return <PolygonLayerDemo />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar onNavigate={setActiveView} activeView={activeView} />
      {renderActiveView()}
    </div>
  )
}

export default App
