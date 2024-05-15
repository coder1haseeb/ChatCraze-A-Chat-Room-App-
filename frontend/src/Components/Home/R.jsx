// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const API_KEY = 'AIzaSyAvNBq-o0GbJIuwzEhUUVxnivbFi3YPtmA'; // Replace with your actual API key
// const MODEL_NAME = "gemini-1.5-pro-latest"; // Assuming you're using Bard API

// function R() {
//   const [messages, setMessages] = useState([]);
//   const [userInput, setUserInput] = useState('');

//   const sendMessage = async () => {
//     if (!userInput) return; // Prevent sending empty messages

//     try {
//       const response = await axios.post('/api/chat', {
//         userInput,
//         model: MODEL_NAME,
//         apiKey: API_KEY,
//       });
//       setMessages([...messages, userInput, response.data.text]);
//       setUserInput('');
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // Simulate initial message (optional)
//   useEffect(() => {
//     setMessages(['Hello, how can I help you today?']);
//   }, []);

//   const handleInputChange = (event) => {
//     setUserInput(event.target.value);
//   };

//   const handleKeyPress = (event) => {
//     if (event.key === 'Enter') {
//       sendMessage();
//     }
//   };

//   return (
//     <div className="R">
//       <ul>
//         {messages.map((message, index) => (
//           <li key={index}>{message}</li>
//         ))}
//       </ul>
//       <form onSubmit={sendMessage}>
//         <input
//           type="text"
//           value={userInput}
//           onChange={handleInputChange}
//           onKeyPress={handleKeyPress}
//         />
//         <button type="submit">Send</button>
//       </form>
//     </div>
//   );
// }

// export default R;
