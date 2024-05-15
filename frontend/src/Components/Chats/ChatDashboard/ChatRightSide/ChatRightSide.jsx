import React, { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { MdArrowBackIosNew } from "react-icons/md";
import { FaTimes } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BsFillReplyAllFill } from "react-icons/bs";
import { RiDeleteBin4Line } from "react-icons/ri";
import "./ChatRightSide.css";
import axios from "axios";
import { toast } from "react-toastify";
// import EmojiPicker from "../../Emogies/EmogiPicker";
import { HiOutlineFaceSmile } from "react-icons/hi2";
import EmojiPicker from "emoji-picker-react"; // Import using curly braces

const ChatRightSide = ({
  chat,
  setCloseChat,
  userInfo,
  handleMembershipLeave,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showDots, setShowDots] = useState({});
  const [suggestion, setSuggestion] = useState("");
  const [showDropDown, setShowDropDown] = useState(false);
  const [replyMessageId, setReplyMessageId] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [guid, setGuid] = useState("");
  const [showEmojiBox, setShowEmojiBox] = useState(false);
  const chatBodyRef = useRef(null);
  const [messageToBeReplied, setMessageToBeReplied] = useState({});
  let websocket;
  // const handleEmojiClick = (event, emojiObject) => {
  //   // const { emoji } = emojiObject;
  //   console.log(emoji);
  // };
  // const handleEmojiSelect = (emoji) => {
  //   setMessage((prevMessage) => prevMessage + emoji); // Append emoji to the message
  // };

  const handleEmojiClick = (emojiData, event) => {
    console.log(emojiData.emoji);
    const emoji = emojiData.emoji;
    setMessage((prevMessage) => prevMessage + emoji); // Append emoji to the message
  };

  // const fetchSuggestion = async () => {
  //   try {
  //     const response = await axios.post(
  //       `${process.env.REACT_APP_API_URL}/chat/suggest_message`,
  //       { last_message: messages[messages.length - 1]?.message_text }
  //     );
  //     console.log("Suggestion:", response.data.suggestion);
  //     setSuggestion(response.data.suggestion);
  //   } catch (error) {
  //     console.error("Error fetching suggestion:", error);
  //   }
  // };

  // const handleFetchSuggestion = () => {
  //   fetchSuggestion();
  // };


  const inputRef = useRef(null);
  useEffect(() => {
    websocket = new WebSocket(`ws://127.0.0.1:4000/cable`);
    websocket.onopen = () => {
      console.log("WebSocket connected");
      setGuid(Math.random().toString(36).substring(2, 15));
      websocket.send(
        JSON.stringify({
          command: "subscribe",
          identifier: JSON.stringify({
            id: guid,
            channel: "MessagesChannel",
            chat_id: chat?.chat?.id,
          }),
        })
      );
    };
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newMessage = data.message;
      if (newMessage && newMessage.chat_id === chat.chat.id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };
    websocket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      websocket.close();
    };
  }, [chat.chat.id]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/chats/${chat?.chat?.id}/messages`
      );
      setMessages(response.data);
      setShowLoader(false);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Error fetching messages.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [chat?.chat?.id]);

  const handleReplyId = (message) => {
    setMessageToBeReplied(message);
  };

  useEffect(() => {
    if (messageToBeReplied.id) {
      console.log(messageToBeReplied.id);
    }
  }, [messageToBeReplied]);

  const handleSend = async () => {
    let data;
    if (!message) {
      toast.error("Enter message to send.");
      return;
    }
    if (messageToBeReplied) {
      data = {
        message: {
          message_text: message,
          user_id: userInfo?.data?.id,
          chat_id: chat?.chat?.id,
          reply_id: messageToBeReplied?.id,
        },
      };
    } else {
      data = {
        message: {
          message_text: message,
          user_id: userInfo?.data?.id,
          chat_id: chat?.chat?.id,
          reply_id: null,
        },
      };
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/chats/${chat?.chat?.id}/messages`,
        data
      );
      setMessage("");
      fetchData();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error sending message.");
    }
  };

  const handleDeleteMessage = async (message_id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/chats/${chat?.chat?.id}/messages/${message_id}`
      );
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== message_id)
      );
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Error deleting message.");
    }
  };

  return (
    <div className="chat_room_right_side_messages_area_div">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="top_bar_for_the_chat_name_and_back_button">
          <div
            className="back_button_for_the_chat_div_header"
            onClick={() => setCloseChat(false)}
          >
            <MdArrowBackIosNew />
          </div>
          <div className="left_side_for_the_single_membership_div">
            <img src={chat.chat.image} alt="" />
          </div>
          <div className="name_of_the_room_on_the_bar">{chat?.chat?.name}</div>
        </div>
        <div
          className="admin_heading_for_right_side_of_the_chat"
          style={{ fontSize: "1.12rem", opacity: ".8" }}
        >
          Admin : <span>{chat.chat.admin}</span>
        </div>
        <div
          className="btn btn-danger"
          style={{ position: "relative", right: "0px" }}
          onClick={() => handleMembershipLeave(chat?.membership_id)}
        >
          Leave Room
        </div>
      </div>
      <div className="body_for_messages_div_single_chat" ref={chatBodyRef}>
        {messages.length > 0 ? (
          messages.map(
            (message, index) =>
              message.message_text && (
                <div
                  key={message.id}
                  onMouseEnter={() =>
                    setShowDots({ ...showDots, [index]: true })
                  }
                  onMouseLeave={() => {
                    setShowDots({ ...showDots, [index]: false });
                    setShowDropDown(false);
                  }}
                  className={
                    userInfo?.data?.id === message?.user?.id
                      ? "single_message_div_for_mapped_message sending_user_id_for_the_color"
                      : "single_message_div_for_mapped_message"
                  }
                >
                  <div style={{ width: "95%" }}>
                    <div className="message_user_name_div_for_the_single_div">
                      {message?.user?.first_name}
                    </div>
                    {message?.reply_to && (
                      <div className="reply_text_area_in_message_for_the_user">
                        <div className="name_of_reply_message_area_for_the_user">
                          Reply to : {message?.reply_to?.user_name}
                        </div>
                        <div className="text_of_reply_text_user_div_for_single_message">
                          {message?.reply_to?.message_text}
                        </div>
                      </div>
                    )}
                    <div className="message_text_div_for_the_single_div">
                      {message?.message_text}
                    </div>
                  </div>
                  <div style={{ width: "5%" }}>
                    {showDots[index] && (
                      <>
                        {showDropDown ? (
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowDropDown(false)}
                          >
                            <FaTimes />
                          </span>
                        ) : (
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowDropDown(true)}
                          >
                            <BsThreeDotsVertical />
                          </span>
                        )}
                        {showDropDown && (
                          <div className="options_dropdown_for_the_dots">
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                              }}
                              onClick={() => handleReplyId(message)}
                            >
                              <BsFillReplyAllFill
                                style={{ marginRight: ".4rem" }}
                              />{" "}
                              Reply
                            </div>
                            {userInfo?.data?.id === message?.user?.id && (
                              <>
                                <hr />
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleDeleteMessage(message?.id)
                                  }
                                >
                                  <RiDeleteBin4Line
                                    style={{ marginRight: ".4rem" }}
                                  />{" "}
                                  Delete
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )
          )
        ) : showLoader ? (
          <div className="no_message_error_for_blank_chat">
            <div>
              <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
            <div className="description_for_no_message_for_blank_chat">
              Please wait while we are loading your messages!
            </div>
          </div>
        ) : (
          <div className="no_message_error_for_blank_chat">
            <div className="heading_for_no_message_for_blank_chat">
              No Messages Yet!
            </div>
            <div className="description_for_no_message_for_blank_chat">
              Type and send a message to start a conversation.
            </div>
          </div>
        )}
      </div>
      {messageToBeReplied.id && (
        <div className="message_to_be_replied_div_message_display ">
          <div className="name_for_the_current_candidate_for_reply_and_cross">
            <div className="name_for_the_current_candidate_for_reply">
              Reply to : {messageToBeReplied?.user?.first_name}
            </div>
            <div
              className="cross_btn_for_the_remove_reply_message_div"
              onClick={() => setMessageToBeReplied({})}
            >
              <FaTimes />
            </div>
          </div>
          <div className="body_for_the_message_to_be_replied_div">
            {messageToBeReplied.message_text}
          </div>
        </div>
      )}
      <div className="message_sending_area_div_for_the_chat">
        <div>
          <div style={{ marginTop: "-27rem", position: "absolute" , bottom : "5.5rem"}}>
            {showEmojiBox && <EmojiPicker onEmojiClick={handleEmojiClick} />}
          </div>
          <div onClick={() => setShowEmojiBox(!showEmojiBox)} className={!showEmojiBox ? "show_lower_box_text_div btn btn-secondary" : "btn btn-secondary"}><HiOutlineFaceSmile /></div>
        </div>
        {/* Pass inputRef */}
        <div className="input_for_the_message_in_chat_right_side">
          <input
            ref={inputRef} // Set the ref to the input field
            type="text"
            value={message}
            placeholder="Type here a message to send"
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div
          className="button_for_sending_message_chat btn btn-success"
          onClick={handleSend}
        >
          <FiSend />
        </div>
        {/* <button onClick={handleFetchSuggestion}>Fetch Suggestion</button> */}
      </div>
    </div>
  );
};

export default ChatRightSide;
