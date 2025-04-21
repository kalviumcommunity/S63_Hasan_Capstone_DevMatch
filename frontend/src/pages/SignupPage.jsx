import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/SignupPage.css';



function SignupPage() {
  return (
    <div className="signup-container">
      <div className="signup-header">
        <h1 className="signup-logo">DevMatch</h1>
        <h2 className="signup-title">Create your account</h2>
        <p className="signup-subtitle">Join thousands of developers finding their perfect match</p>
      </div>

      <form className="signup-form">
        <div className="form-group">
          <label htmlFor="fullname">Full Name</label>
          <input
            type="text"
            id="fullname"
            placeholder="John Doe"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Min. 8 characters"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            placeholder="Re-enter password"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">I am a</label>
          <select id="role" className="form-input">
            <option value="">Select your role</option>
            <option value="frontend">Frontend Developer</option>
            <option value="backend">Backend Developer</option>
            <option value="fullstack">Fullstack Developer</option>
            <option value="designer">UI/UX Designer</option>
          </select>
        </div>

        <div className="privacy-notice">
          Your data is secure and will never be shared
        </div>

        <button type="submit" className="signup-button">
          CREATE ACCOUNT
        </button>
      </form>

      <div className="login-link">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </div>
  );
}

export default SignupPage;