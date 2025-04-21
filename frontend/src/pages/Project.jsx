import React from 'react';
import Sidebar from '../components/Sidebar';

function Project() {
  return (
    <div className="project-page flex">
      <Sidebar />
      <div className="content p-4">
        <h2>E-commerce Platform</h2>
        <section>
          <h3>Description</h3>
          <p>Full description of the project...</p>
        </section>
        <section>
          <h3>Technologies</h3>
          <ul>
            <li>React</li>
            <li>Node.js</li>
            <li>MongoDB</li>
          </ul>
        </section>
        <section>
          <h3>Project Creator</h3>
          <p>John Doe</p>
        </section>
      </div>
    </div>
  );
}

export default Project;