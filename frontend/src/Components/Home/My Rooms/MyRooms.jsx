import axios from "axios";
import "./MyRooms.css";
import React, { useEffect, useState } from "react";
import { MdGroups3 } from "react-icons/md";
import { FaUserLock } from "react-icons/fa";

const MyRooms = () => {
  const [myRooms, setMyRooms] = useState([]);
  const [members, setMembers] = useState([]);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    fetchMyChats()
  }, []);

  const userInfo = JSON.parse(localStorage.getItem("User"))
  const user = userInfo.data;
  
  const fetchMyChats = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/my-chats`, {
        headers: {
          Authorization: localStorage.getItem("Token"),
        },
      })
      .then((res) => {
        console.log(res);
        setMyRooms(res.data.chats);
        setShowLoader(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleShowMembers = (chat_id) => {
    const id = chat_id;
    axios
      .get(`${process.env.REACT_APP_API_URL}/show-members/${id}`, {
        headers: {
          Authorization: localStorage.getItem("Token"),
        },
      })
      .then((res) => {
        console.log(res);
        setMembers(res.data.members);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRemoveAdminMember = (membership_id , chat_id) => {
    axios
    .delete(`${process.env.REACT_APP_API_URL}/memberships/${membership_id}`)
    .then((res) => {
      console.log(res);
      handleShowMembers(chat_id)
      fetchMyChats()
    })
    .catch((err) => {
      console.log(err);
    });
  console.log(membership_id);
  }

  return (
    <div className="my_rooms_main_page_div_for_the_all_rooms">
      <div>
        <center>
          <h1>My Rooms</h1>
        </center>
      </div>
      {showLoader ? (
        <div className="no_message_error_for_blank_chat" style={{marginTop : "5rem"}}>
          <div>
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
          <div className="description_for_no_message_for_blank_chat">
            Loading Rooms!
          </div>
        </div>
      ) : (
        <div className="all_chats_maps_div_for_my_rooms_div">
          {myRooms.map((myRoom) => {
            return (
              <div className="single_div_for_the_all_chats_div_in_my_rooms">
                <div className="card">
                  <div className="image_div_for_the_chat_image_div_in_single_chat">
                    <img
                      src={myRoom.image}
                      className="card-img-top"
                      alt="..."
                      style={{
                        height: "15rem",
                        width: "15rem",
                        position: "relative",
                        left: "50%",
                        transform: "translate(-50%)",
                        marginTop: "1rem",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{myRoom.name}</h5>
                    <div className="status_of_the_single_room_searched_div">
                      <div
                        className="stauts_heading_for_the_single_searched_div"
                        style={{ color: "black" }}
                      >
                        Status :
                      </div>
                      <div className="dynamic_stauts_entity_for_the_room_privacy_div">
                        {myRoom.private ? (
                          <span>
                            <FaUserLock
                              style={{
                                fontSize: "1.2rem",
                                marginBottom: ".2rem",
                              }}
                            />{" "}
                            Private
                          </span>
                        ) : (
                          <span>
                            <MdGroups3
                              style={{
                                fontSize: "1.3rem",
                                marginBottom: ".2rem",
                              }}
                            />{" "}
                            Public
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="members_count_div_for_the_single_chat">
                      Members :{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {myRoom.members}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-success"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={() => handleShowMembers(myRoom.id)}
                    >
                      Members
                    </button>

                    <div
                      className="modal fade"
                      id="exampleModal"
                      tabindex="-1"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h1
                              className="modal-title fs-5"
                              id="exampleModalLabel"
                            >
                              Room Members
                            </h1>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <div className="all_members_div_map_for_single_room">
                              {members.map((member) => {
                                return (
                                  <div className="single_member_for_single_chat_in_modal">
                                    <div className="user_iamge_div_for_the_single_chat">
                                      <img
                                        src="https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                                        alt=""
                                      />
                                    </div>
                                    <div className="name_for_the_single_member_div_in_singel_div">
                                      {member.first_name} {member.user_id == user.id && "(You)"}
                                    </div>
                                    <div className="email_for_the_single_member_div_in_singel_div">
                                      {member.email}
                                    </div>
                                    <div className="remove_btn_for_single_member_div">
                                      <button className="btn btn-danger" onClick={() => handleRemoveAdminMember(member.membership_id , myRoom.id)}>
                                        {member.user_id == user.id ? "Leave" : "Remove"}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal"
                            >
                              Close
                            </button>
                            <button type="button" className="btn btn-primary">
                              Save changes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyRooms;
