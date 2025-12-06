import React, { useEffect, useState } from 'react';
import { AppView, UserProfile } from '../types';
import { Button, Card } from '../components/UI';
import { getProfile, logout, saveProfile } from '../services/storage';
import { MOCK_LEADERBOARD } from '../constants';
import { Sun, Moon, Briefcase, Trophy, Flame, PlayCircle, LogOut, Mountain, Calendar, Target, Edit2, Save, X } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
}

// Helper Component for Editable Goal Cards
const GoalCard: React.FC<{
  title: string;
  value: string;
  placeholder: string;
  icon: React.ElementType;
  onSave: (val: string) => void;
  className?: string;
}> = ({ title, value, placeholder, icon: Icon, onSave, className = '' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  // Sync internal state if prop changes
  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  return (
    <div className={`bg-gray-50 p-5 rounded-2xl border border-gray-100 relative group transition-all hover:border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm text-black">
            <Icon size={18} />
          </div>
          <h4 className="font-bold text-gray-500 text-xs uppercase tracking-widest">{title}</h4>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)} 
            className="p-2 text-gray-400 hover:text-black hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Edit2 size={14} />
          </button>
        ) : (
          <div className="flex gap-2">
             <button onClick={handleCancel} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><X size={16} /></button>
             <button onClick={handleSave} className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><Save size={16} /></button>
          </div>
        )}
      </div>

      {isEditing ? (
        <textarea
          autoFocus
          className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium text-gray-900 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all resize-none"
          rows={3}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <p className={`text-sm font-bold leading-relaxed whitespace-pre-wrap ${value ? 'text-gray-900' : 'text-gray-400 italic'}`}>
          {value || placeholder}
        </p>
      )}
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [profile, setProfile] = useState<UserProfile>(getProfile());

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      onNavigate(AppView.LOGIN);
    }
  };

  const updateGoal = (field: keyof UserProfile, value: string) => {
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    saveProfile(updated);
  };

  const data = [
    { name: 'M', hours: 2 },
    { name: 'T', hours: 3.5 },
    { name: 'W', hours: 2 },
    { name: 'T', hours: 1.5 },
    { name: 'F', hours: profile.deepWorkHours > 0 ? profile.deepWorkHours : 4 }, // Mock existing + current
    { name: 'S', hours: 1 },
    { name: 'S', hours: 0 },
  ];

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto pb-20">
      {/* Header */}
      <div className="bg-gray-900 p-6 pt-12 pb-8 rounded-b-3xl shadow-xl z-10 text-white relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full -mr-10 -mt-10"></div>
        
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight"><span className="text-yellow-400">Hello,</span> {profile.name}</h1>
            <p className="text-gray-400 text-sm font-medium mt-1 uppercase tracking-wider">Own the morning</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center bg-gray-800 px-4 py-2 rounded-xl border border-gray-700">
              <Flame size={20} className="text-yellow-400 mb-1" fill="currentColor" />
              <span className="text-xs font-bold text-white">{profile.streak} Days</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-3 bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-xl transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Quick Action - Wake Up Demo */}
        <button 
          onClick={() => onNavigate(AppView.WAKE_UP_FLOW)}
          className="w-full flex items-center justify-between p-5 bg-yellow-400 rounded-2xl text-black shadow-lg shadow-yellow-400/20 active:scale-95 transition-transform group relative z-10"
        >
          <div className="flex items-center gap-4">
             <div className="bg-black/10 p-2.5 rounded-xl"><Sun size={24} className="text-black" /></div>
             <div className="text-left">
               <div className="font-bold text-xs uppercase opacity-70 tracking-wider">Demo Mode</div>
               <div className="font-extrabold text-lg leading-tight">Simulate 5 AM</div>
             </div>
          </div>
          <PlayCircle size={32} className="text-black opacity-80 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <div className="p-6 space-y-6 -mt-2">
        {/* Main Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="flex flex-col items-center justify-center p-6 cursor-pointer border-2 border-transparent hover:border-yellow-400 transition-all bg-gray-50" onClick={() => onNavigate(AppView.DEEP_WORK) as any}>
            <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center mb-4 shadow-md">
              <Briefcase size={24} className="text-yellow-400" />
            </div>
            <span className="font-bold text-gray-900 text-lg">Deep Work</span>
            <span className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wide">{profile.deepWorkHours}h Tracked</span>
          </Card>
          <Card className="flex flex-col items-center justify-center p-6 cursor-pointer border-2 border-transparent hover:border-black transition-all bg-gray-50" onClick={() => onNavigate(AppView.NIGHT_ROUTINE) as any}>
             <div className="w-14 h-14 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Moon size={24} className="text-gray-900" />
            </div>
            <span className="font-bold text-gray-900 text-lg">Night Prep</span>
            <span className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wide">Plan Tomorrow</span>
          </Card>
        </div>

        {/* Strategic Vision Section */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/80">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-black rounded-lg text-yellow-400">
               <Mountain size={20} />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Strategic Vision</h3>
          </div>
          
          <div className="space-y-4">
             {/* Life Mission */}
             <GoalCard 
                title="Life Mission" 
                icon={Mountain} 
                value={profile.lifeMission} 
                placeholder="What is your ultimate purpose? (e.g., To build technology that empowers millions...)"
                onSave={(val) => updateGoal('lifeMission', val)}
                className="bg-gray-900 text-white border-gray-800"
             />

             <div className="grid grid-cols-1 gap-4">
               {/* Yearly Goal */}
               <GoalCard 
                  title="Yearly Goal" 
                  icon={Calendar} 
                  value={profile.yearlyGoal} 
                  placeholder="Your #1 goal for this year..."
                  onSave={(val) => updateGoal('yearlyGoal', val)}
               />
               
               {/* Monthly Task */}
               <GoalCard 
                  title="Monthly Target" 
                  icon={Target} 
                  value={profile.monthlyGoal} 
                  placeholder="This month's key milestone..."
                  onSave={(val) => updateGoal('monthlyGoal', val)}
               />
             </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-bold text-gray-900 text-lg">Weekly Focus</h3>
             <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">+12% vs last week</span>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} tick={{fill: '#9ca3af', fontWeight: 600}} />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}} 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#111827', color: 'white'}} 
                  itemStyle={{color: '#fbbf24'}}
                />
                <Bar dataKey="hours" radius={[6, 6, 6, 6]} barSize={24}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'F' ? '#facc15' : '#e5e7eb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-900 p-6 rounded-2xl text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-40 h-40 bg-gray-800 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <div className="flex items-center gap-3 mb-6 relative z-10">
             <Trophy size={20} className="text-yellow-400" fill="currentColor" />
             <h3 className="font-bold text-lg">Top Performers</h3>
          </div>
          <div className="space-y-5 relative z-10">
            {MOCK_LEADERBOARD.map((user, idx) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`font-bold w-6 flex justify-center ${idx === 0 ? 'text-yellow-400' : 'text-gray-500'}`}>{idx + 1}</div>
                  <img src={user.avatar} alt={user.name} className={`w-10 h-10 rounded-full object-cover border-2 ${idx === 0 ? 'border-yellow-400' : 'border-gray-700'}`} />
                  <div>
                    <div className="font-bold text-sm text-white">{user.name}</div>
                    <div className="text-xs text-gray-400 font-medium">{user.streak} Day Streak</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-900 bg-white px-3 py-1 rounded-lg">
                  {user.deepWorkHours}h
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};