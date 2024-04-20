import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

/* TODO - add your code to create a functional React component that renders details for a single Product. Fetch the Product data from the provided API. You may consider conditionally rendering a 'Checkout' button for logged in users. */
export default function SingleProduct() {
  const { id } = useParams();
  let [product, setProduct] = useState({})
  const API_URL = "http://127.0.0.1:3000"

  useEffect(() => {
    async function getProduct() {
      try {
        await fetch(`${API_URL}/api/products/${id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(result => {
            console.log(result);
            setProduct(result);
          })
          .catch(console.error);
      } catch (error) {
        console.log(error);
      }
    }
    getProduct();
    console.log(product);
  }, []);

  return (
    <>
      <h1>{product.name}</h1>
      <p>In stock: {product.quantity}</p>
    </>
  )
}
