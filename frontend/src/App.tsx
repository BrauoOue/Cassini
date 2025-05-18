// src/App.tsx
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import UserDashboard from "./pages/UserDashboard.tsx";
import FormPage from "./pages/FormPage.tsx";
import MapPage from "./pages/MapPage.tsx";
import TherapistPage from "./pages/TherapistPage.tsx";
import PeerDetails from "./pages/PeerDetails.tsx";
import TherapistDetails from "./pages/TherapistDetails.tsx";
import Cursor from "./components/Cursor.tsx";
import NavBar from "./components/NavBar.tsx";
import MenuAside from "./components/MenuAside.tsx";
import CirclePage from './pages/CirclePage.tsx';
import ScrollToSection from './components/ScrollToSection.tsx'; 

import type { CursorType } from './assets/utils/types';
import { useState } from 'react';

function App() {
  const [videoView, setVideoView] = useState<boolean>(true);
  const [cursorType, setCursorType] = useState<CursorType>("default");

  return (
    <Router>
      <ScrollToSection /> 
      <div className="App">
        <Cursor cursorType={cursorType} />
        <NavBar videoView={videoView} />
        <MenuAside videoView={videoView} />

        <Routes>
          <Route path="/" element={
            <HomePage setCursorType={setCursorType} setVideoView={setVideoView} />
          } />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/map/threapist/:id" element={<TherapistPage />} />
          <Route path="/circle/:id" element={<CirclePage />} />
          <Route path="/therapist/:id" element={<TherapistDetails />} />
          <Route path="/peer/:id" element={<PeerDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
