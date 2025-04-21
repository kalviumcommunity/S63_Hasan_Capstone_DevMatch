import React from 'react';
import '../styles/NotFound.css';

function NotFound() {
  return (
    <div className="not-found-page">
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <a href="/">Go to Home</a>
    </div>
  );
}

export default NotFound;