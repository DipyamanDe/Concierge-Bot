import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServicePageAssign = ({ onClose, onAssignStaff, serviceDept }) => {
  const [staffData, setStaffData] = useState({
    Staff_Name: '',
    Staff_Id: '',
  });

  const [allStaff, setAllStaff] = useState([]);

  useEffect(() => {
    // Fetch staff data from your API or source
    const apiUrl = "http://127.0.0.1:5000/staff";
    // const staticServiceDept = 'Booking'; 
    axios.get(apiUrl)
      .then(response => {
        // Filter staff based on the service department
        // console.log(serviceDept);
        // console.log("All Staff Data:", response.data.StaffData);
        //const filteredStaff = response.data.StaffData.filter(staff => staff.Service_Dept === staticServiceDept);
        const filteredStaff = response.data.StaffData.filter(staff => staff.Staff_Dept === serviceDept);
        setAllStaff(filteredStaff);
        console.log(filteredStaff);
      })
      .catch(error => {
        console.error('Error fetching staff data:', error);
      });
  }, [serviceDept]); // Include serviceDept in the dependency array to refetch data when serviceDept changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStaffData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAssignClick = () => {
    console.log('Assigning Staff:', staffData);
    onAssignStaff(staffData.Staff_Id);
    // Close the modal
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-900 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg text-black">
        <h2 className="block text-xl font-bold text-black-700 mb-2">Assign Staff</h2>
        <form className="space-y-4">
          {/* <div>
            <label htmlFor="Staff_Name" className="block text-sm font-medium text-gray-700">
              Staff Name
            </label>
            <select
              id="Staff_Name"
              name="Staff_Name"
              value={staffData.Staff_Id}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="">Select Staff</option>
              {allStaff.map((staff) => (
                <option key={staff.Staff_Id} value={staff.Staff_Id}>
                  {staff.Staff_Name}
                </option>
              ))}
            </select>
          </div> */}

           <div>
            <label htmlFor="Staff_Id" className="block text-sm font-medium text-gray-700">
              Staff Id
            </label>
            <select
              id="Staff_Id"
              name="Staff_Id"
              value={staffData.Staff_Id}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="">Select Staff Name</option>
              {allStaff.map((staff) => (
                <option key={staff.Staff_Id} value={staff.Staff_Id}>
                  {staff.Staff_Name}
                </option>
              ))}
            </select>
          </div> 

          <div className="flex justify-start mt-6">
            <button
              type="button"
              onClick={handleAssignClick}
              className="btn-primary bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md mr-2"
            >
              Assign
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-md mr-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicePageAssign;
