import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate,Link } from "react-router-dom";
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
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
  };

  return (
    <header className="header h-3z0 bg-[#708090];"> {/* Use className instead of inline styles */}
      <div className=" text-3xl font-serif">
        {/* <FontAwesomeIcon icon={faHome} className="icon" /> */}
        <Link to='/user'>
        Hotel Bot
        </Link>
      </div>
      
   
      {/* <div className="iconContainer" onClick={handleLogin}>
        <FontAwesomeIcon icon={faSignInAlt} className="icon" />
      </div> */}
      <Link to='/login'><div className="iconContainer" onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
      </div></Link>
      
    </header>
  );
};

export default Header;
