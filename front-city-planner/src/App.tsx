import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './components/pages/Dashboard'
import LandingPage from './components/pages/LandingPage'
import MapboxMap from './components/MapboxMap'
import MapLeyenda from './components/MapLeyenda'
import MapPopup from './components/MapPopup'
import './App.css'

interface FeatureProperties {
  [key: string]: any;
}

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedFeature, setSelectedFeature] = useState<FeatureProperties | null>(null);

  if (showLanding) {
    return <LandingPage onStart={() => setShowLanding(false)} />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar onNavigate={setActiveView} activeView={activeView} />

      {activeView === 'map' ? (
        <div className="flex-1 relative bg-gray-900">
          <MapboxMap className="absolute inset-0" />
          <div className="absolute inset-0 pointer-events-none">
            <MapLeyenda onFeatureClick={setSelectedFeature} />
            <MapPopup
              properties={selectedFeature}
              onClose={() => setSelectedFeature(null)}
              isVisible={selectedFeature !== null}
            />
          </div>
        </div>
      ) : (
        <Dashboard />
      )}
    </div>
  )
}

export default App
