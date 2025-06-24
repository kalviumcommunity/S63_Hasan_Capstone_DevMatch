import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function ProjectCard({ project }) {
  const location = useLocation();

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

  const matchInfo = getMatchInfo(project.matchPercentage);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{project.title}</h3>
            <p className="text-gray-600">Posted by {project.company}</p>
            <div className="flex flex-wrap gap-6 mt-2 text-gray-700 text-base">
              <span><span className="font-medium text-gray-500">Duration</span><br/>{project.duration}</span>
              <span><span className="font-medium text-gray-500">Work Hours</span><br/>{project.workHours}</span>
              <span><span className="font-medium text-gray-500">Location</span><br/>{project.location}</span>
              <span><span className="font-medium text-gray-500">Type</span><br/>{project.type}</span>
              <span><span className="font-medium text-gray-500">Experience Level</span><br/>{project.experienceLevel}</span>
              <span><span className="font-medium text-gray-500">Deadline</span><br/>{project.deadline ? new Date(project.deadline).toLocaleDateString('en-GB') : ''}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${matchInfo.color}`}>
              {project.matchPercentage}% • {matchInfo.text}
            </div>
            {project.timeLeft && (
              <span className="text-sm text-gray-500 mt-2">{project.timeLeft}</span>
            )}
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              project.type === 'Full-time' ? 'bg-purple-100 text-purple-800' :
              project.type === 'Part-time' ? 'bg-blue-100 text-blue-800' :
              'bg-orange-100 text-orange-800'
            }`}>
              {project.type}
            </span>
            <span className="inline-flex items-center text-sm text-gray-500">
              <svg className="mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              {project.applicants} applicants
            </span>
          </div>
          <Link 
            to={`/project/${project._id}`}
            state={{ matchPercentage: project.matchPercentage }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Project
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;