import React from 'react';
import './App.css'
import { Routes , Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar'
import Signup from './Components/Login&Signup/Signup';
import Login from './Components/Login&Signup/Login';
import Home from './Components/Home/Home';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatDashboard from './Components/Chats/ChatDashboard/ChatDashboard';
import MyRooms from './Components/Home/My Rooms/MyRooms';
// import R from './Components/Home/R';

function App() {
  const token = localStorage.getItem("Token")
  const userInfo = JSON.parse(localStorage.getItem("User"))
  return (
    <div>
      <ToastContainer />
        <Navbar token={token} userInfo={userInfo}/>
        <Routes>
          {
            token ? 
            <>
              <Route exact path ="/" element={<ChatDashboard userInfo={userInfo}/>} />
              <Route exact path ="/my-rooms" element={<MyRooms userInfo={userInfo}/>} />
            </>
            :
            <Route exact path ="/" element={<Home />} />
          }
          <Route exact path ="/login" element={<Login token={token}/>} />
          <Route exact path ="/signup" element={<Signup />} />
          {/* <Route exact path ="/r" element={<R />} /> */}
        </Routes>
    </div>
  );
}

export default App;
