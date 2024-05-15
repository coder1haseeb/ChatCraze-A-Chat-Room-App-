import React, { useEffect, useState } from 'react';
import './SearchChatRoom.css';
import { IoSearchSharp } from 'react-icons/io5';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdGroups3 } from "react-icons/md";
import { FaUserLock } from "react-icons/fa";

const SearchChatRoom = ({fetchMemberships}) => {
  const [searchText, setSearchText] = useState('');
  const [chats, setChats] = useState([]);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [passwords, setPasswords] = useState({}); // Store passwords for each chat
  const user = JSON.parse(localStorage.getItem("User"));

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/chats/${searchText}`, {
        headers: {
          Authorization: localStorage.getItem('Token'),
        },
      });
      console.log(response);
      setChats(response.data.chats); // Assuming API response has a 'chats' array
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  useEffect(() => {
    if (searchText.trim() !== '') {
      fetchData();
    } else {
      setChats([]); // Clear chat list when search text is empty
    }
  }, [searchText]);

  const handleMembership = async (chatId, privateChat) => {
    if (privateChat) {
      setIsPasswordProtected(true);
      if (!passwords[chatId]) {
        toast.error("Enter the password to join Room.");
        return;
      }
    } else {
      setIsPasswordProtected(false); // Reset isPasswordProtected for public chats
    }

    let data = {
      "membership": {
        "user_id": user.data.id,
        "chat_id": chatId
      }
    };

    if (isPasswordProtected) {
      data.membership.room_password = passwords[chatId];
    }

    console.log(data); // Check data object before sending request

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/memberships`, data, {
        headers: {
          "Authorization": localStorage.getItem('Token')
        },
      });

      console.log(response.data);
      if (response.data.status === 201) {
        toast.info(response.data.message);
      } else if (response.data.status === "incorrect") {
        toast.error(response.data.message);
      } else {
        toast.success(response.data.message);
      }
      setIsPasswordProtected(false); // Reset isPasswordProtected after joining
      setPasswords({}); // Reset passwords after successful join
      fetchData(); // Fetch updated data after joining
      fetchMemberships()
      
    } catch (error) {
      console.log(error);
    }
  };

  const handlePasswordChange = (chatId, value) => {
    setPasswords(prevPasswords => ({
      ...prevPasswords,
      [chatId]: value
    }));
  };
  
  return (
    <div>
      <button
        type="button"
        className="btn btn-success"
        data-bs-toggle="modal"
        data-bs-tooltip="tooltip"
        data-bs-placement="top"
        title="Create a Room"
        data-bs-target="#searchModal"
      >
        <IoSearchSharp />
      </button>

      <div className="modal fade" id="searchModal" data-bs-theme="dark" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog  modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Search Rooms Here</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body custom_height_for_search_div_modal">
              <input
                type="text"
                className="search_input_div_for_rooms_home_page_from_all_rooms"
                placeholder="Type here to Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <div className='all_room_searched_map_div_for_the_grid'>
                {chats.map(chat => (
                  <div key={chat.id} className='single_chat_searched_div_for_the_room_modal'>
                    <div className="image_div_for_single_searched_chat_div">
                      <img src={chat.image} alt="Chatimage" />
                    </div>
                    <div className="name_of_searched_single_room_div">
                      {chat.name}
                    </div>
                    <div className="owner_name_for_the_chat_div_to_display">
                      By : {chat.admin_user.first_name}
                    </div>
                    <div className="status_of_the_single_room_searched_div">
                      <div className="stauts_heading_for_the_single_searched_div">
                        Status : 
                      </div>
                      <div className="dynamic_stauts_entity_for_the_room_privacy_div">
                        {
                          chat.private ?
                            <span><FaUserLock style={{fontSize : "1.2rem" , marginBottom : ".2rem"}} /> Private</span> : <span><MdGroups3 style={{fontSize : "1.3rem" , marginBottom : ".2rem"}} /> Public</span>
                        }
                      </div>
                    </div>
                    {
                      !chat.current_user_joined && chat.private && 
                      <input type="text" className='input_for_password_the_chat_joined_single_chat' placeholder='Enter password to Join' value={passwords[chat.id] || ''} onChange={(e) => handlePasswordChange(chat.id, e.target.value)} />
                    }
                    {
                      chat.current_user_joined ? 
                      <div className="btn btn-primary join_now_button_for_the_single_div">Joined !</div>
                      :
                      <div className="btn btn-success join_now_button_for_the_single_div" onClick={()=> handleMembership(chat.id , chat.private)}>Join</div>
                    }
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchChatRoom;
