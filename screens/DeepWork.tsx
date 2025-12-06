import React, { useState, useEffect } from 'react';
import { Button } from '../components/UI';
import { ArrowLeft, Play, Pause, Square, CheckCircle, Wifi, WifiOff, BellOff, AlertTriangle, EyeOff, Zap, Flame, RefreshCw, Plane } from 'lucide-react';
import { addDeepWorkTime } from '../services/storage';

interface DeepWorkProps {
  onBack: () => void;
}

export const DeepWork: React.FC<DeepWorkProps> = ({ onBack }) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); 
  const [mode, setMode] = useState<'SETUP' | 'FOCUS' | 'SUMMARY'>('SETUP');
  const [sessionDuration, setSessionDuration] = useState(120); // minutes
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [distractions, setDistractions] = useState(0);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  // Helper to manually check connection
  const checkConnection = () => {
    setIsOnline(navigator.onLine);
  };

  useEffect(() => {
    // Online/Offline listeners
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    // Visibility listener for distraction tracking
    const handleVisibilityChange = () => {
      if (document.hidden && mode === 'FOCUS' && isActive) {
        setDistractions(prev => prev + 1);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [mode, isActive]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && mode === 'FOCUS') {
      setIsActive(false);
      setMode('SUMMARY');
      addDeepWorkTime(sessionDuration);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, sessionDuration]);

  const requestPermissions = async () => {
    if ("Notification" in window) {
      await Notification.requestPermission();
    }
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      const ctx = new AudioContext();
      ctx.resume().then(() => ctx.close());
    }
    setPermissionsGranted(true);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startSession = () => {
    // Double check status on click to be sure
    const currentStatus = navigator.onLine;
    setIsOnline(currentStatus);

    if (currentStatus) {
      alert("Connection Detected ⚠️\n\nTo ensure deep focus, you must disconnect from the internet (Airplane Mode) before starting.");
      return;
    }
    
    // Ask for explicit confirmation even if offline
    if (window.confirm("Please confirm that Airplane Mode is enabled and you are ready to focus.")) {
      setDistractions(0);
      setTimeLeft(sessionDuration * 60);
      setMode('FOCUS');
      setIsActive(true);
    }
  };

  const SetupView = () => (
    <div className="flex flex-col h-full p-6 bg-white">
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft /></button>
        <h1 className="text-2xl font-bold ml-2 text-gray-900">Deep Work</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mb-10">
          <label className="block text-gray-900 mb-4 font-bold text-lg">Session Duration</label>
          <div className="grid grid-cols-2 gap-4">
            {[25, 60, 90, 120].map(m => (
              <button
                key={m}
                onClick={() => setSessionDuration(m)}
                className={`py-5 rounded-xl font-bold text-xl transition-all border-2 ${
                  sessionDuration === m 
                    ? 'border-black bg-black text-yellow-400 shadow-xl' 
                    : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-300'
                }`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="font-bold text-gray-900 text-lg mb-2">Protocols</h3>
          
          <div onClick={requestPermissions} className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${permissionsGranted ? 'bg-gray-50 border-gray-900' : 'bg-white border-gray-100'}`}>
             <div className="flex items-center gap-4">
               <div className={`p-2 rounded-full ${permissionsGranted ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'}`}>
                 <BellOff size={20} />
               </div>
               <div className="text-left">
                 <div className={`font-bold ${permissionsGranted ? 'text-gray-900' : 'text-gray-500'}`}>Notifications</div>
               </div>
             </div>
             {permissionsGranted && <CheckCircle size={24} fill="currentColor" className="text-gray-900" />}
          </div>

          <div 
            onClick={checkConnection}
            className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${!isOnline ? 'bg-gray-50 border-gray-900' : 'bg-red-50 border-red-200'}`}
          >
             <div className="flex items-center gap-4">
               <div className={`p-2 rounded-full ${!isOnline ? 'bg-gray-900 text-white' : 'bg-red-100 text-red-500'}`}>
                 {isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
               </div>
               <div>
                 <div className={`font-bold ${!isOnline ? 'text-gray-900' : 'text-red-700'}`}>Airplane Mode</div>
                 {isOnline && <div className="text-xs font-bold text-red-400 mt-1 uppercase tracking-wide flex items-center gap-1">Required <RefreshCw size={10} /></div>}
               </div>
             </div>
             {!isOnline && <CheckCircle size={24} className="text-black" fill="currentColor" />}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4">
        {!permissionsGranted ? (
           <Button onClick={requestPermissions} variant="outline" className="mb-3">
             Grant Permissions
           </Button>
        ) : (
          <Button 
            onClick={startSession} 
            variant="primary"
            className={`transition-all ${isOnline ? 'bg-gray-100 text-gray-500 border-gray-200 shadow-none hover:bg-gray-200' : ''}`}
          >
            {isOnline ? 'Check Offline Status' : 'INITIATE FOCUS'}
          </Button>
        )}
      </div>
    </div>
  );

  const FocusView = () => {
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const totalSeconds = sessionDuration * 60;
    // Calculate progress: 1.0 (full) -> 0.0 (empty)
    const progress = Math.max(0, timeLeft / totalSeconds);
    // Calculate offset: 0 (full) -> circumference (empty)
    const strokeDashoffset = circumference * (1 - progress);

    const formatEndTime = () => {
      const end = new Date(Date.now() + timeLeft * 1000);
      return end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
      <div className="flex flex-col h-full bg-black text-white p-8 items-center justify-center relative overflow-hidden">
        {/* Subtle texture */}
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, #333 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
        
        {/* Airplane Mode Indicator */}
        <div className="absolute top-6 flex items-center gap-2 px-3 py-1.5 bg-gray-900/80 backdrop-blur-sm rounded-full border border-gray-800 z-20">
           <Plane size={14} className="text-gray-400" />
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Airplane Mode Active</span>
        </div>
        
        {distractions > 0 && (
          <div className="absolute top-16 z-20 px-6 py-3 bg-red-600 rounded-full flex items-center gap-3 animate-bounce shadow-red-900/50 shadow-lg">
            <EyeOff size={18} className="text-white" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">{distractions} Distractions</span>
          </div>
        )}

        <div className="relative z-10 flex items-center justify-center mb-16">
          <svg className="w-72 h-72 drop-shadow-2xl">
            {/* Background Track */}
            <circle cx="144" cy="144" r={radius} stroke="#333" strokeWidth="12" fill="transparent" />
            
            {/* Progress Bar 
                - rotate(-90deg): Start at 12 o'clock
                - scaleX(-1): Draw counter-clockwise
                - strokeDashoffset: Animate the length
            */}
            <circle
              cx="144"
              cy="144"
              r={radius}
              stroke="#FACC15" /* yellow-400 */
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transformOrigin: 'center',
                transform: 'rotate(-90deg) scaleX(-1)',
                transition: 'stroke-dashoffset 1s linear'
              }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <div className="p-3 bg-gray-900 rounded-full mb-4 border border-gray-800">
                <Zap size={20} className={isActive ? "text-yellow-400 fill-current" : "text-gray-600"} />
             </div>
            <div className="text-6xl font-bold tracking-tighter tabular-nums text-white">
              {formatTime(timeLeft)}
            </div>
            <div className="text-gray-500 text-sm mt-3 font-bold uppercase tracking-widest">
               Finish {formatEndTime()}
            </div>
          </div>
        </div>

        <div className="flex gap-8 z-10">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`w-24 h-24 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl ${isActive ? 'bg-white text-black' : 'bg-yellow-400 text-black'}`}
          >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>
        </div>
        
        <button 
          onClick={() => { setIsActive(false); setMode('SETUP'); }}
          className="absolute bottom-10 text-gray-600 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
        >
          <Square size={14} /> Abort Session
        </button>
      </div>
    );
  };

  const SummaryView = () => (
    <div className="flex flex-col h-full p-8 items-center justify-center bg-gray-900 text-center">
      <div className="w-28 h-28 bg-gray-800 rounded-full flex items-center justify-center mb-8 border-4 border-yellow-400 shadow-2xl shadow-yellow-400/20">
        <CheckCircle size={56} className="text-yellow-400" />
      </div>
      <h2 className="text-4xl font-extrabold text-white mb-4">Mission Complete</h2>
      <p className="text-gray-400 mb-10 max-w-xs text-lg">
        {sessionDuration} minutes of deep work banked.
      </p>
      
      {distractions === 0 && (
         <div className="mb-10 px-6 py-3 bg-yellow-400 text-black rounded-xl text-sm font-bold border border-yellow-500 shadow-lg flex items-center gap-2">
           <Flame size={18} fill="currentColor" />
           FLAWLESS VICTORY
         </div>
      )}

      <Button onClick={onBack} variant="secondary" className="bg-white text-black hover:bg-gray-200">
        Return to Base
      </Button>
    </div>
  );

  if (mode === 'FOCUS') return <FocusView />;
  if (mode === 'SUMMARY') return <SummaryView />;
  return <SetupView />;
};