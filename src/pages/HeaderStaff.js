import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import {Link} from 'react-router-dom';


const HeaderAdmin = () => {
  const handleLogin = () => {
    // Your login logic here
    console.log("Login clicked");
  };

  const handleLogout = () => {
    // Your logout logic here
    console.log("Logout clicked");
  };

  return (
    <header className="header h-3z0"> {/* Use className instead of inline styles */}
      <Link to='/admin'>
      <div className="iconContainer text-3xl font-serif">
        {/* <FontAwesomeIcon icon={faHome} className="icon" /> */}
        Hotel Bot - Staff
      </div>
      </Link>
       {/* <div className="iconContainer" onClick={handleLogin}>
        <FontAwesomeIcon icon={faSignInAlt} className="icon" />
      </div>  */}
      
  <div className='self-end flex flex-row'>
  <Link to='/staff'>
  <div  className=" bg-gray-900 text-gray-200 rounded-md p-2 mr-3 items-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
</svg>
</div>
  </Link>
      <Link to='/'>
      <div className="iconContainer" onClick={handleLogout}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
</svg>

      </div>
      </Link>
  </div>
    </header>
  );
};

export default HeaderAdmin;
