import React from 'react';

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-4">
      <ul>
        <li className="mb-4">Dashboard</li>
        <li className="mb-4">Matches</li>
        <li className="mb-4">Projects</li>
        <li className="mb-4">Messages</li>
        <li>Settings</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
