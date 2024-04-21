import { useState, useEffect } from "react";

/* TODO - add your code to create a functional React component that renders account details for a logged in user. Fetch the account data from the provided API. You may consider conditionally rendering a message for other users that prompts them to log in or create an account.  */
export default function Cart(props) {
  const API_URL = "http://127.0.0.1:3000";
  const [products, setProducts] = useState([]);

  async function fetchAccount() {
    await fetch(`/api/users/${props.user}/carts`)
      .then((response) => response.json())
      .then((result) => {
        setProducts(result);
      })
      .catch(console.error);
  }

  return (
    <>
      <h2>Cart</h2>
      <section>
        <h3>Shopping Items:</h3>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <h4>{product.name}</h4>
              <p>{product.quantity}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
