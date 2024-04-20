import { Link } from "react-router-dom";
/* TODO - add your code to create a functional React component that renders a navigation bar for the different views in your single page application. You may consider conditionally rendering some options - for example 'Login' should be available if someone has not logged in yet. */
export default function Navigations() {
  // TODO - implement the authentication check
  function isAuthenticated() {
    return false;
  }

  // TODO - implement the log out handler
  async function handleLogOut() {
    console.log("Logging out");
  }

  return (
    <nav>
      <header>
        <img src="../assets/logo.png" alt="meek's logo" />
        <h1>Meeks T-Shirt Shop</h1>
      </header>
      <div>
        <ul>
          <li>
            <Link to="/products">T-Shirts</Link>
          </li>
        </ul>
      </div>
      <div>
        <ul>
          {isAuthenticated() ? (
            <>
              <li>
                <Link to="/cart">Cart</Link>
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
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
