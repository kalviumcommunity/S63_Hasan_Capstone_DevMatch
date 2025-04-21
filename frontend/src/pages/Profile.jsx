import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/Profile.css';

function Profile() {

  const [editMode, setEditMode] = useState(false);
  const [tempProfile, setTempProfile] = useState({...profile});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempProfile({...tempProfile, [name]: value});
  };

  const handleSave = () => {
    setProfile(tempProfile);
    setEditMode(false);
  };

  return (
    <div className="profile-page">
      <Sidebar />
      <div className="profile-content">
        <div className="profile-header">
          <h2>Your Profile</h2>
          {editMode ? (
            <div className="button-group">
              <button 
                onClick={handleSave}
                className="save-button"
              >
                Save Changes
              </button>
              <button 
                onClick={() => setEditMode(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button 
              onClick={() => {
                setTempProfile({...profile});
                setEditMode(true);
              }}
              className="edit-button"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="profile-card">
          <div className="profile-info">
            <div className="avatar">
              {profile.name.charAt(0)}
            </div>
            <div className="profile-details">
              {editMode ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={tempProfile.name}
                    onChange={handleInputChange}
                    className="profile-input"
                  />
                  <input
                    type="text"
                    name="title"
                    value={tempProfile.title}
                    onChange={handleInputChange}
                    className="profile-input subtitle"
                  />
                </>
              ) : (
                <>
                  <h3 className="profile-name">{profile.name}</h3>
                  <p className="profile-title">{profile.title}</p>
                </>
              )}
            </div>
          </div>

          <section className="profile-section">
            <h3>About</h3>
            {editMode ? (
              <textarea
                name="bio"
                value={tempProfile.bio}
                onChange={handleInputChange}
                className="profile-textarea"
              />
            ) : (
              <p className="profile-bio">{profile.bio}</p>
            )}
          </section>

          <section className="profile-section">
            <h3>Experience</h3>
            {profile.experience.map((exp) => (
              <div key={exp.id} className="experience-item">
                {editMode ? (
                  <div className="experience-edit">
                    <input
                      type="text"
                      value={exp.role}
                      className="profile-input"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      className="profile-input"
                    />
                    <input
                      type="text"
                      value={exp.duration}
                      className="profile-input"
                    />
                  </div>
                ) : (
                  <>
                    <h4 className="experience-role">{exp.role}</h4>
                    <p className="experience-company">{exp.company}</p>
                    <p className="experience-duration">{exp.duration}</p>
                  </>
                )}
              </div>
            ))}
          </section>

          <section className="profile-section">
            <h3>Skills</h3>
            <div className="skills-container">
              {profile.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="profile-section">
            <h3>Languages</h3>
            <div className="skills-container">
              {profile.languages.map((lang, index) => (
                <span key={index} className="language-tag">
                  {lang}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Profile;