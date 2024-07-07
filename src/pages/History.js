import { useState , useEffect} from "react";
import Reservation from "./Reservation";
import Preference from "./Preference";
import Header from "./HeaderUser";
import ChatMainPage from './ChatMainPage';
import { useNavigate } from "react-router-dom";
function History() {
  const [res, setRes] = useState(true);
  const [pre, setPre] = useState(false);
 
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
  const [chatOpen, setChatOpen] = useState(false);
  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };
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
  
  // const resStyle = () => (
  //     {
  //         if(res){
  //             hover:border-b-4;
  //             hover:border-slate-500;
  //         }
  //     }
  // )

  return (
    <>
    <Header></Header>
      <div className="flex flex-row m-6  ">
        <div
          className="mr-3 text-white"
          style={{ borderBottom: res ? "4px solid #708090" : "" }}
          onClick={() => {
            setRes(true);
            setPre(false);
          }}
        >
          Reservation
        </div>
        <div
          className="text-white "
          style={{ borderBottom: pre ? "4px solid #708090" : "" }}
          onClick={() => {
            setPre(true);
            setRes(false);
          }}
        >
         Preference
        </div>
      </div>
      <div>
         {res && (
          <div>
            <Reservation/>
            </div>
        //     <div className="m-10 p-3 border-2 w-[500px] h-[125px] flex flex-row justify-center rounded-lg bg-slate-500 hover:bg-slate-700  text-gray-100">
        //   <div className="w-1/4 h-full flex flex-col ">
        //     <div className="text-xs h-[20%] flex justify-center">
        //       Rservation Id:
        //     </div>
        //     <div className="text-6xl h-[80%] flex justify-center items-center">
        //       1
        //     </div>
        //   </div>
        //   <div className="w-3/4 flex flex-col justify-between p-1 overflow:hidden">
        //     <div className="h-[30%] text-xl">Reservation name</div>
        //     <div className="flex flex-row justify-between  h-[40%] ">
        //       <div className="flex flex-col text-xs  ">
        //         <div className="">Lorem Ipsium......................................</div>
                
        //       </div>
        //       <div className="flex flex-col pr-3">
                
        //         <div className=" text-xs">Dept:- Booking</div>
        //         <div className=" text-xs">Staff:- John Doe</div>
        //       </div>
        //     </div>

        //     <div className="h-[20%] self-center">
        //       <button
        //         type="button"
        //         class="text-gray-900  bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-3 py-1 mr-2 mb-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        //       >
        //         Edit
        //       </button>
        //     </div>
        //   </div>
        //</div>
        )} 
        {pre && (
          <div>
            <Preference/>
          </div>
        )}
        <div style={{ position: 'fixed', bottom: '0', right: '0', marginRight: '20px', marginBottom: '20px' }}>
  <button className='p-3 bg-opacity-50' onClick={toggleChat} style={{  borderRadius: '50%' }}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8 text-white">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
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
          <div style={{ marginLeft: '20px' }}>
            <ChatMainPage />
          </div>
        )}  
      </div>
    </>
  );
}
export default History;
