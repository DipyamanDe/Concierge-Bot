import React, { useState, useEffect } from "react";
import axios from "axios";
import RecommendationCard from "./RecommendationCard";
import Header from "./HeaderUser";
import RecommendationCardEdit from "./RecommendationCardEdit";
import ChatMainPage from "./ChatMainPage";
import { useNavigate } from "react-router-dom";
const ITEMS_PER_PAGE = 5;

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
      <p style={{ margin: "2px" }}>Not logged in</p>
      <button
        style={{
          backgroundColor: "green",
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
    </div>
  </div>
);

const Recommendation = () => {
  const [recom, setRecom] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [chatOpen, setChatOpen] = useState(false);
  const Hotel_Id = localStorage.getItem("Hotel_Id");
  const [showModal, setShowModal] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const handleLoginClick = () => {
    setRedirectToLogin(true);
    setShowModal(false);
  };
  const navigate = useNavigate();
  useEffect(() => {
    // Check if Guest_Id exists in local storage
    const guestId = localStorage.getItem("Guest_Id");

    if (!guestId && !redirectToLogin) {
      // If not logged in, show modal
      setShowModal(true);
    } else if (!guestId && redirectToLogin) {
      // If not logged in and user clicked "Go to Login"
      navigate("/login");
    }
  }, [navigate, redirectToLogin]);
  useEffect(() => {
    const apiUrl = `http://127.0.0.1:5000/recommendation?Hotel_Id=${Hotel_Id}`;

    axios
      .get(apiUrl)
      .then((response) => {
        setRecom(response.data.Recommendation_Details);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [Hotel_Id]);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentRecoms = recom.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevClick = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextClick = () => {
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(recom.length / ITEMS_PER_PAGE))
    );
  };

  // for editing usage
  const [editing, setEditing] = useState(false);
  const [editedRecom, setEditedRecom] = useState(null);

  const handleEditClick = (recomData) => {
    setEditing(true);
    setEditedRecom(recomData);
  };

  const handleSaveClick = (editedData) => {
    // Create an Axios PUT request to update the recommendation data
    axios
      .put("http://127.0.0.1:5000/recommendation_update", editedData)
      .then((response) => {
        console.log("recommendation updated successfully:", response.data);

        // After a successful update, update the frontend data
        const updatedRecom = recom.map((recoms) =>
          recoms.Recommendation_Id === editedData.Recommendation_Id
            ? editedData
            : recoms
        );
        setRecom(updatedRecom);
        setEditing(false);
      })
      .catch((error) => {
        console.error("Error updating recommendation:", error);
      });
  };

  const handleCancelClick = () => {
    setEditing(false);
    setEditedRecom(null);
  };

  return (
    <>
      <style>
        {`
          .pagination-button {
            background-color: #001f3f; /* Dark Blue */
            color: white;
            border: 1px solid #001f3f; /* Dark Blue */
            padding: 8px 16px;
            cursor: pointer;
            border-radius: 4px;
          }
          .active-pagination-button {
            background-color: #003366; /* Darker Blue */
            color: white;
            border: 1px solid #003366; /* Darker Blue */
            padding: 8px 16px;
            cursor: pointer;
            border-radius: 4px;
          }
          .pagination-button:disabled {
            background-color: #334d66; /* Disabled Blue */
            color: #b3cce6; /* Lighter Blue */
            cursor: not-allowed;
          }
        `}
      </style>
      <Header></Header>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-4xl text-white">
          Recommendations for guest: {recom.length}
        </h1>
      </div>

      <div className="flex justify-center gap-4 flex-wrap">
        {currentRecoms.map((recoms) => (
          <RecommendationCard
            data={recoms}
            onEditClick={handleEditClick}
            key={recoms.Guest_Id}
          />
        ))}
      </div>

      <div className="flex flex-row justify-center items-center mt-4">
        {/* Pagination */}
        <ul className="flex space-x-2">
          <li>
            <button
              onClick={handlePrevClick}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Prev
            </button>
          </li>
          {Array.from({
            length: Math.ceil(recom.length / ITEMS_PER_PAGE),
          }).map((page, index) => (
            <li key={index}>
              <button
                onClick={() => paginate(index + 1)}
                className={`${
                  currentPage === index + 1
                    ? "active-pagination-button"
                    : "pagination-button"
                }`}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={handleNextClick}
              disabled={
                currentPage ===
                Math.ceil(recom.length / ITEMS_PER_PAGE)
              }
              className="pagination-button"
            >
              Next
            </button>
          </li>
        </ul>
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
          onClick={() => setChatOpen(!chatOpen)}
          style={{ borderRadius: "50%" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-8 h-8 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
        </button>
      </div>
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          onLoginClick={handleLoginClick}
        />
      )}
      {chatOpen && (
        <div style={{ marginLeft: "20px" }}>
          <ChatMainPage />
        </div>
      )}
    </>
  );
};

export default Recommendation;

