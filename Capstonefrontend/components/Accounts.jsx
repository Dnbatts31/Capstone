import { useState, useEffect } from "react";

/* TODO - add your code to create a functional React component that renders account details for a logged in user. Fetch the account data from the provided API. You may consider conditionally rendering a message for other users that prompts them to log in or create an account.  */
export default function Account() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [books, setBooks] = useState([]);

  useEffect(() => fetchAccount());

  async function fetchAccount() {
    await fetch("/api/users/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer TOKEN_STRING_HERE",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        updatePage(result);
      })
      .catch(console.error);
  }

  function updatePage(result) {
    setEmail(result.email);
    setName(result.firstName + " " + result.lastName);
    setBooks(result.books);
  }

  return (
    <>
      <h2>My Account</h2>
      <section>
        <h3>Account Details:</h3>
        <ul>
          <li>Name: {name}</li>
          <li>Email: {email}</li>
        </ul>
        <h3>Rented Books</h3>
        <ul>{}</ul>
      </section>
    </>
  );
}
