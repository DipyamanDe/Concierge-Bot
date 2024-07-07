import React, { useState, useEffect } from "react";
import axios from "axios";
import BillCard from "./BillCard";
import Header from "./HeaderUser";
import BillCardEdit from "./BillCardEdit";
import BillCardPaid from "./BillCardPaid";
import ChatMainPage from './ChatMainPage';
import { useNavigate } from "react-router-dom";
import BillPaymentModal from "./BillPaymentModal";

import CabModalCompoent from './CabModalComponent';
const ITEMS_PER_PAGE = 5; // Number of items to display per page

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

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0); // New state for total amount
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // New state for current page
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  // New state to track selected bills for payment
  const [selectedBills, setSelectedBills] = useState([]);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
   // New function to handle payment for selected bills
   const handleNewPaymentClick = () => {
    setPaymentModalOpen(true);
    const unpaidBills = bills.filter((bill) => bill.Billing_Status === "Not Paid");
  setSelectedBills(unpaidBills);
  };

  // Function to confirm payment and update billing status
const handleConfirmPayment = () => {
  // Filter bills with "Not Paid" status
  const unpaidBills = bills.filter((bill) => bill.Billing_Status === "Not Paid");
  
  // Only proceed if there are unpaid bills
  if (unpaidBills.length > 0) {
    // Create an array of updated bills with "Paid" status
    const updatedBills = bills.map((bill) =>
      unpaidBills.includes(bill) ? { ...bill, Billing_Status: "Paid" } : bill
    );

    // Make an API call to update the billing status on the server
    axios
      .put('http://127.0.0.1:5000/bulk_payment_update', { bills: updatedBills })
      .then((response) => {
        console.log('Bills updated successfully:', response.data);
        setBills(updatedBills);
        setSelectedBills([]);
        setPaymentModalOpen(false);
      })
      .catch((error) => {
        console.error('Error updating bills:', error);
      });
  } else {
    // No unpaid bills to process
    console.log('No unpaid bills to process');
  }
};

  const handleLoginClick = () => {
    setRedirectToLogin(true);
    setShowModal(false);
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
  const [chatOpen, setChatOpen] = useState(false);
  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };
  useEffect(() => {
    const apiUrl = `http://127.0.0.1:5000/billing?Guest_Id=${Guest_Id}`;

    axios
      .post(apiUrl, { 'Guest_Id': Guest_Id })
      .then((response) => {
        //console.log(Object.entries(response.data.Bills).map(([key, value]) => ({ [key]: value })))
        setBills(response.data.Bills);
       // Calculate total amount
      const total = response.data.Bills.reduce((sum, bill) => sum + parseFloat(bill.Order_Price), 0);
      setTotalAmount(total);
        console.log("hello jbjhb", response.data.Bills)

      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [Guest_Id]);

  // for editing usage
  const [editing, setEditing] = useState(false);
  const [editedBill, setEditedBill] = useState(null);

  const handleEditClick = (billData) => {
    setEditing(true);
    setEditedBill(billData);
  };

  const handleSaveClick = (editedData) => {
    // Create an Axios PUT request to update the bill data
    axios
      .put('http://127.0.0.1:5000/bill_update', editedData)
      .then((response) => {
        console.log('bill updated successfully:', response.data);
  
        // After successful update, update the frontend data
        const updatedBill = bills.map((bill) =>
          bill.Billing_Id === editedData.Billing_Id ? editedData : bill
        );
        setBills(updatedBill);
        setEditing(false);
      })
      .catch((error) => {
        console.error('Error updating bill:', error);
      });
  };
  
  const handleCancelClick = () => {
    setEditing(false);
    setEditedBill(null);
  };
  // for editing usage
  const [editingPay, setEditingPay] = useState(false);
  const [editedBillPay, setEditedBillPay] = useState(null);

  const handlePayEditClick = (billData) => {
    setEditingPay(true);
    setEditedBillPay(billData);
  };

  const handlePayClick = (editedData) => {
    // Create an Axios PUT request to update the bill data
    axios
      .put('http://127.0.0.1:5000/bill_update', editedData)
      .then((response) => {
        console.log('bill updated successfully:', response.data);
  
        // After successful update, update the frontend data
        const updatedBill = bills.map((bill) =>
          bill.Billing_Id === editedData.Billing_Id ? editedData : bill
        );
        setBills(updatedBill);
        setEditingPay(false);
      })
      .catch((error) => {
        console.error('Error updating bill:', error);
      });
  };
  
  const handleCancelPayClick = () => {
    setEditingPay(false);
    setEditedBillPay(null);
  };
  const billsList = Array.isArray(bills) ? bills : [];
// Paginate billsList based on current page
  const indexOfLastBill = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstBill = indexOfLastBill - ITEMS_PER_PAGE;
  const currentBills = billsList.slice(indexOfFirstBill, indexOfLastBill);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  
  return (
    <>
      <Header></Header>
      <div className="flex justify-between items-center p-4">
      <h1 className="text-4xl text-white">
  Bills of guest: {billsList.length} | Total Amount: ₹{totalAmount}
</h1>
      </div>
{/* New payment button */}
<div className="flex justify-center items-center mt-4">
        <button
          onClick={handleNewPaymentClick}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md mx-auto"
        >
          Full Payment
        </button>
      </div>

      <div className="flex justify-center items-center mt-4">
  {/* Hotel dropdown UI */}
  <button className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded" onClick={handleModalOpen}>
    Checkout Cab Preference
  </button>
  {isModalOpen && <CabModalCompoent onClose={handleModalClose} />}
</div>

      {/* Payment modal */}
      <BillPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        selectedBills={selectedBills}
        onConfirmPayment={handleConfirmPayment}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2  gap-0">
        {/* {billsList.map((bill) => (
          <BillCard data={bill} onEditClick={handleEditClick} onPayClick={handlePayEditClick} key={bill.Guest_Id} />
        ))} */}
        {currentBills.map((bill) => (
          <BillCard data={bill} onEditClick={handleEditClick} onPayClick={handlePayEditClick} key={bill.Guest_Id} />
        ))}
        {editing && (
        <BillCardEdit
          data={editedBill}
          onSaveClick={handleSaveClick}
          onCancelClick={handleCancelClick}
        />
      )}
      {editingPay && (
        <BillCardPaid
          data={editedBillPay}
          onSavePayClick={handlePayClick}
          onCancelPayClick={handleCancelPayClick}
        />
      )}

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
      <div className="flex justify-center items-center mt-4">
        {Array.from({ length: Math.ceil(billsList.length / ITEMS_PER_PAGE) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`mx-1 px-3 py-1 rounded-full focus:outline-none ${
              currentPage === index + 1
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
};

export default Billing;
