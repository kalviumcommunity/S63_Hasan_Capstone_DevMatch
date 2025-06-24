import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    console.log('Current user data:', user);
    if (user?.profilePic) {
      console.log('Profile picture URL:', `http://localhost:8000${user.profilePic}`);
    }
  }, [user]);

  // Function to get the full profile picture URL
  const getProfilePicUrl = (profilePic) => {
    if (!profilePic) return "https://placehold.co/200x200";
    // If it's already a full URL, return as is
    if (profilePic.startsWith('http')) return profilePic;
    // Otherwise, prepend the backend URL
    const fullUrl = `http://localhost:8000${profilePic}`;
    console.log('Generated profile pic URL:', fullUrl);
    return fullUrl;
  };

  return (
    <div className="fixed top-0 left-0 w-64 bg-white shadow-md h-screen flex flex-col">
      <div className="p-4 flex items-center">
        <div className="w-8 h-8 bg-purple-700 rounded flex items-center justify-center text-white mr-2">
          <span className="font-bold">D</span>
        </div>
        <span className="text-xl font-bold">DevMatch</span>
      </div>
      
      <nav className="mt-6 flex-1 overflow-y-auto">
        <Link 
          to="/dashboard" 
          className={`flex items-center px-4 py-3 ${
            location.pathname === '/dashboard' 
              ? 'bg-blue-100 text-blue-600' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
          </svg>
          Home
        </Link>
        
        <Link 
          to="/match" 
          className={`flex items-center px-4 py-3 ${
            location.pathname === '/match' 
              ? 'bg-blue-100 text-blue-600' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"></path>
          </svg>
          Matches
        </Link>
        
        <Link 
          to="/projects" 
          className={`flex items-center px-4 py-3 ${
            location.pathname === '/projects' 
              ? 'bg-blue-100 text-blue-600' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
          </svg>
          Projects
        </Link>
        
        <Link 
          to="/settings" 
          className={`flex items-center px-4 py-3 ${
            location.pathname === '/settings' 
              ? 'bg-blue-100 text-blue-600' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
          </svg>
          Settings
        </Link>
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <Link 
          to="/profile"
          className={`flex items-center px-4 py-3 rounded-lg ${
            location.pathname === '/profile' 
              ? 'bg-blue-100 text-blue-600' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mr-3">
            <img 
              src={getProfilePicUrl(user?.profilePic)}
              alt={user?.name || 'Profile'} 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log('Image failed to load:', e.target.src);
                e.target.src = "https://placehold.co/200x200";
              }}
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{user?.name || 'Your Profile'}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
