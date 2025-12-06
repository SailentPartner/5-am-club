import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './screens/Dashboard';
import { WakeUpFlow } from './screens/WakeUpFlow';
import { DeepWork } from './screens/DeepWork';
import { NightRoutine } from './screens/NightRoutine';
import { Login } from './screens/Login';
import { Signup } from './screens/Signup';
import { AppView } from './types';
import { getProfile } from './services/storage';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has profile and is authenticated
    const profile = getProfile();
    if (profile.isAuthenticated) {
      setCurrentView(AppView.DASHBOARD);
    } else {
      setCurrentView(AppView.LOGIN);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) return <div className="h-screen w-full flex items-center justify-center bg-gray-900 text-yellow-400 font-bold">LOADING...</div>;

  const renderScreen = () => {
    switch (currentView) {
      case AppView.LOGIN:
        return <Login onNavigate={setCurrentView} />;
      case AppView.SIGNUP:
        return <Signup onNavigate={setCurrentView} />;
      case AppView.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} />;
      case AppView.WAKE_UP_FLOW:
        return <WakeUpFlow onComplete={() => setCurrentView(AppView.DASHBOARD)} onCancel={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.DEEP_WORK:
        return <DeepWork onBack={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.NIGHT_ROUTINE:
        return <NightRoutine onBack={() => setCurrentView(AppView.DASHBOARD)} />;
      default:
        return <Login onNavigate={setCurrentView} />;
    }
  };

  return (
    <Layout>
      {renderScreen()}
    </Layout>
  );
};

export default App;