import axios from "axios";
import React from "react";
import { toast } from "react-toastify";

import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const Navbar = ({ token, userInfo }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/users/sign_out`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        toast.success(res.data.message);
        localStorage.removeItem("User");
        localStorage.removeItem("Token");
        setTimeout(() => {
          navigate("/");
        }, 500);
      })
      .catch((err) => {
        toast.error(err.data.message);
      });
  };
  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary"
      style={{ padding: "0.4rem 6rem" }}
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <a
          className="navbar-brand"
          style={{ fontSize: "1.7rem", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          ChatCraze
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul
            className="navbar-nav me-auto mb-2 mb-lg-0"
            style={{ fontSize: "1.3rem" }}
          >
            {/* <li className="nav-item">
            <a className="nav-link active" aria-current="page" >
                Home
            </a>
            </li> */}
          </ul>
          {userInfo && (
            <div className="d-flex" role="search">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle active"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ fontSize: "1.3rem", fontWeight: "bold" }}
                  >
                    {userInfo.data.first_name}
                  </a>
                  <ul
                    className="dropdown-menu drop_down_menu_custom_div"
                    aria-labelledby="navbarDropdown"
                    style={{ position: "absolute", right: "0rem" }}
                  >
                    <li>
                      <a
                        className="dropdown-item"
                        onClick={() => navigate("/my-rooms")}
                      >
                        My Rooms
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a className="dropdown-item" onClick={handleLogout}>
                        <CiLogout /> Log out
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
