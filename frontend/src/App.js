import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import WeatherDashboard from "./components/WeatherDashboard";
import SavedWeathers from "./components/SavedWeathers";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/WeatherDashboard" element={<WeatherDashboard />} />
        <Route path="/saved-weathers" element={<SavedWeathers />} />
      </Routes>
    </Router>
  );
}

export default App;
