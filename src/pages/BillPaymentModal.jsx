import React from 'react';
import PropTypes from 'prop-types';

const BillPaymentModal = ({ isOpen, onClose, selectedBills, onConfirmPayment }) => {
  if (!isOpen) return null;

  const totalSelectedAmount = selectedBills.reduce(
    (sum, bill) => sum + parseFloat(bill.Order_Price),
    0
  );

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-900 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg text-center w-[40%]">
        <h2 className="text-xl font-bold text-black-700 mb-2">Confirm Payment</h2>
        <p>
        Pay for {selectedBills.length} bills?<br />
        </p>
       

        <div className="mt-4 max-h-40 overflow-y-auto flex flex-col ">
       <div className="mb-2 flex flex-row gap-4 justify-between">
        <div style={labelStyle}>Billing ID</div>
        <div style={labelStyle}>Order Name</div>
        <div style={labelStyle}>Price</div>
        </div>
  {selectedBills.map((bill) => (
    <div key={bill.Billing_Id} style={rowStyle} className="mb-2 flex flex-row gap-4 justify-evenly items-center">
      <div >{bill.Billing_Id}</div>
      <div >{bill.Order_Name}</div>
      <div >₹{parseFloat(bill.Order_Price).toFixed(2)}</div>
    </div>
  ))}
</div>

        <p>
         
          Total Amount: ₹{totalSelectedAmount.toFixed(2)}
        </p>

       
        <div className="mt-4">
          <button
            onClick={() => onConfirmPayment(selectedBills)}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md mx-auto"
          >
            Confirm Payment
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md mx-auto ml-4"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

BillPaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedBills: PropTypes.array.isRequired,
  onConfirmPayment: PropTypes.func.isRequired,
};
const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '8px', // Adjust as needed for spacing between rows
};

const labelStyle = {
  fontWeight: 'bold',
};

const valueStyle = {
  // Add any additional styling for values
};

export default BillPaymentModal;
