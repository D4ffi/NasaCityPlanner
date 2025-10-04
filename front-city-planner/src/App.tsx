import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './components/pages/Dashboard'
import MapboxMap from './components/MapboxMap'
import './App.css'

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar onNavigate={setActiveView} activeView={activeView} />

      {activeView === 'map' ? (
        <div className="flex-1 relative">
          <MapboxMap className="absolute inset-0" />
        </div>
      ) : (
        <Dashboard />
      )}
    </div>
  )
}

export default App
