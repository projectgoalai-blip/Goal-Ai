import React, { useEffect } from 'react';

function LoadingScreen({ onComplete }) {
  useEffect(() => {
    // Simulate dashboard preparation time
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-animation">
          <div className="loading-circle-large"></div>
          <div className="loading-text">
            <h2>Preparing Your Dashboard</h2>
            <p>Analyzing your profile and generating personalized plans...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
