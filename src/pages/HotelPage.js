// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import HotelCard from "./HotelCard";
// import HotelCardSimple from "./HotelCardSimple";
// import HeaderAdmin from "./HeaderAdmin";
 
// function HotelPage() {
//   const [hotels, setHotels] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [hotelsPerPage] = useState(5);
//   const [sortDescending, setSortDescending] = useState(false);
//   const [sortAlphabetically, setSortAlphabetically] = useState(false);
//   const [showSortOptions, setShowSortOptions] = useState(false);
//   const [res, setRes] = useState(true);
//   const [pre, setPre] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();
 
//   useEffect(() => {
//     const apiUrl = "http://127.0.0.1:5000/hotel";
//     axios
//       .get(apiUrl)
//       .then((response) => {
//         setHotels(response.data.Hotels);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//       });
//   }, []);
 
//   const handleSortByRooms = () => {
//     const sortedHotels = [...hotels].sort((a, b) => {
//       return sortDescending ? b.Total_Rooms - a.Total_Rooms : a.Total_Rooms - b.Total_Rooms;
//     });
 
//     setHotels(sortedHotels);
//     setSortDescending(!sortDescending);
//     setShowSortOptions(false);
//   };
 
//   const handleSortAlphabetically = () => {
//     const sortedHotels = [...hotels].sort((a, b) =>
//       sortAlphabetically
//         ? a.Hotel_Name.localeCompare(b.Hotel_Name)
//         : b.Hotel_Name.localeCompare(a.Hotel_Name)
//     );
 
//     setHotels(sortedHotels);
//     setSortAlphabetically(!sortAlphabetically);
//     setSortDescending(false);
//     setShowSortOptions(false);
//   };
 
//   const toggleSortOptions = () => {
//     setShowSortOptions(!showSortOptions);
//   };
 
//   const indexOfLastHotel = currentPage * hotelsPerPage;
//   const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
//   const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);
 
//   const paginate = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };
 
//   const nextPage = () => {
//     setCurrentPage((prev) => prev + 1);
//   };
 
//   const prevPage = () => {
//     setCurrentPage((prev) => prev - 1);
//   };
 
//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//     setCurrentPage(1); // Reset to the first page when performing a new search
//   };
 
//   // Filter hotels based on the search term
//   const filteredHotels = hotels.filter((hotel) =>
//     hotel.Hotel_Name.toLowerCase().includes(searchTerm.toLowerCase())
//   );
 
//   return (
//     <>
//       <HeaderAdmin></HeaderAdmin>
//       <div className="flex justify-between items-center p-4">
//         <div className="flex items-center">
//           <h1 className="text-4xl text-white">Hotels List</h1>
//         </div>
 
//         <div className="flex flex-col items-end">
//           <div className="flex space-x-2">
//             <input
//               type="text"
//               placeholder="Search by Hotel Name"
//               value={searchTerm}
//               onChange={handleSearch}
//               className="px-2 py-1 border rounded-md focus:outline-none"
//             />
//             <button
//               className="text-white bg-gray-800 border border-gray-300 focus:outline-none hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-2 py-1 mt-4"
//               onClick={toggleSortOptions}
//             >
//               Sort
//             </button>
//           </div>
//           {showSortOptions && (
//             <div className="text-white absolute top-32 right-4 bg-gray-800 border border-gray-300 rounded-md shadow-md z-10">
//               <button
//                 className="block w-full text-left px-4 py-2 hover:bg-gray-400"
//                 onClick={handleSortByRooms}
//               >
//                 Sort by Rooms
//               </button>
//               <button
//                 className="block w-full text-left px-4 py-2 hover:bg-gray-400"
//                 onClick={handleSortAlphabetically}
//               >
//                 Sort Alphabetically
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
 
//       <div className="flex flex-row m-6 text-white">
//         <div
//           className={`mr-3 ${res ? "border-b-4 border-gray-700" : ""}`}
//           onClick={() => {
//             setRes(true);
//             setPre(false);
//           }}
//         >
//           Icon View
//         </div>
//         <div
//           className={`mr-3 ${pre ? "border-b-4 border-gray-700" : ""}`}
//           onClick={() => {
//             setPre(true);
//             setRes(false);
//           }}
//         >
//           List View
//         </div>
//       </div>
 
//       {res && (
//         <div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
//             {currentHotels.map((hotel) => (
//               <HotelCard key={hotel.Hotel_Id} data={hotel} />
//             ))}
//           </div>
//         </div>
//       )}
//       {pre && (
//         <div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
//             <HotelCardSimple hotels={currentHotels} />
//           </div>
//         </div>
//       )}
 
//       <div className="flex justify-center mt-4">
//         <ul className="flex space-x-2">
//           <li>
//             <button
//               onClick={prevPage}
//               disabled={currentPage === 1}
//               className="text-white bg-gray-800 border border-gray-300 focus:outline-none hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-2 py-1 transition duration-300"
//               style={{ minWidth: "30px" }}
//             >
//               {"<"}
//             </button>
//           </li>
//           {Array.from({ length: Math.ceil(filteredHotels.length / hotelsPerPage) }).map(
//             (page, index) => (
//               <li key={index}>
//                 <button
//                   onClick={() => paginate(index + 1)}
//                   className={`${
//                     currentPage === index + 1
//                       ? "bg-blue-500 text-white"
//                       : "text-white bg-gray-800"
//                   } border border-gray-300 focus:outline-none hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-2 py-1 transition duration-300`}
//                   style={{ minWidth: "30px" }}
//                 >
//                   {index + 1}
//                 </button>
//               </li>
//             )
//           )}
//           <li>
//             <button
//               onClick={nextPage}
//               disabled={currentPage === Math.ceil(filteredHotels.length / hotelsPerPage)}
//               className="text-white bg-gray-800 border border-gray-300 focus:outline-none hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-2 py-1 transition duration-300"
//               style={{ minWidth: "30px" }}
//             >
//               {">"}
//             </button>
//           </li>
//         </ul>
//       </div>
//     </>
//   );
// }
 
// export default HotelPage;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HotelCard from "./HotelCard";
import HotelCardSimple from "./HotelCardSimple";
import HeaderAdmin from "./HeaderAdmin";

function HotelPage() {
  const [hotels, setHotels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage] = useState(10);
  const [sortDescending, setSortDescending] = useState(false);
  const [sortAlphabetically, setSortAlphabetically] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [res, setRes] = useState(true);
  const [pre, setPre] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const apiUrl = "http://127.0.0.1:5000/hotel";
    axios
      .get(apiUrl)
      .then((response) => {
        setHotels(response.data.Hotels);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    const apiUrl = "http://127.0.0.1:5000/update_rooms";
    axios
      .post(apiUrl)
      .catch((error) => {
        console.error("Error updating room data:", error);
      });
  }, []);

  useEffect(() => {
    const apiUrl = "http://127.0.0.1:5000/remove_previous";
    axios
      .post(apiUrl)
      .catch((error) => {
        console.error("Error removing previous data:", error);
      });
  }, []);
 
  const handleSortByRooms = () => {
    const sortedHotels = [...hotels].sort((a, b) => {
      return sortDescending ? b.Total_Rooms - a.Total_Rooms : a.Total_Rooms - b.Total_Rooms;
    });

    setHotels(sortedHotels);
    setSortDescending(!sortDescending);
    setShowSortOptions(false);
  };

  const handleSortAlphabetically = () => {
    const sortedHotels = [...hotels].sort((a, b) =>
      sortAlphabetically
        ? a.Hotel_Name.localeCompare(b.Hotel_Name)
        : b.Hotel_Name.localeCompare(a.Hotel_Name)
    );

    setHotels(sortedHotels);
    setSortAlphabetically(!sortAlphabetically);
    setSortDescending(false);
    setShowSortOptions(false);
  };

  const toggleSortOptions = () => {
    setShowSortOptions(!showSortOptions);
  };

  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page when performing a new search
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`${
            currentPage === 1 ? "bg-gray-400 text-gray-800" : "bg-gray-800 text-white"
          } border border-gray-300 focus:outline-none hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 font-medium text-sm px-4 py-2 mx-1 transition duration-300`}
        >
          Prev
        </button>
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => paginate(pageNumber)}
            className={`${
              currentPage === pageNumber ? "bg-blue-500 text-white" : "text-white bg-gray-800"
            } border border-gray-300 focus:outline-none hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 font-medium text-sm px-4 py-2 mx-1 transition duration-300`}
          >
            {pageNumber}
          </button>
        ))}
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`${
            currentPage === totalPages ? "bg-gray-400 text-gray-800" : "bg-gray-800 text-white"
          } border border-gray-300 focus:outline-none hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 font-medium text-sm px-4 py-2 mx-1 transition duration-300`}
        >
          Next
        </button>
      </div>
    );
  };

  const filteredHotels = hotels.filter((hotel) =>
    hotel.Hotel_Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <HeaderAdmin></HeaderAdmin>
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center">
          <h1 className="text-4xl text-white">Hotels List</h1>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search by Hotel Name"
              value={searchTerm}
              onChange={handleSearch}
              className="px-2 py-1 border rounded-md focus:outline-none"
            />
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
                className="block w-full text-left px-4 py-2 hover:bg-gray-400"
                onClick={handleSortByRooms}
              >
                Sort by Rooms
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-400"
                onClick={handleSortAlphabetically}
              >
                Sort Alphabetically
              </button>
            </div>
          )}
        </div>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"> {/* Adjusted grid and added gap */}
        {res && (
          currentHotels.map((hotel) => (
            <HotelCard key={hotel.Hotel_Id} data={hotel} /> 
          ))
        )}
        {pre && (
          <HotelCardSimple hotels={currentHotels} />
        )}
      </div>

      {renderPagination()}
    </>
  );
}

export default HotelPage;
