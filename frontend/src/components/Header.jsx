import React from 'react';

const Header = () => {
  return (
    <header className="p-4 flex justify-between items-center shadow">
      <h1 className="text-2xl font-bold">DevMatch</h1>
      <nav>
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Login</button>
      </nav>
    </header>
  );
};

export default Header;
