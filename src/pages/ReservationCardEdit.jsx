import React, { useState } from "react";

const ReservationCardEdit = ({ data, onSaveClick, onCancelClick }) => {
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
        <h2 className="block text-xl font-bold text-black-700 mb-2">Edit Reservation</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="Reservation_Type" className="block text-sm font-medium text-gray-700">Type</label>
            <input
              type="text"
              id="Reservation_Type"
              value={editedData.Reservation_Type}
              onChange={(e) => setEditedData({ ...editedData, Reservation_Type: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="Reservation_Status" className="block text-sm font-medium text-gray-700">Status</label>
            <input
              type="text"
              id="Reservation_Status"
              value={editedData.Reservation_Status}
              onChange={(e) => setEditedData({ ...editedData, Reservation_Status: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="Reservation_Description" className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              id="Reservation_Description"
              value={editedData.Reservation_Description}
              onChange={(e) => setEditedData({ ...editedData, Reservation_Description: e.target.value })}
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

export default ReservationCardEdit;
