import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  // ✅ Load saved credentials
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  // ✅ Validation
  const validateInputs = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");
    setMessage("");

    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailPattern.test(email)) {
      setEmailError("Enter a valid email address.");
      isValid = false;
    }

    if (password.trim().length < 5) {
      setPasswordError("Password must be at least 5 characters long.");
      isValid = false;
    }

    return isValid;
  };

  // ✅ Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }

      setMessage("✅ Login successful!");
      setTimeout(() => navigate("/WeatherDashboard"), 1000);
    } catch (err) {
      console.error("Login error:", err);
      setMessage("❌ Invalid email or password!");
    }
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
    },
    card: {
      backgroundColor: "#fdfdfd",
      padding: "40px 50px",
      borderRadius: "15px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      width: "100%",
      maxWidth: "400px",
      textAlign: "center",
      background: "linear-gradient(135deg, #f6f0ff, #fde2e4)",
    },
    heading: {
      marginBottom: "25px",
      color: "#333",
      fontSize: "26px",
      fontWeight: "600",
    },
    input: {
      width: "100%",
      padding: "12px 45px 12px 15px", // space for eye icon
      marginTop: "8px",
      marginBottom: "5px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      outline: "none",
      transition: "0.3s",
      fontSize: "15px",
      boxSizing: "border-box",
    },
    passwordContainer: {
      position: "relative",
      width: "100%",
    },
    eyeIcon: {
      position: "absolute",
      right: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      color: "#555",
      fontSize: "18px",
    },
    label: {
      textAlign: "left",
      display: "block",
      fontWeight: "500",
      color: "#444",
      marginTop: "10px",
    },
    rememberMe: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginTop: "10px",
      marginBottom: "10px",
      fontSize: "14px",
    },
    button: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#6a5acd",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      marginTop: "15px",
      transition: "0.3s",
    },
    buttonHover: { backgroundColor: "#5848c2" },
    signupText: {
      marginTop: "20px",
      fontSize: "14px",
      color: "#555",
    },
    signupLink: {
      color: "#6a5acd",
      fontWeight: "600",
      cursor: "pointer",
      textDecoration: "none",
      marginLeft: "5px",
    },
    errorText: {
      color: "red",
      fontSize: "13px",
      marginTop: "4px",
      marginBottom: "8px",
    },
    message: {
      marginTop: "15px",
      fontWeight: "500",
      color: message.includes("Invalid") ? "red" : "green",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Welcome Back</h2>
        <form onSubmit={handleLogin}>
          {/* Email */}
          <label style={styles.label}>Email Address</label>
          <input
            style={styles.input}
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p style={styles.errorText}>{emailError}</p>}

          {/* Password with eye icon */}
          <label style={styles.label}>Password</label>
          <div style={styles.passwordContainer}>
            <input
              style={styles.input}
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              style={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {passwordError && <p style={styles.errorText}>{passwordError}</p>}

          {/* Remember Me */}
          <div style={styles.rememberMe}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label>Remember Me</label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor =
                styles.buttonHover.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = styles.button.backgroundColor)
            }
          >
            Login
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}

        {/* ✅ Signup link */}
        <p style={styles.signupText}>
          Don’t have an account?
          <span
            style={styles.signupLink}
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
