import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁️ Import icons

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ state for visibility toggle
  const [message, setMessage] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateInputs = () => {
    let isValid = true;
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setMessage("");

    const nameRegex = /^[A-Z][a-zA-Z\s]*$/;
    if (!nameRegex.test(name)) {
      setNameError("Name must start with a capital letter and contain only letters.");
      isValid = false;
    }

    const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"];
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailPattern.test(email)) {
      setEmailError("Enter a valid email address.");
      isValid = false;
    } else {
      const domain = email.split("@")[1];
      if (!allowedDomains.includes(domain)) {
        setEmailError(`Email must be from: ${allowedDomains.join(", ")}`);
        isValid = false;
      }
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError("Password must be at least 5 characters long and include letters and numbers.");
      isValid = false;
    }

    return isValid;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
      });
      setMessage(res.data.message);

      if (res.data.message.toLowerCase().includes("success")) {
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (err) {
      console.error(err);
      setMessage("Signup failed!");
    }
  };

  // ✨ Styles
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
      color: "#3b3b98",
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
    buttonHover: {
      backgroundColor: "#5848c2",
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
      color: message.includes("failed") ? "red" : "green",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Create an Account</h2>
        <form onSubmit={handleSignup}>
          {/* Name */}
          <label style={styles.label}>Full Name</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {nameError && <p style={styles.errorText}>{nameError}</p>}

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

          {/* Password with Eye Toggle */}
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

          {/* Submit Button */}
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = styles.button.backgroundColor)
            }
          >
            Sign Up
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}

        {/* Already have an account */}
        <div style={{ marginTop: "15px", fontSize: "14px" }}>
          <span>Already have an account? </span>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "none",
              border: "none",
              color: "#6a5acd",
              cursor: "pointer",
              fontWeight: "600",
              textDecoration: "underline",
              padding: 0,
              margin: 0,
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
