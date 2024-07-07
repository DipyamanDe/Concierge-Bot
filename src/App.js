import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Home from './pages/Home'
import AdminPage from './pages/AdminPage'
import Precheckin from './pages/Precheckin'
import Service from './pages/Service'
import History from './pages/History'
import Staff from './pages/Staff'
import ServicePage from './pages/ServicePage'
import LoginUser from './pages/LoginUser';
import User from './pages/User';
import Header from './pages/HeaderUser';
import ProfilePage from "./pages/ProfilePage";
import Billing from "./pages/Billing"
import HotelPage from "./pages/HotelPage";
import SignUpUser from "./pages/SignUpUser";
import Recommendation from "./pages/Recommendation";
import Layout from './pages/Layout';
import StaffLogin from "./pages/StaffLogin";
import StaffService from "./pages/StaffService";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        
          <Route index element={<User />} />
          <Route  path="/admin" element={<HotelPage/>}/>
          <Route  path="/signup" element={<SignUpUser/>}/>
          <Route  path="/precheckin" element={<Precheckin/>}/>
          <Route  path="/service" element={<Service/>}/>
          <Route  path="/history" element={<History/>}/>
          <Route path="/Staff" element={<Staff/>}/>
          <Route path="/services/:Room_Id" element={<ServicePage/>} />
          <Route path="/room/:Hotel_Id" element={<AdminPage/>} />
          <Route path="/login" element={<LoginUser/>}/>
          {/* <Route path="/user" element={<User/>}/> */}
          <Route path="/header" element={<Header/>}/>
          <Route path="/ProfileUser" element={<ProfilePage/>}/>
          <Route path="/billing" element={<Billing/>}/>
          <Route path="/Recommendation" element={<Recommendation/>}/>
          <Route path="/StaffLogin" element={<StaffLogin/>}/>
          <Route path="/StaffService" element={<StaffService/>}/>
          {/* <Route path="/sample" element={<Sample/>}/> */}
          
      </Routes>
    </BrowserRouter>
  );
}

export default App;

