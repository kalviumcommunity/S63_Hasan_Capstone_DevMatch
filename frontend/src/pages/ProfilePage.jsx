import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, profileAPI } from '../services/api';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import Profile from '../components/Profile';
import ProjectDetailsModal from '../components/ProjectDetailsModal';

function ProfilePage() {
  const { userId } = useParams();
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileAndProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        let profileData;
        if (!userId || userId === authUser?._id) {
          // Fetch own profile
          const response = await userAPI.getProfile();
          profileData = response.data;
        } else {
          // Fetch other user's profile
          const response = await profileAPI.getOne(userId);
          profileData = response.data;
        }
        setProfile(profileData);

        // Fetch projects created by this user
        const projectsResponse = await userAPI.getUserProjects(profileData._id);
        setProjects(projectsResponse.data);

        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load profile data');
        setLoading(false);
      }
    };

    fetchProfileAndProjects();
  }, [userId, authUser?._id]);

  const handleUpdateProfile = async (updatedProfile) => {
    try {
      const response = await userAPI.updateProfile(updatedProfile);
      setProfile(response.data);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update profile');
    }
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
        <Profile
          profile={profile}
          projects={projects}
          isOwnProfile={!userId || userId === authUser?._id}
          onUpdateProfile={handleUpdateProfile}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
        />

        {/* Project Quick View Modal */}
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

export default ProfilePage; 