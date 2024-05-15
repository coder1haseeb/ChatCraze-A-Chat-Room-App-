import axios from "axios";
import React, { useState } from "react";
import { IoCreateOutline } from "react-icons/io5";
import { toast } from "react-toastify";

const ChatCreateModal = ({ userInfo , fetchMemberships }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isInvitable, setIsInvitable] = useState(false);
  const [imageFile, setImageFile] = useState(null); // State to store the image file

  const user = JSON.parse(localStorage.getItem("User"));

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Must enter Room Name!");
      return;
    }
    if (isPrivate && !password) {
      toast.error("Private Room must have Password.");
      return;
    }
    if (isPrivate && password.length < 8) {
      toast.warn("Password should be at least 8 characters long!");
      return;
    }

    const formData = new FormData();
    formData.append("chat[name]", name);
    formData.append("chat[private]", isPrivate);
    formData.append("chat[invitable]", isInvitable);
    formData.append("chat[room_password]", password);
    formData.append("chat[admin_id]", user.data.id);
    formData.append("chat[image]", imageFile); // Append the image file

    axios
      .post(`${process.env.REACT_APP_API_URL}/chats`, formData, {
        headers: {
          Authorization: localStorage.getItem("Token"),
          "Content-Type": "multipart/form-data", // Set content type for FormData
        },
      })
      .then((response) => {
        console.log(response.data);
        toast.success(response.data.message);
        setName("")
        setPassword("")
        setIsPrivate(false)
        setIsInvitable(false)
        setImageFile(null)
        fetchMemberships()
      })
      .catch((error) => {
        console.error("Error creating room:", error);
      });
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
        data-bs-target="#exampleModal"
      >
        <IoCreateOutline />
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        data-bs-theme="dark"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog  modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Create a Room
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="form-floating mb-3">
                {/* Input for image */}
                <input
                  type="file"
                  className="form-control"
                  id="imageInput"
                  accept="image/jpeg, image/jpg, "
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
                <label htmlFor="imageInput">Choose Image</label>
              </div>
              {/* Display the selected image */}
              {imageFile && (
                <div
                  className="div_for_display_image_in_create_room"
                  style={{
                    marginBottom: "1rem",
                  }}
                >
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Selected Image"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      height: "20rem",
                      width: "20rem",
                      borderRadius: "50%",
                      position: "relative",
                      left: "50%",
                      transform: "translate(-50%)",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="nameInput"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="nameInput">Name</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  id="privateCheckbox"
                />
                <label
                  className="form-check-label"
                  htmlFor="privateCheckbox"
                >
                  Private Room
                </label>
              </div>
              {isPrivate && (
                <div>
                  <div className="form-floating" style={{ marginTop: "1rem" }}>
                    <input
                      type="password"
                      className="form-control"
                      id="passwordInput"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="passwordInput">Password</label>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleCreateRoom}
              >
                Create Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCreateModal;
