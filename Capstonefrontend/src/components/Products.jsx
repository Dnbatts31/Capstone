import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/* TODO - add your code to create a functional React component that displays all of the available products in the library's catalog. Fetch the product data from the provided API. Users should be able to click on an individual product to navigate to the SingleProduct component and view its details. */
export default function Products() {
  const dummydata = [{ id: 0, title: "dummy" }];
  const [products, setProducts] = useState(dummydata);
  const API_URL = "http://127.0.0.1:3000"

  useEffect(() => {
    async function getProducts() {
      try {
        await fetch(
          `${API_URL}/api/products`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => response.json())
          .then((result) => {
            setProducts(result);
          })
          .catch(console.error);
      } catch (error) {
        console.log(error);
      }
    }
    getProducts();
  }, []);

  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => {
        return (
          <Link key={product.id} to={`/products/${product.id}`}>
            <section className="product-card">
              {/* <img src={product.coverimage} alt={product.title + " cover image"} height="200px" /> */}
              <div className="product-card-contents">
                <h3>{product.name}</h3>
                <p>In stock: {product.quantity}</p>
              </div>
            </section>
          </Link>
        );
      })}
    </div>
  );
}
