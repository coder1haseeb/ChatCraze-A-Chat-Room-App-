import React, { useEffect, useState } from "react";
import "./ChatLeftSide.css";
import ChatCreateModal from "./ChatCreateModel/ChatCreateModal";
import SearchChatRoom from "./SearchChatRoom/SearchChatRoom";
import axios from "axios";

const ChatLeftSide = ({
  onChatClick,
  fetchMemberships,
  setMemberships,
  memberships,
  showLoader,
}) => {
  // const [memberships, setMemberships] = useState([]);
  // const [showLoader, setShowLoader] = useState(true)

  // const fetchMemberships = () =>{
  //   axios
  //     .get(`${process.env.REACT_APP_API_URL}/memberships`, {
  //       headers: {
  //         Authorization: localStorage.getItem('Token'),
  //       },
  //     })
  //     .then((res) => {
  //       setMemberships(res.data)
  //       setShowLoader(false)
  //     });
  // }
  useEffect(() => {
    fetchMemberships();
  }, []);

  return (
    <div className="chat_left_side_div_child_component">
      <div className="header_for_chat_div_left_side_component">
        <div className="left_side_header_chat_div_heading">Chats</div>
        <div className="right_side_header_chat_div_options">
          <div className="single_option_for_right_side_header">
            <ChatCreateModal fetchMemberships={fetchMemberships} />
          </div>
          <div className="single_option_for_right_side_header">
            <SearchChatRoom fetchMemberships={fetchMemberships} />
          </div>
        </div>
      </div>
      <div className="my_chats_div_for_current_user_left_side">
        {memberships?.length > 0 ? (
          memberships?.map((membership) => (
            <div
              className="single_members_ship_div_for_right_side_left_panel"
              key={membership.id}
              onClick={() => onChatClick(membership)}
            >
              <div className="left_side_for_the_single_membership_div">
                <img src={membership.chat.image} alt="" />
              </div>
              <div className="right_side_for_membership_single_div">
                <div className="name_for_single_chat_membership">
                  {membership.chat.name}
                </div>
                <div className="last_message_for_single_chat_div_in_membership">
                  {membership?.chat?.last_message?.message_text}
                </div>
              </div>
            </div>
          ))
        ) : showLoader ? (
          <div className="no_message_error_for_blank_chat">
            <div>
              <div class="d-flex justify-content-center">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
            <div className="description_for_no_message_for_blank_chat">
              Loading Rooms !
            </div>
          </div>
        ) : (
          <div
            className="no_message_error_for_blank_chat"
            style={{ marginTop: "5rem" }}
          >
            <div
              className="heading_for_no_message_for_blank_chat"
              style={{ fontSize: "1.3rem" }}
            >
              No Rooms Joined Yet!
            </div>
            <div className="description_for_no_message_for_blank_chat">
              Search and join a Room.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLeftSide;
