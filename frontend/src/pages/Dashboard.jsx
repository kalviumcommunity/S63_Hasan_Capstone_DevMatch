import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <nav className="dashboard-nav">
        <div className="nav-left">
          <Link to="/" className="nav-logo">DevMatch</Link>
          <Link to="/dashboard" className="nav-link active">Dashboard</Link>
        </div>
        <div className="nav-right">
          <span className="nav-user">Hasan Ahmed</span>
          <div className="user-avatar">HA</div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <h2>Welcome back, Hasan!</h2>
          <p className="welcome-message">Here are some projects that match your skills</p>
        </header>

        <div className="projects-grid">
          {/* Project 1 */}
          <div className="project-card">
            <h3 className="project-title">E-commerce Platform</h3>
            <p className="project-description">Building a modern e-commerce platform with React and Node.js</p>
            <div className="tech-tags">
              <span className="tech-tag">React</span>
              <span className="tech-tag">Node.js</span>
              <span className="tech-tag">MongoDB</span>
            </div>
            <div className="project-actions">
              <button className="action-btn view-btn">View Details</button>
              <button className="action-btn save-btn">Save for later</button>
            </div>
          </div>

          {/* Project 2 */}
          <div className="project-card">
            <h3 className="project-title">Mobile Fitness App</h3>
            <p className="project-description">Creating a cross-platform fitness tracking app with Flutter</p>
            <div className="tech-tags">
              <span className="tech-tag">Flutter</span>
              <span className="tech-tag">Firebase</span>
              <span className="tech-tag">REST API</span>
            </div>
            <div className="project-actions">
              <button className="action-btn view-btn">View Details</button>
              <button className="action-btn save-btn">Save for later</button>
            </div>
          </div>

          {/* Project 3 */}
          <div className="project-card">
            <h3 className="project-title">AI Chat Application</h3>
            <p className="project-description">Developing an AI-powered chat application using Python and TensorFlow</p>
            <div className="tech-tags">
              <span className="tech-tag">Python</span>
              <span className="tech-tag">TensorFlow</span>
              <span className="tech-tag">AWS</span>
            </div>
            <div className="project-actions">
              <button className="action-btn view-btn">View Details</button>
              <button className="action-btn save-btn">Save for later</button>
            </div>
          </div>

          {/* Project 4 */}
          <div className="project-card">
            <h3 className="project-title">Blockchain Wallet</h3>
            <p className="project-description">Implementing a secure cryptocurrency wallet with Web3</p>
            <div className="tech-tags">
              <span className="tech-tag">Solidity</span>
              <span className="tech-tag">Web3.js</span>
              <span className="tech-tag">React</span>
            </div>
            <div className="project-actions">
              <button className="action-btn view-btn">View Details</button>
              <button className="action-btn save-btn">Save for later</button>
            </div>
          </div>
        </div>

        <div className="recent-activity">
          <h3 className="activity-title">Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <p className="activity-text">You matched with Sarah Chen</p>
              <p className="activity-time">2 hours ago</p>
            </div>
            <div className="activity-item">
              <p className="activity-text">New message on "AI Chat Application"</p>
              <p className="activity-time">5 hours ago</p>
            </div>
            <div className="activity-item">
              <p className="activity-text">Project "E-commerce Platform" updated</p>
              <p className="activity-time">Yesterday</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;