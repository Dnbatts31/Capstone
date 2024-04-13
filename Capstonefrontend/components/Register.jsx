import { useState } from 'react';

/* TODO - add your code to create a functional React component that renders a registration form */
export default function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    API_PATH = 'https://fsa-book-buddy-b6e748d1380d.herokuapp.com'

  function handleSubmit(e) {
    e.preventDefault();
    fetch(`${API_PATH}/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname: firstName,
        lastname: lastName,
        email: email,
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
        <label htmlFor="firstName">
          First Name:
          <input 
            type="text"
            id="firstName" 
            name="firstName" 
            value={firstName} onChange={(e) => setFirstName(e.target.value)} 
            required 
          />
        </label>
        <br/>
        <label htmlFor="lastName">
          Last Name:
          <input 
            type="text" 
            id="lastName" 
            name="lastName" 
            value={lastName} onChange={(e) => setLastName(e.target.value)} 
            required 
          />
        </label>
        <br/>
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
        <button type="submit">Register</button>
      </form>
    </>
  );
}
