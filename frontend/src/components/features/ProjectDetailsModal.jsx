import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProjectDetailsModal({ project, onClose }) {
  const navigate = useNavigate();
  
  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Company */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Company</h3>
              <p className="mt-1 text-base text-gray-900">{project.company}</p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1 text-base text-gray-900">{project.description}</p>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tech Stack</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.techStack?.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Type</h3>
                <p className="mt-1 text-base text-gray-900">{project.type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Experience Level</h3>
                <p className="mt-1 text-base text-gray-900">{project.experienceLevel}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="mt-1 text-base text-gray-900">{project.location}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <span className={`mt-1 inline-block px-2 py-1 rounded-full text-sm ${
                  project.status === 'Open' ? 'bg-green-100 text-green-700' :
                  project.status === 'Closed' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {project.status}
                </span>
              </div>
            </div>

            {/* Requirements */}
            {project.requirements && project.requirements.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Requirements</h3>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  {project.requirements.map((req, index) => (
                    <li key={index} className="text-gray-900">{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Responsibilities */}
            {project.responsibilities && project.responsibilities.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Responsibilities</h3>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  {project.responsibilities.map((resp, index) => (
                    <li key={index} className="text-gray-900">{resp}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Salary Range */}
            {project.salary && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Salary Range</h3>
                <p className="mt-1 text-base text-gray-900">
                  {project.salary.min && project.salary.max
                    ? `${project.salary.currency}${project.salary.min.toLocaleString()} - ${project.salary.currency}${project.salary.max.toLocaleString()}`
                    : 'Not specified'}
                </p>
              </div>
            )}

            <button
              onClick={() => {
                onClose();
                navigate(`/projects/${project._id}`);
              }}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              View Full Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailsModal; 