import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import UserCard from '../components/UserCard';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Match() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [techInput, setTechInput] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [filters, setFilters] = useState({
    techStack: []
  });

  const [availableTechStack] = useState([
    'React', 'Node.js', 'Python', 'TypeScript', 'AWS',
    'Flutter', 'Firebase', 'PostgreSQL', 'MongoDB', 'Web3.js'
  ]);

  // Filter available tech stack based on input - case insensitive
  const filteredTechStack = availableTechStack.filter(tech =>
    tech.toLowerCase().includes(techInput.toLowerCase())
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        setUserProfile(response.data);
        // Initialize filters with user's skills if they have any
        if (response.data.skills && response.data.skills.length > 0) {
          setFilters(prev => ({
            ...prev,
            techStack: response.data.skills
          }));
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Convert filters to query parameters
      const queryParams = new URLSearchParams();
      if (filters.techStack.length > 0) {
        queryParams.append('techStack', filters.techStack.join(','));
      }

      const response = await api.get(`/users/matches?${queryParams.toString()}`);
      // Sort users by match percentage in descending order
      const sortedUsers = response.data.sort((a, b) => b.matchPercentage - a.matchPercentage);
      setUsers(sortedUsers);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Calculate the number of users with good matches (>50% match)
  const goodMatches = users.filter(user => user.matchPercentage >= 50).length;

  const handleTechStackFilter = (tech) => {
    setFilters(prev => ({
      ...prev,
      techStack: prev.techStack.some(t => t.toLowerCase() === tech.toLowerCase())
        ? prev.techStack.filter(t => t.toLowerCase() !== tech.toLowerCase())
        : [...prev.techStack, tech]
    }));
  };

  const handleAddCustomTech = (e) => {
    e.preventDefault();
    if (!techInput) return;

    // Check for duplicates case-insensitively
    const isDuplicate = filters.techStack.some(
      tech => tech.toLowerCase() === techInput.toLowerCase()
    );

    if (!isDuplicate) {
      // Normalize the input to match existing format (first letter uppercase)
      const normalizedInput = techInput.trim();
      setFilters(prev => ({
        ...prev,
        techStack: [...prev.techStack, normalizedInput]
      }));
      setTechInput('');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 ml-64">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Matches</h1>
            <div className="flex items-center space-x-2 text-gray-600">
              <p>Found {users.length} total users</p>
              {goodMatches > 0 && (
                <>
                  <span className="text-gray-400">•</span>
                  <p className="text-green-600">{goodMatches} good matches</p>
                </>
              )}
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-semibold mb-6 text-gray-900">Filters</h2>
                
                {/* Tech Stack Filter */}
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Tech Stack</h3>
                  
                  {/* Tech Stack Input Form */}
                  <form onSubmit={handleAddCustomTech} className="mb-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        placeholder="Search or add tech..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </form>

                  {/* Selected Tech Stack */}
                  {filters.techStack.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-gray-500 mb-2">Selected:</h4>
                      <div className="flex flex-wrap gap-2">
                        {filters.techStack.map(tech => (
                          <span
                            key={tech}
                            onClick={() => handleTechStackFilter(tech)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm cursor-pointer flex items-center gap-1 hover:bg-blue-200 transition-colors"
                          >
                            {tech}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Tech Stacks */}
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-gray-500 mb-2">Popular Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {availableTechStack.map(tech => (
                        <button
                          key={tech}
                          onClick={() => handleTechStackFilter(tech)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            filters.techStack.includes(tech)
                              ? 'bg-blue-500 text-white hover:bg-blue-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search Results */}
                  {techInput && filteredTechStack.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-gray-500 mb-2">Search Results:</h4>
                      <div className="flex flex-wrap gap-2">
                        {filteredTechStack.map(tech => (
                          <button
                            key={tech}
                            onClick={() => {
                              handleTechStackFilter(tech);
                              setTechInput('');
                            }}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                              filters.techStack.includes(tech)
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {tech}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Users Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium">Error</h3>
                      <p className="mt-1 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {users.map((user, index) => (
                    <div 
                      key={user._id}
                      className={`transition-all duration-300 ${
                        index === 0 && user.matchPercentage >= 80 ? 'transform scale-102 ring-2 ring-green-500 rounded-xl' : ''
                      }`}
                    >
                      <UserCard user={user} />
                    </div>
                  ))}
                  {users.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
                      <p className="mt-2 text-gray-500">Try adjusting your filters to find more users</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Match;