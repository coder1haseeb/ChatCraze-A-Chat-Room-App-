import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import './Login.css'

function Login({ token }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error('Please fill all the fields.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/sign_in`, {
        user: {
          email: email,
          password: password,
        },
      });

      const userInfo = JSON.stringify(response.data.status);
      localStorage.setItem('User', userInfo);

      if (response.headers.authorization) {
        const token = response.headers.authorization;
        localStorage.setItem('Token', token);
        console.log('Token:', token);
      } else {
        console.error('Token not found in response headers');
      }

      console.log(response.headers.authorization);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (token) {
      toast.info('You are already logged in.');
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <div className="login_form_main_div_for_landing_page_div">
      <div className="heading_for_the_login_div_hero_section">
        Login Here !
      </div>
      <div class="form-floating mb-3">
        <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)}/>
        <label for="floatingInput">Email address</label>
      </div>
      <div class="form-floating">
        <input type="password" class="form-control" id="floatingPassword" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
        <label for="floatingPassword">Password</label>
      </div>
      <button className='login_btn_for_hero_section btn btn-success' onClick={handleSubmit}>Login</button>
      <div className="dont_have_any_account" onClick={() => navigate("/signup")}>
        Don't have account? Create now!
      </div>
    </div>
  );
}

export default Login;
