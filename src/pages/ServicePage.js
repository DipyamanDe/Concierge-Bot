import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ServicePageCard from "./ServicePageCard";
import ServicePageCardSimple from "./ServicePageCardSimple";
import ServicePageEdit from "./ServicePageEdit";
import InsertService from "./InsertService";
import Header from "./HeaderAdmin";
import ServicePagePreference from "./ServicePagePreference";

const ServicePage = () => {
  const { Room_Id } = useParams();
  const [services, setServices] = useState([]);
  const [res, setRes] = useState(true);
  const [pre, setPre] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false); // State to manage the display of Preferences
  const [room,setRoom]= useState([]);
  const [roomGuestId, setRoomGuestId] = useState(null);

  const [sortAssigned, setSortAssigned] = useState(false);
  const [sortDone, setSortDone] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortUnassigned, setSortUnassigned] = useState(false);

  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  // Declare state for editing and inserting
  const [editing, setEditing] = useState(false);
  const [editedService, setEditedService] = useState(null);
  const [insert, setInsert] = useState(false);
// Original copy of services data
const [originalServices, setOriginalServices] = useState([]);

  useEffect(() => {
    const apiUrl = `http://127.0.0.1:5000/services?Room_Id=${Room_Id}`;
    axios
      .get(apiUrl)
      .then((response) => {
        console.log("Fetched services data:", response.data.ServicesData);
        setServices(response.data.ServicesData);
        setOriginalServices(response.data.ServicesData); // Save original data
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [Room_Id]);

  useEffect(() => {
    const apiUrl = `http://127.0.0.1:5000/get_room_details?Room_Id=${Room_Id}`;
    axios
      .get(apiUrl)
      .then((response) => {;
        setRoom(response.data.Room_Details);
        setRoomGuestId(response.data.Room_Details[0].Guest_Id);
        console.log("room details is : ",response.data.Room_Details)
        console.log("Guest ID is: ",response.data.Room_Details[0].Guest_Id)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [Room_Id]);
  
  

  const servicesList = Array.isArray(services) ? services : [];

  const indexOfLastService = currentPage * itemsPerPage;
  const indexOfFirstService = indexOfLastService - itemsPerPage;
  const currentServices = servicesList.slice(indexOfFirstService, indexOfLastService);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < Math.ceil(servicesList.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleEditClick = (serviceData) => {
    setEditing(true);
    setEditedService(serviceData);
  };

  const handleSaveClick = (editedData) => {
    axios
      .put("http://127.0.0.1:5000/service_update", editedData)
      .then((response) => {
        console.log("Service updated successfully:", response.data);
        const updatedServices = services.map((service) =>
          service.Service_Id === editedData.Service_Id ? editedData : service
        );
        setServices(updatedServices);
        setEditing(false);
      })
      .catch((error) => {
        console.error("Error updating service:", error);
      });
  };

  const handleCancelClick = () => {
    setEditing(false);
    setEditedService(null);
  };

  const handleInsertCancelClick = () => {
    setInsert(false);
  }; 
  const toggleSortOptions = () => {
    setShowSortOptions(!showSortOptions);
  };
 


  const handleAssignStaff = async (Service_Id, Staff_Id) => {
    try {
      await axios.put("http://127.0.0.1:5000/service_assign", {
        Service_Id: Service_Id,
        Staff_Id: Staff_Id,
      });
      function refreshPage() {
        window.location.reload(false);
      }
    } catch (error) {
      console.error("Error assigning staff:", error);
    }
  };
  const handleSortByAssigned = () => {
    setSortAssigned(!sortAssigned);
  
    const sortedServices = [...originalServices].sort((a, b) => {
      if (sortAssigned) {
        return a.Staff_Id && !b.Staff_Id ? -1 : 1; // Move assigned tasks first
      } else {
        return a.Staff_Id && !b.Staff_Id ? 1 : -1; // Move unassigned tasks first
      }
    });
  
    // Filter out unassigned tasks after sorting by assigned
    const filteredServices = sortedServices.filter(service => service.Staff_Id);
  
    setServices(filteredServices);
  };
  
  const handleSortByUnassigned = () => {
    setSortUnassigned(!sortUnassigned);
  
    const sortedServices = [...originalServices].sort((a, b) => {
      if (sortUnassigned) {
        return a.Staff_Id ? 1 : -1; // Move unassigned tasks first
      } else {
        return a.Staff_Id ? -1 : 1; // Move assigned tasks first
      }
    });
  
    // Filter out assigned tasks after sorting by unassigned
    const filteredServices = sortedServices.filter(service => !service.Staff_Id);
  
    setServices(filteredServices);
  };
  
  const handleSortByDone = () => {
    setSortDone(!sortDone);
  
    const sortedServices = [...originalServices].sort((a, b) => {
      if (sortDone) {
        return a.Service_Status === 'Done' ? -1 : 1; // Move done tasks first
      } else {
        return a.Service_Status === 'Done' ? 1 : -1; // Move not done tasks first
      }
    });
  
    // Filter out uncompleted tasks after sorting by done
    const filteredServices = sortedServices.filter(service => service.Service_Status === 'Done');
  
    setServices(filteredServices);
  };
  

  return (
    <>
      <Header></Header>
      
      <div className="flex justify-between items-center p-4">
      <div className="flex items-center">
        <h1 className="text-4xl text-white">Services for Room {Room_Id}</h1>
      </div>
      <div className="flex flex-col items-end">
      <div className="flex space-x-2">
      <button
              className="text-white bg-gray-800 border border-gray-300 focus:outline-none hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-2 py-1 mt-4"
              onClick={toggleSortOptions}
            >
              Sort
            </button>
            </div>
      {showSortOptions && (
  
<div className="text-white absolute top-32 right-4 bg-gray-800 border border-gray-300 rounded-md shadow-md z-10">
        <button
          type="button"
          onClick={handleSortByAssigned}
          className="block w-full text-left px-4 py-2 hover:bg-gray-400"
        >
          Sort by Assigned
        </button>
        <button
    type="button"
    onClick={handleSortByUnassigned}
    className="block w-full text-left px-4 py-2 hover:bg-gray-400"
  >
    Sort by Unassigned
  </button>
        <button
          type="button"
          onClick={handleSortByDone}
          className="block w-full text-left px-4 py-2 hover:bg-gray-400"
        >
          Sort by Done
        </button>

        </div>
         )}
      </div>
      </div>
      <div className="flex flex-row m-6">
        <div
          className="mr-3 text-white"
          style={{ borderBottom: res ? '4px solid #708090' : '' }}
          onClick={() => {
            setRes(true);
            setPre(false);
            setShowPreferences(false);
          }}
        >
          Icon view
        </div>
        <div
          className="text-white"
          style={{ borderBottom: pre ? '4px solid #708090' : '' }}
          onClick={() => {
            setPre(true);
            setRes(false);
            setShowPreferences(false);
          }}
        >
          List View
        </div>
        </div>

        <div
          className="text-white"
          style={{ borderBottom: showPreferences ? ' border-b-4 border-solid border-gray-900' : '' }}
          onClick={() => {
            setRes(false);
            setPre(false);
            setShowPreferences(true);
          }}
        >
          Preferences
        </div>
      {/* </div> */}
      {res && (
        <div>
          {currentServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
              {currentServices.map((service) => (
                <ServicePageCard
                  data={service}
                  key={service.Service_Id}
                  onEditClick={handleEditClick}
                  onAssignStaff={handleAssignStaff}
                />
              ))}
              {editing && editedService && (
                <ServicePageEdit
                  data={editedService}
                  onSaveClick={handleSaveClick}
                  onCancelClick={handleCancelClick}
                />
              )}
            </div>
          ) : (
            <p className="text-white text-2xl font-bold">No data found </p>
          )}
        </div>
      )}
      {pre && (
        <div>
          {currentServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
              <ServicePageCardSimple
                services={currentServices}
                onEditClick={handleEditClick}
                onAssignStaff={handleAssignStaff}
              />
              {editing && editedService && (
                <ServicePageEdit
                  data={editedService}
                  onSaveClick={handleSaveClick}
                  onCancelClick={handleCancelClick}
                />
              )}
            </div>
          ) : (
            <p className="text-white text-2xl font-bold">No data found </p>
          )}
        </div>
      )}
      {showPreferences && 
      <ServicePagePreference 
        RoomDetails={room}
        GuestId={roomGuestId}
      />}
      <div className="flex justify-center mt-4">
        {servicesList.length > itemsPerPage && (
          <ul className="pagination">
            <li className="page-item">
              <button onClick={handlePreviousClick} className="page-link">
                Previous
              </button>
            </li>
            {[...Array(Math.ceil(servicesList.length / itemsPerPage)).keys()].map((number) => (
              <li key={number + 1} className="page-item">
                <button
                  onClick={() => paginate(number + 1)}
                  className={`page-link ${currentPage === number + 1 ? "active" : ""}`}
                >
                  {number + 1}
                </button>
              </li>
            ))}
            <li className="page-item">
              <button onClick={handleNextClick} className="page-link">
                Next
              </button>
            </li>
          </ul>
        )}
      </div>
    </>

  );
};

export default ServicePage;
