import React, { useState } from "react";

const PreferenceCardEdit = ({ data, onSaveClick, onCancelClick }) => {
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
        <h2 className="block text-xl font-bold text-black-700 mb-2">Edit Preference</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="Food_Preferance" className="block text-sm font-medium text-gray-700">Food Preference</label>
            <input
              type="text"
              id="Food_Preferance"
              value={editedData.Food_Preferance}
              onChange={(e) => setEditedData({ ...editedData, Food_Preferance: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="Medical_Condition_Preferance" className="block text-sm font-medium text-gray-700">Medical Condition</label>
            <input
              type="text"
              id="Medical_Condition_Preferance"
              value={editedData.Medical_Condition_Preferance}
              onChange={(e) => setEditedData({ ...editedData, Medical_Condition_Preferance: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="Cab_Preferance" className="block text-sm font-medium text-gray-700">Cab Preference</label>
            <input
              type="text"
              id="Cab_Preferance"
              value={editedData.Cab_Preferance}
              onChange={(e) => setEditedData({ ...editedData, Cab_Preferance: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="Room_Preferance" className="block text-sm font-medium text-gray-700">Room Preference</label>
            <input
              type="text"
              id="Room_Preferance"
              value={editedData.Room_Preferance}
              onChange={(e) => setEditedData({ ...editedData, Room_Preferance: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="Allergic_to" className="block text-sm font-medium text-gray-700">Allergies</label>
            <input
              type="text"
              id="Allergic_to"
              value={editedData.Allergic_to}
              onChange={(e) => setEditedData({ ...editedData, Allergic_to: e.target.value })}
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

export default PreferenceCardEdit;
