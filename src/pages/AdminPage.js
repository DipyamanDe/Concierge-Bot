import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import HeaderAdmin from './HeaderAdmin';
import Rooms from './Rooms';
 
function AdminPage() {
  const { Hotel_Id } = useParams();
  const [rooms, setRooms] = useState([]);
  const [emptyRooms, setEmptyRooms] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editedroom, setEditedRoom] = useState(null);
  const [res, setRes] = useState(true);
  const [pre, setPre] = useState(false);
 
  // New state for user input
  const [dateInput, setDateInput] = useState('');
 
  useEffect(() => {
    const apiUrl = `http://127.0.0.1:5000/room?Hotel_Id=${Hotel_Id}&date=${dateInput}`;
    axios
      .get(apiUrl)
      .then((response) => {
        setRooms(response.data.RoomData);
      })
      .catch((error) => {
        console.error('Error fetching room data:', error);
      });
  }, [Hotel_Id, dateInput]);
 
  useEffect(() => {
    const apiUrl = `http://127.0.0.1:5000/room_empty??Hotel_Id=${Hotel_Id}&date=${dateInput}`;
    axios
      .get(apiUrl)
      .then((response) => {
        setEmptyRooms(response.data.EmptyRoomData);
      })
      .catch((error) => {
        console.error('Error fetching unoccupied room data:', error);
      });
  }, [Hotel_Id, dateInput]);
 
  const handleEditClick = (roomData) => {
    setEditing(true);
    setEditedRoom(roomData);
  };
 
  const handleSaveClick = (editedData) => {
    axios
      .put('http://127.0.0.1:5000/room_update', editedData)
      .then((response) => {
        const updatedRoom = rooms.map((room) =>
          room.Room_Number === editedData.Room_Number ? editedData : room
        );
        setRooms(updatedRoom);
        setEditing(false);
      })
      .catch((error) => {
        console.error('Error updating room:', error);
      });
  };
 
  const handleCancelClick = () => {
    setEditing(false);
    setEditedRoom(null);
  };
 
  const handleDateInputChange = (e) => {
    const { value } = e.target;
    setDateInput(value);
  };
 
  return (
    <>
      <HeaderAdmin />
 
      {/* User input for "from date" and "to date" */}
      <div className="flex flex-row m-6 text-white">
      <label className="mr-3 ">
          Date:
          <input
            type="date"
            name="date"
            value={dateInput}
            onChange={handleDateInputChange}
            className="text-black ml-1"
          />
        </label>
       
      </div>
 
      <div className="flex flex-row m-6 text-white ">
        <div
          className="mr-3"
          style={{ borderBottom: res ? '4px solid #708090' : '' }}
          onClick={() => {
            setRes(true);
            setPre(false);
          }}
        >
          Occupied Rooms
        </div>
        <div
          className="text-white "
          style={{ borderBottom: pre ? '4px solid #708090' : '' }}
          onClick={() => {
            setPre(true);
            setRes(false);
          }}
        >
          Unoccupied Rooms
        </div>
      </div>
 
      {res && (
        <Rooms
          rooms={rooms}
          editing={editing}
          editedroom={editedroom}
          handleEditClick={handleEditClick}
          handleSaveClick={handleSaveClick}
          handleCancelClick={handleCancelClick}
        />
      )}
      {pre && (
        <Rooms
          rooms={emptyRooms}
          editing={editing}
          editedroom={editedroom}
          handleEditClick={handleEditClick}
          handleSaveClick={handleSaveClick}
          handleCancelClick={handleCancelClick}
        />
      )}
    </>
  );
}
 
export default AdminPage;