import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import Navigations from "./components/Navigations.jsx";
import Products from "./components/Products.jsx";
import Product from "./components/Product.jsx";
import Login from "./components/Login.jsx";
import Cart from "./components/Cart.jsx";
import Register from "./components/Register.jsx";

function App() {
  const [token, setToken] = useState(null);
  let { id } = useParams();

  return (
    <>
      <Router>
        <Navigations set-token={setToken}/>
        <Routes>
          <Route path="/products/:id" element={<Product />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login set-token={setToken}/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Products />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
