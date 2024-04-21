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
import './App.css';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  let { id } = useParams();

  return (
    <>
      <Router>
        <Navigations setToken={setToken} token={token}/>
        <Routes>
          <Route path="/products/:id" element={<Product user={user}/>} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart user={user}/>} />
          <Route path="/login" element={<Login setToken={setToken} setUser={setUser}/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Products />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
