import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { users as userAPI } from '../services/api';

function UserCard({ user }) {
  const location = useLocation();
  const { user: currentUser } = useAuth();
  const [isFriend, setIsFriend] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Function to get the full profile picture URL
  const getProfilePicUrl = (profilePic) => {
    if (!profilePic) return null;
    // If it's already a full URL, return as is
    if (profilePic.startsWith('http')) return profilePic;
    // Otherwise, prepend the backend URL
    return `http://localhost:8000${profilePic}`;
  };

  // Function to determine match percentage color and text
  const getMatchInfo = (percentage) => {
    if (percentage >= 80) {
      return {
        color: 'bg-green-100 text-green-800',
        text: 'Excellent match'
      };
    } else if (percentage >= 50) {
      return {
        color: 'bg-blue-100 text-blue-800',
        text: 'Good match'
      };
    } else if (percentage >= 30) {
      return {
        color: 'bg-yellow-100 text-yellow-800',
        text: 'Fair match'
      };
    } else {
      return {
        color: 'bg-gray-100 text-gray-800',
        text: 'Low match'
      };
    }
  };

  const matchInfo = getMatchInfo(user.matchPercentage);

  const handleAddFriend = async () => {
    if (isLoading) return;
    setErrorMsg("");
    try {
      setIsLoading(true);
      await userAPI.sendFriendRequest(user._id);
      setIsRequestSent(true);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Error sending friend request';
      setErrorMsg(msg);
      if (msg.includes('already sent')) setIsRequestSent(true);
      if (msg.includes('Already friends')) setIsFriend(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show add friend button if it's the current user
  const isCurrentUser = currentUser && currentUser._id === user._id;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {user.profilePic ? (
                  <img 
                    src={getProfilePicUrl(user.profilePic)}
                    alt={user.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-semibold text-gray-600">
                    {user.name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.title || 'Independent Developer'}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-600 line-clamp-2">{user.bio || 'No bio available'}</p>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {user.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="ml-4 flex flex-col items-end">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${matchInfo.color}`}>
              {user.matchPercentage}% • {matchInfo.text}
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                to={`/profile/${user._id}`}
                state={{ from: location.pathname }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                View Profile
              </Link>
              {!isCurrentUser && !isFriend && !isRequestSent && (
                <button
                  onClick={handleAddFriend}
                  disabled={isLoading || isRequestSent || isFriend}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Add Friend'}
                </button>
              )}
              {errorMsg && (
                <span className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm mt-1 block">
                  {errorMsg}
                </span>
              )}
              {isRequestSent && (
                <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
                  Request Sent
                </span>
              )}
              {isFriend && (
                <span className="px-4 py-2 bg-green-100 text-green-600 rounded-lg text-sm">
                  Friends
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCard; 