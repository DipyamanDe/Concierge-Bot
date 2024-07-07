import Header from "./HeaderUser";
import ChatMainPage from "./ChatMainPage";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Modal = ({ onClose, onLoginClick }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    }}
  >
    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <p 
      style={{
        
        margin: "2px",}}
        > Not logged in</p>
      <button
        style={{
          backgroundColor:"green",
          padding: "5px 10px",
          margin: "5px",
          fontSize: "14px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={onLoginClick}
      >
        Go to Login
      </button>
      {/* <button
        style={{
          backgroundColor:"red",
          padding: "5px 10px",
          margin: "5px",
          fontSize: "14px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={onClose}
      >
        Close
      </button> */}
    </div>
  </div>
);
const RedirectModal = ({ onClose, onRedirectHomeClick }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    }}
  >
    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <p style={{ margin: "2px" }}>No room booked!!</p>
      <button
        style={{
          backgroundColor: "green",
          padding: "5px 10px",
          margin: "5px",
          fontSize: "14px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={onRedirectHomeClick}
      >
        Go to Home
      </button>
      {/* <button
        style={{
          backgroundColor: "red",
          padding: "5px 10px",
          margin: "5px",
          fontSize: "14px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={onClose}
      >
        Close
      </button> */}
    </div>
  </div>
);
function Precheckin() {
  const [chatOpen, setChatOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [bookedRoomId, setBookedRoomId] = useState(null);
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const guestId = localStorage.getItem("Guest_Id");

  const handleLoginClick = () => {
    setRedirectToLogin(true);
    setShowModal1(false);
  };

  useEffect(() => {
    const apiUrl = `http://127.0.0.1:5000/check_prev_Book`;
    axios
      .post(apiUrl,{"Guest_Id":guestId})
      .then((response) => {
        console.log(response.data.Prev_Booking_data)
        setBookedRoomId(response.data.Prev_Booking_data);
        
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [guestId]);

  const navigate = useNavigate();


  useEffect(() => {
    // Check if Guest_Id exists in local storage
    // If Guest_Id is present but bookedRoomId is missing, show redirect modal
    console.log("running----->",guestId ,"  ", bookedRoomId)
    if (guestId && !bookedRoomId) {
      setShowRedirectModal(true);
    } else if (!guestId && !redirectToLogin) {
      // If not logged in, show modal
      // setShowModal(true);
    } else if (!guestId && redirectToLogin) {
      // If not logged in and user clicked "Go to Login"
      navigate("/login");
    }
    else{
      setShowRedirectModal(false);
      setShowModal(false);
    }
  }, [navigate, redirectToLogin, bookedRoomId,guestId]);


  const openModal = () => {
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    window.location.reload();
  };
  const [cab, setCab] = useState({
    preference: false,
    source: "",
    destination: "",
    cabType:"",
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
 
 
  // Handle changes in preferences
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
 
 
  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };
  const [guest, setGuest] = useState('');
  const [gender,setGender] = useState('');
  const [num,setNum] = useState('');
  const [address,setAddress] = useState('');
  const [email,setEmail] = useState('');
  const [preferences, setPreferences] = useState({});
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  // const [guest, setGuest] = useState([]);
  const [cabPreferences, setCabPreferences] = useState({});
  const [roomPreferences, setRoomPreferences] = useState({});
  const [foodPreferences, setFoodPreferences] = useState({});

  const [roomData, setRooms] = useState({});

  const guest_id = localStorage.getItem("Guest_Id");
  
  useEffect(() => {
    const apiUrl = `http://127.0.0.1:5000/post_guest`;
 
    axios
      .post(apiUrl, { Guest_Id: guest_id })
      .then((response) => {
        setGuest(response.data.Guest_Details[0]);
        setGender(response.data.Guest_Details[0].Guest_Gender);
        setNum(response.data.Guest_Details[0].Guest_Phone_Number);
        setAddress(response.data.Guest_Details[0].Guest_address);
        setEmail(response.data.Guest_Details[0].Guest_email);

      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [guest_id]);


  // Add a new state for the ID proof file
  const [idProofFile, setIdProofFile] = useState(null);

  // Modify the handleFileChange function to handle the ID proof file upload
  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("Guest_Id", guest_id); // Include Guest_Id in the request
      formData.append("filename", file.name);

      const apiUrl = "http://127.0.0.1:5000/upload_id_proof"; // Replace with your actual API URL

      const response = await axios.put(apiUrl, formData, {
        headers: {

      // O]ptionally, you can handle success or show a confirmation message}
         }})  
         window.location.reload();
        }
    catch (error) {
      console.error("Error uploading file:", error);
      // Handle error, show error message, etc.
    }
  };

  useEffect(() => {
    const apiUrl = `http://127.0.0.1:5000/cab_preference`;
 
    axios
      .post(apiUrl, { Guest_Id: guest_id })
      .then((response) => {
        setCabPreferences(response.data.Cab_Preference[0]);
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
        setRoomPreferences(response.data.Room_Preference[0]);
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
        setFoodPreferences(response.data.Food_Preference[0]);
        setFoodPreferenceBasedOnData(response.data.Food_Preference[0].Preferance_Description);

      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [guest_id]);



  // const [cab_source, setcab_source] = useState('');
  // const [cab_destination, setcab_destination] = useState('');
  // const [cab_comments, setcab_comments] = useState('');

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
        cabType: extractedValues['CabType'],
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
   

  // Call the function in useEffect or any other appropriate place
  // useEffect(() => {
  //   setCabPreferenceBasedOnData();
  // }, [cabPreferences]);
  // useEffect(() => {
  //   setFoodPreferenceBasedOnData();
  // }, [foodPreferences]);
  // useEffect(() => {
  //   setRoomPreferenceBasedOnData();
  // }, [roomPreferences]);

  useEffect(() => {
   
    const apiUrl = `http://127.0.0.1:5000/booking`;

    axios
      .post(apiUrl, { Guest_Id: guest_id })
      .then((response) => {
        const firstRoom = response.data.Booking_data[0];
        setBook(firstRoom);
        setCheckin(firstRoom.CheckIn_Time)
        setCheckout(firstRoom.CheckOut_Time)
        axios
        .post(`http://127.0.0.1:5000/id_room`, { Room_Id: firstRoom.Room_Id })
        .then((response) => {
          const Room = response.data.Roomdata[0];
          setRooms(Room);
        })
        .catch((error) => {
          console.error("Error fetching room details data:", error);
        });
        console.log(firstRoom)
      })
      .catch((error) => {
        console.error("Error fetching room details data:", error);
      });
  }, [guest_id]);

  

  const handleSaveChanges = async (event) => {
    event.preventDefault();
 
    // Create strings for cab, room, and food details
    const cabDetails = cab.preference
      ? `Cab Preference: Source - ${cab.source}, Destination - ${cab.destination}, CabType - ${cab.cabType} , Comments - ${cab.comments}`
      : "Cab Preference: No preference";
 
    const roomDetails = room.preference
      ? `Room Preference: Extra Towel - ${room.extraTowel}, Extra Toiletries - ${room.extraToiletries}, Extra Bed - ${room.extraBed}, Laundry - ${room.laundry}, Comments - ${room.comments}`
      : "Room Preference: No preference";
 
    const foodDetails = food.preference
      ? `Food Preference: Type - ${food.foodType}, Allergies - ${food.allergies}, Comments - ${food.comments}`
      : "Food Preference: No preference";
 
    // Display or use the created strings as needed
    console.log("Cab Details:", cabDetails);
    console.log("Room Details:", roomDetails);
    console.log("Food Details:", foodDetails);
 
 
    try {
      const apiUrl = "http://127.0.0.1:5000/update_preferences"; // Replace with your actual API URL
 
      // Make API call for cab preferences
      if (cab.preference) {
        await axios.put(apiUrl, {
          Guest_Id: guest_id, // Assuming guest_id is available in your component
          Preferance_Type: "Cab Preference",
          Preferance_Description: cabDetails,
        });
      }
      if (!cab.preference) {
        await axios.put(apiUrl, {
          Guest_Id: guest_id, // Assuming guest_id is available in your component
          Preferance_Type: "Cab Preference",
          Preferance_Description: null,
        });
      }
      // Make API call for room preferences
      if (room.preference) {
        await axios.put(apiUrl, {
          Guest_Id: guest_id,
          Preferance_Type: "Room Preference",
          Preferance_Description: roomDetails,
        });
      }
      if (!room.preference) {
        await axios.put(apiUrl, {
          Guest_Id: guest_id,
          Preferance_Type: "Room Preference",
          Preferance_Description: null,
        });
      }
 
      // Make API call for food preferences
      if (food.preference) {
        await axios.put(apiUrl, {
          Guest_Id: guest_id,
          Preferance_Type: "Food Preference",
          Preferance_Description: foodDetails,
        });
      }
      if (!food.preference) {
        await axios.put(apiUrl, {
          Guest_Id: guest_id,
          Preferance_Type: "Food Preference",
          Preferance_Description: null,
        });
      }
 
      // Optionally, you can handle success or show a confirmation message
      console.log("Preferences updated successfully!");
    
   
       // Close the modal and reload the page
      closeModal();
     // Reload the page after 10 seconds
     
     
    // 10000 milliseconds = 10 seconds
    } catch (error) {
      console.error("Error inserting preferences:", error);
      // Handle error, show error message, etc.
    }
   
 
  };
  const format=(date)=>{
    return  new Date(date).toISOString().slice(0, 10);
  }

  return (
    <div className=" p-0 mb-0">
      <Header></Header>
 
      <div className="w-auto h-auto flex  justify-center m-5 font-serif ">
        <div className="border-2 border-zinc-600 p-10 rounded-md w-[50%] bg-[#fdf5ed] opacity-90">
          <h1 className="text-4xl text-center ">Pre-Check in</h1>
          <div className="my-6">
            <label className="mr-3 ">Room No. : {roomData ? roomData.Room_Number : "Not Assigned"}</label>
            <label>Room type : {roomData ? roomData.Room_Type : "Not Assigned"}</label>
          </div>
          <form>
            <div className="flex flex-col gap-4">
              <div className="inputty  flex flex-row">
                <div className=" self-center w-[30%]">Name :</div>
                <input
                  className="w-[50%]"
                  placeholder="Enter Your Name"
                  value={guest.Guest_Name}
                  onChange={(event)=>setGuest(event.target.value)}
                ></input>
              </div>
              <div className="inputty  flex flex-row">
                <div className=" w-[30%]">Gender :</div>
                <div className="w-[50%] ">
                  <label className="mr-2" name="gender" id="male" value="Male">
                    Male
                  </label>
                  <input
                    type="radio"
                    name="gender"
                    checked={gender === "Male"? "Male":false }
                    onChange={(event)=>setGender(event.target.value)}
                  ></input>
                  <label
                    name="gender"
                    className="mr-2"
                    id="female"
                    value="Female"
                  >
                    Female
                  </label>
                  <input
                    type="radio"
                    name="gender"
                    checked={gender === "Female"?"Female":false}
                    onChange={(event)=>setGender(event.target.value)}
                  ></input>
                </div>
              </div>
              <div className="inputty  flex flex-row">
                <div className=" self-center w-[30%]">Phone no. :</div>
                <input
                  placeholder="Enter Your Phone number"
                  value={num}
                  onChange={(event)=>setNum(event.target.value)}
                ></input>
              </div>
              <div className="inputty  flex flex-row">
                <div className=" self-center w-[30%]">Address :</div>
                <input
                  placeholder="Enter Your Address"
                  value={address}
                  onChange={(event)=>setAddress(event.target.value)}
                ></input>
              </div>
 
              <div className="inputty  flex flex-row">
                <div className=" self-center w-[30%]">Email :</div>
                <div className="texty bg-gray-200 text-gray-600">
                  {" "}
                  {email}
                </div>
              </div>
              <div>
                <span className="mb-2">Your stay is From :</span>
                <div date-rangepicker class="flex items-center">
                  <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg
                        class="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                      </svg>
                    </div>
                    <input
                      name="start"
                      type="date"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Select date start"
                      // value={() => {
                      //   const dateValue = guest.Guest_CheckIn_Time ? new Date(guest.Guest_CheckIn_Time) : null;
                      //   console.log(dateValue); // Add this line to log the value
                      //   return dateValue ? dateValue.toLocaleString() : '';
                      // }}
                      // value={()=>{
                      //   console.log(guest.Guest_CheckIn_Time)
                      //   return guest.Guest_CheckIn_Time}}
                      value={checkin?format(checkin):''}
                    />
                  </div>
                  <span class="mx-4 text-gray-500">to</span>
                  <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg
                        class="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                      </svg>
                    </div>
                    <input
                      name="end"
                      type="date"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Select date end"
                      // value={() => {
                      //   const dateValue = guest.Guest_CheckOut_Time ? new Date(guest.Guest_CheckOut_Time) : null;
                      //   console.log("date value is:",dateValue); // Add this line to log the value
                      //   return dateValue ? dateValue.toLocaleString() : '';
                      // }}
                      value={checkout?format(checkout):''}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center gap-4">
  <div>Upload your ID for checking-in:</div>
  <div className="flex w-[70%]">
    {guest.Id_Proof ? (
      <label className="flex flex-col w-full h-[60%] bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 border-dashed rounded-lg">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
            fill="currentColor"
            d="M3 0h14a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3zm2 2v2h10V2H5zm0 4v2h10V6H5zm0 4v2h7V10H5zm0 4v2h7v-2H5z"
          
              // stroke="currentColor"
              // strokeLinecap="round"
              // strokeLinejoin="round"
              // strokeWidth="2"
              // d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            {guest.Id_Proof_Filename}
          </p>
        </div>
        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
      </label>
    ) : (
      <label
        htmlFor="dropzone-file"
        className="flex flex-col w-full h-[60%] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            SVG, PNG, JPG or GIF (MAX. 800x400px)
          </p>
        </div>
        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
      </label>
    )}
  </div>
  {/* {console.log(guest.Id_Proof)} */}
  <div className={`mb-2 text-sm font-semibold ${guest.Id_Proof  ? 'text-green-500' : 'text-red-500'}`}>
    {guest.Id_Proof ? 'ID proof uploaded' : 'Please upload ID proof'}
  </div>
</div>


              {/* <div className="flex flex-col justify-center items-center gap-4">
                <div>Upload your ID for checking-in:</div>
                {!guest.Id_Proof && (<div class="flex w-[70%] ">
                  <label
                    for="dropzone-file"
                    class="flex flex-col  w-full h-[60%] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span class="font-semibold">Click to upload</span> or
                        drag and drop
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <input id="dropzone-file" type="file" class="hidden" onChange={handleFileChange}/>
                  </label>
                </div>)}
                <div className={`mb-2 text-sm font-semibold ${guest.Id_Proof ? 'text-green-500' : 'text-red-500'}`}>
                  {guest.Id_Proof ? 'ID proof uploaded' : 'Please upload ID proof'}
                </div>
              </div> */}
 
 
              {/* CAB PREFERENCE */}
 
 
 
 
              <div className="flex flex-row">
                <div className=" w-[30%]">Cab Preference :</div>
                <div className="w-[50%] ">
                  <label className="mr-2" name="Cabpreference" id="yes">
                    Yes
                  </label>
                  <input
                    type="radio"
                    name="Cabpreference"
                    id="yes"
                    checked={cab.preference}
                    onClick={() => handleCabChange(true)}
                  ></input>
                  <label name="Cab Preference" className="mr-2" id="no">
                    No
                  </label>
                  <input
                    type="radio"
                    name="Cabpreference"
                    id="no"
                    checked={!cab.preference}
                    onClick={() => handleCabChange(false)}
                  ></input>
                </div>
              </div>

              {/* <div className="flex flex-row">
  <div className="w-[30%]">Cab Preference :</div>
  <div className="w-[50%]">
    <label className="mr-2" htmlFor="yes">
      Yes
    </label>
    <input
      type="radio"
      name="Cabpreference"
      id="yes"
      checked={cabPreferences.Preferance_Description !== null}
      onChange={() => handleCabChange(true)}
    />
    <label className="mr-2" htmlFor="no">
      No
    </label>
    <input
      type="radio"
      name="Cabpreference"
      id="no"
      checked={cabPreferences.Preferance_Description === null}
      onChange={() => handleCabChange(false)}
    />
  </div>
</div> */}
 
              {cab.preference && (
                <div className="text-sm border-2 p-2 gap-3 flex flex-col rounded-md border-zinc-600 ">
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col gap-1">
                      <span>From:</span>
                      <input
                        type="text"
                        className="w-full"
                        placeholder="Source"
                        value={cab.source}
                        onChange={(e) =>
                          setCab({
                            ...cab,
                            source: e.target.value,
                          })
                        }
                      ></input>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span>To:</span>
                      <input
                        type="text"
                        className="w-full"
                        placeholder="Destination"
                        value={cab.destination}
                        onChange={(e) =>
                          setCab({
                            ...cab,
                            destination: e.target.value,
                          })
                        }
                      ></input>
                    </div>
                  </div>

                  <div className="flex flex-row ">
                    <div className="w-[60%]">Cab Type :</div>
                    <div className="w-[30%]">
                      <select
                        className="border-gray-500 w-full"
                        value={cab.cabType}
                        onChange={(e) =>
                          setCab({
                            ...cab,
                            cabType: e.target.value,
                          })
                        }
                      >
                        {/* <option value="">Select</option> */}
                        <option value="No Preference">No Preference</option>
                        <option value="Ola (24 rs/km)">Ola (24 rs/km)</option>
                        <option value="Uber (21 rs/km)">Uber (21 rs/km)</option>
                        <option value="Snap E (18 rs/km)">Snap E (18 rs/km)</option>
                      </select>
                    </div>
                  </div>

                  <div className=" flex flex-row ">
                    <span className="w-[30%] text-sm flex flex-row self-end">
                      Anything extra you want to notify us?
                    </span>
                    <input
                      className=" w-[70%] h-[20%] border-gray-500 "
                      type="text"
                      value={cab.comments}
                      onChange={(e) =>
                        setCab({
                          ...cab,
                          comments: e.target.value,
                        })
                      }
                    ></input>
                  </div>
                </div>
              )}
 
 
              {/* ROOM PREFERENCE */}
 
              <div className="flex flex-row">
                <div className=" w-[30%]">Room Preference :</div>
                <div className="w-[50%] ">
                  <label className="mr-2" name="Roompreference" id="yes">
                    Yes
                  </label>
                  <input
                    type="radio"
                    name="Roompreference"
                    id="yes"
                    checked={room.preference}
                    onClick={() => handleRoomChange(true)}
                  ></input>
                  <label name="Roompreference" className="mr-2" id="no">
                    No
                  </label>
                  <input
                    type="radio"
                    name="Roompreference"
                    id="no"
                    checked={!room.preference}
                    onClick={() => handleRoomChange(false)}
                  ></input>
                </div>
              </div>
              {room.preference && (
                <div className="text-sm border-2 p-2 gap-3 flex flex-col rounded-md border-zinc-600 ">
                 
                  <div className="flex flex-row ">
                    <div className="w-[60%]">Do you want an extra towel?</div>
                    <div className="w-[30%]">
                      <label name="towel" className="mr-2">
                        Yes
                      </label>
                      <input type="radio" name="towel" checked={room.extraTowel}
                        onClick={() =>
                          setRoom({
                            ...room,
                            extraTowel: true,
                          })
                        }></input>
                      <label name="towel" className="mr-2">
                        No
                      </label>
                      <input type="radio" name="towel" checked={!room.extraTowel}
                        onClick={() =>
                          setRoom({
                            ...room,
                            extraTowel: false,
                          })
                        }></input>
                    </div>
                  </div>
 
                  <div className="flex flex-row ">
                    <div className="w-[60%]">
                      Do you want some extra toiletries?
                    </div>
                    <div className="w-[30%]">
                      <label name="toiletries" className="mr-2">
                        Yes
                      </label>
                      <input type="radio" name="toiletries" checked={room.extraToiletries}onClick={() =>
                        setRoom({
                          ...room,
                          extraToiletries: true,
                        })
                      }></input>
                      <label name="toiletries" className="mr-2">
                        No
                      </label>
                      <input type="radio" name="toiletries" checked={!room.extraToiletries}onClick={() =>
                        setRoom({
                          ...room,
                          extraToiletries: false,
                        })
                      }></input>
                    </div>
                  </div>
 
                  <div className="flex flex-row ">
                    <div className="w-[60%]">Do you want an extra bed?</div>
                    <div className="w-[30%]">
                      <label name="bed" className="mr-2">
                        Yes
                      </label>
                      <input type="radio" name="bed" checked={room.extraBed}onClick={() =>
                        setRoom({
                          ...room,
                          extraBed: true,
                        })
                      }></input>
                      <label name="bed" className="mr-2">
                        No
                      </label>
                      <input type="radio" name="bed" checked={!room.extraBed}onClick={() =>
                        setRoom({
                          ...room,
                          extraBed: false,
                        })
                      }></input>
                    </div>
                  </div>
                  <div className="flex flex-row ">
                    <div className="w-[60%]">
                      Do you want your laundry to be done?
                    </div>
                    <div className="w-[30%]">
                      <label name="laundry" className="mr-2">
                        Yes
                      </label>
                      <input type="radio" name="laundry" checked={room.laundry}onClick={() =>
                        setRoom({
                          ...room,
                          laundry: true,
                        })
                      }></input>
                      <label name="laundry" className="mr-2">
                        No
                      </label>
                      <input type="radio" name="laundry" checked={!room.laundry}onClick={() =>
                        setRoom({
                          ...room,
                          laundry: false,
                        })
                      }></input>
                    </div>
                  </div>
                  <div className=" flex flex-row ">
                    <span className="w-[30%] text-sm flex flex-row self-end">
                      Anything extra you want to notify us?
                    </span>
                    <input
                      className=" w-[70%] h-[20%] border-gray-500 "
                      type="text"
                      value={room.comments}
                      onChange={(e) =>
                        setRoom({
                          ...room,
                          comments: e.target.value,
                        })
                      }
                    ></input>
                  </div>
                </div>
              )}
 
 
 
              {/* FOOD PREFERENCE  */}
 
              <div className="flex flex-row">
                <div className=" w-[30%]">Food Preference :</div>
                <div className="w-[50%] ">
                  <label className="mr-2" name="Foodpreference" id="yes">
                    Yes
                  </label>
                  <input
                    type="radio"
                    name="Foodpreference"
                    id="yes"
                    checked={food.preference}
                    onClick={() => handleFoodChange(true)}
                  ></input>
                  <label name="Foodpreference" className="mr-2" id="no">
                    No
                  </label>
                  <input
                    type="radio"
                    name="Foodpreference"
                    id="no"
                    checked={!food.preference}
                    onClick={() => handleFoodChange(false)}
                  ></input>
                </div>
              </div>
 
              {food.preference && (
                <div className="text-sm border-2 p-2 gap-3 flex flex-col rounded-md border-gray-700 ">
                  <div className="flex flex-row ">
                    <div className="w-[60%]">Food Type :</div>
                    <div className="w-[30%]">
                      <select
                        className="border-gray-500 w-full"
                        value={food.foodType}
                        onChange={(e) =>
                          setFood({
                            ...food,
                            foodType: e.target.value,
                          })
                        }
                      >
                        {/* <option value="">Select</option> */}
                        <option value="No Preference">No Preference</option>
                        <option value="Pure Veg">Pure Veg</option>
                        <option value="Pure Jain">Pure Jain</option>
                        <option value="Non Veg">Non Veg</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <span className="w-[30%] text-sm flex flex-row self-end">
                      Any Allergies that we should know?
                    </span>
                    <input
                      className=" w-[70%] h-[20%] border-gray-500 "
                      type="text"
                      value={food.allergies}
                      onChange={(e) =>
                        setFood({
                          ...food,
                          allergies: e.target.value,
                        })
                      }
                    ></input>
                  </div>
                  <div className="flex flex-row">
                    <span className="w-[30%] text-sm flex flex-row self-end">
                      Anything extra you want to notify us?
                    </span>
                    <input
                      className=" w-[70%] h-[20%] border-gray-500 "
                      type="text"
                      value={food.comments}
                      onChange={(e) =>
                        setFood({
                          ...food,
                          comments: e.target.value,
                        })
                      }
                    ></input>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end items-end">
              <button
                onClick={(event) => {handleSaveChanges(event); openModal();}}
                class="h-10 px-5 m-2 text-green-100 transition-colors duration-150 bg-green-700 rounded-lg focus:shadow-outline hover:bg-green-800 flex self-end">
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "0",
          right: "0",
          marginRight: "20px",
          marginBottom: "20px",
        }}
      >
        <button
          className="p-3 bg-opacity-50"
          onClick={toggleChat}
          style={{ borderRadius: "50%" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
        </button>
      </div>
      {showModal1 && (
  <Modal
    onClose={() => setShowModal1(false)}
    onLoginClick={handleLoginClick}
  />
)} 
      {chatOpen && (
        <div style={{ marginLeft: "20px" }}>
          <ChatMainPage />
        </div>
      )}
      {showRedirectModal && (
        <RedirectModal
          onClose={() => setShowRedirectModal(false)}
          onRedirectHomeClick={() => {
            navigate("/");
            setShowRedirectModal(false);
          }}
        />
      )}
      {showModal && (
  <div className="modal-overlay">
    <div className="modal-content modal">
      <div className="modal-box">
        <p>Changes saved!</p>
        <button onClick={closeModal} className="modal-button">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>

        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
}
export default Precheckin;