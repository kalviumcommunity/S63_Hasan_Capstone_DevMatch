import React from 'react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';

function Match() {
  return (
    <div className="match-page flex">
      <Sidebar />
      <div className="content p-4">
        <h2>Project Matches</h2>
        <div className="filters">Filter Components Here</div>
        <div className="matches">
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </div>
  );
}

export default Match;