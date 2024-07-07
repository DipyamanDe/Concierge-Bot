import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests

const CabModalComponent = ({ onClose }) => {
  const guest_id = localStorage.getItem('Guest_Id');
  const [cab, setCab] = useState({
    preference: false,
    source: '',
    destination: '',
    cabType: '',
    comments: '',
  });

  const handleCabChange = (value) => {
    setCab({
      ...cab,
      preference: value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      const apiUrl = "http://127.0.0.1:5000/update_preferences"; // Replace with your actual API URL

      // Create strings for cab details
      const cabDetails = cab.preference
        ? `Cab Preference: Source - ${cab.source}, Destination - ${cab.destination}, CabType - ${cab.cabType} , Comments - ${cab.comments}`
        : "Cab Preference: No preference";

      // Make API call to save cab preferences
      await axios.put(apiUrl, {
        Guest_Id: guest_id, // Assuming guest_id is available in your component
        Preferance_Type: "Cab Preference",
        Preferance_Description: cab.preference ? cabDetails : null,
      });

      // Handle onClose to close the modal after saving
      onClose();

      // Optionally, you can show a success message or perform other actions after successful save
      console.log("Preferences updated successfully!");
    } catch (error) {
      console.error("Error updating preferences:", error);
      // Handle error, show error message, etc.
    }
  };

  return (
    <div className="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 999 }}>
      <div className="modal-content" style={{ backgroundColor: '#fefefe', padding: '20px', borderRadius: '8px' }}>
        <span className="close" onClick={onClose} style={{ cursor: 'pointer', float: 'right', fontSize: '24px', fontWeight: 'bold' }}>&times;</span>
        <div className="flex flex-row">
          <div className=" w-[30%]">Cab Preference :</div>
          <div className="w-[50%] ">
            <label className="mr-2" htmlFor="yes">Yes</label>
            <input
              type="radio"
              name="Cabpreference"
              id="yes"
              checked={cab.preference}
              onClick={() => handleCabChange(true)}
            />
            <label htmlFor="no">No</label>
            <input
              type="radio"
              name="Cabpreference"
              id="no"
              checked={!cab.preference}
              onClick={() => handleCabChange(false)}
            />
          </div>
        </div>
        {/* Additional UI for source, destination, cab type, comments */}
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-1">
            <span>From:</span>
            <input
              type="text"
              className="w-full"
              placeholder="Source"
              value={cab.source}
              onChange={(e) =>
                setCab({
                  ...cab,
                  source: e.target.value,
                })
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <span>To:</span>
            <input
              type="text"
              className="w-full"
              placeholder="Destination"
              value={cab.destination}
              onChange={(e) =>
                setCab({
                  ...cab,
                  destination: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="flex flex-row ">
          <div className="w-[60%]">Cab Type :</div>
          <div className="w-[30%]">
            <select
              className="border-gray-500 w-full"
              value={cab.cabType}
              onChange={(e) =>
                setCab({
                  ...cab,
                  cabType: e.target.value,
                })
              }
            >
              <option value="No Preference">No Preference</option>
              <option value="Ola (24 rs/km)">Ola (24 rs/km)</option>
              <option value="Uber (21 rs/km)">Uber (21 rs/km)</option>
              <option value="Snap E (18 rs/km)">Snap E (18 rs/km)</option>
            </select>
          </div>
        </div>
        <div className=" flex flex-row ">
          <span className="w-[30%] text-sm flex flex-row self-end">
            Anything extra you want to notify us?
          </span>
          <input
            className=" w-[70%] h-[20%] border-gray-500 "
            type="text"
            value={cab.comments}
            onChange={(e) =>
              setCab({
                ...cab,
                comments: e.target.value,
              })
            }
          />
        </div>
        {/* Save changes button */}
        <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mt-4 mr-2" onClick={handleSaveChanges}>Save Changes</button>
        {/* Cancel button */}
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded mt-4" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default CabModalComponent;
