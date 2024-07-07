import React, { useState, useEffect } from "react";
import axios from "axios";
import StaffServiceCard from "./StaffServiceCard";
import StaffServiceCardSimple from "./StaffServiceCardSimple";
import Header from "./HeaderStaff";
import StaffServiceEdit from "./StaffServiceEdit";



const StaffService = () => {
  const [service, setService] = useState([]);
  const Staff_Id = localStorage.getItem('Staff_Id')
  const [insert, setInsert] = useState(false);
  const [res, setRes] = useState(true);
  const [pre, setPre] = useState(false);

  
  useEffect(() => {
    const apiUrl = `http://127.0.0.1:5000/services_staff?Staff_Id=${Staff_Id}`;

    axios
      .get(apiUrl)
      .then((response) => {
        //console.log(Object.entries(response.data.Bills).map(([key, value]) => ({ [key]: value })))
        setService(response.data.ServicesData);
        console.log("hello jbjhb", response.data.ServicesData)

      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [Staff_Id]);
  const [editing, setEditing] = useState(false);
  const [editedService, setEditedService] = useState(null);

  const handleEditClick = (serviceData) => {
    setEditing(true);
    setEditedService(serviceData);
  };

  const handleSaveClick = (editedData) => {
    axios
      .put("http://127.0.0.1:5000/service_update", editedData)
      .then((response) => {
        console.log("Service updated successfully:", response.data.editedData);
        const updatedServices = service.map((service) =>
          service.Service_Id === editedData.Service_Id ? editedData : service
        );
        setService(updatedServices);
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
  
  
  const ServiceList = Array.isArray(service) ? service : [];
  return (
    <>
      <Header></Header>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-4xl text-white">Services of the staff: {ServiceList.length}</h1>
        
      </div>
      
      <div className="flex flex-row m-6">
        <div
          className="mr-3 text-white "
          style={{ borderBottom: res ? '4px solid #708090' : '' }}
          onClick={() => {
            setRes(true);
            setPre(false);
          }}
        >
          Icon view
        </div>
        <div
          className="text-white "
          style={{ borderBottom: pre ? '4px solid #708090' : '' }}
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
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-0">
        {ServiceList.map((service) => (
          <StaffServiceCard data={service}  key={service.Service_Id} onEditClick={handleEditClick} />
        ))}
        {editing && editedService && (
                <StaffServiceEdit
                  data={editedService}
                  onSaveClick={handleSaveClick}
                  onCancelClick={handleCancelClick}
                />
              )}
       
      </div>
        </div>
      )}
 
      {pre && (
        <div>
           <div className="grid grid-cols-1 sm:grid-cols-2  gap-0">
       
          <StaffServiceCardSimple service={ServiceList}  onEditClick={handleEditClick} />
        
        {editing && editedService && (
                <StaffServiceEdit
                  data={editedService}
                  onSaveClick={handleSaveClick}
                  onCancelClick={handleCancelClick}
                />
              )}
       
      </div>
        </div>
      )}

      
    </>
  );
};

export default StaffService;
