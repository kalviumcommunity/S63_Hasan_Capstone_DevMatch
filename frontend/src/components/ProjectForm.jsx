import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function ProjectForm({ onClose, user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [project, setProject] = useState({
    title: '',
    company: '',
    description: '',
    duration: '6 months',
    workHours: '20-30 hrs/week',
    location: 'Remote',
    techStack: [],
    requirements: [],
    roles: [
      {
        title: '',
        count: 1,
        filled: 0,
        skills: [],
        applicants: 0
      }
    ],
    type: 'Full-time',
    experienceLevel: 'Junior',
    deadline: '',
  });

  const [techInput, setTechInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');
  const [skillInput, setSkillInput] = useState('');

  const durationOptions = ['3 months', '6 months', '12 months'];
  const workHoursOptions = ['10-20 hrs/week', '20-30 hrs/week', '30-40 hrs/week'];
  const locationOptions = ['Remote', 'On-site', 'Hybrid'];

  const [customDuration, setCustomDuration] = useState(false);
  const [customWorkHours, setCustomWorkHours] = useState(false);
  const [customLocation, setCustomLocation] = useState(false);

  const commonTechStacks = ['React', 'Node.js', 'Python', 'TypeScript', 'AWS', 'Docker', 'PostgreSQL', 'MongoDB', 'CI/CD'];

  const handleTechAdd = (tech) => {
    if (!project.techStack.includes(tech)) {
      setProject({ ...project, techStack: [...project.techStack, tech] });
    }
    setTechInput('');
  };

  const handleTechRemove = (techToRemove) => {
    setProject({ ...project, techStack: project.techStack.filter(tech => tech !== techToRemove) });
  };

  const handleRequirementAdd = () => {
    if (requirementInput.trim()) {
      setProject({ ...project, requirements: [...project.requirements, requirementInput.trim()] });
      setRequirementInput('');
    }
  };

  const handleRequirementRemove = (index) => {
    setProject({ ...project, requirements: project.requirements.filter((_, i) => i !== index) });
  };

  const handleRoleSkillAdd = (roleIndex, skill) => {
    const updatedRoles = [...project.roles];
    if (!updatedRoles[roleIndex].skills.includes(skill)) {
      updatedRoles[roleIndex].skills.push(skill);
      setProject({ ...project, roles: updatedRoles });
    }
    setSkillInput('');
  };

  const handleRoleSkillRemove = (roleIndex, skillToRemove) => {
    const updatedRoles = [...project.roles];
    updatedRoles[roleIndex].skills = updatedRoles[roleIndex].skills.filter(skill => skill !== skillToRemove);
    setProject({ ...project, roles: updatedRoles });
  };

  const addRole = () => {
    setProject({
      ...project,
      roles: [...project.roles, { title: '', count: 1, filled: 0, skills: [], applicants: 0 }]
    });
  };

  const removeRole = (index) => {
    setProject({ ...project, roles: project.roles.filter((_, i) => i !== index) });
  };

  const handleCustomOptionToggle = (field, value) => {
    if (value === 'custom') {
      switch (field) {
        case 'duration':
          setCustomDuration(true);
          setProject({ ...project, duration: '' });
          break;
        case 'workHours':
          setCustomWorkHours(true);
          setProject({ ...project, workHours: '' });
          break;
        case 'location':
          setCustomLocation(true);
          setProject({ ...project, location: '' });
          break;
      }
    } else {
      switch (field) {
        case 'duration':
          setCustomDuration(false);
          break;
        case 'workHours':
          setCustomWorkHours(false);
          break;
        case 'location':
          setCustomLocation(false);
          break;
      }
      setProject({ ...project, [field]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    const sanitizedRoles = project.roles.map(role => ({
      title: role.title.trim(),
      count: role.count,
      skills: role.skills
    }));
  
    const payload = {
      title: project.title.trim(),
      company: project.company.trim(),
      description: project.description.trim(),
      duration: project.duration,
      workHours: project.workHours,
      location: project.location,
      techStack: project.techStack,
      requirements: project.requirements,
      roles: sanitizedRoles,
      type: project.type,
      experienceLevel: project.experienceLevel,
      deadline: project.deadline,
      createdBy: user?._id || user?.id
    };
  
    try {
      await userAPI.createProject(payload);
      onClose();
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Title</label>
              <input
                type="text"
                value={project.title}
                onChange={(e) => setProject({ ...project, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input
                type="text"
                value={project.company}
                onChange={(e) => setProject({ ...project, company: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Project Overview</label>
              <textarea
                value={project.description}
                onChange={(e) => setProject({ ...project, description: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration</label>
              {customDuration ? (
                <div className="mt-1 relative">
                  <input
                    type="text"
                    value={project.duration}
                    onChange={(e) => setProject({ ...project, duration: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter custom duration..."
                  />
                  <button
                    type="button"
                    onClick={() => handleCustomOptionToggle('duration', '6 months')}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <select
                  value={project.duration}
                  onChange={(e) => handleCustomOptionToggle('duration', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {durationOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                  <option value="custom">Custom...</option>
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Work Hours</label>
              {customWorkHours ? (
                <div className="mt-1 relative">
                  <input
                    type="text"
                    value={project.workHours}
                    onChange={(e) => setProject({ ...project, workHours: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter custom hours..."
                  />
                  <button
                    type="button"
                    onClick={() => handleCustomOptionToggle('workHours', '20-30 hrs/week')}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <select
                  value={project.workHours}
                  onChange={(e) => handleCustomOptionToggle('workHours', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {workHoursOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                  <option value="custom">Custom...</option>
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              {customLocation ? (
                <div className="mt-1 relative">
                  <input
                    type="text"
                    value={project.location}
                    onChange={(e) => setProject({ ...project, location: e.target.value })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter custom location..."
                  />
                  <button
                    type="button"
                    onClick={() => handleCustomOptionToggle('location', 'Remote')}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <select
                  value={project.location}
                  onChange={(e) => handleCustomOptionToggle('location', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {locationOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                  <option value="custom">Custom...</option>
                </select>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={project.type}
                onChange={e => setProject({ ...project, type: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Experience Level</label>
              <select
                value={project.experienceLevel}
                onChange={e => setProject({ ...project, experienceLevel: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="Junior">Junior</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
              </select>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Deadline</label>
              <input
                type="date"
                value={project.deadline}
                onChange={e => setProject({ ...project, deadline: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tech Stack</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {project.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleTechRemove(tech)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="Add technology..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => handleTechAdd(techInput)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {commonTechStacks.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => handleTechAdd(tech)}
                  className={`px-2 py-1 rounded-full text-sm ${
                    project.techStack.includes(tech)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
            <div className="space-y-2 mb-2">
              {project.requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1 text-gray-700">{req}</span>
                  <button
                    type="button"
                    onClick={() => handleRequirementRemove(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                placeholder="Add requirement..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleRequirementAdd}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>

          {/* Team Roles */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Team Roles</label>
              <button
                type="button"
                onClick={addRole}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Add Role
              </button>
            </div>
            <div className="space-y-4">
              {project.roles.map((role, roleIndex) => (
                <div key={roleIndex} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between">
                    <div className="flex-1 mr-4">
                      <label className="block text-sm font-medium text-gray-700">Role Title</label>
                      <input
                        type="text"
                        value={role.title}
                        onChange={(e) => {
                          const updatedRoles = [...project.roles];
                          updatedRoles[roleIndex].title = e.target.value;
                          setProject({ ...project, roles: updatedRoles });
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-sm font-medium text-gray-700">Count</label>
                      <input
                        type="number"
                        min="1"
                        value={role.count}
                        onChange={(e) => {
                          const updatedRoles = [...project.roles];
                          updatedRoles[roleIndex].count = parseInt(e.target.value);
                          setProject({ ...project, roles: updatedRoles });
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    {project.roles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRole(roleIndex)}
                        className="ml-4 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Role Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {role.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRoleSkillRemove(roleIndex, skill)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="Add required skill..."
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRoleSkillAdd(roleIndex, skillInput)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectForm; 