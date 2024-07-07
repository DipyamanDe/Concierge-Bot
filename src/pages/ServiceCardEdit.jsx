import React, { useState } from "react";

const ServiceCardEdit = ({ data, onSaveClick, onCancelClick }) => {
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
        <h2 className="block text-xl font-bold text-black-700 mb-2">Edit Service</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="Service_Name" className="block text-sm font-medium text-gray-700">Service Name</label>
            <input
              type="text"
              id="Service_Name"
              value={editedData.Service_Name}
              onChange={(e) => setEditedData({ ...editedData, Service_Name: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          
          
          {/* <div className="mb-4">
            <label htmlFor="Service_Dept" className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              id="Service_Dept"
              value={editedData.Service_Dept}
              onChange={(e) => setEditedData({ ...editedData, Service_Dept: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div> */}
          
          <div className="mb-4">
            <label htmlFor="Service_Dept" className="block text-sm font-medium text-gray-700">Department</label>
            <select
              id="Service_Dept"
              value={editedData.Service_Dept}
              onChange={(e) => setEditedData({ ...editedData, Service_Dept: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
            >
              <option value="Cab Booking">Cab Booking</option>
              <option value="Dining">Dining</option>
              <option value="Room service">Room service</option>
              <option value="Other Bookings">Other Bookings</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="Service_Description" className="block text-sm font-medium text-gray-700">Service Description</label>
            <input
              type="text"
              id="Service_Description"
              value={editedData.Service_Description}
              onChange={(e) => setEditedData({ ...editedData, Service_Description: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          {/* <div className="mb-4">
            <label htmlFor="Service_Status" className="block text-sm font-medium text-gray-700">Status</label>
            <input
              type="text"
              id="Service_Status"
              value={editedData.Service_Status}
              onChange={(e) => setEditedData({ ...editedData, Service_Status: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div> */}
        </form>
        <button onClick={handleSave}  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md mr-2"
          >Save</button>
        <button onClick={handleCancel} className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-md mr-2"
          >Cancel</button>
      </div>
    </div>
  );
};

export default ServiceCardEdit;
