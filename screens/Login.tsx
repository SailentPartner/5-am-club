import React, { useState } from 'react';
import { Button, Input } from '../components/UI';
import { AppView } from '../types';
import { Sunrise, Mail, Lock, Chrome } from 'lucide-react';
import { getProfile, saveProfile } from '../services/storage';

interface LoginProps {
  onNavigate: (view: AppView) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const profile = getProfile();
      // For demo purposes, we accept any login if fields are filled
      // In a real app, we'd verify credentials
      profile.email = email;
      profile.isAuthenticated = true;
      // If name is missing from previous session, set a default based on email
      if (!profile.name) profile.name = email.split('@')[0];
      
      saveProfile(profile);
      setLoading(false);
      onNavigate(AppView.DASHBOARD);
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const profile = getProfile();
      profile.name = "Google User";
      profile.email = "user@gmail.com";
      profile.isAuthenticated = true;
      saveProfile(profile);
      setLoading(false);
      onNavigate(AppView.DASHBOARD);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col p-8 bg-gray-900 text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
      
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="mb-10 flex flex-col items-center">
          <div className="p-4 bg-gray-800 rounded-2xl border border-gray-700 shadow-xl mb-6">
             <Sunrise size={40} className="text-yellow-400" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-center">Welcome Back</h1>
          <p className="text-gray-400 mt-2 text-center text-sm">Sign in to continue your streak.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute top-3.5 left-4 text-gray-500" size={20} />
            <Input 
              dark 
              type="email" 
              placeholder="Email Address" 
              className="pl-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute top-3.5 left-4 text-gray-500" size={20} />
            <Input 
              dark 
              type="password" 
              placeholder="Password" 
              className="pl-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <Button type="submit" variant="primary" className="mt-4" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-500">Or continue with</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="mt-6 w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-700 rounded-xl hover:bg-gray-800 transition-colors text-white font-bold text-sm"
          >
            <Chrome size={20} className="text-white" />
            Google
          </button>
        </div>
      </div>

      <div className="mt-auto pt-6 text-center">
        <p className="text-gray-500 text-sm">
          Don't have an account?{' '}
          <button onClick={() => onNavigate(AppView.SIGNUP)} className="text-yellow-400 font-bold hover:underline">
            Join the Club
          </button>
        </p>
      </div>
    </div>
  );
};