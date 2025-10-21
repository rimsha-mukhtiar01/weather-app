import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSyncAlt, FaTrashAlt } from "react-icons/fa"; // icons

function SavedWeathers() {
  const [user, setUser] = useState(null);
  const [savedWeathers, setSavedWeathers] = useState([]);
  const [message, setMessage] = useState("");

  // Load user from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      if (!userData._id && userData.id) userData._id = userData.id;
      setUser(userData);
      fetchSavedWeathers(userData._id);
    } else {
      setMessage("⚠️ Please log in first!");
    }
  }, []);

  // Fetch all saved weathers from backend
  const fetchSavedWeathers = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/weather/saved/${userId}`
      );
      if (response.data.length === 0) setMessage("No saved weather data found!");
      setSavedWeathers(response.data);
    } catch (err) {
      console.error("❌ Error fetching saved weathers:", err);
      setMessage("❌ Failed to fetch saved weathers.");
    }
  };

  // Refresh specific city weather
  const refreshWeather = async (weatherItem, index) => {
    if (!weatherItem.city) return;

    try {
      const apiKey = "daba6a8c5a7d0a090b5ab7f07d58ae94";
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${weatherItem.city}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();

      if (data.cod !== 200) {
        setMessage(`❌ Could not refresh weather for ${weatherItem.city}`);
        return;
      }

      const updatedWeather = {
        ...weatherItem,
        temperature: data.main.temp,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        refreshedAt: new Date(),
      };

      const updatedWeathers = [...savedWeathers];
      updatedWeathers[index] = updatedWeather;
      setSavedWeathers(updatedWeathers);

      const weatherId = weatherItem._id || weatherItem.id;
      if (!weatherId) return;

      await axios.put(`http://localhost:5000/api/weather/update/${weatherId}`, {
        temperature: updatedWeather.temperature,
        description: updatedWeather.description,
        humidity: updatedWeather.humidity,
        refreshedAt: updatedWeather.refreshedAt.toISOString(),
      });

      setMessage(`✅ Weather for ${weatherItem.city} updated successfully!`);
    } catch (err) {
      console.error("❌ Error refreshing weather:", err);
      setMessage(`❌ Failed to refresh weather for ${weatherItem.city}`);
    }
  };

  // ✅ Delete city weather (with confirmation + MongoDB removal)
  const deleteWeather = async (weatherItem) => {
  if (!weatherItem) {
    console.error("❌ weatherItem is undefined");
    setMessage("❌ Internal error: No weather data found to delete.");
    return;
  }

  const weatherId = weatherItem._id || weatherItem.id; // <-- handle both cases
  const city = weatherItem.city;

  if (!weatherId) {
    setMessage(`❌ Could not find ID for "${city}"`);
    return;
  }

  const confirmDelete = window.confirm(
    `🗑️ Are you sure you want to delete weather data for "${city}"?`
  );
  if (!confirmDelete) return;

  try {
    const response = await axios.delete(
      `http://localhost:5000/api/weather/delete/${weatherId}`
    );

    if (response.status === 200) {
      // Remove from frontend instantly
      setSavedWeathers((prev) =>
        prev.filter(
          (item) => item._id !== weatherId && item.id !== weatherId
        )
      );
      setMessage(`✅ "${city}" deleted successfully!`);
    } else {
      setMessage(`❌ Failed to delete "${city}".`);
    }
  } catch (err) {
    console.error("❌ Error deleting weather:", err);
    setMessage(`❌ Failed to delete "${city}".`);
  }
};

  // Navigation + Logout
  const goBack = () => (window.location.href = "/WeatherDashboard");
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // Styles
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
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
      maxWidth: "600px",
    },
    heading: {
      fontSize: "26px",
      color: "#3b3b98",
      fontWeight: "600",
      marginBottom: "15px",
    },
    subText: {
      fontSize: "16px",
      color: "#555",
      marginBottom: "20px",
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
      marginBottom: "20px",
      flexWrap: "wrap",
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
      marginTop: "20px",
      backgroundColor: "rgba(255,255,255,0.9)",
      padding: "15px 20px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    },
    topRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "8px",
    },
    iconGroup: {
      display: "flex",
      gap: "10px",
      alignItems: "center",
    },
    iconButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#6a5acd",
      fontSize: "18px",
      transition: "color 0.2s ease",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Saved Weathers</h2>
        {user ? (
          <p style={styles.subText}>Welcome, {user.name || "User"} </p>
        ) : (
          <p style={{ color: "red" }}>Please log in to view saved weathers.</p>
        )}

        <div style={styles.buttonGroup}>
          <button style={styles.button} onClick={goBack}>
            Back to Dashboard
          </button>
          <button
            style={styles.button}
            onClick={async () => {
              if (!user?._id) return;
              setMessage("🔄 Refreshing list...");
              await fetchSavedWeathers(user._id);
              setMessage("✅ List refreshed successfully!");
            }}
          >
            Refresh All
          </button>
        </div>

        {message && (
          <p style={{ color: "#333", fontWeight: "500", marginBottom: "15px" }}>
            {message}
          </p>
        )}

        {savedWeathers.length > 0 ? (
          savedWeathers.map((item, index) => (
            <div key={index} style={styles.weatherBox}>
              <div style={styles.topRow}>
                <h3 style={{ margin: 0, color: "#333" }}>{item.city}</h3>
                <div style={styles.iconGroup}>
                  <button
                    style={styles.iconButton}
                    onClick={() => refreshWeather(item, index)}
                    title="Refresh Weather"
                  >
                    <FaSyncAlt />
                  </button>
                  <button
    style={{ ...styles.iconButton, color: "#e74c3c" }}
    onClick={() => deleteWeather(item)}   // ✅ Updated here
    title="Delete City"
  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>

              <p>Temperature: {item.temperature}°C</p>
              <p>Condition: {item.description}</p>
              <p>Humidity: {item.humidity}%</p>

              <p style={{ fontSize: "13px", color: "#666" }}>
                Saved on:{" "}
                {item.savedAt
                  ? new Date(item.savedAt).toLocaleString()
                  : "N/A"}
              </p>
              {item.refreshedAt && (
                <p style={{ fontSize: "13px", color: "#888" }}>
                  Refreshed on: {new Date(item.refreshedAt).toLocaleString()}
                </p>
              )}
            </div>
          ))
        ) : (
          <p style={{ color: "#777" }}>No saved weather data available.</p>
        )}

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default SavedWeathers;
