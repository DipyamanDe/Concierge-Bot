// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const StaffPreference = ({ data, onCloseClick }) => {
//     const Room_Id=data.Room_Id;
//     const [guest_id, setGuestId] = useState(null);

//     useEffect(() => {
//         const apiUrl = `http://127.0.0.1:5000/get_room_details?Room_Id=${Room_Id}`;
//         axios
//           .get(apiUrl)
//           .then((response) => {
//             setGuestId(response.data.Room_Details[0].Guest_Id);
//             console.log("Guest ID is: ",response.data.Room_Details[0].Guest_Id)
//           })
//           .catch((error) => {
//             console.error("Error fetching data:", error);
//           });
//       }, [Room_Id]);

//       const [cab, setCab] = useState({
//         preference: false,
//         source: "",
//         destination: "",
//         comments: "",
//       });
     
//       const [room, setRoom] = useState({
//         preference: false,
//         extraTowel: false,
//         extraToiletries: false,
//         extraBed: false,
//         laundry: false,
//         comments: "",
//       });
     
//       const [food, setFood] = useState({
//         preference: false,
//         foodType: "", // You can set options like "Pure Veg", "Pure Jain", "Non-veg"
//         allergies: "",
//         comments: "",
//       });
    
//       const handleCabChange = (value) => {
//         setCab({
//           ...cab,
//           preference: value,
//         });
//       };
     
//       const handleRoomChange = (value) => {
//         setRoom({
//           ...room,
//           preference: value,
//         });
//       };
     
//       const handleFoodChange = (value) => {
//         setFood({
//           ...food,
//           preference: value,
//         });
//       };
    
//       useEffect(() => {
//         const apiUrl = `http://127.0.0.1:5000/cab_preference`;
     
//         axios
//           .post(apiUrl, { Guest_Id: guest_id })
//           .then((response) => {
//             console.log("this is response.data.Cab_Preference[0]",response.data.Cab_Preference[0])
//             setCabPreferenceBasedOnData(response.data.Cab_Preference[0].Preferance_Description);
//           })
//           .catch((error) => {
//             console.error("Error fetching data:", error);
//           });
//       }, [guest_id]);


//       const [book,setBook] = useState(null);


//       useEffect(() => {
//         const apiUrl = `http://127.0.0.1:5000/room_preference`;
     
//         axios
//           .post(apiUrl, { Guest_Id: guest_id })
//           .then((response) => {
//             setRoomPreferenceBasedOnData(response.data.Room_Preference[0].Preferance_Description);
//           })
//           .catch((error) => {
//             console.error("Error fetching data:", error);
//           });
//       }, [guest_id]);

      
    
//       useEffect(() => {
//         const apiUrl = `http://127.0.0.1:5000/food_preference`;
     
//         axios
//           .post(apiUrl, { Guest_Id: guest_id })
//           .then((response) => {
//             setFoodPreferenceBasedOnData(response.data.Food_Preference[0].Preferance_Description);
    
//           })
//           .catch((error) => {
//             console.error("Error fetching data:", error);
//           });
//       }, [guest_id]);
    
//       const setCabPreferenceBasedOnData = (cabPreferences) => {
//         if (cabPreferences !== null) {
//           handleCabChange(true);
//           const preferenceString = cabPreferences
//           console.log("cab pref: ",preferenceString)
    
//           const keyValuePairs = preferenceString.split(',');
//           const extractedValues = {};
    
//           keyValuePairs.forEach(pair => {
//             const [key, value] = pair.split('-');
//             const trimmedKey = key.trim();
//             const trimmedValue = value.trim();
//             extractedValues[trimmedKey] = trimmedValue;
//           });
//           console.log(extractedValues)
//           setCab({
//             ...cab,
//             comments: extractedValues['Comments'],
//             source: extractedValues['Cab Preference: Source'],
//             destination: extractedValues['Destination'],
//             preference:true
//           })
         
//         } else {
//           handleCabChange(false);
//         }
//       };
//       const setRoomPreferenceBasedOnData = (roomPreferences) => {
//         if (roomPreferences !== null) {
//           handleRoomChange(true);
//           const roomString = roomPreferences
//           console.log("room pref: ",roomString)
    
//           const keyValuePairs = roomString.split(',');
//           const extractedValues = {};
    
//           keyValuePairs.forEach(pair => {
//             const [key, value] = pair.split('-');
//             const trimmedKey = key.trim();
//             const trimmedValue = value.trim();
//             extractedValues[trimmedKey] = trimmedValue;
//           });
//           console.log(extractedValues)
//           console.log("true or false room :",(extractedValues['Room Preference: Extra Towel']==="true"?true:false))
//           const a=(extractedValues['Room Preference: Extra Towel']==="true"?true:false)
//           setRoom({
//             ...room,
//             preference: true,
//             comments: extractedValues['Comments'],
//             extraTowel: a,
//             extraToiletries: (extractedValues['Extra Toiletries']==="true"?true:false),
//             extraBed: (extractedValues['Extra Bed']==="true"?true:false),
//             laundry: (extractedValues['Laundry']==="true"?true:false),
    
//           });
//         } else {
//           handleRoomChange(false);
//         }
//       };
//        const setFoodPreferenceBasedOnData = (foodPreferences) => {
//         if (foodPreferences !== null) {
//           handleFoodChange(true);
//           const foodString = foodPreferences
//           console.log("food pref: ",foodString)
    
//           const keyValuePairs = foodString.split(',');
//           const extractedValues = {};
    
//           keyValuePairs.forEach(pair => {
//             const [key, value] = pair.split('-');
//             const trimmedKey = key.trim();
//             const trimmedValue = value.trim();
//             extractedValues[trimmedKey] = trimmedValue;
//           });
//           console.log(extractedValues)
//           setFood({
//             ...food,
//             preference: true,
//             comments: extractedValues['Comments'],
//             foodType: extractedValues['Food Preference: Type'],// You can set options like "Pure Veg", "Pure Jain", "Non-veg"
//             allergies:extractedValues['Allergies'],
//           });
//         } else {
//           handleFoodChange(false);
//         }
//       };

//       return (
//         <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-900 bg-opacity-75">
//           <div className="bg-white p-6 rounded-lg">
//             <h2 className="block text-xl font-bold text-gray-800 mb-2">Preference Details</h2>
//             <div>
//               {/* Display preference details with darker text color */}
//               {data.Service_Dept === "Cab Booking" && (
//                 <>
//                 <h4 className="block font-bold text-gray-800 mb-2">Cab Details</h4>
//                   <p className="text-gray-800">Source: {cab.source}</p>
//                   <p className="text-gray-800">Destination: {cab.destination}</p>
//                   <p className="text-gray-800">Comments: {cab.comments}</p>
//                 </>
//               )}
//               {data.Service_Dept === "Room Service" && (
//                 <>
//                 <h4 className="block font-bold text-gray-800 mb-2">Room Service Details</h4>
//                   <p className="text-gray-800">Extra Towel: {room.extraTowel.toString()}</p>
//                   <p className="text-gray-800">Extra Toileteries: {room.extraToiletries.toString()}</p>
//                   <p className="text-gray-800">Extra Bed: {room.extraBed.toString()}</p>
//                   <p className="text-gray-800">Laundry: {room.laundry.toString()}</p>
//                   <p className="text-gray-800">Comments: {room.comments}</p>

//                   {/* Add other room details accordingly */}
//                 </>
//               )}
//               {data.Service_Dept === "Dining" && (
//                 <>
//                 <h4 className="block font-bold text-gray-800 mb-2">Dining Details</h4>
//                   <p className="text-gray-800">Food Type: {food.foodType}</p>
//                   <p className="text-gray-800">Allergies: {food.allergies}</p>
//                   <p className="text-gray-800">Comments: {food.comments}</p>
//                   {/* Add other food details accordingly */}
//                 </>
//               )}
//             </div>
//             <button 
//             onClick={() => {
//                 onCloseClick();
//                 window.location.reload(); // Refresh the page
//               }}
//             className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-md mt-4"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       );
// };

// export default StaffPreference;


import React, { useEffect, useState } from "react";
import axios from "axios";

const StaffPreference = ({ data, onCloseClick }) => {
  const Room_Id = data.Room_Id;
  const [guest_id, setGuestId] = useState(null);

  useEffect(() => {
    const apiUrl = `http://127.0.0.1:5000/get_room_details?Room_Id=${Room_Id}`;
    axios
      .get(apiUrl)
      .then((response) => {
        setGuestId(response.data.Room_Details[0].Guest_Id);
        console.log("Guest ID is: ", response.data.Room_Details[0].Guest_Id);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [Room_Id]);
  const [cab, setCab] = useState({
    preference: false,
    source: "",
    destination: "",
    comments: "",
  });
  const [room, setRoom] = useState({
    preference: false,
    extraTowel: false,
    extraToiletries: false,
    extraBed: false,
    laundry: false,
    comments: "",
  });
  const [food, setFood] = useState({
    preference: false,
    foodType: "", // You can set options like "Pure Veg", "Pure Jain", "Non-veg"
    allergies: "",
    comments: "",
  });
  const handleCabChange = (value) => {
    setCab({
      ...cab,
      preference: value,
    });
  };
  const handleRoomChange = (value) => {
    setRoom({
      ...room,
      preference: value,
    });
  };
  const handleFoodChange = (value) => {
    setFood({
      ...food,
      preference: value,
    });
  };
  useEffect(() => {
    if (guest_id) {
      // Perform API call only when guest_id is available
      if (data.Service_Dept === "Cab Booking") {
        const apiUrl = `http://127.0.0.1:5000/cab_preference`;
        axios
          .post(apiUrl, { Guest_Id: guest_id })
          .then((response) => {
            console.log(
              "this is response.data.Cab_Preference[0]",
              response.data.Cab_Preference[0]
            );
            setCabPreferenceBasedOnData(
              response.data.Cab_Preference[0].Preferance_Description
            );
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      } else if (data.Service_Dept === "Room Service") {
        const apiUrl = `http://127.0.0.1:5000/room_preference`;
        axios
          .post(apiUrl, { Guest_Id: guest_id })
          .then((response) => {
            setRoomPreferenceBasedOnData(
              response.data.Room_Preference[0].Preferance_Description
            );
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      } else if (data.Service_Dept === "Dining") {
        const apiUrl = `http://127.0.0.1:5000/food_preference`;
        axios
          .post(apiUrl, { Guest_Id: guest_id })
          .then((response) => {
            setFoodPreferenceBasedOnData(
              response.data.Food_Preference[0].Preferance_Description
            );
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      }
    }
  }, [guest_id, data.Service_Dept]);

  const setCabPreferenceBasedOnData = (cabPreferences) => {
    if (cabPreferences !== null) {
      handleCabChange(true);
      const preferenceString = cabPreferences;
      console.log("cab pref: ", preferenceString);

      const keyValuePairs = preferenceString.split(",");
      const extractedValues = {};

      keyValuePairs.forEach((pair) => {
        const [key, value] = pair.split("-");
        const trimmedKey = key.trim();
        const trimmedValue = value.trim();
        extractedValues[trimmedKey] = trimmedValue;
      });
      console.log(extractedValues);
      setCab({
        ...cab,
        comments: extractedValues["Comments"],
        source: extractedValues["Cab Preference: Source"],
        destination: extractedValues["Destination"],
        preference: true,
      });
    } else {
      handleCabChange(false);
    }
  };
  const setRoomPreferenceBasedOnData = (roomPreferences) => {
    if (roomPreferences !== null) {
      handleRoomChange(true);
      const roomString = roomPreferences;
      console.log("room pref: ", roomString);

      const keyValuePairs = roomString.split(",");
      const extractedValues = {};

      keyValuePairs.forEach((pair) => {
        const [key, value] = pair.split("-");
        const trimmedKey = key.trim();
        const trimmedValue = value.trim();
        extractedValues[trimmedKey] = trimmedValue;
      });
      console.log(extractedValues);
      console.log(
        "true or false room :",
        extractedValues["Room Preference: Extra Towel"] === "true"
          ? true
          : false
      );
      const a =
        extractedValues["Room Preference: Extra Towel"] === "true" ? true : false;
      setRoom({
        ...room,
        preference: true,
        comments: extractedValues["Comments"],
        extraTowel: a,
        extraToiletries:
          extractedValues["Extra Toiletries"] === "true" ? true : false,
        extraBed: extractedValues["Extra Bed"] === "true" ? true : false,
        laundry: extractedValues["Laundry"] === "true" ? true : false,
      });
    } else {
      handleRoomChange(false);
    }
  };
  const setFoodPreferenceBasedOnData = (foodPreferences) => {
    if (foodPreferences !== null) {
      handleFoodChange(true);
      const foodString = foodPreferences;
      console.log("food pref: ", foodString);

      const keyValuePairs = foodString.split(",");
      const extractedValues = {};

      keyValuePairs.forEach((pair) => {
        const [key, value] = pair.split("-");
        const trimmedKey = key.trim();
        const trimmedValue = value.trim();
        extractedValues[trimmedKey] = trimmedValue;
      });
      console.log(extractedValues);
      setFood({
        ...food,
        preference: true,
        comments: extractedValues["Comments"],
        foodType: extractedValues["Food Preference: Type"], // You can set options like "Pure Veg", "Pure Jain", "Non-veg"
        allergies: extractedValues["Allergies"],
      });
    } else {
      handleFoodChange(false);
    }
  };
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-900 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="block text-xl font-bold text-gray-800 mb-2">
          Preference Details
        </h2>
        <div>
          {/* Display preference details with darker text color */}
          {data.Service_Dept === "Cab Booking" && (
            <>
              <h4 className="block font-bold text-gray-800 mb-2">Cab Details</h4>
              <p className="text-gray-800">Source: {cab.source}</p>
              <p className="text-gray-800">Destination: {cab.destination}</p>
              <p className="text-gray-800">Comments: {cab.comments}</p>
            </>
          )}
          {data.Service_Dept === "Room Service" && (
            <>
              <h4 className="block font-bold text-gray-800 mb-2">Room Service Details</h4>
              <p className="text-gray-800">Extra Towel: {room.extraTowel.toString()}</p>
              <p className="text-gray-800">Extra Toileteries: {room.extraToiletries.toString()}</p>
              <p className="text-gray-800">Extra Bed: {room.extraBed.toString()}</p>
              <p className="text-gray-800">Laundry: {room.laundry.toString()}</p>
              <p className="text-gray-800">Comments: {room.comments}</p>
              {/* Add other room details accordingly */}
            </>
          )}
          {data.Service_Dept === "Dining" && (
            <>
              <h4 className="block font-bold text-gray-800 mb-2">Dining Details</h4>
              <p className="text-gray-800">Food Type: {food.foodType}</p>
              <p className="text-gray-800">Allergies: {food.allergies}</p>
              <p className="text-gray-800">Comments: {food.comments}</p>
              {/* Add other food details accordingly */}
            </>
          )}
        </div>
        <button
          onClick={() => {
            onCloseClick();
            //window.location.reload(); // Refresh the page
          }}
          className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-md mt-4"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default StaffPreference;
