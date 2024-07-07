import React, { useState, useEffect } from 'react';
import ServicePageAssign from './ServicePageAssign';
import axios from "axios";

const ServicePageCard = ({ data, onEditClick, onAssignStaff }) => {
  

  const [isAssignModalOpen, setAssignModalOpen] = useState(false);
  const [serviceData, setServiceData] = useState(data);
  const [selectedServiceDept, setSelectedServiceDept] = useState('');
  

  useEffect(() => {
    setServiceData(data);
    setSelectedServiceDept(data.Service_Dept); // Assuming Service_Dept is the property containing the department value
  }, [data]);
  

  const handleAssignClick = () => {
    setAssignModalOpen(true);
  };

  const handleAssignModalClose = () => {
    setAssignModalOpen(false);
  };

  const [assignData, setAssignData] = useState(null);

  const handleAssignStaffClick = async (assignD) => {
    // Perform staff assignment
    setAssignData(assignD);
    await onAssignStaff(serviceData.Service_Id, assignD);
    console.log(serviceData.Service_Id, assignD)
    // Update the ServicePageCard data after staff assignment
    const updatedService = { ...serviceData, Staff_Id: assignD.Staff_Id };
    setServiceData(updatedService);

    // Close the modal
    setAssignModalOpen(false);

    function refreshPage() {
      window.location.reload(false);
    }
    refreshPage();
  };
  const getCardColor = () => {
    if (serviceData.Service_Status === 'Done') {
      return 'bg-green-500';
    } else if (serviceData.Staff_Id && serviceData.Service_Status !== 'Done') {
      return 'bg-red-500';
    } else if (!serviceData.Staff_Id && serviceData.Service_Status !== 'Done') {
      return 'bg-yellow-500';
    } else {
      return ''; // Default color or add a specific class if needed
    }
  };
  const getCardHover = () => {
    if (serviceData.Service_Status === 'Done') {
      return 'hover:bg-green-700';
    } else if (serviceData.Staff_Id && serviceData.Service_Status !== 'Done') {
      return 'hover:bg-red-700';
    } else if (!serviceData.Staff_Id && serviceData.Service_Status !== 'Done') {
      return 'hover:bg-yellow-700';
    } else {
      return ''; // Default color or add a specific class if needed
    }
  };
 

  return (
    <div className={`m-5 p-3 border-2 w-[500px] h-[155px] flex flex-row justify-center rounded-lg ${getCardColor()} ${getCardHover()}  text-gray-100`}>
       <div className="w-1/4 h-full flex flex-col ">
                <div className="text-xs h-[20%] flex justify-center">Service Id: </div>
                <div className="text-6xl h-[80%] flex justify-center items-center">{data.Service_Id}</div>
            </div>
            <div className="w-3/4 flex flex-col justify-between p-0.75 overflow:hidden">
                <div className="h-[30%] text-xl">{data.Service_Name}</div>
                <div className="flex flex-row justify-between  h-[40%] ">
                    <div className="flex flex-col text-xs justify-evenly ">
                        <div className="">SR start time :- {data.Service_Start_Time}</div>
                        <div className="">SR end time :- {data.Service_End_Time}</div>
                        <div className="">Staff_Id:- {data.Staff_Id}</div>

                    </div>
                    <div className="flex flex-col pr-3">
                        <div className=" text-xs">Dept:- {data.Service_Dept}</div>
                        <div className=" text-xs">Status:-  {data.Service_Status}</div>
                        <div className=" text-xs">Desc:-  {data.Service_Description}</div>
                    </div>
                </div>

      <div className="h-[20%] self-end flex justify-end items-end">
        <button
          type="button"
          onClick={handleAssignClick}
          className="text-gray-900  bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-3 py-1  mr-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          Assign Staff
        </button>

        <button
          type="button"
          onClick={() => onEditClick(serviceData)}
          className="text-gray-900  bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-3 py-1  dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </button>
      </div>
</div>
      {/* Assign Staff Modal */}
      {isAssignModalOpen && <ServicePageAssign onClose={handleAssignModalClose} onAssignStaff={handleAssignStaffClick} serviceDept={selectedServiceDept}/>}
      
    </div>
  );
};

export default ServicePageCard;
