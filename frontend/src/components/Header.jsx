// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link if your logo should link home

const Header = () => {
  return (
    <header style={{
        // --- Layout & Spacing ---
        display: 'flex',
        justifyContent: 'space-between', // Pushes items to ends
        alignItems: 'center',           // Vertically centers items
        padding: '1rem',                // Equivalent to p-4 (adjust as needed)
        width: '100%',                  // Ensure header spans full width

        // --- Appearance ---
        backgroundColor: '#ffffff',     // White background
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // Standard shadow
        borderBottom: '1px solid #e5e7eb' // Optional subtle border
      }}
      // Or use a CSS class: className="site-header"
    >
      {/* Logo/Brand Name - Link to homepage */}
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 style={{
            fontSize: '1.5rem', // text-2xl
            fontWeight: 'bold',
            margin: 0 // Remove default heading margin
          }}
        >
          DevMatch
        </h1>
      </Link>

      {/* Navigation Links (Optional) */}
      <nav>
        {/* Add navigation links here if needed */}
        {/* Example:
        <Link to="/features" style={{ marginRight: '1rem' }}>Features</Link>
        <Link to="/login">Login</Link>
        */}
      </nav>
    </header>
  );
};

export default Header;