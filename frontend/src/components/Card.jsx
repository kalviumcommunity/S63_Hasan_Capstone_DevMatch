import React from 'react';

const Card = ({ title, description, onClick }) => {
  return (
    <div
      className="p-4 border rounded shadow hover:shadow-lg transition cursor-pointer"
      onClick={onClick}
    >
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default Card;