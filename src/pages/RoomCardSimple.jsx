
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RoomCardSimple = ({ rooms, onEditClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set the number of items per page

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRooms = rooms.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(rooms.length / itemsPerPage)));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="ml-64">
      {/* Table */}
      <table className="w-full border-collapse border border-gray-300 rounded-md overflow-hidden mb-4">
        <thead>
          <tr className="bg-gray-400">
            <th className="py-2 px-4 border">Room Number</th>
            <th className="py-2 px-4 border">Room Type</th>
            <th className="py-2 px-4 border">Guest Id</th>
            <th className="py-2 px-4 border">CheckIn Time</th>
            <th className="py-2 px-4 border">CheckOut Time</th>
            <th className="py-2 px-4 border">Room Price</th>
            <th className="py-2 px-4 border">Action</th>
            <th className="py-2 px-4 border">Edit</th>
          </tr>
        </thead>
        <tbody>
          {currentRooms.map((room) => (
            <tr key={room.Room_Number} className="bg-gray-200 hover:bg-gray-100">
              <td className="py-2 px-4 border">{room.Room_Number}</td>
              <td className="py-2 px-4 border">{room.Room_Type}</td>
              <td className="py-2 px-4 border">{room.Guest_Id}</td>
              <td className="py-2 px-4 border">{room.CheckIn_Time}</td>
              <td className="py-2 px-4 border">{room.CheckOut_Time}</td>
              <td className="py-2 px-4 border">{room.Room_Price}</td>
              <td className="py-2 px-4 border">
                <Link
                  to={`/services/${room.Room_Id}`}
                  className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md transition duration-300 hover:bg-blue-700"
                >
                  Services
                </Link>
              </td>
              <td className="py-2 px-4 border">
                <button
                  type="button"
                  onClick={() => onEditClick(room)}
                  className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md transition duration-300 hover:bg-blue-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-auto mb-4">
        <button onClick={prevPage} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md transition duration-300 hover:bg-blue-700">
          Prev
        </button>
        {Array.from({ length: Math.ceil(rooms.length / itemsPerPage) }).map(
          (page, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`mx-2 px-4 py-2 ${
                currentPage === index + 1
                  ? 'bg-blue-500 text-white rounded-md transition duration-300 hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-700 rounded-md transition duration-300 hover:bg-gray-400'
              }`}
            >
              {index + 1}
            </button>
          )
        )}
        <button onClick={nextPage} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md transition duration-300 hover:bg-blue-700">
          Next
        </button>
      </div>
    </div>
  );
};

export default RoomCardSimple;
