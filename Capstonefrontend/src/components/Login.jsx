/* TODO - add your code to create a functional React component that renders a login form */

import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const API_URL = "http://127.0.0.1:3000"

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
          console.log(result);
        })
        .catch(console.error);
  }
  return (
    <>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">
          Username:
          <input 
            type="username" 
            id="username" 
            name="username" 
            value={username} onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </label>
        <br/>
        <label htmlFor="password">
          Password:
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={password} onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </label>
        <br/>
        <button type="submit">Login</button>
      </form>
    </>
  );
}
