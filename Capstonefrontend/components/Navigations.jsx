import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
/* TODO - add your code to create a functional React component that renders a navigation bar for the different views in your single page application. You may consider conditionally rendering some options - for example 'Login' should be available if someone has not logged in yet. */
export default function Navigations() {
  function isAuthenticated() {
    return true;
  }

  return (
    <nav>
      <header>
        <img src="../assets/books.png" alt="stacked books" />
        <h1>bookebuddy</h1>
      </header>
      <div>
        <ul>
          <li>
            <Link to="/books">Books</Link>
          </li>
        </ul>
      </div>
      <div>
        <ul>
          {isAuthenticated() ? (
            <li>
              <Link to="/account">Account</Link>
            </li>
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
