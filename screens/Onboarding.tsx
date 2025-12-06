import React, { useState } from 'react';
import { Button, Input } from '../components/UI';
import { getProfile, saveProfile } from '../services/storage';
import { UserProfile } from '../types';
import { Sunrise } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [step, setStep] = useState(0);

  const handleFinish = () => {
    if (!name) return;
    const profile: UserProfile = {
      ...getProfile(),
      name: name,
    };
    saveProfile(profile);
    onComplete();
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gray-900 text-center relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
      
      <div className="mb-10 p-5 bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl relative z-10">
        <Sunrise size={48} className="text-yellow-400" />
      </div>
      
      {step === 0 ? (
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">THE 5 AM <span className="text-yellow-400">CLUB</span></h1>
          <p className="text-gray-400 mb-10 leading-relaxed max-w-xs mx-auto text-sm font-medium">
            Own your morning. Elevate your life. Wake up early, work deeply, and execute relentlessly.
          </p>
          <Button onClick={() => setStep(1)} variant="primary" className="animate-fade-in-up">
            Join the Movement
          </Button>
        </div>
      ) : (
        <div className="relative z-10 w-full max-w-xs">
          <h2 className="text-2xl font-bold text-white mb-2">Identify Yourself</h2>
          <p className="text-gray-400 mb-8 text-sm">How should we address you?</p>
          <Input 
            placeholder="Your Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="mb-8 text-center text-lg bg-gray-800 border-gray-700 text-white focus:border-yellow-400 focus:bg-gray-800 placeholder:text-gray-600"
            autoFocus
          />
          <Button onClick={handleFinish} disabled={!name} variant="primary">
            Start Journey
          </Button>
        </div>
      )}
    </div>
  );
};