import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ServicePageAssign from './ServicePageAssign';

const ServiceCardSimple = ({ services, onEditClick, onAssignStaff }) => {
  const [isAssignModalOpen, setAssignModalOpen] = useState(false);
  const [serviceData, setServiceData] = useState(null);
  const [selectedServiceDept, setSelectedServiceDept] = useState('');
  
  const handleAssignClick = (service) => {
    setAssignModalOpen(true);
    setServiceData(service);

    // Find the corresponding service in the array
    const selectedService = services.find((s) => s.Service_Id === service.Service_Id);

    // Set the service department
    setSelectedServiceDept(selectedService ? selectedService.Service_Dept : '');
  };

  const handleAssignModalClose = () => {
    setAssignModalOpen(false);
  };

  const handleAssignStaffClick = async (assignD) => {
    // Perform staff assignment
    await onAssignStaff(serviceData.Service_Id, assignD);
    console.log(serviceData.Service_Id, assignD);

    // Update the service data after staff assignment
    const updatedService = { ...serviceData, Staff_Id: assignD.Staff_Id };
    setServiceData(updatedService);

    // Close the modal
    setAssignModalOpen(false);

    function refreshPage() {
      window.location.reload(false);
    }
    refreshPage();
  };

  return (
    <div className="flex items-center justify-center ml-64">
      <table className="w-full border-collapse border border-gray-300 rounded-md overflow-hidden">
        <thead>
          <tr className="bg-gray-400">
            <th className="py-2 px-4 border">Service Id</th>
            <th className="py-2 px-4 border">Service Name</th>
            <th className="py-2 px-4 border">Dept</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Action</th>
            <th className="py-2 px-4 border">Edit</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.Service_Id} className="bg-gray-200 hover:bg-gray-100">
              <td className="py-2 px-4 border">{service.Service_Id}</td>
              <td className="py-2 px-4 border">{service.Service_Name}</td>
              <td className="py-2 px-4 border">{service.Service_Dept}</td>
              <td className="py-2 px-4 border">{service.Service_Status}</td>
              <td className="py-2 px-4 border">
                <button
                  type="button"
                  onClick={() => handleAssignClick(service)}
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-3 py-1  mr-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                >
                  Assign Staff
                </button>
              </td>
              <td className="py-2 px-4 border">
                <button
                  type="button"
                  onClick={() => onEditClick(service)}
                  className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md transition duration-300 hover:bg-blue-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Assign Staff Modal */}
      {isAssignModalOpen && (
        <ServicePageAssign
          onClose={handleAssignModalClose}
          onAssignStaff={handleAssignStaffClick}
          serviceData={serviceData}
          serviceDept={selectedServiceDept}
        />
      )}
    </div>
  );
};

export default ServiceCardSimple;
