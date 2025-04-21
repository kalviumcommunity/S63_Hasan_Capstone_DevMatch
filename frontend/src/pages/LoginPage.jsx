import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LoginPage.css';

function LoginPage() {
  return (
    <div className="login-container">
      <div className="login-header">
        <h1 className="login-logo">DevMatch</h1>
        <h2 className="login-title">Welcome back, developer!</h2>
      </div>

      <form className="login-form">
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
            placeholder="Enter your password"
            className="form-input"
          />
          <Link to="/forgot-password" className="forgot-password">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="login-button">
          LOG IN
        </button>
      </form>

      <div className="signup-link">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </div>

      <div className="divider">
        <span className="divider-line"></span>
        <span className="divider-text">OR</span>
        <span className="divider-line"></span>
      </div>

      <div className="social-login">
        <button className="social-button github">
          Continue with GitHub
        </button>
        <button className="social-button google">
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default LoginPage;