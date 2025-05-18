import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import UserDashboard from "./pages/UserDashboard.tsx";
import FormPage from "./pages/FormPage.tsx";
import MapPage from "./pages/MapPage.tsx";
import TherapistPage from "./pages/TherapistPage.tsx";
import PeerDetails from "./pages/PeerDetails.tsx";
import TherapistDetails from "./pages/TherapistDetails.tsx";
// import axiosSpringInstance from "./network/AxiosSpringInstance.ts";
// import axiosDjangoInstance from "./network/AxiosDjangoInstance.ts";
import Cursor from "./components/Cursor.tsx";
import NavBar from "./components/NavBar.tsx";
import MenuAside from "./components/MenuAside.tsx";
import type {CursorType} from './assets/utils/types'
import { useState } from 'react';

function App() {
    // const fetchSpring = async () => {
    //     const response = await axiosSpringInstance.get('/rest');
    //     console.log('Spring: ',response.data);
    // };
    //
    // const fetchDjango = async () => {
    //     const response = await axiosDjangoInstance.get('/django/hello/');
    //     console.log('Django: ', response.data);
    // };

    // fetchDjango()
    // fetchSpring()

    const [videoView,setVideoView] = useState<boolean>(true)
    const [cursorType,setCursorType] = useState<CursorType>("default")
    
    
  return (
      <Router>
          <div className="App">
            <Cursor cursorType={cursorType}></Cursor>
            
            <NavBar videoView={videoView}></NavBar>
            <MenuAside videoView={videoView}></MenuAside>
              
              <Routes>
                  <Route path="/" element={<HomePage setCursorType={setCursorType} setVideoView={setVideoView}/>}></Route>
                  <Route path="/dashboard" element={<UserDashboard/>}></Route>
                  <Route path="/form" element={<FormPage/>}></Route>
                  <Route path="/map" element={<MapPage/>}></Route>
                  <Route path="/map/threapist/:id" element={<TherapistPage/>}></Route>
                  <Route path="/therapist/:id" element={<TherapistDetails/>}></Route>
                  <Route path="/peer/:id" element={<PeerDetails/>}></Route>
              </Routes>
          </div>
      </Router>
  )
}

export default App
