import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import Profile from '../components/Profile';
import ProjectDetailsModal from '../components/ProjectDetailsModal';

// Common tech stacks for suggestions
const TECH_SUGGESTIONS = {
  'React': ['Next.js', 'Redux', 'React Native', 'TypeScript', 'Webpack', 'Jest'],
  'Node.js': ['Express', 'MongoDB', 'PostgreSQL', 'TypeScript', 'Docker', 'Redis'],
  'Python': ['Django', 'Flask', 'FastAPI', 'NumPy', 'Pandas', 'TensorFlow'],
  'JavaScript': ['TypeScript', 'Node.js', 'React', 'Vue.js', 'Angular', 'Express'],
  'AWS': ['Docker', 'Kubernetes', 'Terraform', 'Lambda', 'S3', 'DynamoDB'],
  'TypeScript': ['React', 'Node.js', 'Angular', 'Next.js', 'NestJS', 'GraphQL'],
};

function ProfilePage() {
  const { userId } = useParams();
  const { user: authUser, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempProfile, setTempProfile] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  const isOwnProfile = !userId || userId === authUser?._id;
  
  // Get the back button text based on where the user came from
  const getBackButtonText = () => {
    const from = location.state?.from || '';
    if (from.includes('/matches')) return 'Back to Matches';
    if (from.includes('/projects')) return 'Back to Projects';
    if (from.includes('/dashboard')) return 'Back to Dashboard';
    return 'Back';
  };

  useEffect(() => {
    const fetchProfileAndProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user profile
        const profileResponse = isOwnProfile 
          ? await userAPI.getProfile()
          : await userAPI.getUserById(userId);
        const profileData = profileResponse.data;
        setProfile(profileData);
        setTempProfile(profileData);

        // If this is the user's own profile, update the auth context with the full profile data
        if (isOwnProfile) {
          setUser(currentUser => ({
            ...currentUser,
            ...profileData
          }));
        }

        // Only fetch projects after we have the profile data
        if (profileData._id) {
          const projectsResponse = await userAPI.getUserProjects(profileData._id);
          setProjects(projectsResponse.data);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to load profile data');
        setLoading(false);
      }
    };

    fetchProfileAndProjects();
  }, [userId, isOwnProfile, authUser?._id, setUser]);

  // Generate skill suggestions based on current skills
  useEffect(() => {
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
  };

  const handleSave = async () => {
    try {
      setSaveMessage('');
      // Only send the fields that are in the User model
      const profileData = {
        name: tempProfile.name,
        email: tempProfile.email,
        title: tempProfile.title,
        bio: tempProfile.bio,
        profilePic: tempProfile.profilePic,
        skills: tempProfile.skills || []
      };
      const response = await userAPI.updateProfile(profileData);
      setProfile(response.data);
      // Update the user data in auth context
      setUser(currentUser => ({
        ...currentUser,
        ...response.data
      }));
      setEditMode(false);
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
      setSkillInput(''); // Clear the input after adding
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = tempProfile.skills.filter(skill => skill !== skillToRemove);
    setTempProfile({
      ...tempProfile,
      skills: updatedSkills
    });
  };

  const handleUpdateProfile = async (updatedProfile) => {
    try {
      const response = await userAPI.updateProfile(updatedProfile);
      const updatedData = response.data;
      setProfile(updatedData);
      
      // Update the user data in auth context
      setUser(currentUser => ({
        ...currentUser,
        ...updatedData
      }));
      
      return updatedData;
    } catch (err) {
      console.error('Error updating profile:', err);
      throw new Error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-6 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        {!isOwnProfile && (
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                clipRule="evenodd" 
              />
            </svg>
            {getBackButtonText()}
          </button>
        )}
        <Profile
          profile={profile}
          projects={projects}
          isOwnProfile={isOwnProfile}
          onUpdateProfile={handleUpdateProfile}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          onSignOut={handleSignOut}
        />
        {selectedProject && (
          <ProjectDetailsModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
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
  if (projects?.length > 0) strength++; // Check projects array from state

  return Math.round((strength / total) * 100);
}

export default ProfilePage;