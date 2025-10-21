import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function WeatherDashboard() {
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // ✅ Load logged-in user from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      if (!userData._id && userData.id) userData._id = userData.id;
      setUser(userData);
    } else {
      setMessage("⚠️ Please log in first!");
    }
  }, []);

  // ✅ Fetch weather directly from OpenWeather API
  const fetchWeather = async (cityName) => {
    if (cityName.trim() === "") {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    try {
      const openWeatherKey = "daba6a8c5a7d0a090b5ab7f07d58ae94"; // ✅ your OpenWeather API key
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        cityName
      )}&appid=${openWeatherKey}&units=metric`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.cod !== 200) {
        setError("City not found or invalid name!");
        setWeather(null);
      } else {
        setWeather(data);
        setError("");
        setMessage("");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching weather data.");
      setWeather(null);
    }
  };

  // ✅ Save weather data to MongoDB
  const saveWeather = async () => {
    if (!weather) {
      setMessage("⚠️ No weather data to save!");
      return;
    }
    if (!user || !user._id) {
      setMessage("⚠️ User not logged in. Please login first!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/weather/save", {
        userId: user._id,
        city: weather.name,
        temperature: weather.main.temp,
        description: weather.weather[0].description,
        humidity: weather.main.humidity,
      });

      if (response.status === 200) {
        setMessage("✅ Weather data saved successfully!");
      }
    } catch (err) {
      console.error("❌ Error saving weather:", err.response?.data || err.message);
      setMessage("❌ Failed to save weather data.");
    }
  };

  // ✅ Navigate to saved weathers
  const showSavedWeathers = () => navigate("/saved-weathers");

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  // ✅ Styles
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "linear-gradient(135deg, #a8edea, #fed6e3)",
      fontFamily: "Poppins, sans-serif",
      padding: "20px",
    },
    card: {
      background: "linear-gradient(135deg, #f6f0ff, #fde2e4)",
      padding: "40px",
      borderRadius: "18px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      textAlign: "center",
      width: "100%",
      maxWidth: "450px",
    },
    heading: {
      fontSize: "26px",
      color: "#3b3b98",
      fontWeight: "600",
      marginBottom: "10px",
    },
    subText: { fontSize: "16px", color: "#555", marginBottom: "25px" },
    buttonGroup: {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
      marginBottom: "20px",
    },
    button: {
      backgroundColor: "#6a5acd",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "10px 20px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.2s ease-in-out",
    },
    input: {
      padding: "10px",
      width: "80%",
      borderRadius: "8px",
      border: "1px solid #ccc",
      outline: "none",
      fontSize: "15px",
      marginBottom: "10px",
    },
    saveBtn: {
      backgroundColor: "#4caf50",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "10px 18px",
      cursor: "pointer",
      fontWeight: "600",
      marginTop: "15px",
    },
    logoutBtn: {
      backgroundColor: "#ff5e78",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "10px 18px",
      cursor: "pointer",
      fontWeight: "600",
      marginTop: "25px",
    },
    weatherBox: {
      marginTop: "25px",
      backgroundColor: "rgba(255,255,255,0.85)",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Weather Dashboard</h2>

        {user ? (
          <p style={styles.subText}>Welcome, {user.name || "User"}</p>
        ) : (
          <p style={{ color: "red" }}>Please log in to use this app.</p>
        )}

        {/* ✅ Input and Buttons */}
        <input
          style={styles.input}
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <div style={styles.buttonGroup}>
          <button style={styles.button} onClick={() => fetchWeather(city)}>
            Get Weather
          </button>
          <button style={styles.button} onClick={showSavedWeathers}>
            Saved Weathers
          </button>
        </div>

        {/* ✅ Error Message */}
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

        {/* ✅ Weather Display */}
        {weather && (
          <div style={styles.weatherBox}>
            <h3>{weather.name}</h3>
            <p>Temperature: {weather.main.temp}°C</p>
            <p>Condition: {weather.weather[0].description}</p>
            <p>Humidity: {weather.main.humidity}%</p>
            <button style={styles.saveBtn} onClick={saveWeather}>
              Save Weather
            </button>
          </div>
        )}

        {/* ✅ Message */}
        {message && (
          <p style={{ marginTop: "10px", color: "#333", fontWeight: "500" }}>
            {message}
          </p>
        )}

        {/* ✅ Logout */}
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default WeatherDashboard;
