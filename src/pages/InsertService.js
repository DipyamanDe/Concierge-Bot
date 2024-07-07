// function InsertService({handleInsertCancelClick}){
//     const handleCancel = () => {
//         handleInsertCancelClick();
//       };
//     const [editedData, setEditedData] = useState(data);
//     return(
//         <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-900 bg-opacity-75">
//       <div className="bg-white p-6 rounded-lg">
//         <h2 className="block text-xl font-bold text-black-700 mb-2">Add Service</h2>
//         <form>
//           <div className="mb-4">
//             <label htmlFor="Service_Name" className="block text-sm font-medium text-gray-700">Service Name</label>
//             <input
//               type="text"
//               id="Service_Name"
//             //   value={editedData.Service_Name}
//             //   onChange={(e) => setEditedData({ ...editedData, Service_Name: e.target.value })}
//               className="mt-1 p-2 w-full border rounded-md"
//             />
//           </div>
          
//           <div className="mb-4">
//             <label htmlFor="Service_Dept" className="block text-sm font-medium text-gray-700">Department</label>
//             <input
//               type="text"
//               id="Service_Dept"
//             //   value={editedData.Service_Dept}
//             //   onChange={(e) => setEditedData({ ...editedData, Service_Dept: e.target.value })}
//               className="mt-1 p-2 w-full border rounded-md"
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="Service_Status" className="block text-sm font-medium text-gray-700">Status</label>
//             <input
//               type="text"
//               id="Service_Status"
//             //   value={editedData.Service_Status}
//             //   onChange={(e) => setEditedData({ ...editedData, Service_Status: e.target.value })}
//               className="mt-1 p-2 w-full border rounded-md"
//             />
//           </div>
//         </form>
//         <button   className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md mr-2"
//           >Save</button>
//         <button onClick={handleCancel} className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-md mr-2"
//           >Cancel</button>
//       </div>
//     </div>
//     )
// }
// export default InsertService;

import React, { useEffect, useState } from "react";
import axios from "axios";

function InsertService({ handleInsertCancelClick }) {
  const [room,setRoom] =useState([])
  
  const [formData, setFormData] = useState({
    
    Service_Name: '',
    Service_Dept: '',
    Service_Status: 'Not Done',
    Service_Description:'',
    Room_Id:''
  });

  const guest_id = localStorage.getItem('Guest_Id');

  useEffect(() => {
    const apiUrl = "http://127.0.0.1:5000/guest_room";
    if(guest_id ){
      axios
      .post(apiUrl, {'Guest_Id':guest_id})
      .then((response) => {
        setRoom(response.data.Roomdata[0].Room_Id);
        console.log(response.data);
        // setLoading(false); // Set loading to false when data is fetched
        console.log("API Response:", response.data.Roomdata);
        
        setFormData({ ...formData, Room_Id: response.data.Roomdata[0].Room_Id });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    }
  }, [guest_id]);

  const handleCancel = () => {
    handleInsertCancelClick();
  };

  
  const handleInsert = () => {
    console.log('Form Data:', formData); // Add this line to log the formData

    axios
      .post('http://127.0.0.1:5000/insert_service', formData)
      .then((response) => {
        console.log('Inserted data:', response.data);
      })
      .catch((error) => {
        console.log('Error:', error);
      });
    setFormData({ Service_Name: '', Service_Dept: '', Service_Status: 'Not Done', Service_Description:'', Room_Id: room });
    handleCancel();
    // function refreshPage() {
    //   window.location.reload(false);
    // }
    // refreshPage();
    setTimeout(() => {
      
      window.location.reload(false);
    }, 2000);
  };
  
  // const guest_id = localStorage.getItem('Guest_Id');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value); // Add this line to log the values
    setFormData({ ...formData, [name]: value });
  };
  

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-900 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="block text-xl font-bold text-black-700 mb-2">Add Service</h2>
        <form>
          
          <div className="mb-4">
            <label htmlFor="Service_Name" className="block text-sm font-medium text-gray-700">Service Name</label>
            <input
              type="text"
              name="Service_Name"
              value={formData.Service_Name}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          
           

          

          <div className="mb-4">
            <label htmlFor="Service_Dept" className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              id="Service_Dept"
              name="Service_Dept"
              value={formData.Service_Dept}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
            >
            <option>Select Service Dept</option>
              <option value="Cab Booking">Cab Booking</option>
              <option value="Room Service">Room Service</option>
              <option value="Dining">Dining</option>
              <option value="Other Bookings">Other Bookings</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="Service_Description" className="block text-sm font-medium text-gray-700">Anything to be specified</label>
            <input
              type="text"
              name="Service_Description"
              value={formData.Service_Description}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          
        </form>
        <button
          onClick={handleInsert}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md mr-2"
        >
          Add
        </button>
        <button
          onClick={handleCancel}
          className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default InsertService;
