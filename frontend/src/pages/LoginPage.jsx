import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      console.log('Attempting login with:', { email });
      const user = await login({ email, password });
      console.log('Login successful:', user);
      console.log('Token in localStorage:', localStorage.getItem('token'));
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setMessage(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gray-50">
      <div className="w-full max-w-2xl p-12 bg-white rounded-3xl shadow-xl space-y-10 transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold text-gray-800">DevMatch</h1>
          <p className="text-lg text-gray-600">Welcome back, developer!</p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-base font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-base font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg"
            />
            <Link to="/forgot-password" className="block text-sm text-blue-500 hover:underline text-right">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            LOG IN
          </button>

          {(message || authError) && (
            <p className="text-center text-red-500 font-medium pt-2">{message || authError}</p>
          )}
        </form>

        {/* Signup link */}
        <div className="text-base text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline font-medium">
            Sign up
          </Link>
        </div>

        {/* Divider */}
        <div className="flex items-center space-x-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-gray-500 text-sm font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Social Login */}
        <div className="space-y-5">
          <button 
            type="button"
            className="w-full py-4 bg-gray-800 text-white text-lg rounded-lg hover:bg-gray-900 font-medium transition"
          >
            Continue with GitHub
          </button>
          <button 
            type="button"
            className="w-full py-4 bg-red-500 text-white text-lg rounded-lg hover:bg-red-600 font-medium transition"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;