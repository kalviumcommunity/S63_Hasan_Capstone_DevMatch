import React, { useState } from 'react';
import '../styles/Settings.css';

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [projectAlerts, setProjectAlerts] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  return (
    <div className="settings-container">
      <div className="main-content">
        <h2>Settings</h2>
        <p className="subtitle">Manage your account preferences and settings</p>

        <div className="settings-section">
          <h3>Notifications</h3>
          
          <div className="setting-item">
            <div className="setting-info">
              <h4>Email Notifications</h4>
              <p>Receive updates about your projects via email</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={emailNotifications}
                onChange={() => setEmailNotifications(!emailNotifications)}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4>Project Alerts</h4>
              <p>Get notified about new project matches</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={projectAlerts}
                onChange={() => setProjectAlerts(!projectAlerts)}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h4>Message Notifications</h4>
              <p>Receive notifications for new messages</p>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={messageNotifications}
                onChange={() => setMessageNotifications(!messageNotifications)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        <div className="divider"></div>

        <div className="settings-section">
          <h3>Account Settings</h3>
          
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="your@email.com" />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input type="password" placeholder="Enter new password" />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input type="password" placeholder="Confirm new password" />
          </div>

          <button className="save-button">Save Changes</button>
        </div>

        <div className="divider"></div>

        <div className="settings-section danger-zone">
          <h3>Danger Zone</h3>
          
          <div className="danger-item">
            <div className="danger-info">
              <h4>Delete Account</h4>
              <p>Once you delete your account, there is no going back. Please be certain.</p>
            </div>
            <div className="delete-confirm">
              <input 
                type="text" 
                placeholder="Type 'DELETE' to confirm"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
              />
              <button 
                className="delete-button"
                disabled={deleteConfirm !== 'DELETE'}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;