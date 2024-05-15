// ChatDashboard.js

import React, { useEffect, useState } from "react";
import "./ChatDashboard.css";
import ChatLeftSide from "./ChatsLeftSide/ChatLeftSide";
import ChatRightSide from "./ChatRightSide/ChatRightSide";
import axios from "axios";
import { toast } from "react-toastify";

const ChatDashboard = ({ userInfo }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [closeChat, setCloseChat] = useState(true);
  const [memberships, setMemberships] = useState([]);
  const [showLoader, setShowLoader] = useState(true);

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    setCloseChat(true);
  };

  const fetchMemberships = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/memberships`, {
        headers: {
          Authorization: localStorage.getItem("Token"),
        },
      })
      .then((res) => {
        setMemberships(res.data);
        setShowLoader(false);
      });
  };

  const handleMembershipLeave = (membership_id) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/memberships/${membership_id}`)
      .then((res) => {
        console.log(res);
        toast.success(res.data.message);
        fetchMemberships();
        setSelectedChat(null);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(membership_id);
  };

  return (
    <div className="chat_dash_board_main_div_for_chat">
      <div className="left_side_chat_names_and_controller_for_chat">
        <ChatLeftSide
          onChatClick={handleChatClick}
          fetchMemberships={fetchMemberships}
          memberships={memberships}
          showLoader={showLoader}
          setMemberships={setMemberships}
        />
      </div>
      <div className="right_side_opened_chat_for_user">
        {selectedChat && closeChat ? (
          <ChatRightSide
            chat={selectedChat}
            fetchMemberships={fetchMemberships}
            setCloseChat={setCloseChat}
            userInfo={userInfo}
            handleMembershipLeave={handleMembershipLeave}
          />
        ) : (
          <div className="no_message_error_for_blank_chat">
            <div className="heading_for_no_message_for_blank_chat">
              ChatCraze
            </div>
            <div className="description_for_no_message_for_blank_chat">
              Open a Room and get connected to the our communities.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDashboard;
