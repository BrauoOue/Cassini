import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import UserDashboard from "./pages/UserDashboard.tsx";
import FormPage from "./pages/FormPage.tsx";
import MapPage from "./pages/MapPage.tsx";
import axiosSpringInstance from "./network/AxiosSpringInstance.ts";
import axiosDjangoInstance from "./network/AxiosDjangoInstance.ts";

function App() {
    const fetchSpring = async () => {
        const response = await axiosSpringInstance.get('/rest');
        console.log('Spring: ',response.data);
    };

    const fetchDjango = async () => {
        const response = await axiosDjangoInstance.get('/django/hello/');
        console.log('Django: ', response.data);
    };

    fetchDjango()
    fetchSpring()

  return (
      <Router>
          <div className="App">
              {/* <NavBar/> */}
              <Routes>
                  <Route path="/" element={<HomePage/>}></Route>
                  <Route path="/dashboard" element={<UserDashboard/>}></Route>
                  <Route path="/form" element={<FormPage/>}></Route>
                  <Route path="/map" element={<MapPage/>}></Route>
              </Routes>
          </div>
      </Router>
  )
}

export default App
