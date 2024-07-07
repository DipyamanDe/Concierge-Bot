import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from './HeaderUser';

const SignUpUser = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState(""); // New state for gender
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate("/login");
  };

  const isValidPhoneNumber = (phoneNumber) => {
    // Regular expression for Indian phone numbers
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields
    if (!name || !phoneNumber || !email || !password || !confirmPassword || !gender) {
        alert("All fields are required. Please fill in all the details.");
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match. Please check and try again.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    if (!passwordRegex.test(password)) {
      alert("Password must contain at least one uppercase letter, one digit, one special character and it should be more than 8 characters.");
      return;
    }

    // Check if the email contains '@gmail.com'
    if (!email.endsWith('@gmail.com')) {
      alert("Please use a Gmail account for signup.");
      return;
    }

    // Validate phone number
    if (!isValidPhoneNumber(phoneNumber)) {
      alert("Please enter a valid Indian phone number.");
      return;
    }

    const formattedPhoneNumber = `+91${phoneNumber}`;
    const userData = {
      Guest_Name: name,
      Guest_Phone_Number: formattedPhoneNumber,
       Guest_Gender: gender,
      Guest_Email: email,
      Guest_Email_Password: password,
      // Add gender to userData
    };
    console.log(userData.Guest_Gender);

    try {
      const response = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log(response.status);  // Log the HTTP status code
      const errorData = await response.json();
      console.log(errorData);  // Log the response body

      if (errorData.error === 'Email is already in use') {
        alert('Email is already in use. Please use a different email.');
      } 
      else if (response.status === 200) {
        console.log('Signup successful');
        handleSignup();
      } else {
        console.error('Signup failed');
        alert("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Header />
      <div style={{ ...styles.container, backgroundImage: `url(${require('../images/itc.jpg')})` }}>
        <h1 style={styles.heading}>User Signup Page</h1>
        <p style={styles.signupText}>
          Already have an account? <Link to='/login'><strong className="hover:underline">Login</strong></Link>
        </p>
        <form onSubmit={handleSubmit} style={styles.formContainer}>
          <div style={styles.inputContainer}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={styles.input}
            />
          </div>
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
          <div style={styles.inputContainer}>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
            />
          </div>
          <div className="flex flex-row" style={styles.inputContainer}>
  <div  style={{ ...styles.inputContainer, marginRight:"10px"}}>Gender </div>
  <div style={{ ...styles.inputContainer, marginRight:"10px"}}>
    <input
      type="radio"
      name="gender"
      value="male"
      checked={gender === "male"}
      onChange={(e) => setGender(e.target.value)}
      style={{  marginRight: "5px" }}
    />
    Male
  </div>
  <div style={{ ...styles.inputContainer, marginRight:"10px"}}>
    <input
      type="radio"
      name="gender"
      value="female"
      checked={gender === "female"}
      onChange={(e) => setGender(e.target.value)}
      style={{  marginRight: "5px" }}
    />
    Female
  </div>
  
</div>


          <button type="submit" style={styles.button}>
            Signup
          </button>
        </form>
        
      </div>
    </>
  );
};

// Styles (same as in the login page)
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

export default SignUpUser;
