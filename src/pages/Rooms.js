import React, { useState } from 'react';
import RoomCard from './RoomCard';
import RoomCardSimple from './RoomCardSimple';
import RoomCardEdit from './RoomCardEdit';
import './Room.css';
 
const Rooms = ({ rooms, editing, editedroom, handleEditClick, handleSaveClick, handleCancelClick }) => {
  const [res, setRes] = useState(true);
  const [pre, setPre] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4); // Set the number of items per page
 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = rooms.slice(indexOfFirstItem, indexOfLastItem);
 
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(rooms.length / itemsPerPage)));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
 
  return (
    <div>
      <div className="flex flex-row m-6">
        <div
          className="mr-3 text-white "
          style={{ borderBottom: res ? '4px solid #708090' : '' }}
          onClick={() => {
            setRes(true);
            setPre(false);
          }}
        >
          Icon view
        </div>
        <div
          className="text-white "
          style={{ borderBottom: pre ? '4px solid #708090' : '' }}
          onClick={() => {
            setPre(true);
            setRes(false);
          }}
        >
          List View
        </div>
      </div>
 
      {res && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            {currentItems.map((room) => (
              <RoomCard key={room.Room_Number} data={room} onEditClick={handleEditClick} />
            ))}
            {editing && (
              <RoomCardEdit data={editedroom} onSaveClick={handleSaveClick} onCancelClick={handleCancelClick} />
            )}
          </div>
          <div className="pagination">
            <button onClick={prevPage}>&lt;</button>
            {Array.from({ length: Math.ceil(rooms.length / itemsPerPage) }, (_, index) => index + 1).map((number) => (
              <button key={number} onClick={() => paginate(number)} className={currentPage === number ? 'active' : ''}>
                {number}
              </button>
            ))}
            <button onClick={nextPage}>&gt;</button>
          </div>
        </div>
      )}
 
      {pre && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            <RoomCardSimple rooms={rooms} />
          </div>
        </div>
      )}
    </div>
  );
};
 
export default Rooms;