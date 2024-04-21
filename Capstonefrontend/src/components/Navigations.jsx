import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

/* TODO - add your code to create a functional React component that renders a navigation bar for the different views in your single page application. You may consider conditionally rendering some options - for example 'Login' should be available if someone has not logged in yet. */
export default function Navigations(props) {
  const API_URL = "http://127.0.0.1:3000"

  function isAuthenticated() {
    fetch(`${API_URL}/api/auth/validate`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${props.token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return true;
        }
        throw new Error("could not validate");
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }

  async function handleLogOut(e) {
    e.preventDefault();
    console.log("Logging out");
    props.setToken(null);
  }

  return (
    <nav>
      <header>
        <img src={logo} alt="meek's logo" height="100px" />
        <h1>Meeks T-Shirt Shop</h1>
      </header>
      <div className="nav-links">
        <ul>
          <li>
            <Link className="a" to="/products">T-Shirts</Link>
          </li>
        </ul>
      </div>
      <div className="nav-account">
        <ul>
          {props.token ? (
            <>
              <li>
                <Link className="a" to="/cart">Cart</Link>
              </li>
              <li>
                <a href="#" onClick={handleLogOut}>
                  Log Out
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link className="a" to="/login">Login</Link>
              </li>
              <li>
                <Link className="a" to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
