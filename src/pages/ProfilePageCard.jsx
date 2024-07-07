// import React from 'react';

// const ProfilePageCard = ({ data  ,onEditClick}) => {
//     return (
//         <div className="m-10 p-3 border-2 w-[500px] h-[125px] flex flex-row justify-center rounded-lg bg-slate-500 hover:bg-slate-700  text-gray-100">
//             <div className="w-1/4 h-full flex flex-col ">
//                 <div className="text-xs h-[20%] flex justify-center">Guest Id : </div>
//                 <div className="text-6xl h-[80%] flex justify-center items-center">{data.Guest_Id}</div>
                
//             </div>
//             <div className="w-3/4 flex flex-col justify-between p-1 overflow:hidden">
//                 <div className="h-[30%] text-xl">Guest Name  :-{data.Guest_Name}</div>
//                 <div className="flex flex-row justify-between  h-[40%] ">
//                     <div className="flex flex-col text-xs justify-evenly ">
//                         <div className="">Guest Phone Number:- {data.Guest_Phone_Number}</div>
//                         <div className="">Guest Gender:- {data.Guest_Gender}</div>
//                     </div>
//                     <div className="flex flex-col pr-3"> 
//                         <div className=" text-xs">Guest Email:- {data.Guest_email}</div>
//                         <div className=" text-xs">:-  {data.Allergic_to}</div>
//                     </div>
//                 </div>

//                 <div className="h-[20%] self-end">
//                     <button type="button"onClick={() => onEditClick(data)} class="text-gray-900  bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-3 py-1 mr-2 mb-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
//           </svg>
//                     </button>

//                 </div>
//             </div>
//         </div>

//     );
// };

// export default ProfilePageCard;

import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";

const ProfilePageCard = ({ data, onEditClick }) => {
  return (
    <div className="flex justify-center items-center h-screen ">
      <div className=" m-10 p-6 border-2 w-[400px] h-[400px] flex flex-col items-center justify-center rounded-lg bg-white shadow-md">
        {/* Avatar */}
        <div className="rounded-full overflow-hidden mb-4">
          {/* You can replace the src with the actual path to the user's profile picture */}
          <FontAwesomeIcon icon={faUser} className="icon w-[80px] h-[100px]" />
        </div>
        

        {/* User Information */}
        <div className="text-xl font-bold mb-2">{data.Guest_Name}</div>
        <div className="text-gray-600 text-sm mb-4">{data.Guest_email}</div>

        {/* Details */}
        <div className="text-sm mb-2">Guest Phone Number: {data.Guest_Phone_Number}</div>
        {/* <div className="text-sm mb-2">Guest Phone Number: +{data.Guest_Phone_Number.slice(0, 2)} {data.Guest_Phone_Number.slice(2)}</div> */}

        <div className="text-sm mb-2">Guest Gender: {data.Guest_Gender}</div>
        <div className="text-sm mb-2">Guest Email: {data.Guest_email}</div>


        {/* Edit Button */}
        <button
          type="button"
          onClick={() => onEditClick(data)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md mt-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProfilePageCard;
