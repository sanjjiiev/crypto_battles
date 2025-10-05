import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-brand">
          <h2>Crypto Battles</h2>
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/compare">Comparison</Link>
          <Link to="/leaderboard">Leaderboard</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;