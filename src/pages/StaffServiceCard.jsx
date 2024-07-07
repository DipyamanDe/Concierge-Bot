import React, { useState } from 'react';
import StaffPreference from './StaffPreference';
 
const StaffServiceCard = ({ data, onEditClick }) => {
    const [showPreferenceView, setShowPreferenceView] = useState(false);
 
    const handlePreferenceViewClick = () => {
        setShowPreferenceView(true);
    };
 
    const closePreferenceView = () => {
        setShowPreferenceView(false);
    };
 
    return (
        <div className="m-10 p-3 border-2 w-[500px] h-[150px] flex flex-row justify-center rounded-lg bg-slate-500 hover:bg-slate-700  text-gray-100">
            <div className="w-1/4 h-full flex flex-col ">
                <div className="text-xs h-[20%] flex justify-center">Service Id: </div>
                <div className="text-6xl h-[80%] flex justify-center items-center">{data.Service_Id}</div>
               
            </div>
            <div className="w-3/4 flex flex-col justify-between p-1 overflow:hidden">
                <div className="h-[30%] text-xl">Service Name :-{data.Service_Name}</div>
                <div className="flex flex-row justify-between  h-[40%] ">
                    <div className="flex flex-col text-xs justify-evenly ">
                    <div className="">SR start time :- {data.Service_Start_Time}</div>
                        <div className="">SR end time :- {data.Service_End_Time}</div>
                        <div className="">Staff_Id:- {data.Staff_Id}</div>
                    </div>
                    <div className="flex flex-col pr-3">
                    <div className=" text-xs">Dept:- {data.Service_Dept}</div>
                        <div className=" text-xs">Status:-  {data.Service_Status}</div>
                    </div>
                </div>
                </div>
                <div className="h-[20%] self-end flex justify-end items-end">
       
                <button
                        type="button"
                        onClick={handlePreferenceViewClick}
                        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-3 py-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 mr-2"
                    >
                        P
                    </button>
 
        <button
          type="button"
          onClick={() => onEditClick(data)}
          className="text-gray-900  bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-3 py-1  dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
        D
        </button>
     
{/*
          </svg>
                    </button> */}
 {showPreferenceView && <StaffPreference data={data} onCloseClick={closePreferenceView} />}
 
 
 
                </div>
            </div>
 
    );
};
 
export default StaffServiceCard;