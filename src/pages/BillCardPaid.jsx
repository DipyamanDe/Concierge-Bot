import React, { useState } from "react";

const BillCardPaid = ({ data, onSavePayClick, onCancelPayClick }) => {
  const [editedData, setEditedData] = useState(data);
  const [showModal, setShowModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSave = () => {
    const updatedData = { ...editedData };
    if (editedData.Billing_Status === "Not Paid") {
      updatedData.Billing_Status = "Paid";
      onSavePayClick(updatedData);
      setPaymentSuccess(true);
      //setShowModal(true);
    } else if (editedData.Billing_Status === "Paid") {
       setShowModal(true);
     }
  };
  const handleClosePaymentSuccess = () => {
    setPaymentSuccess(false);
    // window.location.reload(); // Reload the page
  };
  const handleCloseModal = () => {
    
   onCancelPayClick();
   setShowModal(false);
     
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-900 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg text-center">
        <h2 className="text-xl font-bold text-black-700 mb-2">Pay Bill</h2>
        <table className="w-full">
          <tbody>
            <tr>
              <td className="text-gray-700 font-medium">Billing Id</td>
              <td>
                <input
                  type="text"
                  value={editedData.Billing_Id}
                  readOnly
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </td>
            </tr>
            <tr>
              <td className="text-gray-700 font-medium">Order Name</td>
              <td>
                <input
                  type="text"
                  value={editedData.Order_Name}
                  readOnly
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </td>
            </tr>
            <tr>
              <td className="text-gray-700 font-medium">Price</td>
              <td>
                <input
                  type="text"
                  value={editedData.Order_Price}
                  readOnly
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md mx-auto"
          >
            Pay
          </button>
        </div>
      </div>
      {showModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-900 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg text-center">
            <h2 className="text-xl font-bold text-black-700 mb-2">Already Paid</h2>
            <p>This bill has already been paid.</p>
            <button
              onClick={handleCloseModal}
              className="bg-blue-500 hover:bg-blue-600  py-2 px-4 rounded-md mt-4 mx-auto "
            >
             <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-4 h-4" // Adjust the size of the SVG
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>

            </button>
          </div>
        </div>
      )}
       {paymentSuccess && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-900 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg text-center">
            <h2 className="text-xl font-bold text-black-700 mb-2">Payment Successful</h2>
            <p>Your payment has been successfully processed.</p>
            {/* <button
              onClick={handleClosePaymentSuccess}
              className="bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-md mt-4 mx-auto"
            >
              <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-4 h-4" // Adjust the size of the SVG
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
            </button> */}
          </div>
        </div>
      )}

    </div>
  );
};

export default BillCardPaid;
