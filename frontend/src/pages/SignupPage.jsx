import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const defaultProfileImage = 'https://www.w3schools.com/w3images/avatar2.png';

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setPreviewUrl(URL.createObjectURL(uploadedFile));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (!role) {
      setMessage('Please select your role');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', username.trim());
      formData.append('email', email.trim().toLowerCase());
      formData.append('password', password);
      formData.append('role', role);
      if (file) {
        formData.append('profilePic', file);
      }

      await signup(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      setMessage(err.response?.data?.message || 'Signup failed');
    }
  };

  const handleGoogleSignUp = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  const handleGitHubSignUp = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/github`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="signup-container bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl transform transition duration-300 hover:scale-105">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-blue-600">DevMatch</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mt-2">Create your account</h2>
          <p className="text-sm text-gray-600 mt-1">Join thousands of developers finding their perfect match</p>
        </div>

        <form onSubmit={handleSignup} className="w-full space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="username"
              placeholder="John Doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">I am a</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Select your role</option>
              <option value="frontend">Frontend Developer</option>
              <option value="backend">Backend Developer</option>
              <option value="fullstack">Fullstack Developer</option>
              <option value="designer">UI/UX Designer</option>
            </select>
          </div>

          <div className="text-center">
            <div className="mt-4 flex justify-center">
              <img
                src={previewUrl || defaultProfileImage}
                alt="Profile Preview"
                className="rounded-full w-24 h-24 object-cover border-4 border-blue-500"
              />
            </div>

            <div className="flex justify-center mt-3">
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-blue-500 text-white py-1.5 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out text-sm"
              >
                Upload Profile Picture
              </label>
              <input
                type="file"
                id="file-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out text-base"
          >
            CREATE ACCOUNT
          </button>

          {message && (
            <p className="text-center text-red-500 text-sm mt-1">{message}</p>
          )}
        </form>

        <div className="text-center my-3">
          <p className="text-gray-600 text-sm">OR</p>
        </div>

        <div className="flex justify-center space-x-2">
          <button
            onClick={handleGoogleSignUp}
            className="w-1/2 flex items-center justify-center bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-300 ease-in-out text-sm"
          >
            Sign Up with Google
          </button>

          <button
            onClick={handleGitHubSignUp}
            className="w-1/2 flex items-center justify-center bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 transition duration-300 ease-in-out text-sm"
          >
            Sign Up with GitHub
          </button>
        </div>

        <div className="text-center mt-4 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;