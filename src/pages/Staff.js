import React, { useState, useEffect } from "react";
import axios from "axios";
import StaffCard from "./StaffCard";
import StaffCardEdit from "./StaffCardEdit";
import StaffCardSimple from "./StaffCardSimple";
import Header from "./HeaderAdmin";

function Staff() {
  const [staffs, setStaff] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Set the number of items per page
  const [editing, setEditing] = useState(false);
  const [editedStaff, setEditedStaff] = useState(null);
  const [res, setRes] = useState(true);
  const [pre, setPre] = useState(false);
  const [staffPerPage] = useState(5);

  useEffect(() => {
    const apiUrl = "http://127.0.0.1:5000/staff";
    axios
      .get(apiUrl)
      .then((response) => {
        setStaff(response.data.StaffData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStaffs = staffs.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const nextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const handleEditClick = (staffData) => {
    setEditing(true);
    setEditedStaff(staffData);
  };

  const handleSaveClick = (editedData) => {
    axios
      .put("http://127.0.0.1:5000/staff_update", editedData)
      .then((response) => {
        console.log("staff updated successfully:", response.data);

        const updatedStaff = staffs.map((staff) =>
          staff.Staff_Id === editedData.Staff_Id ? editedData : staff
        );
        setStaff(updatedStaff);
        setEditing(false);
      })
      .catch((error) => {
        console.error("Error updating staff:", error);
      });
  };

  const handleCancelClick = () => {
    setEditing(false);
    setEditedStaff(null);
  };

  return (
    <>
      <style>
        {`
          .pagination-button {
            background-color: #1a202c; /* Dark Blue-Gray */
            color: white;
            border: 1px solid #1a202c; /* Dark Blue-Gray */
            padding: 8px 16px;
            cursor: pointer;
            border-radius: 4px;
          }
 
          .active-pagination-button {
            background-color: #2d3748; /* Darker Blue-Gray */
            color: white;
            border: 1px solid #2d3748; /* Darker Blue-Gray */
            padding: 8px 16px;
            cursor: pointer;
            border-radius: 4px;
          }
 
          .pagination-button:disabled {
            background-color: #4a5568; /* Disabled Blue-Gray */
            color: #a0aec0; /* Lighter Blue-Gray */
            cursor: not-allowed;
          }
        `}
      </style>

      <Header></Header>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-4xl">Staff Details</h1>
      </div>

      <div className="flex flex-row m-6 text-white">
        <div
          className={`mr-3 ${res ? "border-b-4 border-gray-700" : ""}`}
          onClick={() => {
            setRes(true);
            setPre(false);
          }}
        >
          Icon View
        </div>
        <div
          className={`mr-3 ${pre ? "border-b-4 border-gray-700" : ""}`}
          onClick={() => {
            setPre(true);
            setRes(false);
          }}
        >
          List View
        </div>
      </div>
      {res && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            {currentStaffs.map((staff) => (
              <StaffCard
                data={staff}
                onEditClick={handleEditClick}
                key={staff.Staff_Id}
              />
            ))}
            {currentStaffs.length === 0 && (
              <div className="text-center text-gray-500 p-4">
                No staff members found.
              </div>
            )}

            {editing && (
              <StaffCardEdit
                data={editedStaff}
                onSaveClick={handleSaveClick}
                onCancelClick={handleCancelClick}
              />
            )}
          </div>
          <div className="flex justify-center mt-4">
            <ul className="flex space-x-2">
              <li>
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  Prev
                </button>
              </li>
              {Array.from({
                length: Math.ceil(staffs.length / staffPerPage),
              }).map((page, index) => (
                <li key={index}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`${
                      currentPage === index + 1
                        ? "active-pagination-button"
                        : "pagination-button"
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={nextPage}
                  disabled={
                    currentPage === Math.ceil(staffs.length / staffPerPage)
                  }
                  className="pagination-button"
                >
                  Next
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
      {pre && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            <StaffCardSimple
              staffs={currentStaffs}
              onEditClick={handleEditClick}
            />
            {currentStaffs.length === 0 && (
              <div className="text-center text-gray-500 p-4">
                No staff members found.
              </div>
            )}
            {editing && (
              <StaffCardEdit
                data={editedStaff}
                onSaveClick={handleSaveClick}
                onCancelClick={handleCancelClick}
              />
            )}
          </div>
          <div className="flex justify-center mt-4">
            <ul className="flex space-x-2">
              <li>
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  Prev
                </button>
              </li>
              {Array.from({
                length: Math.ceil(staffs.length / staffPerPage),
              }).map((page, index) => (
                <li key={index}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`${
                      currentPage === index + 1
                        ? "active-pagination-button"
                        : "pagination-button"
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={nextPage}
                  disabled={
                    currentPage === Math.ceil(staffs.length / staffPerPage)
                  }
                  className="pagination-button"
                >
                  Next
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default Staff;
