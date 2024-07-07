import React, { useState } from "react";

const BillCardEdit = ({ data, onSaveClick, onCancelClick }) => {
  const [editedData, setEditedData] = useState(data);

  const handleSave = () => {
    onSaveClick(editedData);
  };

  const handleCancel = () => {
    onCancelClick();
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-900 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="block text-xl font-bold text-black-700 mb-2">Edit Bill</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="Order_Name" className="block text-sm font-medium text-gray-700">Order Name</label>
            <input
              type="text"
              id="Order_Name"
              value={editedData.Order_Name}
              onChange={(e) => setEditedData({ ...editedData, Order_Name: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="Order_Department" className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              id="Order_Department"
              value={editedData.Order_Department}
              onChange={(e) => setEditedData({ ...editedData, Order_Department: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="Order_Price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="text"
              id="Order_Price"
              value={editedData.Order_Price}
              onChange={(e) => setEditedData({ ...editedData, Order_Price: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="Billing_Status" className="block text-sm font-medium text-gray-700">Status</label>
            <input
              type="text"
              id="Billing_Status"
              value={editedData.Billing_Status}
              onChange={(e) => setEditedData({ ...editedData, Billing_Status: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
        </form>
        <button onClick={handleSave}  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md mr-2"
          >Save</button>
        <button onClick={handleCancel} className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-md mr-2"
          >Cancel</button>
      </div>
    </div>
  );
};

export default BillCardEdit;
