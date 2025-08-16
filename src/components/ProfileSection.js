import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiRequest } from '../utils/api';

function ProfileSection() {
  const { user } = useAuth();
  const [onboardingData, setOnboardingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    loadOnboardingData();
  }, []);

  const loadOnboardingData = async () => {
    try {
      const response = await apiRequest('GET', '/api/onboarding');
      if (response.ok) {
        const data = await response.json();
        setOnboardingData(data);
        setEditData(data);
      }
    } catch (error) {
      console.error('Failed to load profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await apiRequest('PUT', '/api/profile', editData);
      if (response.ok) {
        setOnboardingData(editData);
        setEditing(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleInputChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="profile-section">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-section">
      <div className="profile-header">
        <h2>Your Profile</h2>
        <button 
          className="edit-btn"
          onClick={() => setEditing(!editing)}
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <h3>Personal Information</h3>
          <div className="profile-grid">
            <div className="profile-item">
              <label>Name</label>
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={editData.name || user?.name || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{user?.name || 'Not provided'}</span>
              )}
            </div>

            <div className="profile-item">
              <label>Email</label>
              <span>{user?.email || 'Not provided'}</span>
            </div>

            <div className="profile-item">
              <label>Date of Birth</label>
              {editing ? (
                <input
                  type="date"
                  name="dateOfBirth"
                  value={editData.dateOfBirth || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{onboardingData?.dateOfBirth || 'Not provided'}</span>
              )}
            </div>
          </div>
        </div>

        <div className="profile-card">
          <h3>Exam Information</h3>
          <div className="profile-grid">
            <div className="profile-item">
              <label>Exam Type</label>
              {editing ? (
                <select
                  name="examType"
                  value={editData.examType || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Select exam</option>
                  <option value="JEE">JEE</option>
                  <option value="NEET">NEET</option>
                </select>
              ) : (
                <span>{onboardingData?.examType || 'Not provided'}</span>
              )}
            </div>

            <div className="profile-item">
              <label>Target Year</label>
              {editing ? (
                <select
                  name="targetYear"
                  value={editData.targetYear || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Select year</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                </select>
              ) : (
                <span>{onboardingData?.targetYear || 'Not provided'}</span>
              )}
            </div>

            <div className="profile-item">
              <label>Preparation Duration</label>
              {editing ? (
                <select
                  name="preparationYears"
                  value={editData.preparationYears || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Select duration</option>
                  <option value="1">1 Year</option>
                  <option value="2">2 Years</option>
                  <option value="3">3 Years</option>
                  <option value="4">4 Years</option>
                  <option value="5+">5+ Years</option>
                </select>
              ) : (
                <span>{onboardingData?.preparationYears ? `${onboardingData.preparationYears} years` : 'Not provided'}</span>
              )}
            </div>

            <div className="profile-item">
              <label>Current Status</label>
              {editing ? (
                <select
                  name="currentClass"
                  value={editData.currentClass || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Select status</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                  <option value="12th Pass">12th Pass</option>
                  <option value="Dropper">Dropper</option>
                  <option value="Repeater">Repeater</option>
                </select>
              ) : (
                <span>{onboardingData?.currentClass || 'Not provided'}</span>
              )}
            </div>
          </div>
        </div>

        <div className="profile-card">
          <h3>Study Information</h3>
          <div className="profile-grid">
            <div className="profile-item">
              <label>Daily Study Hours</label>
              {editing ? (
                <select
                  name="studyHours"
                  value={editData.studyHours || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Select hours</option>
                  <option value="4-6">4-6 hours</option>
                  <option value="6-8">6-8 hours</option>
                  <option value="8-10">8-10 hours</option>
                  <option value="10-12">10-12 hours</option>
                  <option value="12+">12+ hours</option>
                </select>
              ) : (
                <span>{onboardingData?.studyHours || 'Not provided'}</span>
              )}
            </div>

            <div className="profile-item">
              <label>Study Mode</label>
              {editing ? (
                <select
                  name="studyMode"
                  value={editData.studyMode || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Select mode</option>
                  <option value="Self Study">Self Study</option>
                  <option value="Coaching Institute">Coaching Institute</option>
                  <option value="Online Course">Online Course</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              ) : (
                <span>{onboardingData?.studyMode || 'Not provided'}</span>
              )}
            </div>

            <div className="profile-item">
              <label>Strong Subjects</label>
              {editing ? (
                <textarea
                  name="strongSubjects"
                  value={editData.strongSubjects || ''}
                  onChange={handleInputChange}
                  rows="2"
                />
              ) : (
                <span>{onboardingData?.strongSubjects || 'Not provided'}</span>
              )}
            </div>

            <div className="profile-item">
              <label>Weak Subjects</label>
              {editing ? (
                <textarea
                  name="weakSubjects"
                  value={editData.weakSubjects || ''}
                  onChange={handleInputChange}
                  rows="2"
                />
              ) : (
                <span>{onboardingData?.weakSubjects || 'Not provided'}</span>
              )}
            </div>
          </div>
        </div>

        {editing && (
          <div className="profile-actions">
            <button className="btn-primary" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileSection;
