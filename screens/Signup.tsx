import React, { useState } from 'react';
import { Button, Input } from '../components/UI';
import { AppView } from '../types';
import { User, Mail, Smartphone, Lock, ArrowLeft } from 'lucide-react';
import { getProfile, saveProfile } from '../services/storage';

interface SignupProps {
  onNavigate: (view: AppView) => void;
}

export const Signup: React.FC<SignupProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobile || !formData.password) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const profile = getProfile();
      profile.name = formData.name;
      profile.email = formData.email;
      profile.mobile = formData.mobile;
      profile.isAuthenticated = true;
      
      saveProfile(profile);
      setLoading(false);
      onNavigate(AppView.DASHBOARD);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col p-6 bg-gray-900 text-white relative overflow-hidden">
      <button 
        onClick={() => onNavigate(AppView.LOGIN)} 
        className="absolute top-6 left-6 p-2 -ml-2 text-gray-400 hover:text-white transition-colors z-20"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Background Decorative Element */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400 rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

      <div className="flex-1 flex flex-col justify-center relative z-10 mt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2">Create Account</h1>
          <p className="text-gray-400 text-sm">Join the 1% who own their mornings.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="relative">
            <User className="absolute top-3.5 left-4 text-gray-500" size={20} />
            <Input 
              dark 
              name="name"
              placeholder="Full Name" 
              className="pl-12"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <Smartphone className="absolute top-3.5 left-4 text-gray-500" size={20} />
            <Input 
              dark 
              name="mobile"
              type="tel"
              placeholder="Mobile Number" 
              className="pl-12"
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <Mail className="absolute top-3.5 left-4 text-gray-500" size={20} />
            <Input 
              dark 
              name="email"
              type="email"
              placeholder="Email Address" 
              className="pl-12"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <Lock className="absolute top-3.5 left-4 text-gray-500" size={20} />
            <Input 
              dark 
              name="password"
              type="password"
              placeholder="Password" 
              className="pl-12"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" variant="primary" className="mt-6" disabled={loading}>
            {loading ? 'Creating Account...' : 'Join The 5 AM Club'}
          </Button>
        </form>
      </div>

      <div className="mt-auto pt-6 text-center">
        <p className="text-gray-500 text-sm">
          Already a member?{' '}
          <button onClick={() => onNavigate(AppView.LOGIN)} className="text-yellow-400 font-bold hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};