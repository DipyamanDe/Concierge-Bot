import React, { useState } from "react";
import axios from "axios";
 
const StaffServiceEdit = ({ data, onSaveClick, onCancelClick }) => {
  const [editedData, setEditedData] = useState(data);
 
  const handleSave = async () => {
    // Check if the status is set to "Done"
    if (editedData.Service_Status === "Done") {
      try {
        // Make the API call to update the service end time
        await axios.post(
          'http://127.0.0.1:5000/update_service_end_time',
          {
            service_id: editedData.Service_Id,  // Provide the service ID
            service_end_time: new Date().toISOString()  // Use the current time as the end time
          }
        );
      } catch (error) {
        console.error('Error updating service end time:', error);
        // Handle the error as needed
      }
    }
 
    // Continue with the original save logic
    onSaveClick(editedData);
    // window.location.reload();
  };
 
  const handleCancel = () => {
    onCancelClick();
  };
 
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-900 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg">
       
        <form>
         
         
 
          <div className="mb-4">
            <label htmlFor="Service_Status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              type="text"
              id="Service_Status"
              value={editedData.Service_Status}
              onChange={(e) => setEditedData({ ...editedData, Service_Status: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
            >
              <option value="Done">Done</option>
              <option value="Not Done">Not Done</option>
            </select>
          </div>
        </form>
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md mr-2"
        >
          Save
        </button>
        <button
          onClick={handleCancel}
          className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-md mr-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
 
export default StaffServiceEdit;