import React from 'react'
import './LandingPage.css'
import Login from '../../Login&Signup/Login'

const LandingPage = () => {
  return (
    <div className="landing_page_main_div_for_chat_app_home_div">
      <div className="left_side_div_for_hero_section">
        <div className="left_side_hero_section_heading_div">
          Join Our Chatroom Community!
        </div>
        <div className="left_side_hero_sectio_desc_div">
          Connect instantly, chat freely, and discover new connections with our chatroom app.
        </div>
      </div>
      <div className="right_side_div_for_hero_section">
        <Login />
      </div>
    </div>
  )
}

export default LandingPage