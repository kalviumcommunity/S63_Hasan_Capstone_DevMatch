import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate

// --- Import your components ---
import Header from '../components/Header';     // Adjust path if needed
import Button from '../components/Button';     // Adjust path if needed
// ------------------------------

// --- Import the CSS for this page ---
import '../styles/Landing.css';         // Adjust path if needed
// ------------------------------------

const Landing = () => {
  const navigate = useNavigate(); // Hook for navigation

  // --- Button Click Handlers ---
  const handleGetStartedClick = () => {
    navigate('/signup'); // Navigate to signup page
  };

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to login page
  };
  // -----------------------------

  return (
    <div className="page-container">
      <Header /> {/* Use the imported Header component */}

      <main className="main-content">

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-container">
            <h1 className="main-title">Find Your Perfect Coding Partner</h1>
            <p className="hero-text">Connect with developers who share your passion and complement your skills.</p>
            <p className="hero-text">Build amazing projects together.</p>

            <div className="feature-badges">
              <span className="badge">✓ Free to join</span>
              <span className="badge">✓ Verified developers</span>
            </div>

            {/* Use your imported Button component with correct props */}
            <div className="cta-buttons">
               {/* Note: Styling variants (primary/secondary) might require */}
               {/* adjustments in your Button component if needed */}
               <Button text="Get Started" onClick={handleGetStartedClick} />
               <Button text="Login" onClick={handleLoginClick} />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="steps-section">
          <div className="steps-container">
            <h2 className="section-title">How It Works</h2>
            <div className="steps-grid">
              {/* Step Cards */}
              <div className="step-card">
                <div className="step-icon">👤</div>
                <h3>Create Your Profile</h3>
                <p>Build your developer profile with your skills, experiences, and project preferences.</p>
              </div>
              <div className="step-card">
                <div className="step-icon">🔍</div>
                <h3>Get Matched</h3>
                <p>Our algorithm finds developers who match your skillset and project interests.</p>
              </div>
              <div className="step-card">
                <div className="step-icon">🤝</div>
                <h3>Start Collaborating</h3>
                <p>Connect with your matches and begin building amazing projects together.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-container">
            {/* Stat Items */}
            <div className="stat-item"><span className="stat-number">10k+</span><span className="stat-label">Active Developers</span></div>
            <div className="stat-item"><span className="stat-number">5k+</span><span className="stat-label">Successful Matches</span></div>
            <div className="stat-item"><span className="stat-number">1k+</span><span className="stat-label">Projects Launched</span></div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="final-cta">
          <div className="cta-container">
            <h2 className="cta-title">Ready to Find Your Match?</h2>
            <p className="cta-text">Join thousands of developers who've found their perfect coding partner.</p>
             {/* Use your imported Button component */}
             {/* Consider variant prop for styling if needed */}
            <Button text="GET STARTED NOW" onClick={handleGetStartedClick} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Footer Columns */}
             <div className="footer-column"><h4>Platform</h4><ul><li><Link to="/how-it-works">How it Works</Link></li><li><Link to="/projects">Browse Projects</Link></li><li><Link to="/success-stories">Success Stories</Link></li></ul></div>
            <div className="footer-column"><h4>Company</h4><ul><li><Link to="/about">About Us</Link></li><li><Link to="/blog">Blog</Link></li><li><Link to="/careers">Careers</Link></li></ul></div>
            <div className="footer-column"><h4>Resources</h4><ul><li><Link to="/docs">Documentation</Link></li><li><Link to="/help">Help Center</Link></li><li><Link to="/faq">FAQs</Link></li></ul></div>
            <div className="footer-column"><h4>Connect</h4><ul><li><a href="#" target="_blank" rel="noopener noreferrer">Twitter</a></li><li><a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a></li><li><a href="#" target="_blank" rel="noopener noreferrer">GitHub</a></li></ul></div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} DevMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;