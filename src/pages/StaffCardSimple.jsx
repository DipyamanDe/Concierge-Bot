import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
 
const StaffCardSimple = ({ staffs, onEditClick }) => {
  const statusText = (status) => (status ? "Active" : "Inactive");
 
  return (
    <div className="flex items-center justify-center ml-64">
      <table className="w-full border-collapse border border-gray-300 rounded-md overflow-hidden">
        <thead>
          <tr className="bg-gray-400">
            <th className="py-2 px-4 border">Staff Id</th>
            <th className="py-2 px-4 border">Staff Name</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Department</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Edit</th>
          </tr>
        </thead>
        <tbody>
          {staffs.map((staff) => (
            <tr key={staff.Staff_Id} className="bg-gray-200 hover:bg-gray-100">
              <td className="py-2 px-4 border">{staff.Staff_Id}</td>
              <td className="py-2 px-4 border">
                <div className="flex items-center">
                  <div className="ml-2">{staff.Staff_Name}</div>
                </div>
              </td>
              <td className={`py-2 px-4 border text-${staff.Staff_Status ? 'green' : 'red'}`}>
                {statusText(staff.Staff_Status)}
              </td>
              <td className="py-2 px-4 border">{staff.Staff_Dept}</td>
              <td className="py-2 px-4 border">{staff.Staff_email}</td>
              <td className="py-2 px-4 border">
                <button
                  type="button"
                  onClick={() => onEditClick(staff)}
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
    </div>
  );
};
 
export default StaffCardSimple;