import React from 'react';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ children, onAuthRequired, onAuthSuccess, onOnboardingComplete }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return <div>{children}</div>;
}

export default ProtectedRoute;
