import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link } from "react-router-dom";

const HeaderUser = () => {
  const navigate = useNavigate();
  
  const profilepage = () => {
    navigate("/ProfileUser");
  };

  const handleLogin = () => {
    // Your login logic here
    console.log("Login clicked");
  };

  const handleLogout = () => {
    // Your logout logic here
    console.log("Logout clicked");
    localStorage.removeItem('Guest_Id');
    localStorage.removeItem('Guest_email');
    localStorage.removeItem('Booked_Room_Id');
  };

  const [activeButton, setActiveButton] = useState(
    localStorage.getItem("activeButton") || ""
  );

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    localStorage.setItem("activeButton", buttonName);
  };
  const handleLinkClick = (buttonName) => {
    handleButtonClick(buttonName);
    
  };

  const precheckinpage = () => {
    navigate('/precheckin');
    handleButtonClick("precheckin");
  };

  const servicepage = () => {
    navigate('/service');
    handleButtonClick("service");
  };

  const historypage = () => {
    navigate('/history');
    handleButtonClick("history");
  };

  const userpage = () => {
    navigate('/');
    handleButtonClick("");
  };

  const recommendationpage = () => {
    navigate('/Recommendation');
    handleButtonClick("recommendation");
  };

  const billingpage = () => {
    navigate('/billing');
    handleButtonClick("billing");
  };

  return (
    <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="iconContainer text-3xl font-serif" onClick={userpage}>
        {/* <Link to='/'>Hotel Bot</Link> */}
        Hotel Bot
      </div>

      <div className="center-buttons">
        <div className="button-container">
          <button
            style={{ marginRight: "10px", marginBottom: "5px" }}
            onClick={precheckinpage}
            className={activeButton === "precheckin" ? "active-button" : ""}
          >


            Pre-Check in

          </button>
          <button
            style={{ marginRight: "10px", marginBottom: "5px" }}
            onClick={servicepage}
            className={activeButton === "service" ? "active-button" : ""}
          >
            Services
          </button>
          <button
            style={{ marginRight: "10px", marginBottom: "5px" }}
            onClick={historypage}
            className={activeButton === "history" ? "active-button" : ""}
          >
            History
          </button>
          <button
            style={{ marginRight: "10px", marginBottom: "5px" }}
            onClick={recommendationpage}
            className={activeButton === "recommendation" ? "active-button" : ""}
          >
            Recommendation
          </button>
          <button
            style={{ marginRight: "10px", marginBottom: "5px" }}
            onClick={billingpage}
            className={activeButton === "billing" ? "active-button" : ""}
          >
            Billing
          </button>

           <Link
            to='/ProfileUser'
            style={{ marginRight: '10px' }}
            onClick={profilepage} 
            className={activeButton === "profileuser" ? "active-button text-xl" : ""}
          >
            <FontAwesomeIcon icon={faUser} className="icon" />
          </Link>

        </div>
        {/* Include similar button structures for other sections */}
        {/* <Link to='/ProfileUser' style={{ marginRight: '10px' }} >
          <FontAwesomeIcon icon={faUser} className="icon" />
          
        </Link>
        <Link to='/login' style={{ marginRight: '10px' }} onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
        </Link> */}

        
        <Link
          to='/login'
          style={{ marginRight: '10px' }}
          onClick={() => { handleLogout(); handleLinkClick("logout"); }}
          className={activeButton === "logout" ? "active-button" : ""}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
        </Link>

      </div>
    </header>
  );
};

export default HeaderUser;
