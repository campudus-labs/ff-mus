import React from 'react';
import { Link } from 'react-router';

const Menu = () => (
  <nav>
    <h1>Menu</h1>
    <ul>
      <li><Link to="/">Start</Link></li>
      <li><Link to="/login">Login</Link></li>
      <li><Link to="/faq">FAQ</Link></li>
    </ul>
  </nav>
);

export default Menu;
