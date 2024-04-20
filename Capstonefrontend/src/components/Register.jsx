import { useState } from "react";

/* TODO - add your code to create a functional React component that renders a registration form */
export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const API_URL = "http://127.0.0.1:3000/"

  function handleSubmit(e) {
    e.preventDefault();
    fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch(console.error);
  }
  return (
    <>
      <h2>register</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">
          Username:
          <input
            type="username"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <br />
        <label htmlFor="password">
          Password:
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Register</button>
      </form>
    </>
  );
}
