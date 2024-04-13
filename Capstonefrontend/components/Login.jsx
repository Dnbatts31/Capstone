/* TODO - add your code to create a functional React component that renders a login form */

import { useState } from 'react';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    API_PATH = 'https://fsa-book-buddy-b6e748d1380d.herokuapp.com'

  function handleSubmit(e) {
    e.preventDefault();
    fetch(`${API_PATH}/api/users/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
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
        <label htmlFor="email">
          Email:
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={email} onChange={(e) => setEmail(e.target.value)} 
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
