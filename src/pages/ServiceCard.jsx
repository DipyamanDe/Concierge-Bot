import React, { useState, useEffect } from 'react';

const ServiceCard = ({ data, onEditClick }) => {
  const [serviceData, setServiceData] = useState(data);

  useEffect(() => {
    setServiceData(data);
  }, [data]);

  return (
    <div style={{ 
      backgroundColor: '#2C2F33', // Changed to a dark gray color
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      border: '1px solid #23272A', // A slightly darker border for subtle contrast
      borderRadius: '8px',
      padding: '20px',
      width: '350px',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px'
    }}>
      <div style={{ 
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div>
          <div style={{ fontWeight: 'bold' }}>{serviceData.Service_Id}</div>
        </div>
        <div style={{ marginLeft: '10px' }}>
          <div style={{ fontWeight: 'bold' }}>{serviceData.Service_Name}</div>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ fontWeight: 'bold' }}>Dept: </span>
            <span>{serviceData.Service_Dept}</span>
          </div>
          <div>
            <span style={{ fontWeight: 'bold' }}>Staff: </span>
            <span>{serviceData.Staff_Id || 'Not Assigned'}</span>
          </div>
        </div>
        <div style={{ marginLeft: '10px', alignSelf: 'flex-start' }}>
          <div>{serviceData.Service_Description}</div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onEditClick(serviceData)}
        style={{
          padding: '10px 20px',
          border: '1px solid #23272A', // Match button border with card border
          backgroundColor: '#23272A', // Darker gray for the button
          color: '#fff',
          cursor: 'pointer',
          borderRadius: '4px',
          alignSelf: 'flex-end',
          fontSize: '14px'
        }}
      >
        Edit
      </button>
    </div>
  );
};

export default ServiceCard;


