import React, { useState, useEffect } from "react";
import axios from "axios";
import ReservationCard from "./ReservationCard";
import ReservationCardEdit from "./ReservationCardEdit";
 
const Reservation = () => {
  const [reser, setReser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reservationsPerPage] = useState(5); // Adjust as needed
 
  const Guest_Id = localStorage.getItem('Guest_Id')
 
  useEffect(() => {
    const apiUrl = `http://127.0.0.1:5000/reservation?Guest_Id=${Guest_Id}`;
 
    axios
      .post(apiUrl, { 'Guest_Id': Guest_Id })
      .then((response) => {
        setReser(response.data.Reservation_Details);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [Guest_Id]);
 
  // Calculate the index of the last reservation on the current page
  const indexOfLastReser = currentPage * reservationsPerPage;
  // Calculate the index of the first reservation on the current page
  const indexOfFirstReser = indexOfLastReser - reservationsPerPage;
  // Get the reservations for the current page
  const currentReservations = reser.slice(indexOfFirstReser, indexOfLastReser);
 
  const reserList = Array.isArray(currentReservations) ? currentReservations : [];
 
  // for editing usage
  const [editing, setEditing] = useState(false);
  const [editedReser, setEditedReser] = useState(null);
 
  const handleEditClick = (reserData) => {
    setEditing(true);
    setEditedReser(reserData);
  };
 
  const handleSaveClick = (editedData) => {
    // Create an Axios PUT request to update the reservation data
    axios
      .put('http://127.0.0.1:5000/reservation_update', editedData)
      .then((response) => {
        console.log('reservation updated successfully:', response.data);
 
        // After successful update, update the frontend data
        const updatedReser = reser.map((resers) =>
          resers.Reservation_Id === editedData.Reservation_Id ? editedData : resers
        );
        setReser(updatedReser);
        setEditing(false);
      })
      .catch((error) => {
        console.error('Error updating reservation:', error);
      });
  };
 
  const handleCancelClick = () => {
    setEditing(false);
    setEditedReser(null);
  };
 
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
 
  return (
    <>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-4xl text-white">Reservations of guest: {reser.length}</h1>
      </div>
 
      <div className="grid grid-cols-1 sm:grid-cols-2  gap-0">
        {reserList.map((resers) => (
          <ReservationCard data={resers} onEditClick={handleEditClick} key={resers.Guest_Id} />
        ))}
        {editing && (
          <ReservationCardEdit
            data={editedReser}
            onSaveClick={handleSaveClick}
            onCancelClick={handleCancelClick}
          />
        )}
      </div>
 
      <div className="flex justify-center items-center mt-4">
        {Array.from({ length: Math.ceil(reser.length / reservationsPerPage) }, (_, i) => (
          <button
            key={i}
            className={`mx-2 px-3 py-1 rounded ${
              i + 1 === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300'
            }`}
            onClick={() => paginate(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </>
  );
};
 
export default Reservation;