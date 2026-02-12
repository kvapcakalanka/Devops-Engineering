import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/path/to/logo.png" alt="Find It Local" />
        <span>Find It Local</span>
      </div>
      <ul className="navbar-links">
        <li><a href="/">Home</a></li>
        <li className="dropdown">
          <a href="/services">Services</a>
          <ul className="dropdown-menu">
            <li><a href="/services/service1">Service 1</a></li>
            <li><a href="/services/service2">Service 2</a></li>
          </ul>
        </li>
        <li><a href="/find">Find</a></li>
        <li><a href="/about">About Us</a></li>
        <li><a href="/contact">Contact Us</a></li>
      </ul>
      <div className="navbar-language">
        <button className="language-button">
          <span className="language-icon">🌐</span>
          English
        </button>
      </div>
    </nav>
  );
};

export default Navbar;