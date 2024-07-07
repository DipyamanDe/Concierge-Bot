import React, { useState } from "react";

const RecommendationCardEdit = ({ data, onSaveClick, onCancelClick }) => {
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
        <h2 className="block text-xl font-bold text-black-700 mb-2">Edit Recommendation</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="Recommendation_Name" className="block text-sm font-medium text-gray-700">Recommendation Name</label>
            <input
              type="text"
              id="Recommendation_Name"
              value={editedData.Recommendation_Name}
              onChange={(e) => setEditedData({ ...editedData, Recommendation_Name: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="Recommendation_Type" className="block text-sm font-medium text-gray-700">Type</label>
            <input
              type="text"
              id="Recommendation_Type"
              value={editedData.Recommendation_Type}
              onChange={(e) => setEditedData({ ...editedData, Recommendation_Type: e.target.value })}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="Recommendation_Rating" className="block text-sm font-medium text-gray-700">Rating</label>
            <input
              type="text"
              id="Recommendation_Rating"
              value={editedData.Recommendation_Rating}
              onChange={(e) => setEditedData({ ...editedData, Recommendation_Rating: e.target.value })}
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

export default RecommendationCardEdit;

