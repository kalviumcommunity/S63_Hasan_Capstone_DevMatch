import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { userAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser } = useAuth();
  const [project, setProject] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getProject(id);
        setProject(response.data);
        console.log('Fetched project:', response.data);
        console.log('createdBy:', response.data.createdBy);
        if (response.data.createdBy) {
          const ownerId = typeof response.data.createdBy === 'string'
            ? response.data.createdBy
            : response.data.createdBy && response.data.createdBy._id;
          if (ownerId) {
            try {
              const ownerRes = await userAPI.getUserById(ownerId);
              setOwner(ownerRes.data);
            } catch (e) {
              setOwner(null);
            }
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!project) return null;
  // Use matchPercentage from location state if available, otherwise fallback
  const matchPercentage = location.state?.matchPercentage ?? project.matchPercentage ?? 95;

  // Function to determine match percentage color and text (copied from Card.jsx)
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
  const matchInfo = getMatchInfo(matchPercentage);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Project Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                <p className="text-gray-600 mt-1">Posted by {project.company}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-gray-500 text-sm">
                  <span><span className="font-medium text-gray-400">Duration:</span> {project.duration}</span>
                  <span><span className="font-medium text-gray-400">Work Hours:</span> {project.workHours}</span>
                  <span><span className="font-medium text-gray-400">Location:</span> {project.location}</span>
                  <span><span className="font-medium text-gray-400">Type:</span> {project.type}</span>
                  <span><span className="font-medium text-gray-400">Experience Level:</span> {project.experienceLevel}</span>
                  <span><span className="font-medium text-gray-400">Deadline:</span> {project.deadline ? new Date(project.deadline).toLocaleDateString('en-GB') : ''}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${matchInfo.color}`}>
                  {matchPercentage}% • {matchInfo.text}
                </span>
                {/* Edit button for project owner */}
                {currentUser && owner && currentUser._id === owner._id && (
                  <button
                    className="mt-2 px-4 py-1 border border-blue-500 text-blue-600 rounded hover:bg-blue-50 text-sm font-medium"
                    onClick={() => navigate(`/project/${project._id}/edit`)}
                  >
                    Edit Project
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Project Overview */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Project Overview</h2>
            <p className="text-gray-700 mb-4 whitespace-pre-wrap">{project.description}</p>
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-1">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack?.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            {project.requirements && project.requirements.length > 0 && (
              <div className="mb-2">
                <h3 className="font-medium text-gray-900 mb-1">Requirements</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {project.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Team Roles */}
          {project.roles && project.roles.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Roles</h2>
              <div className="space-y-6">
                {project.roles.map((role, idx) => (
                  <div key={idx} className="border rounded-lg p-4 mb-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                      <div className="font-medium text-gray-900">{role.title}</div>
                      <div className="text-gray-500 text-sm">{role.filled || 0} / {role.count} filled</div>
                      {role.applicants !== undefined && (
                        <div className="text-blue-600 text-sm">{role.applicants} applicant{role.applicants === 1 ? '' : 's'}</div>
                      )}
                    </div>
                    <div>
                      <span className="block text-sm text-gray-700 font-medium mb-1">Required Skills</span>
                      <div className="flex flex-wrap gap-2">
                        {role.skills && role.skills.length > 0 ? (
                          role.skills.map((skill, i) => (
                            <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">{skill}</span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">None specified</span>
                        )}
                      </div>
                    </div>
                    {/* Optionally, add an 'Apply for this role' button here if needed */}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Owner */}
          {owner && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-2 border-blue-400">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Owner</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  <img
                    src={owner.profilePic || 'https://placehold.co/100x100'}
                    alt={owner.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{owner.name}</div>
                  <div className="text-gray-600 text-sm">{owner.title || ''}</div>
                  <div className="text-gray-500 text-xs">{owner.email}</div>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="px-3 py-1 border border-blue-200 text-blue-700 rounded text-xs font-medium"
                      onClick={() => navigate(`/profile/${owner._id}`)}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails; 