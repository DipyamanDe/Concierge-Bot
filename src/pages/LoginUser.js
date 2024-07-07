import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from './HeaderUser'

const LoginUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.status === 200) {
        console.log('Login successful');
        const data = await response.json();
        localStorage.setItem('Guest_Id', data.Guest_Details.Guest_Id)
        localStorage.setItem('Guest_email', data.Guest_Details.Guest_email)
        handleLogin();
      } else {
        console.error('Login failed');
        alert("Please check the Password and Email");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Header />
      <div style={{ ...styles.container }}>
      <h1 className='' style={{ color: 'white', ...styles.heading }}>Welcome Back, Please Login to Proceed!!</h1>

        <p style={styles.signupText}>
          Don't have an account? <strong className='hover:underline'><Link to='/signup'>Signup</Link></strong>
        </p>
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
        <div className='flex flex-row justify-evenly'>
        <Link to='/admin' style={styles.adminLink}>
          <div className="bg-slate-500 text-gray-200 rounded-md mt-7 mx-32 w-48 h-8 text-center">
            Admin
          </div>
        </Link>
        <Link to='/StaffLogin' style={styles.adminLink}>
        <div className="bg-slate-500 text-gray-200 rounded-md mt-7 mx-32 w-48 h-8 text-center">
            Staff
          </div>
          </Link>
        </div>
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
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Set background color with opacity
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
  signupText: {
    fontSize: "14px",
    color: "white",
    marginTop: "10px",
  },
  adminLink: {
    textDecoration: "none",
    marginTop: "20px",
  },
};

export default LoginUser;
