// src/components/Button.jsx
import React from 'react';

const Button = ({ text, onClick }) => {
  return (
    <button
      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded" // Tailwind classes for styling
      onClick={onClick} // Propagate the onClick handler
    >
      {text} {/* Display the button text */}
    </button>
  );
};

export default Button;