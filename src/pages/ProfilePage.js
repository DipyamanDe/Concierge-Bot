import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfilePageCard from "./ProfilePageCard";
import ProfilePageCardEdit from "./ProfilePageCardEdit";
import Header from "./HeaderUser";
import ChatMainPage from './ChatMainPage';
import { useNavigate } from "react-router-dom";
const Modal = ({ onClose, onLoginClick }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    }}
  >
    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <p 
      style={{
        
        margin: "2px",}}
        > Not logged in</p>
      <button
        style={{
          backgroundColor:"green",
          padding: "5px 10px",
          margin: "5px",
          fontSize: "14px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={onLoginClick}
      >
        Go to Login
      </button>
      {/* <button
        style={{
          backgroundColor:"red",
          padding: "5px 10px",
          margin: "5px",
          fontSize: "14px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={onClose}
      >
        Close
      </button> */}
    </div>
  </div>
);

const ProfilePage = () => {
  const [Guest, setGuest] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const handleLoginClick = () => {
    setRedirectToLogin(true);
    setShowModal(false);
  };
  const [chatOpen, setChatOpen] = useState(false);
  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };
  const navigate = useNavigate();
  useEffect(() => {
    // Check if Guest_Id exists in local storage
    const guestId = localStorage.getItem("Guest_Id");

    if (!guestId && !redirectToLogin) {
      // If not logged in, show modal
      setShowModal(true);
    } else if (!guestId && redirectToLogin) {
      // If not logged in and user clicked "Go to Login"
      navigate("/login");
    }
  }, [navigate, redirectToLogin]);
  const Guest_Id = localStorage.getItem('Guest_Id')

  useEffect(() => {
    const apiUrl = `http://127.0.0.1:5000/post_guest`;

    axios
      .post(apiUrl, { 'Guest_Id': Guest_Id })
      .then((response) => {
        console.log("Fetched services data:", response.data);
        setGuest(response.data.Guest_Details);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [Guest_Id ]);
  

  // for editing usage
  const [editing, setEditing] = useState(false);
  const [editedGuest, setEditedGuest] = useState(null);

  const handleEditClick = (GuestData) => {
    setEditing(true);
    setEditedGuest(GuestData);
  };

  const handleSaveClick = (editedData) => {
    // Create an Axios PUT request to update the bill data
    axios
      .put('http://127.0.0.1:5000/guest_update', editedData)
      .then((response) => {
        console.log('guest data updated successfully:', response.data);
  
        // After successful update, update the frontend data
        const updatedGuest =  Guest.map((guest) =>
          guest.Guest_Id === editedData.Guest_Id ? editedData : guest
        );
        setGuest(updatedGuest);
        setEditing(false);
      })
      .catch((error) => {
        console.error('Error updating guest:', error);
      });
  };
  
  const handleCancelClick = () => {
    setEditing(false);
    setEditedGuest(null);
  };

  const GuestList = Array.isArray(Guest) ? Guest : [];
  return (
    <>
    
      <Header></Header>
      <div className="flex justify-between items-center p-4">
        {/* <h1 className="text-4xl text-white">Details of Guest_Id: {Guest_Id}</h1> */}
      </div>


      {GuestList.map((guest) => (
          <ProfilePageCard data={guest} onEditClick={handleEditClick} key={guest.Guest_Id} />
        ))}
        
        {editing && (
        <ProfilePageCardEdit
          data={editedGuest}
          onSaveClick={handleSaveClick}
          onCancelClick={handleCancelClick}
        />
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2  gap-0">
        


<div style={{ position: 'fixed', bottom: '0', right: '0', marginRight: '20px', marginBottom: '20px' }}>
  <button className='p-3 bg-opacity-50' onClick={toggleChat} style={{  borderRadius: '50%' }}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8 text-white">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  </button>
</div> 
 
{showModal && (
  <Modal
    onClose={() => setShowModal(false)}
    onLoginClick={handleLoginClick}
  />
)}

         {chatOpen && (
          <div style={{ marginLeft: '20px' }}>
            <ChatMainPage />
          </div>
        )}  
      
      </div>
    </>
  );
};

export default ProfilePage;
