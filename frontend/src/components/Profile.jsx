import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

// Common tech stacks for suggestions
const TECH_SUGGESTIONS = {
  'React': ['Next.js', 'Redux', 'React Native', 'TypeScript', 'Webpack', 'Jest'],
  'Node.js': ['Express', 'MongoDB', 'PostgreSQL', 'TypeScript', 'Docker', 'Redis'],
  'Python': ['Django', 'Flask', 'FastAPI', 'NumPy', 'Pandas', 'TensorFlow'],
  'JavaScript': ['TypeScript', 'Node.js', 'React', 'Vue.js', 'Angular', 'Express'],
  'AWS': ['Docker', 'Kubernetes', 'Terraform', 'Lambda', 'S3', 'DynamoDB'],
  'TypeScript': ['React', 'Node.js', 'Angular', 'Next.js', 'NestJS', 'GraphQL'],
};

function Profile({ 
  profile, 
  projects, 
  isOwnProfile,
  onUpdateProfile,
  selectedProject,
  setSelectedProject,
  onSignOut 
}) {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [tempProfile, setTempProfile] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  // Function to get the full profile picture URL
  const getProfilePicUrl = (profilePic) => {
    if (!profilePic) return "https://placehold.co/200x200";
    // If it's already a full URL, return as is
    if (profilePic.startsWith('http')) return profilePic;
    // Otherwise, prepend the backend URL
    return `http://localhost:8000${profilePic}`;
  };

  // Generate skill suggestions based on current skills
  React.useEffect(() => {
    if (tempProfile?.skills) {
      const suggestions = new Set();
      tempProfile.skills.forEach(skill => {
        if (TECH_SUGGESTIONS[skill]) {
          TECH_SUGGESTIONS[skill].forEach(suggestion => {
            if (!tempProfile.skills.includes(suggestion)) {
              suggestions.add(suggestion);
            }
          });
        }
      });
      setSkillSuggestions(Array.from(suggestions));
    }
  }, [tempProfile?.skills]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempProfile({...tempProfile, [name]: value});
    
    // If changing profile picture URL, update preview
    if (name === 'profilePicUrl' && value) {
      setPreviewUrl(value);
      // Remove any file selection since we're using URL
      setTempProfile(prev => ({
        ...prev,
        profilePicFile: null,
        profilePicUrl: value
      }));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setTempProfile(prev => ({
          ...prev,
          profilePicFile: file,
          profilePicUrl: '' // Clear URL when file is selected
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setSaveMessage('');
      const formData = new FormData();
      
      // Append all profile data
      formData.append('name', tempProfile.name || '');
      formData.append('email', tempProfile.email || '');
      formData.append('title', tempProfile.title || '');
      formData.append('bio', tempProfile.bio || '');
      formData.append('skills', JSON.stringify(tempProfile.skills || []));
      
      // If there's a profile picture URL, append it
      if (tempProfile.profilePicUrl) {
        formData.append('profilePicUrl', tempProfile.profilePicUrl);
      }
      // If there's a new profile picture file, append it
      else if (tempProfile.profilePicFile) {
        formData.append('profilePic', tempProfile.profilePicFile);
      }

      const response = await userAPI.updateProfile(formData);
      const updatedUser = response.data;
      
      // Update both profile and user context
      await onUpdateProfile(updatedUser);
      setUser(currentUser => ({
        ...currentUser,
        ...updatedUser
      }));
      
      setEditMode(false);
      setPreviewUrl(null);
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveMessage(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleAddSkill = (skill) => {
    if (skill && !tempProfile.skills.includes(skill)) {
      const updatedSkills = [...tempProfile.skills, skill];
      setTempProfile({
        ...tempProfile,
        skills: updatedSkills
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = tempProfile.skills.filter(skill => skill !== skillToRemove);
    setTempProfile({
      ...tempProfile,
      skills: updatedSkills
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden">
              <img 
                src={previewUrl || getProfilePicUrl(profile.profilePic)}
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-gray-600">{profile.title || 'Add your title'}</p>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>
          </div>
          {isOwnProfile && (
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  if (!editMode) {
                    setTempProfile({...profile});
                  }
                  setEditMode(!editMode);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                {editMode ? 'View Profile' : 'Edit Profile'}
              </button>
              <button
                onClick={onSignOut}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <section className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            {editMode ? (
              <textarea
                name="bio"
                value={tempProfile.bio || ''}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
                rows="4"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-700">{profile.bio || 'No bio added yet.'}</p>
            )}
          </section>

          {/* Skills Section */}
          <section className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4">Skills</h2>
            {editMode ? (
              <div className="space-y-4">
                {/* Current Skills */}
                <div className="flex flex-wrap gap-2">
                  {tempProfile.skills?.map((skill) => (
                    <span 
                      key={skill}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-blue-700 hover:text-blue-900 focus:outline-none"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>

                {/* Skill Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && skillInput.trim()) {
                        e.preventDefault();
                        handleAddSkill(skillInput.trim());
                      }
                    }}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                    placeholder="Type a skill and press Enter or Add"
                  />
                  <button
                    onClick={() => {
                      if (skillInput.trim()) {
                        handleAddSkill(skillInput.trim());
                      }
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>

                {/* Skill Suggestions */}
                {skillSuggestions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Suggested Skills:</h3>
                    <div className="flex flex-wrap gap-2">
                      {skillSuggestions.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => handleAddSkill(skill)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          + {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.skills?.map((skill) => (
                  <span 
                    key={skill}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
                {(!profile.skills || profile.skills.length === 0) && (
                  <p className="text-gray-500">No skills added yet.</p>
                )}
              </div>
            )}
          </section>

          {/* Projects Section */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Projects</h2>
            {projects.length === 0 ? (
              <p className="text-gray-500">No projects created yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <div key={project._id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                      
                      {/* Tech Stack */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Tech Stack</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.slice(0, 4).map((tech, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.techStack.length > 4 && (
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                              +{project.techStack.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          Quick View
                        </button>
                        <button
                          onClick={() => navigate(`/projects/${project._id}`)}
                          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          See More
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column - Profile Strength & Settings */}
        <div className="lg:col-span-1 space-y-6">
          {isOwnProfile && (
            <>
              <section className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                <h2 className="text-xl font-semibold mb-4">Profile Strength</h2>
                <div className="space-y-4">
                  {/* Profile Completion Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion</span>
                      <span>{calculateProfileStrength(profile, projects)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{width: `${calculateProfileStrength(profile, projects)}%`}}
                      />
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-2">
                    <ChecklistItem
                      completed={!!profile.profilePic}
                      text="Add a profile picture"
                    />
                    <ChecklistItem
                      completed={!!profile.bio}
                      text="Write your bio"
                    />
                    <ChecklistItem
                      completed={profile.skills?.length >= 3}
                      text="Add at least 3 skills"
                    />
                    <ChecklistItem
                      completed={!!profile.title}
                      text="Add your title"
                    />
                    <ChecklistItem
                      completed={projects.length > 0}
                      text="Create your first project"
                    />
                  </div>
                </div>
              </section>

              {editMode && (
                <section className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                  <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Picture
                      </label>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                            <img
                              src={previewUrl || getProfilePicUrl(tempProfile.profilePic)}
                              alt="Profile Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://placehold.co/200x200";
                              }}
                            />
                          </div>
                          <div className="flex flex-col space-y-2">
                            <label
                              htmlFor="profile-upload"
                              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Upload Picture
                            </label>
                            <input
                              id="profile-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            <p className="text-xs text-gray-500">
                              Recommended: Square image, at least 200x200px
                            </p>
                          </div>
                        </div>

                        {/* Profile Picture URL Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Or use image URL
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="url"
                              name="profilePicUrl"
                              value={tempProfile.profilePicUrl || ''}
                              onChange={handleInputChange}
                              placeholder="https://example.com/your-image.jpg"
                              className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            Enter a direct link to an image (must start with http:// or https://)
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={tempProfile.title || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g. Senior Full Stack Developer"
                      />
                    </div>
                    <div className="pt-4 flex justify-end gap-4">
                      <button
                        onClick={() => {
                          setTempProfile({...profile});
                          setPreviewUrl(null);
                          setEditMode(false);
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper Components
function ChecklistItem({ completed, text }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
        completed ? 'bg-green-100 text-green-500' : 'bg-gray-100 text-gray-400'
      }`}>
        {completed ? '✓' : '○'}
      </span>
      <span className={completed ? 'text-gray-700' : 'text-gray-500'}>
        {text}
      </span>
    </div>
  );
}

// Helper function to calculate profile strength
function calculateProfileStrength(profile, projects) {
  let strength = 0;
  const total = 5; // Total number of completion items

  if (profile.profilePic) strength++;
  if (profile.bio) strength++;
  if (profile.skills?.length >= 3) strength++;
  if (profile.title) strength++;
  if (projects?.length > 0) strength++;

  return Math.round((strength / total) * 100);
}

export default Profile; 