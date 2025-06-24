import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { users as userAPI } from '../services/api';

function FriendManagement({ isOpen, onClose }) {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState('friends'); // ['friends', 'requests', 'add']
  const [loading, setLoading] = useState({
    friends: true,
    requests: true,
    search: false
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchFriends();
      fetchFriendRequests();
    }
  }, [isOpen]);

  const fetchFriends = async () => {
    try {
      setLoading(prev => ({ ...prev, friends: true }));
      const response = await userAPI.getFriends();
      setFriends(response.data);
    } catch (err) {
      setError('Failed to fetch friends');
    } finally {
      setLoading(prev => ({ ...prev, friends: false }));
    }
  };

  const fetchFriendRequests = async () => {
    try {
      setLoading(prev => ({ ...prev, requests: true }));
      const response = await userAPI.getFriendRequests();
      setFriendRequests(response.data);
    } catch (err) {
      setError('Failed to fetch friend requests');
    } finally {
      setLoading(prev => ({ ...prev, requests: false }));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(prev => ({ ...prev, search: true }));
      // Search by name or skills
      const [nameResponse, skillsResponse] = await Promise.all([
        userAPI.searchUsers({ name: searchQuery }),
        userAPI.searchUsers({ techStack: searchQuery })
      ]);

      // Combine and deduplicate results
      const combinedResults = [...nameResponse.data, ...skillsResponse.data];
      const uniqueResults = Array.from(new Map(combinedResults.map(user => [user._id, user])).values());
      
      // Filter out current user and existing friends
      const filteredResults = uniqueResults.filter(user => 
        user._id !== this.user?._id && 
        !friends.some(friend => friend._id === user._id)
      );

      setSearchResults(filteredResults);
    } catch (err) {
      setError('Failed to search users');
    } finally {
      setLoading(prev => ({ ...prev, search: false }));
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      await userAPI.sendFriendRequest(userId);
      // Update search results to show request sent
      setSearchResults(prev => 
        prev.map(user => 
          user._id === userId 
            ? { ...user, requestSent: true }
            : user
        )
      );
    } catch (err) {
      setError('Failed to send friend request');
    }
  };

  const handleFriendRequest = async (userId, action) => {
    try {
      if (action === 'accept') {
        await userAPI.acceptFriendRequest(userId);
      } else {
        await userAPI.rejectFriendRequest(userId);
      }
      // Refresh both lists
      fetchFriends();
      fetchFriendRequests();
    } catch (err) {
      setError(`Failed to ${action} friend request`);
    }
  };

  const removeFriend = async (userId) => {
    try {
      await userAPI.removeFriend(userId);
      fetchFriends();
    } catch (err) {
      setError('Failed to remove friend');
    }
  };

  if (!isOpen) return null;

  const TabButton = ({ tab, label, count }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-lg ${
        activeTab === tab
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
      {count > 0 && (
        <span className="ml-2 px-2 py-1 bg-blue-500 text-white rounded-full text-xs">
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Friends Management</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex space-x-2">
            <TabButton tab="friends" label="Friends" count={friends.length} />
            <TabButton tab="requests" label="Requests" count={friendRequests.length} />
            <TabButton tab="add" label="Add Friends" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'add' && (
            <>
              {/* Search Section */}
              <div className="mb-6">
                <form onSubmit={handleSearch} className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or skills..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Search Users
                  </button>
                </form>
              </div>

              {/* Search Results */}
              {loading.search ? (
                <div className="text-center py-4">Searching...</div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((user) => (
                    <div key={user._id} className="bg-white border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {user.profilePic ? (
                              <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover rounded-full" />
                            ) : (
                              <span className="text-sm font-semibold text-gray-600">
                                {user.name?.charAt(0) || 'U'}
                              </span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{user.name}</h3>
                            <p className="text-sm text-gray-500">{user.title || 'No title'}</p>
                          </div>
                        </div>
                        {user.requestSent ? (
                          <span className="text-sm text-gray-500">Request Sent</span>
                        ) : (
                          <button
                            onClick={() => sendFriendRequest(user._id)}
                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                          >
                            Add Friend
                          </button>
                        )}
                      </div>
                      {user.skills && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {user.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : searchQuery && (
                <div className="text-center py-4 text-gray-500">
                  No users found matching "{searchQuery}"
                </div>
              )}
            </>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Friend Requests</h3>
              {loading.requests ? (
                <div className="text-center py-4">Loading...</div>
              ) : friendRequests.length === 0 ? (
                <p className="text-center text-gray-500">No pending friend requests</p>
              ) : (
                friendRequests.map((request) => (
                  <div key={request.user._id} className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {request.user.profilePic ? (
                            <img src={request.user.profilePic} alt={request.user.name} className="w-full h-full object-cover rounded-full" />
                          ) : (
                            <span className="text-sm font-semibold text-gray-600">
                              {request.user.name?.charAt(0) || 'U'}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{request.user.name}</h3>
                          <p className="text-sm text-gray-500">{request.user.title || 'No title'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleFriendRequest(request.user._id, 'accept')}
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleFriendRequest(request.user._id, 'reject')}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'friends' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Friends ({friends.length})</h3>
              {loading.friends ? (
                <div className="text-center py-4">Loading...</div>
              ) : friends.length === 0 ? (
                <p className="text-center text-gray-500">No friends yet</p>
              ) : (
                friends.map((friend) => (
                  <div key={friend._id} className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {friend.profilePic ? (
                            <img src={friend.profilePic} alt={friend.name} className="w-full h-full object-cover rounded-full" />
                          ) : (
                            <span className="text-sm font-semibold text-gray-600">
                              {friend.name?.charAt(0) || 'U'}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{friend.name}</h3>
                          <p className="text-sm text-gray-500">{friend.title || 'No title'}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFriend(friend._id)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                    {friend.skills && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {friend.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FriendManagement; 