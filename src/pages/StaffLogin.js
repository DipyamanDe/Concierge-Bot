import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from './Header';

const StaffLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/adminlogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        console.log('Login successful');
        const data = await response.json();
        localStorage.setItem('Staff_Id', data.Staff_Details.Staff_Id);
        navigate("/Staffservice");
      } else {
        console.error('Login failed');
        alert("Please check the id and Email");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    handleLogin();
  };

  return (
    <>
      <Header />
      <div style={{ ...styles.container, backgroundImage: `url(${require('../images/itc.jpg')})` }}>
        <h1 style={styles.heading}>Staff Login Page</h1>

        <form onSubmit={handleSubmit} style={styles.formContainer}>
          <div style={styles.inputContainer}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  formContainer: {
    padding: "20px",
    margin: "20px",
    width: "400px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    borderRadius: "8px",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  heading: {
    fontSize: "24px",
    color: "#333",
    marginBottom: "20px",
  },
  inputContainer: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxSizing: "border-box",
    marginBottom: "10px",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#ff7f32",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default StaffLogin;
