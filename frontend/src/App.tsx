import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import NavBar from "./components/NavBar.tsx";
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
              <NavBar/>
              <Routes>
                  <Route path="/" element={<HomePage/>}></Route>
              </Routes>
          </div>
      </Router>
  )
}

export default App
