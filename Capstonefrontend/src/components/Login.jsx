/* TODO - add your code to create a functional React component that renders a login form */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const API_URL = "http://127.0.0.1:3000"
  const navigate = useNavigate();

  // TODO: Create or store token on front-end to use for authentication
  function handleSubmit(e) {
    e.preventDefault();
    fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      }).then(response => response.json())
        .then(result => {
          if (result.token) {
            props.setToken(result.token);
            props.setUser(result.userID);
            navigate('/');
          }
        })
        .catch(console.error);
  }
  return (
    <>
      <h2 className='title'>Login</h2>
      <form className='form' onSubmit={handleSubmit}>
        <label htmlFor="username">
          Username:&nbsp;
          <input 
            type="username" 
            id="username" 
            name="username" 
            value={username} onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </label>
        <label htmlFor="password">
          Password:&nbsp;
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={password} onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </>
  );
}
