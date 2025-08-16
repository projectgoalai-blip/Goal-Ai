import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

function AuthPage({ onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login, register, error } = useAuth();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      onSuccess();
    } catch (err) {
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-section">
          <div className="auth-form">
            <div className="auth-header">
              <div className="logo-small">
                <div className="logo-circle-small">
                  <span>GA</span>
                </div>
              </div>
              <h1>{isLogin ? 'Welcome Back' : 'Join Goal AI'}</h1>
              <p>{isLogin ? 'Sign in to continue your journey' : 'Start your JEE/NEET preparation journey'}</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form-inputs">
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={!isLogin}
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your password"
                  minLength="6"
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="auth-switch">
              <p>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="auth-switch-btn"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>

        <div className="auth-hero-section">
          <div className="hero-content">
            <h2>Master Your JEE/NEET Preparation</h2>
            <p>AI-powered goal tracking to keep you on the path to success</p>
            
            <div className="hero-features">
              <div className="hero-feature">
                <div className="feature-icon">✓</div>
                <span>Daily AI-powered planning</span>
              </div>
              <div className="hero-feature">
                <div className="feature-icon">✓</div>
                <span>Progress tracking & analysis</span>
              </div>
              <div className="hero-feature">
                <div className="feature-icon">✓</div>
                <span>Personalized study schedules</span>
              </div>
              <div className="hero-feature">
                <div className="feature-icon">✓</div>
                <span>24/7 AI motivation & support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
