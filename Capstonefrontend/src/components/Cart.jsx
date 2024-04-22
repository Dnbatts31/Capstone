import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

/* TODO - add your code to create a functional React component that renders account details for a logged in user. Fetch the account data from the provided API. You may consider conditionally rendering a message for other users that prompts them to log in or create an account.  */
export default function Cart(props) {
  const API_URL = "https://capstone-3efc.onrender.com"; //"http://127.0.0.1:3000";
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAccount() {
      setIsLoading(true);
      await fetch(`${API_URL}/api/users/${props.user}/carts`)
        .then((response) => response.json())
        .then((result) => {
          setProducts(result);
          console.log(result);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setIsLoading(false);
        }
      );
    }
    fetchAccount();
  }, [props.user]);

  async function checkout() {
    await fetch(`${API_URL}/api/users/${props.user}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setProducts([]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  async function handleX(product) {
    await fetch(`${API_URL}/api/users/${props.user}/carts/${product.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setProducts(result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <>
      <h2 className="title">Cart</h2>
      {isLoading && <p>Loading...</p>}
      <section>
        <ul>
          {products.map((product, i) => (
            
            <li key={i} className="product-card">
                  <div className="product-card-contents">
                    <Link className="a" to={`/products/${product.id}`}>
                    <h4>{product.name}</h4>
                    <p>Quantity: {product.quantity}</p>
                    </Link>
                    <img src="https://cdn-icons-png.flaticon.com/128/1828/1828843.png" alt="x" height="30px" onClick={() => handleX(product)} />
                  </div>
              </li>
          ))}
        </ul>
        <button onClick={checkout}>Checkout</button>
      </section>
    </>
  );
}
