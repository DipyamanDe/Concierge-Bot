import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
// import CabModalCompoent from './CabModalComponent';
const HotelDashboard = () => {
  const guest_id = localStorage.getItem('Guest_Id');
  console.log(guest_id)
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city,setCity] = useState('');
  const [cities,setCities] = useState([]);
  const [state,setState] = useState('');
  const [hotelName,setHotelName] = useState('');
  const [hotelNames,setHotelNames] = useState([]);
  const [availableRooms,setAvailableRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [bookedHotelId, setBookedHotelId] = useState(null);
  const [booking,setBooking]=useState([])
  const bookingIds = Array.isArray(booking) ? booking.map((bookingItem) => bookingItem.Booking_Id) : [];

   //const bookingIds = booking.map((bookingItem) => bookingItem.Booking_Id);
  // const guest_Id = localStorage.getItem('Guest_Id')
  const guest_email = localStorage.getItem('Guest_email')
const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
const [bookingGenerated, setBookingGenerated] = useState(false);
const [showBillingModal, setShowBillingModal] = useState(false);

// ... (existing code)

const openBillingModal = () => {
  setShowBillingModal(true);
};

const closeBillingModal = () => {
  setShowBillingModal(false);
  // Optionally, you can navigate back to the home page here
  // navigate('/home');
};

const handlePayNow = async () => {
  try {
    const updateResponse = await axios.put('http://127.0.0.1:5000/billing/update_latest');
// Handle the response from the update request
console.log("Update response:", updateResponse.data);

        // // Make an API call to create a new billing entry
    // const billingResponse = await axios.post('http://127.0.0.1:5000/create_billing', {
    //   Order_Name: 'Hotel Bill',
    //   Order_Department: 'Hotel',
    //   Order_Price: 10000,
    //   Billing_Status: 'Paid',
    //   Guest_Id: guest_id,
    // });
    const booking= await axios.post('http://127.0.0.1:5000/booking',{
            Guest_Id: guest_id
          });
          const sortedBooking = booking.data.Booking_data.sort((a, b) => {
            const dateA = new Date(a.CheckIn_Time).getTime();
            const dateB = new Date(b.CheckIn_Time).getTime();
            return dateA - dateB;
          });
          console.log("Booking data --->",sortedBooking)
          const room_id=sortedBooking[0].Room_Id
    const services= await axios.post('http://127.0.0.1:5000/insert_service',{
      Room_Id: room_id,
      Service_Name: "Booking Hotel",
      Service_Dept: "Booking",
      Service_Status: "Done" ,
      Service_Description: "Service booked from booking"
    });

    const service_id=services.data.service_id

    const reservationResponse = await axios.post('http://127.0.0.1:5000/create_reservation', {
      Reservation_Type: "Booking Hotel",
      Reservation_Status: 'Booked', // Assuming this is the status for booked entries
      Reservation_Description:  "Booking Hotel (From Booking)", // Replace with the actual value
      Service_Id: service_id, // Replace with the actual value
    });
    // // Handle the response, e.g., show a success message
    // console.log("Billing created successfully:", billingResponse.data);

    // Close the billing modal
    closeBillingModal();
    setShowModal(false);
  } catch (error) {
    // Handle the error, e.g., show an error message
    console.error("Error creating billing:", error);
  }
};
const handlePayLater = async () => {
  try {
    // Make an API call to create a new billing entry
    // const billingResponse = await axios.post('http://127.0.0.1:5000/create_billing', {
    //   Order_Name: 'Hotel Bill',
    //   Order_Department: 'Hotel',
    //   Order_Price: 10000,
    //   Billing_Status: 'Not Paid',
    //   Guest_Id: guest_id,
    // });
    const booking= await axios.post('http://127.0.0.1:5000/booking',{
            Guest_Id: guest_id
          });
          const sortedBooking = booking.data.Booking_data.sort((a, b) => {
            const dateA = new Date(a.CheckIn_Time).getTime();
            const dateB = new Date(b.CheckIn_Time).getTime();
            return dateA - dateB;
          });
          console.log("Booking data --->",sortedBooking)
          const room_id=sortedBooking[0].Room_Id
const services= await axios.post('http://127.0.0.1:5000/insert_service',{
      Room_Id: room_id,
      Service_Name: "Booking hotel",
      Service_Dept: "Booking",
      Service_Status: "Done" ,
      Service_Description: "Service booked from booking"
    });

    const service_id=services.data.service_id
    
    const reservationResponse = await axios.post('http://127.0.0.1:5000/create_reservation', {
      Reservation_Type: "Booking hotel",
      Reservation_Status: 'Booked', // Assuming this is the status for booked entries
      Reservation_Description: "Booking Hotel (From Booking)", // Replace with the actual value
      Service_Id: service_id, // Replace with the actual value
    });
    // // Handle the response, e.g., show a success message
    // console.log("Billing created successfully:", billingResponse.data);

    // Close the billing modal
    closeBillingModal();
    setShowModal(false);
  } catch (error) {
    // Handle the error, e.g., show an error message
    console.error("Error creating billing:", error);
  }
};
 
  const openModal = () => {
    setShowModal(true);
  };
 
  const closeModal = () => {
    setShowModal(false);
  };
 
 //cab 


  useEffect(() => {
    const apiUrl = "http://127.0.0.1:5000/hotel";
    axios
      .get(apiUrl)
      .then((response) => {
        setHotels(response.data.Hotels);
        setLoading(false); // Set loading to false when data is fetched
        // console.log("API Response:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false in case of an error
      });
  }, []);
 
  // useEffect(() => {
  //   const apiUrl = "http://127.0.0.1:5000/city";
  //   axios
  //     .post(apiUrl, {'state':state})
  //     .then((response) => {
  //       setCities(response.data);
  //       // console.log(response.data)
  //       setLoading(false); // Set loading to false when data is fetched
  //       // console.log("API Response:", response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //       setLoading(false); // Set loading to false in case of an error
  //     });
  // }, [state]);
  // useEffect(() => {
  //   const apiUrl = "http://127.0.0.1:5000/hotelname";
  //   axios
  //     .post(apiUrl,{"state":state,"city":city})
  //     .then((response) => {
  //       setHotelNames(response.data);
  //       console.log(response.data)
  //       setLoading(false); // Set loading to false when data is fetched
  //       console.log("API Response:", response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //       setLoading(false); // Set loading to false in case of an error
  //     });
  // }, [city]);
 
  const handleSelectHotel = (e) => {
    const selectedHotelId = parseInt(e.target.value, 10);
    const hotel = hotels.find((h) => h.id === selectedHotelId);
    setSelectedHotel(hotel);
  };
 
 
 
const uniqueState = [...new Set(hotels.map(hotel =>hotel.Hotel_State))];
const uniqueCities =
  state &&
  [...new Set(hotels.filter(hotel => hotel.Hotel_State === state).map(hotel => hotel.Hotel_City))];
  const filteredHotels = state && city ? hotels.filter(hotel => hotel.Hotel_State === state && hotel.Hotel_City === city): [];
// console.log(filteredHotels)
 
  const today = new Date();
  const minDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  // console.log(minDate)
  const minExitDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()+1}`;
 
  const [selectedFromDate, setSelectedFromDate] = useState(new Date());
  const [formattedFromDate, setFormattedFromDate] = useState('');
 
  const handleFromDateChange = (event) => {
    setActive(false)
    const selectedDateString = event.target.value;
    const selectedDateObject = new Date(selectedDateString);
    const formattedTimestamp = selectedDateObject.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata', // Set the desired time zone, e.g., 'America/Los_Angeles'
    hour12: false // Display time in 24-hour format
    });
    setSelectedFromDate(selectedDateObject);
    setFormattedFromDate(formattedTimestamp);
    console.log("From",formattedTimestamp)
  };
  // console.log(hotelName);
  const [selectedToDate, setSelectedToDate] = useState(new Date());
  const [formattedToDate, setFormattedToDate] = useState('');
 
 
 
  const handleToDateChange = (event) => {
    setActive(false)
    const selectedDateString = event.target.value;
    const selectedDateObject = new Date(selectedDateString);
    const formattedTimestamp = selectedDateObject.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata', // Set the desired time zone, e.g., 'America/Los_Angeles'
    hour12: false // Display time in 24-hour format
    });
    setSelectedToDate(selectedDateObject);
    setFormattedToDate(formattedTimestamp);
    console.log("To",formattedTimestamp)
  };
  const [roomType,setRoomType] =useState('');
  const [beds,setBeds] =useState('');
 
  console.log("Hotel_Id",hotelName,
  "Room_Type",roomType,
  "No_of_Beds",beds,
  "CheckIn_Time" , formattedFromDate,
  "CheckOut_Time" , formattedToDate);
 
  const [active,setActive] = useState(false);
  const roomly = () =>{
      const apiUrl = "http://127.0.0.1:5000/room_availability";
    axios
      .post(apiUrl,{"Hotel_Id":hotelName,
      "Room_Type":roomType,
      "No_of_Beds":beds,
      "CheckIn_Time" : formattedFromDate,
      "CheckOut_Time" : formattedToDate,
      "Guest_Id":guest_id})
      .then((response) => {
        const { existing_booking } = response.data;

        if (existing_booking) {
          // Notify the guest that there is an existing booking
          alert('You already have an existing booking between these dates, Please select different dates.');
          setActive(false);
          setShowAvailabilityModal(false); // Open the availability modal
        }
        else{
          setAvailableRooms(response.data.available_room_ids);
          console.log("rooms",response.data)
          setActive(true);
          setShowAvailabilityModal(true); // Open the availability modal
          setLoading(false); // Set loading to false when data is fetched
          console.log("API Response:", response.data.available_room_ids);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setActive(false)
        setLoading(false); // Set loading to false in case of an error
      });
    }
    // console.log(availableRooms)
    const [booked,setBooked] = useState(false);
    //const bookingIds = booking.map((bookingItem) => bookingItem.Booking_Id);
    const roombook = () =>{
      if(guest_id){
        if (availableRooms.length > 0) {
          // const bookedRoomId = availableRooms[0];
        const apiUrl = "http://127.0.0.1:5000/book_room";
    axios
      .post(apiUrl,{"Hotel_Id":hotelName,
      "Room_Type":roomType,
      "No_of_Beds":beds,
      "Guest_email":guest_email,
      "CheckIn_Time" : formattedFromDate,
      "CheckOut_Time" : formattedToDate})
      .then((response) => {
        // setAvailableRooms(response.data.available_room_ids);
        console.log("booked ------>",(response.data.Booking_data[0]))
        localStorage.setItem('Booked_Room_Id', bookingIds[bookingIds.length - 1]); 
        setBooked(true)
        setBookingGenerated(true); // Set the flag to true when booking is generated
        // setActive(true);
        setBookedHotelId(hotelName);
        setBooking(response.data.Booking_data[0])
        setLoading(false); // Set loading to false when data is fetched
        // console.log("API Response:", response.data.available_room_ids);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        localStorage.setItem('Booked_Room_Id', bookingIds[bookingIds.length - 1]); 
        // setActive(false)
        setBooked(false)
        setBookingGenerated(false); // Set the flag to false in case of an errors
        setLoading(false); // Set loading to false in case of an error
 
      });
      }
    }
    else{
      navigate('/login');
    }}
    

    // useEffect(() => {
     
    //     // You can put the code related to booking completion here
    //     // For example, you may want to fetch updated booking data or perform other actions
    //     const apiUrl = `http://127.0.0.1:5000/booking?Guest_Id=${Guest_Id}`;
   
    //     axios
    //       .post(apiUrl, { 'Guest_Id': Guest_Id })
    //       .then((response) => {
    //         setBooking(response.data.Booking_data);
    //         console.log("hello jbjhb", response.data.Booking_data);
    //       })
    //       .catch((error) => {
    //         console.error("Error fetching data:", error);
    //       });
     
    // }, [Guest_Id]);
   
    // useEffect(() => {
    //   if (bookingGenerated && bookingIds.length > 0) { 
    //    // Set the booked room ID in local storage 
    //    localStorage.setItem('Booked_Room_Id', bookingIds[bookingIds.length - 1]); 
    //  } }, [bookingGenerated, bookingIds]);

    const handleBook = () => {
      if(!guest_id){
        navigate('/login');
      }
    }
 
  // }, [state,city,hotelName,formattedFromDate,formattedToDate,roomType ,beds]);
  return (<>
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md mt-8 bg-white gap-2">
    <div className="flex flex-row justify-between gap-2">
    <div className='w-full'>
      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
      <select onChange={(event)=>{setState(event.target.value);setActive(false)}} className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 appearance-none"
  >
         <option value="" >
      Select the State
    </option>
    {uniqueState.map((state) => (
      <option key={state} value={state}>
       {state}
      </option>
    ))}
      </select>
    </div>
    <div className='w-full'>
      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
      <select disabled={!state} onChange={(event)=>{setCity(event.target.value);setActive(false)}} className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 appearance-none"
  >
        <option value="" disabled  selected>
      Select the City
    </option>
    {state && uniqueCities.map((city) => (
      <option key={city} value={city}>
       {city}
      </option>
    ))}
      </select>
 
    </div>
   
    </div>
      <label htmlFor="hotel" className="block text-sm font-medium text-gray-700 mb-2">
        View all Hotel
      </label>
      <div className="relative">
       
          <select disabled={!city}
    id="hotel"
    onChange={(event)=>{setHotelName(event.target.value);setActive(false)}}
    className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 appearance-none"
  >
    <option value="" disabled selected>
      Choose a Hotel
    </option>
    {city && filteredHotels.map((hotel) => (
      <option key={hotel.Hotel_Name} value={hotel.Hotel_Id}>
       {hotel.Hotel_Name}
      </option>
    ))}
  </select>
       
      </div>
 
      {selectedHotel && (
  <div className="mt-4 flex items-center">
    <img
      src={selectedHotel.image}
      alt={selectedHotel.name}
      className="rounded-lg mr-4"
      style={{ maxWidth: "100%", maxHeight: "150px" }}
    />
    <div>
      <h2 className="text-xl font-semibold">{selectedHotel.Hotel_Id}</h2>
      <p className="mt-2">Location: {selectedHotel.Hotel_Address}</p>
      <p className="mt-2">Phone Number: {selectedHotel.Hotel_Phn_Number}</p>
      {/* Additional hotel details can be added here */}
    </div>
  </div>
)}
<div>
                <span className="block text-sm font-medium text-gray-700 mb-2">Your stay is From :</span>
                <div date-rangepicker class="flex items-center">
                  <div class="relative" name="start">
                    <div name="start" class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
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
                      id='startDate'
                      onChange={handleFromDateChange}
                      min={minDate}
                     
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Select date start"
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
                      id='endDate'
                      onChange={handleToDateChange}
                      min={minExitDate}
                     
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Select date end"
                    />
                  </div>
                </div>
               
              </div>
            <div className='flex flex-row gap-3 mt-3'>
              <span className="block text-l font-medium text-gray-700 mb-2">Number of Persons staying with us:-</span>
              <select  onChange={(event)=>{setBeds(event.target.value);setActive(false)}}  className="w-[10%] p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 appearance-none">
                <option>~</option>
                <option id='1' value='1'>1</option>
                <option id='2' value='2'>2</option>
                <option id='3' value='3'>3</option>
              </select>
            </div>
            <div className='flex flex-row justify-evenly mt-3'>
      <label className=" w-[30%] block text-l font-medium text-gray-700 mb-2">Room Type</label>
      <select onChange={(event)=>{setRoomType(event.target.value);setActive(false)}}  className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 appearance-none"
  >
        <option>Select the Room Type</option>
        <option key='Single Room' value='Single room'>Single Room</option>
        <option key='Double Room' value='Double room'>Double Room</option>
        <option key='Family Room' value='Family room'>Family Room</option>
        <option key='Suite Room' value='Suite room'>Suite Room</option>
      </select>
   
      </div>
            <div className='flex flex-row justify-end items-end'>
            {active?(<div className="flex flex-col ">
              {/* <div className="text-sm">{availableRooms.length} Rooms are Available </div> */}
              <button onClick={() => { roombook(); openModal(); }} className="h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800">
               {booked ? <>Booked!!!!</> : <>Book</>}
               </button>
              </div>
            ):(<>
              <button onClick={roomly} class=" h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800">Check Availability</button>
              </>)}
             
            </div>
    </div>
    {/* </div>
            <div className='flex flex-row justify-end items-end'>
            <button class=" h-10 px-5 m-2 text-gray-100 transition-colors duration-150 bg-gray-700 rounded-lg focus:shadow-outline hover:bg-gray-800">Book</button>
            {availableRooms && <div>{availableRooms.length} rooms are availble</div>}
            </div>
    </div> */}
{showAvailabilityModal && (
  <div className="modal-overlay">
    <div className="modal-content modal">
      <div className="modal-box">
        <p>{availableRooms.length} Rooms are Available</p>
        {/* Add any additional information about available rooms here */}
        <button onClick={() => setShowAvailabilityModal(false)} className=" close">
        <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    className="w-4 h-4" // Adjust the size of the SVG
  >
    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
        </button>
        <div className="tick">&#10003;</div>
      </div>
    </div>
  </div>
)}
 
{showModal && (
  <div className="modal-overlay">
    <div className="modal-content modal">
      <div className="modal-box">
        {bookingGenerated  ? (
          <>
            <p>Your room has been booked!</p>
            <p>Please confirm it by payment</p>


            <div>
              <p key={booking.Booking_Id}>Booking Id: {booking.Booking_Id}</p>
            </div>
            <button onClick={openBillingModal} className="pay-now">
                  Payment
                </button>
                {/* <button onClick={closeModal} className="pay-later">
                  Pay Later
                </button> */}
          </>
        ) : (
          <>
          <p>Booking is being generated...</p>
           <p> Please confirm it by payment</p>
          <button onClick={openBillingModal} className="pay-now">
                  Payment
                </button>
                {/* <button onClick={closeModal} className="pay-later">
                  Pay Later
                </button> */}
                </>
        )}
 
        <button onClick={closeModal} className="close">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-4 h-4" // Adjust the size of the SVG
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {bookingGenerated && <div className="tick">&#10003;</div>}
        
      </div>
    </div>
  </div>
)}
 {/* Billing Modal */}
 {showBillingModal && (
  <div className="modal-overlay">
    <div className="modal-content modal">
      <div className="modal-box">
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={tableHeaderStyle}>Order Name</th>
              <th style={tableHeaderStyle}>Order Department</th>
              <th style={tableHeaderStyle}>Order Price</th>
              <th style={tableHeaderStyle}>Billing Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <td style={tableCellStyle}>Hotel Bill</td>
              <td style={tableCellStyle}>Hotel</td>
              <td style={tableCellStyle}>10000</td>
              <td style={tableCellStyle}>Not Paid</td>
            </tr>
          </tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <button onClick={handlePayNow}  className="pay-now">
            Pay Now
          </button>
           <button onClick={handlePayLater}  className="pay-later">
            Pay Later
          </button> 
        </div>
      </div>
    </div>
  </div>
)}

 
    </>
  );
};
const tableHeaderStyle = {
  background: '#f2f2f2',
  padding: '8px',
  textAlign: 'left',
  fontWeight: 'bold',
  border: '1px solid #ddd',
};

const tableCellStyle = {
  padding: '8px',
  border: '1px solid #ddd',
};
export default HotelDashboard;