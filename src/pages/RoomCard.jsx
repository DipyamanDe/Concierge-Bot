import React from 'react';
import { Link } from "react-router-dom";
 
const Roomcard = ({ data, onEditClick }) => {
  // Check if Guest_Id is not null
  const isGuestIdNotNull = data.Guest_Id !== null;
 
  // Define the background color based on the condition
  const bgColor = isGuestIdNotNull ? 'bg-green-500' : 'bg-gray-500';
  const bgHover= isGuestIdNotNull ? 'hover:bg-green-700' : 'hover:bg-gray-700';
  // console.log(data.Room_Id)
  return (
    <div className={`m-10 p-3 border-2 w-[500px] h-[125px] flex flex-row justify-center rounded-lg ${bgColor} ${bgHover} text-gray-100 relative`}>
      <div className="w-1/4 h-full flex flex-col">
        <div className="text-6xl h-[80%] flex justify-center items-center">{data.Room_Number}</div>
        <div className="text-xm h-[20%] flex justify-center">{data.Room_Type}</div>
      </div>
      <div className="w-3/4 flex flex-col justify-between p-1.5">
        <div className="h-[40%] text-2xl">Guest ID: {data.Guest_Id}</div>
        <div className="flex flex-row text-xs justify-between">
          <div className="h-[20%">Check-in: {data.CheckIn_Time}</div>
          <div className="h-[20%">Check-out: {data.CheckOut_Time}</div>
          <div className="h-[20%">Room ID {data.Room_Id}</div>
        </div>
        <div className="flex flex-row text-xs justify-between">
          <div className="h-[20%">Price: {data.Room_Price}</div>
        </div>
 
        <div className="absolute bottom-1 right-3 flex space-x-2">
          <Link
            to={`/services/${data.Room_Id}`}
            className={`text-gray-900 ${isGuestIdNotNull ? 'bg-white' : 'bg-gray-300'} border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-3 py-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700`}
          >
            Services
          </Link>
          <button
            type="button"
            onClick={() => onEditClick(data)}
            className={`text-gray-900 ${isGuestIdNotNull ? 'bg-white' : 'bg-gray-300'} border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-3 py-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default Roomcard;
 