import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecommendationCard = ({ data , onEditClick }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isBooked, setBooked] = useState(false);
    // const isBookedFromLocalStorage = localStorage.getItem('isBooked');
    // const [isBooked, setBooked] = useState(isBookedFromLocalStorage ? JSON.parse(isBookedFromLocalStorage) : false);
  
    // useEffect(() => {
    //   localStorage.setItem('isBooked', JSON.stringify(isBooked));
    // }, [isBooked]);
    const guestIdFromLocalStorage = localStorage.getItem('Guest_Id');
  const [guestId, setGuestId] = useState(guestIdFromLocalStorage || '');
  
    const openModal = () => {
        setModalOpen(true);
      };
      const closeModal = () => {
        setModalOpen(false);
      };
      
    
      const handleBookClick2 =  async () => {
        if (isBooked) {
          alert('Already booked!');
          return;
        }
    
        try {
          // Make API call to create billing entry
          const billingResponse = await axios.post('http://127.0.0.1:5000/create_billing', {
            Order_Name: data.Recommendation_Name,
            Order_Department: data.Recommendation_Type, // Replace with the actual value
            Order_Price: 500, // Replace with the actual value
            Billing_Status: 'Not Paid', // Assuming this is the status for booked entries
            Guest_Id: guestId, // Replace with the actual value
          });
          
          const booking= await axios.post('http://127.0.0.1:5000/booking',{
            Guest_Id: guestId
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
            Service_Name: data.Recommendation_Name,
            Service_Dept: "Recommendation",
            Service_Status: "Not Done" ,
            Service_Description: "Service booked from recommendation"
          });

          const service_id=services.data.service_id

          if (billingResponse.data.message === 'Billing entry added successfully') {
            // Make API call to create reservation entry
            const reservationResponse = await axios.post('http://127.0.0.1:5000/create_reservation', {
              Reservation_Type: data.Recommendation_Type,
              Reservation_Status: 'Booked', // Assuming this is the status for booked entries
              Reservation_Description: data.Recommendation_Name + " (From Recommendations)", // Replace with the actual value
              Service_Id: service_id, // Replace with the actual value
            });
    
            if (reservationResponse.data.message === 'Reservation entry added successfully') {
              setBooked(true);
              closeModal(); 
              // Perform any additional actions after successful booking
              //alert('Booking successful!');
            } else {
              // Handle reservation creation error
              alert('Failed to create reservation entry');
            }
          } else {
            // Handle billing creation error
            alert('Failed to create billing entry');
          }
        } catch (error) {
          console.error('Error during booking:', error);
        }
        
      };
    
      const handleBookClick = async () => {
        // Check if already booked
        if (isBooked) {
          alert('Already booked!');
          return;
        }
    
        try {
          // Make API call to create billing entry
          const billingResponse = await axios.post('http://127.0.0.1:5000/create_billing', {
            Order_Name: data.Recommendation_Name,
            Order_Department: data.Recommendation_Type, // Replace with the actual value
            Order_Price: 500, // Replace with the actual value
            Billing_Status: 'Paid', // Assuming this is the status for booked entries
            Guest_Id: guestId, // Replace with the actual value
          });

          const booking= await axios.post('http://127.0.0.1:5000/booking',{
            Guest_Id: guestId
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
            Service_Name: data.Recommendation_Name,
            Service_Dept: "Recommendation",
            Service_Status: "Not Done" ,
            Service_Description: "Service booked from recommendation"
          });

          const service_id=services.data.service_id
    
          if (billingResponse.data.message === 'Billing entry added successfully') {
            // Make API call to create reservation entry
            const reservationResponse = await axios.post('http://127.0.0.1:5000/create_reservation', {
              Reservation_Type: data.Recommendation_Type,
              Reservation_Status: 'Booked', // Assuming this is the status for booked entries
              Reservation_Description: data.Recommendation_Name + " (From Recommendations)",// Replace with the actual value
              Service_Id: service_id, // Replace with the actual value
            });
    
            if (reservationResponse.data.message === 'Reservation entry added successfully') {
              setBooked(true);
              closeModal(); 
              // Perform any additional actions after successful booking
              //alert('Booking successful!');
            } else {
              // Handle reservation creation error
              alert('Failed to create reservation entry');
            }
          } else {
            // Handle billing creation error
            alert('Failed to create billing entry');
          }
        } catch (error) {
          console.error('Error during booking:', error);
        }
      };
    return (
        <div className="m-10 p-3 border-2 w-[500px] h-[125px] flex flex-row justify-center rounded-lg bg-slate-500 hover:bg-slate-700  text-gray-100">
            <div className="w-1/4 h-full flex flex-col ">
                <div className="text-xs h-[20%] flex justify-center">Recommendation Id: </div>
                <div className="text-4xl h-[80%] flex justify-center items-center">{data.Recommendation_Id}</div>
                
            </div>
            <div className="w-3/4 flex flex-col justify-between p-1 overflow:hidden">
                {/* <div className="h-[30%] text-xl">Hotel_Id{data.Hotel_Id}</div> */}
                <div className="flex flex-row justify-between  h-[40%] ">
                    <div className="flex flex-col text-xs justify-evenly ">
                        <div className="">Name:- {data.Recommendation_Name}</div>
                        <div className="">Rating :- {data.Recommendation_Rating}</div>
                    </div>
                    <div className="flex flex-col pr-3"> 
                        <div className=" text-xs">Type:- {data.Recommendation_Type}</div>
                        {/* <div className=" text-xs">Status:-  {data.Billing_Status}</div> */}
                    </div>
                </div>

                <div className="h-[20%] self-mid">
                    <button type="button" onClick={() => onEditClick(data)} class="text-gray-900  bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-3 py-1 mr-2 mb-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
                    </button>

                </div>
                <div className="h-[20%] self-end">
        {isBooked ? (
          'Already Booked'
        ) : (
          <button
            type="button"
            onClick={openModal}
            className="text-gray-900  bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-3 py-1 mr-2 mb-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            Book
          </button>
        )}
      </div>

            </div>
            {isModalOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-900 bg-opacity-75">
        <div className="bg-white p-6 rounded-lg text-center">
        <h2 className="text-xl font-bold text-black mb-2">Payment</h2>
            <h2 className="text-x font-bold text-black mb-2">Do you want to book this?</h2>
            <button className="bg-blue-500 hover:bg-blue-600  py-2 px-4 rounded-md mt-4 mx-2 " onClick={handleBookClick}>Book and Pay Now</button>
            <button className="bg-green-500 hover:bg-green-600  py-2 px-4 rounded-md mt-4 mx-2 " onClick={handleBookClick2}>Book and Pay Later</button>
            <button className="bg-red-500 hover:bg-red-600  py-2 px-4 rounded-md mt-4 mx-2 " onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
        </div>

    );
};

export default RecommendationCard;
