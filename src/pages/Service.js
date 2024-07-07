import React, { useEffect, useState } from "react";
import axios from "axios";
import ServiceCard from "./ServiceCard";
import Header from "./HeaderUser";
import ChatMainPage from './ChatMainPage';
import ServiceCardEdit from './ServiceCardEdit';
import InsertService from './InsertService';
import { useNavigate } from "react-router-dom";
const ITEMS_PER_PAGE = 5;
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
const RedirectModal = ({ onClose, onRedirectHomeClick }) => (
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
      <p style={{ margin: "2px" }}>No room booked!!</p>
      <button
        style={{
          backgroundColor: "green",
          padding: "5px 10px",
          margin: "5px",
          fontSize: "14px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={onRedirectHomeClick}
      >
        Go to Home
      </button>
      {/* <button
        style={{
          backgroundColor: "red",
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

const Service = () => {
  const Guest_Id = localStorage.getItem('Guest_Id');
  
  const [services, setServices] = useState([]);
  const [insert, setInsert] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editing, setEditing] = useState(false);
  const [editedService, setEditedService] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [bookedRoomId, setBookedRoomId] = useState(null);
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const handleLoginClick = () => {
    setRedirectToLogin(true);
    setShowModal(false);
  };
  const navigate = useNavigate();

  const guestId = localStorage.getItem("Guest_Id");

  useEffect(() => {
    const apiUrl = `http://127.0.0.1:5000/check_prev_Book`;
    axios
      .post(apiUrl,{"Guest_Id":guestId})
      .then((response) => {
        console.log(response.data.Prev_Booking_data)
        setBookedRoomId(response.data.Prev_Booking_data);
        
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [guestId]);
  console.log("booked room id",bookedRoomId)

  useEffect(() => {
    // Check if Guest_Id exists in local storage
    // If Guest_Id is present but bookedRoomId is missing, show redirect modal
    console.log("running----->",guestId ,"  ", bookedRoomId)
    if (guestId && !bookedRoomId) {
      setShowRedirectModal(true);
    } else if (!guestId && !redirectToLogin) {
      // If not logged in, show modal
      setShowModal(true);
    } else if (!guestId && redirectToLogin) {
      // If not logged in and user clicked "Go to Login"
      navigate("/login");
    }
    else{
      setShowRedirectModal(false);
      setShowModal(false);
    }
  }, [navigate, redirectToLogin, bookedRoomId,guestId]);

  const [bookingWeek, setBookingWeek] = useState({});

  useEffect(() => {
    const apiUrl = `http://127.0.0.1:5000/services_user?Guest_Id=${Guest_Id}`;
    axios
      .get(apiUrl)
      .then((response) => {
        console.log("Fetched services data:", response.data.ServicesUserData);
        setServices(response.data.ServicesUserData);

        setBookingWeek(response.data.Booking_Week)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [Guest_Id]);

  useEffect(() => {
    // Check the value of bookingWeek and show an alert if it's false
    if (!bookingWeek) {
      alert("You can only access Services between the check-in and check-out date of your stay.");
      navigate("/");
    }
  }, [bookingWeek]);
 
  const serviceList = Array.isArray(services) ? services : [];
 
  const indexOfLastService = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstService = indexOfLastService - ITEMS_PER_PAGE;
  const currentServices = serviceList.slice(indexOfFirstService, indexOfLastService);
 
  const totalPages = Math.ceil(serviceList.length / ITEMS_PER_PAGE);
 
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
 
  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };
 
  const handleEditClick = (serviceData) => {
    setEditing(true);
    setEditedService(serviceData);
  };
 
  const handleSaveClick = (editedData) => {
    console.log("edited data: ", editedData.Service_Id, editedData.Service_Status);
    axios
      .put('http://127.0.0.1:5000/service_update', editedData)
      .then((response) => {
        console.log('Service updated successfully:', response.data);
 
        // After successful update, update the frontend data
        const updatedServices = services.map((service) =>
          service.Service_Id === editedData.Service_Id ? editedData : service
        );
        setServices(updatedServices);
        setEditing(false);
      })
      .catch((error) => {
        console.error('Error updating service:', error);
      });
  };
 
  const handleCancelClick = () => {
    setEditing(false);
    setEditedService(null);
  };
 
  const handleInsertClick = (formData) => {
    axios
      .post('http://127.0.0.1:5000/insert_service', formData)
      .then((response) => {
        const newService = response.data;
        const updatedServices = [...services, newService];
        setServices(updatedServices);
        axios
          .get(`http://127.0.0.1:5000/services_user?Guest_Id=${Guest_Id}`)
          .then((response) => {
            setServices(response.data);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      })
      .catch((error) => {
        console.error('Error adding service:', error);
      });
  };
 
  const handleInsertCancelClick = () => {
    setInsert(false);
  };
 
  return (
    <>
    
      {
      (!Guest_Id) && (<>
        
        <div
          id="crud-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          {/* ... (rest of your modal code) */}
          {/* Add a button or some other UI element to close the modal */}
          <button
            // onClick={closeModal}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            {/* Close icon */}
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        </>
      )}

 
      <Header />
 
      <div className="flex justify-between items-center self-center p-4">
        <h1 className="text-4xl text-white">You availed {services.length} Services</h1>
      </div>
 
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {insert ? (
          <InsertService
            onInsertClick={handleInsertClick}
            handleInsertCancelClick={handleInsertCancelClick}
          />
        ) : (
          
<div className="flex flex-col justify-center items-center text-white" onClick={()=>setInsert(!insert)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-14 w-14 bg-slate-500 text-slate-100 rounded-xl"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>Add Request</div>
        </div>
        )}
 
        {currentServices.map((service) => (
          <ServiceCard data={service} key={service.Service_Id} onEditClick={handleEditClick} />
        ))}
 
        {editing && editedService && (
          <ServiceCardEdit
            data={editedService}
            onSaveClick={handleSaveClick}
            onCancelClick={handleCancelClick}
          />
        )}
 
        
 
        <div style={{ position: 'fixed', bottom: '0', right: '0', marginRight: '20px', marginBottom: '20px' }}>
          <button className='p-3 bg-opacity-50' onClick={toggleChat} style={{ borderRadius: '50%' }}>
            {/* Your existing chat button icon */}
          </button>
        </div>
 
        {chatOpen && (
          <div style={{ marginLeft: '20px' }}>
            <ChatMainPage />
          </div>
        )}
        {showModal && (
  <Modal
    onClose={() => setShowModal(false)}
    onLoginClick={handleLoginClick}
  />
)}
{showRedirectModal && (
        <RedirectModal
          onClose={() => setShowRedirectModal(false)}
          onRedirectHomeClick={() => {
            navigate("/");
            setShowRedirectModal(false);
          }}
        />
      )}

      </div>
          {/* Pagination */}
        <div className="flex justify-center items-center p-4 bottom-0 ">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-white bg-gray-500 p-2 m-2 rounded-md"
          >
            Prev
          </button>
 
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`m-2 text-white p-2 rounded-md ${currentPage === i + 1 ? 'bg-gray-700' : 'bg-gray-500'}`}
            >
              {i + 1}
            </button>
          ))}
 
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastService >= serviceList.length}
            className="text-white bg-gray-500 p-2 m-2 rounded-md"
          >
            Next
          </button>
        </div>
    </>
  );
};
 
export default Service;