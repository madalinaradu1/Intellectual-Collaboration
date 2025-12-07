import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = ({ user, signOut }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>IC</h2>
      </div>
      <div className="navbar-menu">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/profile" className="nav-link">Profile</Link>
        <Link to="https://sites.gcu.edu/ic/" className="nav-link">WordPress</Link>
        <button onClick={signOut} className="sign-out-btn">
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;