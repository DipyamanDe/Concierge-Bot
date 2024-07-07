// ServicePagePreference.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
 
const ServicePagePreference = ({RoomDetails, GuestId}) => {
  // Your content for the Preferences view goes here

  const guest_id=GuestId;
  console.log("(for preference )Guest Id is : ",guest_id)


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
    const apiUrl = `http://127.0.0.1:5000/cab_preference`;
 
    axios
      .post(apiUrl, { Guest_Id: guest_id })
      .then((response) => {
        console.log("this is response.data.Cab_Preference[0]",response.data.Cab_Preference[0])
        setCabPreferenceBasedOnData(response.data.Cab_Preference[0].Preferance_Description);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [guest_id]);
  const [book,setBook] = useState(null);
  useEffect(() => {
    const apiUrl = `http://127.0.0.1:5000/room_preference`;
 
    axios
      .post(apiUrl, { Guest_Id: guest_id })
      .then((response) => {
        setRoomPreferenceBasedOnData(response.data.Room_Preference[0].Preferance_Description);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [guest_id]);

  useEffect(() => {
    const apiUrl = `http://127.0.0.1:5000/food_preference`;
 
    axios
      .post(apiUrl, { Guest_Id: guest_id })
      .then((response) => {
        setFoodPreferenceBasedOnData(response.data.Food_Preference[0].Preferance_Description);

      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [guest_id]);

  const setCabPreferenceBasedOnData = (cabPreferences) => {
    if (cabPreferences !== null) {
      handleCabChange(true);
      const preferenceString = cabPreferences
      console.log("cab pref: ",preferenceString)

      const keyValuePairs = preferenceString.split(',');
      const extractedValues = {};

      keyValuePairs.forEach(pair => {
        const [key, value] = pair.split('-');
        const trimmedKey = key.trim();
        const trimmedValue = value.trim();
        extractedValues[trimmedKey] = trimmedValue;
      });
      console.log(extractedValues)
      setCab({
        ...cab,
        comments: extractedValues['Comments'],
        source: extractedValues['Cab Preference: Source'],
        destination: extractedValues['Destination'],
        preference:true
      })
     
    } else {
      handleCabChange(false);
    }
  };
  const setRoomPreferenceBasedOnData = (roomPreferences) => {
    if (roomPreferences !== null) {
      handleRoomChange(true);
      const roomString = roomPreferences
      console.log("room pref: ",roomString)

      const keyValuePairs = roomString.split(',');
      const extractedValues = {};

      keyValuePairs.forEach(pair => {
        const [key, value] = pair.split('-');
        const trimmedKey = key.trim();
        const trimmedValue = value.trim();
        extractedValues[trimmedKey] = trimmedValue;
      });
      console.log(extractedValues)
      console.log("true or false room :",(extractedValues['Room Preference: Extra Towel']==="true"?true:false))
      const a=(extractedValues['Room Preference: Extra Towel']==="true"?true:false)
      setRoom({
        ...room,
        preference: true,
        comments: extractedValues['Comments'],
        extraTowel: a,
        extraToiletries: (extractedValues['Extra Toiletries']==="true"?true:false),
        extraBed: (extractedValues['Extra Bed']==="true"?true:false),
        laundry: (extractedValues['Laundry']==="true"?true:false),

      });
    } else {
      handleRoomChange(false);
    }
  };
   const setFoodPreferenceBasedOnData = (foodPreferences) => {
    if (foodPreferences !== null) {
      handleFoodChange(true);
      const foodString = foodPreferences
      console.log("food pref: ",foodString)

      const keyValuePairs = foodString.split(',');
      const extractedValues = {};

      keyValuePairs.forEach(pair => {
        const [key, value] = pair.split('-');
        const trimmedKey = key.trim();
        const trimmedValue = value.trim();
        extractedValues[trimmedKey] = trimmedValue;
      });
      console.log(extractedValues)
      setFood({
        ...food,
        preference: true,
        comments: extractedValues['Comments'],
        foodType: extractedValues['Food Preference: Type'],// You can set options like "Pure Veg", "Pure Jain", "Non-veg"
        allergies:extractedValues['Allergies'],
      });
    } else {
      handleFoodChange(false);
    }
  };
  
  return (

    <div className="flex flex-col items-center p-4">

      <h1 className="text-4xl text-white mb-4">Preferences of Guest: {guest_id}</h1>
 
      {/* Cab Preferences */}

      <div className="flex flex-row justify-center m-4 space-x-4">

        <div className="bg-blue-200 rounded-lg overflow-hidden shadow-md p-4 w-60 transform transition duration-500 hover:scale-105">

          <p className="font-semibold text-lg mb-2">Cab Preferences</p>

          <p>Preference: {cab.preference ? "Yes" : "No"}</p>

          <p>Source: {cab.source}</p>

          <p>Destination: {cab.destination}</p>

          <p>Comments: {cab.comments}</p>

        </div>
 
        {/* Room Preferences */}

        <div className="bg-green-200 rounded-lg overflow-hidden shadow-md p-4 w-60 transform transition duration-500 hover:scale-105">

          <p className="font-semibold text-lg mb-2">Room Preferences</p>

          <p>Preference: {room.preference ? "Yes" : "No"}</p>

          <p>Extra Towel: {room.extraTowel ? "Yes" : "No"}</p>

          <p>Extra Toiletries: {room.extraToiletries ? "Yes" : "No"}</p>

          <p>Extra Bed: {room.extraBed ? "Yes" : "No"}</p>

          <p>Laundry: {room.laundry ? "Yes" : "No"}</p>

          <p>Comments: {room.comments}</p>

        </div>
 
        {/* Food Preferences */}

        <div className="bg-yellow-200 rounded-lg overflow-hidden shadow-md p-4 w-60 transform transition duration-500 hover:scale-105">

          <p className="font-semibold text-lg mb-2">Food Preferences</p>

          <p>Preference: {food.preference ? "Yes" : "No"}</p>

          <p>Food Type: {food.foodType}</p>

          <p>Allergies: {food.allergies}</p>

          <p>Comments: {food.comments}</p>

        </div>

      </div>

    </div>

  );


};

export default ServicePagePreference;
