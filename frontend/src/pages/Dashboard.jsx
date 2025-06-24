import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import ProjectForm from '../components/ProjectForm';
import FriendManagement from '../components/FriendManagement';

function Dashboard() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [suggestedProjects, setSuggestedProjects] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showFriendManagement, setShowFriendManagement] = useState(false);
  const [friendCount, setFriendCount] = useState(0);
  const [loading, setLoading] = useState({
    user: true,
    projects: true,
    suggestions: true,
    userSuggestions: true,
    friends: true
  });
  const [error, setError] = useState({
    user: null,
    projects: null,
    suggestions: null,
    userSuggestions: null,
    friends: null
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (authUser) {
          setUser(authUser);
        } else {
          const response = await api.get('/users/profile');
          setUser(response.data);
        }
      } catch (err) {
        setError(prev => ({ ...prev, user: err.message || 'Failed to fetch user data' }));
      } finally {
        setLoading(prev => ({ ...prev, user: false }));
      }
    };

    const fetchProjects = async () => {
      try {
        // Get the user's ID first
        const userResponse = await api.get('/users/profile');
        const userId = userResponse.data._id;
        
        // Then fetch projects for that user
        const response = await api.get(`/projects/user/${userId}`);
        setProjects(response.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(prev => ({ 
          ...prev, 
          projects: err.response?.data?.message || 'Failed to fetch projects' 
        }));
      } finally {
        setLoading(prev => ({ ...prev, projects: false }));
      }
    };

    const fetchSuggestedProjects = async () => {
      try {
        setLoading(prev => ({ ...prev, suggestions: true }));
        // Get user profile to include skills in the match query
        const userResponse = await api.get('/users/profile');
        const userSkills = userResponse.data.skills || [];
        
        // Fetch projects that match user's skills
        const response = await api.get('/projects/matches', {
          params: {
            techStack: userSkills.join(',')
          }
        });
        
        const matchingProjects = response.data
          .filter(project => project.matchPercentage >= 15)
          .sort((a, b) => b.matchPercentage - a.matchPercentage)
          .slice(0, 3); // Show top 3 suggestions
        setSuggestedProjects(matchingProjects);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setError(prev => ({ 
          ...prev, 
          suggestions: err.response?.data?.message || 'Failed to fetch project suggestions' 
        }));
      } finally {
        setLoading(prev => ({ ...prev, suggestions: false }));
      }
    };

    const fetchSuggestedUsers = async () => {
      try {
        setLoading(prev => ({ ...prev, userSuggestions: true }));
        // Get user profile to include skills in the match query
        const userResponse = await api.get('/users/profile');
        const userSkills = userResponse.data.skills || [];
        
        // Fetch users that match user's skills
        const response = await api.get('/users/matches', {
          params: {
            techStack: userSkills.join(',')
          }
        });
        
        const matchingUsers = response.data
          .filter(user => user.matchPercentage >= 15)
          .sort((a, b) => b.matchPercentage - a.matchPercentage)
          .slice(0, 3); // Show top 3 suggestions
        setSuggestedUsers(matchingUsers);
      } catch (err) {
        console.error('Error fetching user suggestions:', err);
        setError(prev => ({ 
          ...prev, 
          userSuggestions: err.response?.data?.message || 'Failed to fetch user suggestions' 
        }));
      } finally {
        setLoading(prev => ({ ...prev, userSuggestions: false }));
      }
    };

    const fetchFriendCount = async () => {
      try {
        setLoading(prev => ({ ...prev, friends: true }));
        const response = await api.get('/users/friends');
        setFriendCount(response.data.length);
      } catch (err) {
        setError(prev => ({ ...prev, friends: err.message || 'Failed to fetch friend count' }));
      } finally {
        setLoading(prev => ({ ...prev, friends: false }));
      }
    };

    const initializeDashboard = async () => {
      await fetchUser();
      await fetchProjects();
      await fetchSuggestedProjects();
      await fetchSuggestedUsers();
      await fetchFriendCount();
    };

    initializeDashboard();
  }, [authUser]);

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  const ErrorMessage = ({ message }) => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
      <strong className="font-bold">Error! </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );

  const ProjectCard = ({ project, isSuggestion = false }) => (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${
      isSuggestion && 'border-2 border-blue-100 hover:border-blue-200 transition-colors'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{project.title}</h3>
          <p className="text-sm text-gray-600">{project.company}</p>
        </div>
        <div className="flex flex-col items-end">
          {isSuggestion ? (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {project.matchPercentage}% Match
            </span>
          ) : (
            <span className={`px-2 py-1 rounded-full text-sm ${
              project.status === 'Open' ? 'bg-green-100 text-green-700' :
              project.status === 'Closed' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {project.status}
            </span>
          )}
        </div>
      </div>
      <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
      {project.techStack && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm">
              {tech}
            </span>
          ))}
        </div>
      )}
      <div className="flex justify-end">
        <Link
          to={`/project/${project._id}`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View Details
        </Link>
      </div>
    </div>
  );

  const UserCard = ({ user }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-blue-100 hover:border-blue-200 transition-colors">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-xl font-semibold text-gray-600">
            {user.name?.charAt(0) || 'U'}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.title || 'No title set'}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {user.matchPercentage}% Match
          </span>
          <Link
            to={`/profile/${user._id}`}
            state={{ from: '/dashboard' }}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Profile
          </Link>
        </div>
      </div>
      
      {user.skills && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {user.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm">
                {skill}
              </span>
            ))}
            {user.skills.length > 3 && (
              <span className="text-gray-500 text-sm">+{user.skills.length - 3} more</span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowFriendManagement(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="mr-2">Friends ({friendCount})</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>
                <button
                  onClick={() => setShowProjectForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Project
                </button>
              </div>
            </div>
            {loading.user ? (
              <div className="h-8 w-64 bg-gray-300 rounded animate-pulse mb-2"></div>
            ) : error.user ? (
              <ErrorMessage message={error.user} />
            ) : user && (
              <div className="mt-2">
                <p className="text-gray-600">Welcome back, {user.name?.split(' ')[0]}! 👋</p>
                {user.title && (
                  <p className="text-gray-500 mt-1">{user.title}</p>
                )}
              </div>
            )}
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enrolled Projects Section */}
            <div className="lg:col-span-2">
              <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Your Projects</h2>
                  <Link
                    to="/projects"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All
                  </Link>
                </div>

                {loading.projects ? (
                  <LoadingSpinner />
                ) : error.projects ? (
                  <ErrorMessage message={error.projects} />
                ) : projects.length > 0 ? (
                  <div className="space-y-6">
                    {projects.map((project) => (
                      <ProjectCard key={project._id} project={project} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No projects yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new project</p>
                  </div>
                )}
              </section>
            </div>

            {/* Suggested Projects Section */}
            <div className="lg:col-span-1">
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Projects</h2>
                {loading.suggestions ? (
                  <LoadingSpinner />
                ) : error.suggestions ? (
                  <ErrorMessage message={error.suggestions} />
                ) : suggestedProjects.length > 0 ? (
                  <div className="space-y-4">
                    {suggestedProjects.map((project) => (
                      <ProjectCard 
                        key={project._id} 
                        project={project} 
                        isSuggestion={true}
                      />
                    ))}
                    <div className="text-center mt-4">
                      <Link
                        to="/match"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View More Projects
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                    <p className="text-gray-500">No matching projects found</p>
                    <Link
                      to="/match"
                      className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Browse All Projects
                    </Link>
                  </div>
                )}
              </section>

              {/* Suggested Users Section */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Users</h2>
                {loading.userSuggestions ? (
                  <LoadingSpinner />
                ) : error.userSuggestions ? (
                  <ErrorMessage message={error.userSuggestions} />
                ) : suggestedUsers.length > 0 ? (
                  <div className="space-y-4">
                    {suggestedUsers.map((user) => (
                      <UserCard key={user._id} user={user} />
                    ))}
                    <div className="text-center mt-4">
                      <Link
                        to="/match"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View More Users
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                    <p className="text-gray-500">No matching users found</p>
                    <Link
                      to="/match"
                      className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Browse All Users
                    </Link>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>

        {showProjectForm && (
          <ProjectForm
            onClose={() => setShowProjectForm(false)}
            onProjectCreated={() => {
              setShowProjectForm(false);
              // Refresh projects list
              fetchProjects();
            }}
            user={user}
          />
        )}
      </div>

      {/* Friend Management Side Panel */}
      <FriendManagement
        isOpen={showFriendManagement}
        onClose={() => setShowFriendManagement(false)}
      />
    </div>
  );
}

export default Dashboard;