// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import ChatMainPage from "./ChatMainPage";
// import "../App.css";
// import Header from "./HeaderUser";
// import Text from "./AnimatedText";
// import Hotel from "./HotelDropdown";
// import itc from '../images/itc.jpg'

// // Import any other necessary components
// const Modal = ({ onClose, onLoginClick }) => (
//   <div
//     style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       position: "fixed",
//       top: 0,
//       left: 0,
//       width: "100%",
//       height: "100%",
//       backgroundColor: "rgba(0, 0, 0, 0.5)",
//     }}
//   >
//     <div
//       style={{
//         backgroundColor: "white",
//         padding: "20px",
//         borderRadius: "8px",
//       }}
//     >
//       <p
//       style={{
       
//         margin: "2px",}}
//         > Not logged in</p>
//       <button
//         style={{
//           backgroundColor:"green",
//           padding: "5px 10px",
//           margin: "5px",
//           fontSize: "14px",
//           borderRadius: "5px",
//           cursor: "pointer",
//         }}
//         onClick={onLoginClick}
//       >
//         Go to Login
//       </button>
//       {/* <button
//         style={{
//           backgroundColor:"red",
//           padding: "5px 10px",
//           margin: "5px",
//           fontSize: "14px",
//           borderRadius: "5px",
//           cursor: "pointer",
//         }}
//         onClick={onClose}
//       >
//         Close
//       </button> */}
//     </div>
//   </div>
// );
 
 
// const User = () => {
//   const navigate = useNavigate();
//   const [chatOpen, setChatOpen] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [redirectToLogin, setRedirectToLogin] = useState(false);
 
//   const toggleChat = () => {
//     setChatOpen(!chatOpen);
//   };
 
//   const handleLoginClick = () => {
//     setRedirectToLogin(true);
//     setShowModal(false);
//   };
 
//   useEffect(() => {
//     // Check if Guest_Id exists in local storage
//     const guestId = localStorage.getItem("Guest_Id");
 
//     if (!guestId && !redirectToLogin) {
//       // If not logged in, show modal
//       setShowModal(true);
//     } else if (!guestId && redirectToLogin) {
//       // If not logged in and user clicked "Go to Login"
//       navigate("/login");
//     }
//   }, [navigate, redirectToLogin]);
 
//   return (
//     <>
//       <Header />
//       <div
//         style={{
//           backgroundImage: `url(${itc})`,
//           backgroundSize: 'cover',
//           backgroundRepeat: 'no-repeat',
//           backgroundPosition: 'center',
//           minWidth: '100vh',
//         }}
//       >
//         <div
//           className="font-serif"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//           }}
//         ></div>
 
//         <div className="font-serif" style={{ display: "flex" }}>
//           <div style={{ position: "relative" }}>
//             <Text />
//           </div>
//           <div style={{ position: "fixed", right: "0", marginRight: "20px" }}>
//             <Hotel />
//             {/* Other components or text can be added here */}
//           </div>
//         </div>
 
//         <div
//           style={{
//             position: "fixed",
//             bottom: "0",
//             right: "0",
//             marginRight: "20px",
//             marginBottom: "20px",
//           }}
//         >
//           <button
//             className="p-3 bg-opacity-50 "
//             onClick={toggleChat}
//             style={{ borderRadius: "50%" }}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth="2"
//               stroke="currentColor"
//               className="w-8 h-8 text-white"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
//               />
//             </svg>
//           </button>
//         </div>
 
//         {chatOpen && (
//           <div style={{}}>
//             <ChatMainPage />
//           </div>
//         )}
 
// {showModal && (
//         <Modal
//           onClose={() => setShowModal(false)}
//           onLoginClick={handleLoginClick}
//         />
//       )}
//         <footer />
//       </div>
//     </>
//   );
// };
 
// export default User;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useSpring, animated } from "react-spring";
import ChatMainPage from "./ChatMainPage";
import "../App.css";
import Header from "./HeaderUser";
import Text from "./AnimatedText";
import Hotel from "./HotelDropdown";
import itc from '../images/itc.jpg';





const User = () => {
  
  const [chatOpen, setChatOpen] = useState(false);
 
 
  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };



  return (
    <>
      <Header />
      <div
        style={{
          backgroundImage: `url(${itc})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          minWidth: '100vh',
        }}
      >
        <div
          className="font-serif"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        ></div>
 
        <div className="font-serif" style={{ display: "flex" }}>
          <div style={{ position: "relative" }}>
            <Text />
          </div>
          <div style={{ position: "fixed", right: "0", marginRight: "20px" }}>
            <Hotel />
          </div>
        </div>
 
        <div
          style={{
            position: "fixed",
            bottom: "0",
            right: "0",
            marginRight: "20px",
            marginBottom: "20px",
          }}
        >
          <button
            className="p-3 bg-opacity-50 "
            onClick={toggleChat}
            style={{ borderRadius: "50%" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-8 h-8 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              />
            </svg>
          </button>
        </div>
 
        {chatOpen && (
          <div style={{ marginLeft: "20px" }}>
            <ChatMainPage />
          </div>
        )}


        <footer />
      </div>
    </>
  );
};
 
export default User;
