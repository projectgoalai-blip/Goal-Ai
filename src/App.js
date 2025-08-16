import React, { useState, useEffect } from 'react';
import { AuthProvider } from './hooks/useAuth';
import SplashScreen from './components/SplashScreen';
import AuthPage from './components/AuthPage';
import OnboardingFlow from './components/OnboardingFlow';
import LoadingScreen from './components/LoadingScreen';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState('auth');

  useEffect(() => {
    // Show splash screen for 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <AuthProvider>
      <div className="app">
        <AppRouter />
      </div>
    </AuthProvider>
  );
}

function AppRouter() {
  const [currentView, setCurrentView] = useState('auth');
  
  return (
    <ProtectedRoute
      onAuthRequired={() => setCurrentView('auth')}
      onAuthSuccess={() => setCurrentView('onboarding')}
      onOnboardingComplete={() => setCurrentView('dashboard')}
    >
      {currentView === 'auth' && <AuthPage onSuccess={() => setCurrentView('onboarding')} />}
      {currentView === 'onboarding' && <OnboardingFlow onComplete={() => setCurrentView('loading')} />}
      {currentView === 'loading' && <LoadingScreen onComplete={() => setCurrentView('dashboard')} />}
      {currentView === 'dashboard' && <Dashboard />}
    </ProtectedRoute>
  );
}

export default App;
