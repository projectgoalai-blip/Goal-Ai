import React, { useState } from 'react';
import { apiRequest } from '../utils/api';

function OnboardingFlow({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    examType: '',
    targetYear: '',
    preparationYears: '',
    currentClass: '',
    studyHours: '',
    weakSubjects: '',
    strongSubjects: '',
    previousAttempts: '',
    coachingInstitute: '',
    studyMode: ''
  });

  const totalSteps = 6;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/onboarding', formData);
      if (response.ok) {
        onComplete();
      }
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="onboarding-step">
            <h2>Personal Information</h2>
            <p>Let's start with some basic details about you</p>
            
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="onboarding-step">
            <h2>Exam Selection</h2>
            <p>Which exam are you preparing for?</p>
            
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="examType"
                  value="JEE"
                  checked={formData.examType === 'JEE'}
                  onChange={handleInputChange}
                />
                <span className="radio-label">JEE (Joint Entrance Examination)</span>
              </label>
              
              <label className="radio-option">
                <input
                  type="radio"
                  name="examType"
                  value="NEET"
                  checked={formData.examType === 'NEET'}
                  onChange={handleInputChange}
                />
                <span className="radio-label">NEET (National Eligibility Entrance Test)</span>
              </label>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="onboarding-step">
            <h2>Target & Timeline</h2>
            <p>When do you plan to take the exam?</p>
            
            <div className="form-group">
              <label htmlFor="targetYear">Target Year</label>
              <select
                id="targetYear"
                name="targetYear"
                value={formData.targetYear}
                onChange={handleInputChange}
                required
              >
                <option value="">Select target year</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="preparationYears">Years of Preparation</label>
              <select
                id="preparationYears"
                name="preparationYears"
                value={formData.preparationYears}
                onChange={handleInputChange}
                required
              >
                <option value="">Select preparation duration</option>
                <option value="1">1 Year</option>
                <option value="2">2 Years</option>
                <option value="3">3 Years</option>
                <option value="4">4 Years</option>
                <option value="5+">5+ Years</option>
              </select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="onboarding-step">
            <h2>Current Status</h2>
            <p>Tell us about your current academic status</p>
            
            <div className="form-group">
              <label htmlFor="currentClass">Current Class/Status</label>
              <select
                id="currentClass"
                name="currentClass"
                value={formData.currentClass}
                onChange={handleInputChange}
                required
              >
                <option value="">Select current status</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
                <option value="12th Pass">12th Pass</option>
                <option value="Dropper">Dropper</option>
                <option value="Repeater">Repeater</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="studyHours">Daily Study Hours</label>
              <select
                id="studyHours"
                name="studyHours"
                value={formData.studyHours}
                onChange={handleInputChange}
                required
              >
                <option value="">Select study hours</option>
                <option value="4-6">4-6 hours</option>
                <option value="6-8">6-8 hours</option>
                <option value="8-10">8-10 hours</option>
                <option value="10-12">10-12 hours</option>
                <option value="12+">12+ hours</option>
              </select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="onboarding-step">
            <h2>Subject Preferences</h2>
            <p>Help us understand your strengths and areas for improvement</p>
            
            <div className="form-group">
              <label htmlFor="strongSubjects">Strong Subjects</label>
              <textarea
                id="strongSubjects"
                name="strongSubjects"
                value={formData.strongSubjects}
                onChange={handleInputChange}
                placeholder="e.g., Mathematics, Physics..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="weakSubjects">Subjects needing improvement</label>
              <textarea
                id="weakSubjects"
                name="weakSubjects"
                value={formData.weakSubjects}
                onChange={handleInputChange}
                placeholder="e.g., Chemistry, Biology..."
                rows="3"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="onboarding-step">
            <h2>Additional Details</h2>
            <p>Final details to personalize your experience</p>
            
            <div className="form-group">
              <label htmlFor="studyMode">Study Mode</label>
              <select
                id="studyMode"
                name="studyMode"
                value={formData.studyMode}
                onChange={handleInputChange}
              >
                <option value="">Select study mode</option>
                <option value="Self Study">Self Study</option>
                <option value="Coaching Institute">Coaching Institute</option>
                <option value="Online Course">Online Course</option>
                <option value="Hybrid">Hybrid (Multiple modes)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="coachingInstitute">Coaching Institute (if any)</label>
              <input
                type="text"
                id="coachingInstitute"
                name="coachingInstitute"
                value={formData.coachingInstitute}
                onChange={handleInputChange}
                placeholder="Name of your coaching institute"
              />
            </div>

            <div className="form-group">
              <label htmlFor="previousAttempts">Previous Attempts</label>
              <select
                id="previousAttempts"
                name="previousAttempts"
                value={formData.previousAttempts}
                onChange={handleInputChange}
              >
                <option value="">Select previous attempts</option>
                <option value="None">First time</option>
                <option value="1">1 attempt</option>
                <option value="2">2 attempts</option>
                <option value="3+">3+ attempts</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="onboarding-flow">
      <div className="onboarding-container">
        <div className="onboarding-header">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          <p className="step-indicator">Step {currentStep} of {totalSteps}</p>
        </div>

        <div className="onboarding-content">
          {renderStep()}
        </div>

        <div className="onboarding-actions">
          {currentStep > 1 && (
            <button 
              type="button" 
              onClick={handlePrev}
              className="btn-secondary"
            >
              Previous
            </button>
          )}
          
          <button 
            type="button" 
            onClick={handleNext}
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : (currentStep === totalSteps ? 'Complete Setup' : 'Next')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingFlow;
