import React from "react";
import axios from 'axios'
import './Login.css'
import {useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify';

export default function Signup() {
  const [firstName , setFirstName] = React.useState("")
  const [lastName , setLastName] = React.useState("")
  const [anonymousName , setAnonymousName] = React.useState("")
  const [gender , setGender] = React.useState("")
  const [email , setEmail] = React.useState("")
  const [password , setPassword] = React.useState("")
  const [passwordConfirmation , setPasswordConfirmation] = React.useState("")
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!firstName || !lastName || !anonymousName || !gender || !email || !password || !passwordConfirmation) {
      toast.error("Please fill all the fields.");
      return;
    }      

    const data = {
      "user" : {
        "first_name" : firstName , 
        "last_name" : lastName,
        "anonymous_name" : anonymousName,
        "gender" : gender,
        "email" : email,
        "password" : password,
        "password_confirmation" : passwordConfirmation
      }
    }
    
    axios.post(`http://127.0.0.1:4000/users`, data)
    .then(res => {
      const userInfo = JSON.stringify(res.data.status);
      localStorage.setItem("User", userInfo);
      toast.success("A confirmation email was sent to your email. Please confirm it.")
      if (res.headers.authorization) {
        const token = res.headers.authorization
        localStorage.setItem("Token", token);
        console.log("Token:", token);
      } else {
        console.error("Token not found in response headers");
      }
      
      toast.error(res.data.message);
    })
    .catch(err => {
      console.error('Error:', err);
    });
  
  };

  return (
    <div className="login_form_main_div_for_landing_page_div sign_up_form_main_div_for_landing_page_div" style={{width : "475px"}}>
      <div className="heading_for_the_login_div_hero_section" style={{color : "black"}}>
        Create Account !
      </div>
      <div className="form-floating mb-3">
        <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" value={firstName} onChange={e => setFirstName(e.target.value)}/>
        <label for="floatingInput">First Name</label>
      </div>
      <div className="form-floating mb-3">
        <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" value={lastName} onChange={e => setLastName(e.target.value)}/>
        <label for="floatingInput">Last Name</label>
      </div>
      <div className="form-floating mb-3">
        <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" value={anonymousName} onChange={e => setAnonymousName(e.target.value)}/>
        <label for="floatingInput">Username</label>
      </div>
      <div className="form-floating mb-3">
        <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" value={gender} onChange={e => setGender(e.target.value)}/>
        <label for="floatingInput">Gender</label>
      </div>
      <div className="form-floating mb-3">
        <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)}/>
        <label for="floatingInput">Email address</label>
      </div>
      <div className="form-floating">
        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
        <label for="floatingPassword">Password</label>
      </div>
      <div className="form-floating" style={{marginTop : "1rem"}}>
        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)}/>
        <label for="floatingPassword">Password Confirmation</label>
      </div>
      <button className='login_btn_for_hero_section btn btn-success' onClick={handleSubmit}>Create Account</button>
      <div className="dont_have_any_account" style={{color : "blue"}} onClick={() => navigate("/")}>
        Already have an Account. Login instead !
      </div>
  </div>
  );
}