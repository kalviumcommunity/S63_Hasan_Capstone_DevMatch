import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/Card';
import { useAuth } from '../context/AuthContext';
import api, { userAPI } from '../services/api';

function Match() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [techInput, setTechInput] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [filters, setFilters] = useState({
    techStack: [],
    type: 'all',
    experienceLevel: 'all'
  });
  const [showDrawer, setShowDrawer] = useState(false);

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
    // Fetch user's own projects
    const fetchUserProjects = async () => {
      if (!user?._id) return;
      try {
        const res = await userAPI.getUserProjects(user._id);
        setUserProjects(res.data);
      } catch (err) {
        // handle error
      }
    };
    fetchUserProjects();
  }, [user]);

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.techStack.length > 0) {
        queryParams.append('techStack', filters.techStack.join(','));
      }
      if (filters.type !== 'all') {
        queryParams.append('type', filters.type);
      }
      if (filters.experienceLevel !== 'all') {
        queryParams.append('experienceLevel', filters.experienceLevel);
      }
      const response = await api.get(`/projects/matches?${queryParams.toString()}`);
      // Exclude user's own projects from recommendations
      const filteredProjects = response.data.filter(p => p.createdBy !== user._id);
      const sortedProjects = filteredProjects.sort((a, b) => b.matchPercentage - a.matchPercentage);
      setProjects(sortedProjects);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  // Calculate the number of projects with good matches (>50% match)
  const goodMatches = projects.filter(project => project.matchPercentage >= 50).length;

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

  // Add delete handler
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await userAPI.deleteProject(projectId);
      setUserProjects(userProjects.filter(p => p._id !== projectId));
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 ml-64">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Matches</h1>
              <div className="flex items-center space-x-2 text-gray-600">
                <p>Found {projects.length} total projects</p>
                {goodMatches > 0 && (
                  <>
                    <span className="text-gray-400">•</span>
                    <p className="text-green-600">{goodMatches} good matches</p>
                  </>
                )}
              </div>
            </div>
            <button
              className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              onClick={() => setShowDrawer(true)}
            >
              Your Projects
            </button>
          </header>

          {/* Your Projects Drawer */}
          {showDrawer && (
            <div className="fixed inset-0 z-50 flex">
              {/* Overlay */}
              <div className="fixed inset-0 bg-black bg-opacity-30" onClick={() => setShowDrawer(false)}></div>
              {/* Drawer */}
              <div className="relative ml-auto w-full max-w-lg h-full bg-white shadow-xl p-8 overflow-y-auto">
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                  onClick={() => setShowDrawer(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Projects</h2>
                {userProjects.length === 0 ? (
                  <div className="text-gray-500">You haven't posted any projects yet.</div>
                ) : (
                  <div className="space-y-6">
                    {userProjects.map(project => (
                      <div key={project._id} className="bg-gray-50 rounded-xl shadow-sm p-6 flex justify-between items-center">
                        <div className="flex-1">
                          <ProjectCard project={project} />
                        </div>
                        <div className="flex flex-col gap-2 ml-6">
                          <button
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => window.location.href = `/project/${project._id}/edit`}
                          >
                            Edit
                          </button>
                          <button
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => handleDeleteProject(project._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

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

                {/* Availability Filter */}
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Availability</h3>
                  <div className="space-y-3">
                    {['all', 'Full-time', 'Part-time', 'Contract'].map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="radio"
                          name="type"
                          value={type}
                          checked={filters.type === type}
                          onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                          className="form-radio text-blue-500 focus:ring-blue-500 h-4 w-4"
                        />
                        <span className="ml-2 text-gray-700 text-sm">
                          {type === 'all' ? 'All' : type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Level Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Experience Level</h3>
                  <div className="space-y-3">
                    {[
                      { value: 'all', label: 'All' },
                      { value: 'Junior', label: 'Junior (1-3 years)' },
                      { value: 'Mid', label: 'Mid (3-5 years)' },
                      { value: 'Senior', label: 'Senior (5+ years)' }
                    ].map(({ value, label }) => (
                      <label key={value} className="flex items-center">
                        <input
                          type="radio"
                          name="experienceLevel"
                          value={value}
                          checked={filters.experienceLevel === value}
                          onChange={(e) => setFilters(prev => ({ ...prev, experienceLevel: e.target.value }))}
                          className="form-radio text-blue-500 focus:ring-blue-500 h-4 w-4"
                        />
                        <span className="ml-2 text-gray-700 text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
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
                  {projects.map((project, index) => (
                    <div 
                      key={project._id}
                      className={`transition-all duration-300 ${
                        index === 0 && project.matchPercentage >= 80 ? 'transform scale-102 ring-2 ring-green-500 rounded-xl' : ''
                      }`}
                    >
                      <ProjectCard project={project} />
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No projects found</h3>
                      <p className="mt-2 text-gray-500">Try adjusting your filters to find more projects</p>
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