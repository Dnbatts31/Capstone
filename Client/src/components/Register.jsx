import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* TODO - add your code to create a functional React component that renders a registration form */
export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const API_URL = "https://capstone-3efc.onrender.com"; //"http://127.0.0.1:3000";
  const navigate = useNavigate();

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
      .then((data) => {
        console.log(data);
        navigate("/login");
      })
      .catch(console.error);
  }
  return (
    <>
      <h2 className="title">Register</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="username">
          Username:&nbsp;
          <input
            type="username"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label htmlFor="password">
          Password:&nbsp;
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Register</button>
      </form>
    </>
  );
}
