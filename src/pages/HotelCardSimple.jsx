import React from 'react';
import { Link } from 'react-router-dom';

const HotelCardSimple = ({ hotels }) => {
  return (
    <div className="flex items-center justify-center ml-64">
      <table className="w-full border-collapse border border-gray-300 rounded-md overflow-hidden">
        <thead>
          <tr className="bg-gray-400">
            <th className="py-2 px-4 border">Hotel Name</th>
            <th className="py-2 px-4 border">Hotel ID</th>
            <th className="py-2 px-4 border">Total Rooms</th>
            <th className="py-2 px-4 border">Address</th>
            <th className="py-2 px-4 border">City</th>
            <th className="py-2 px-4 border">State</th>
            <th className="py-2 px-4 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => (
            <tr key={hotel.Hotel_Id} className="bg-gray-200 hover:bg-gray-100">
              <td className="py-2 px-4 border">{hotel.Hotel_Name}</td>
              <td className="py-2 px-4 border">{hotel.Hotel_Id}</td>
              <td className="py-2 px-4 border">{hotel.Total_Rooms}</td>
              <td className="py-2 px-4 border">{hotel.Hotel_Address}</td>
              <td className="py-2 px-4 border">{hotel.Hotel_City}</td>
              <td className="py-2 px-4 border">{hotel.Hotel_State}</td>
              <td className="py-2 px-4 border">
                <Link
                  to={`/room/${hotel.Hotel_Id}`}
                  className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md transition duration-300 hover:bg-blue-700"
                >
                  View Rooms
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HotelCardSimple;
