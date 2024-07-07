
import React from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHotel } from '@fortawesome/free-solid-svg-icons';

const HotelCard = ({ data }) => {
  return (
    <div className="m-10 p-3 border-2 w-[500px] h-[125px] flex flex-row justify-center rounded-lg bg-slate-500 hover:bg-slate-700 text-gray-100 relative">
      <div className="w-1/4 h-full flex flex-col">
            <div className="text-xs h-[20%] flex justify-center">Hotel ID: {data.Hotel_Id}</div>
             <div className="text-5xl h-[80%] flex justify-center items-center"><FontAwesomeIcon icon={faHotel} size='lg'/></div> 
      </div>
      <div className="w-3/4 flex flex-col justify-between p-1.5">
        <div className="h-[40%] text-lg">{data.Hotel_Name}</div>
        
        <div className="flex flex-col text-xs justify-between">
          <div className="h-[20%">Address: {data.Hotel_Address}</div>
          <div className="h-[20%">City: {data.Hotel_City}</div>
           <div className="h-[20%">State: {data.Hotel_State}</div>
        </div>
        <div className="absolute top-2 right-2 bg-slate-800 text-white rounded-full p-2 text-xs">
          Total Rooms: {data.Total_Rooms}
        </div>

        <div className="absolute bottom-1 right-3 flex space-x-2">
          <Link
            to={`/room/${data.Hotel_Id}`}
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-3 py-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            Rooms
          </Link>
          {/* <button
            type="button"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-3 py-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            Edit
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default HotelCard;

