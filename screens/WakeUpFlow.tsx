import React, { useState, useEffect, useRef } from 'react';
import { WakeUpStep } from '../types';
import { Button, Card, Input } from '../components/UI';
import { Camera, Footprints, CheckCircle2, CloudSun, Droplets, Calculator, X, ChevronRight } from 'lucide-react';
import { QUOTES } from '../constants';
import { updateStreak } from '../services/storage';

interface WakeUpFlowProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const WakeUpFlow: React.FC<WakeUpFlowProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<WakeUpStep>(WakeUpStep.ALARM);
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Alarm logic (simulated)
  }, [step]);

  const nextStep = (next: WakeUpStep) => setStep(next);

  const AlarmScreen = () => (
    <div className="h-full flex flex-col items-center justify-between p-8 bg-black text-white relative">
      <div className="absolute inset-0 bg-yellow-400/5 animate-pulse"></div>
      <div className="mt-20 flex flex-col items-center relative z-10">
        <div className="p-6 bg-gray-900 rounded-full mb-8 border border-gray-800">
          <CloudSun size={64} className="text-yellow-400" />
        </div>
        <h1 className="text-7xl font-bold tracking-tighter text-white">05:00</h1>
        <p className="text-xl text-yellow-400 mt-4 tracking-[0.2em] uppercase font-bold">Rise & Grind</p>
      </div>
      <div className="w-full space-y-4 mb-10 relative z-10">
        <Button 
          variant="primary" 
          onClick={() => nextStep(WakeUpStep.STEPS)}
          className="py-6 text-xl shadow-yellow-400/40 animate-bounce"
        >
          I AM AWAKE
        </Button>
        <button onClick={onCancel} className="w-full text-center text-xs text-gray-500 hover:text-white uppercase tracking-widest font-bold mt-4">
          Emergency Exit
        </button>
      </div>
    </div>
  );

  const StepVerification = () => {
    const [count, setCount] = useState(0);
    const target = 15;

    const handleTap = () => {
      const newCount = count + 1;
      setCount(newCount);
      if (newCount >= target) {
        setTimeout(() => nextStep(WakeUpStep.WATER), 300);
      }
    };

    return (
      <div className="h-full flex flex-col p-6 bg-white">
        <h2 className="text-3xl font-extrabold text-black mb-2 uppercase">Movement</h2>
        <p className="text-gray-500 mb-8 font-medium">Activate your physiology. Tap rapidly.</p>
        
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative mb-12">
             <Footprints size={120} className="text-gray-100" />
             <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-5xl font-black text-gray-900">{count}<span className="text-gray-300 text-3xl">/{target}</span></span>
             </div>
          </div>
          
          <button 
            onClick={handleTap}
            className="w-32 h-32 rounded-full bg-yellow-400 text-black font-black text-xl shadow-xl shadow-yellow-400/30 active:scale-95 transition-transform flex items-center justify-center border-4 border-yellow-300"
          >
            TAP
          </button>
        </div>
      </div>
    );
  };

  const WaterVerification = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [captured, setCaptured] = useState(false);

    useEffect(() => {
      startCamera();
      return () => stopCamera();
    }, []);

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    const stopCamera = () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };

    const takePhoto = () => {
      setCaptured(true);
      stopCamera();
      setTimeout(() => nextStep(WakeUpStep.MATH), 1000);
    };

    return (
      <div className="h-full flex flex-col p-6 bg-gray-50">
        <h2 className="text-3xl font-extrabold text-black mb-2 uppercase">Hydration</h2>
        <p className="text-gray-500 mb-6 font-medium">Fuel your brain. Proof required.</p>
        
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-200 rounded-3xl overflow-hidden relative shadow-inner mb-6 border-4 border-white">
          {!captured ? (
             stream ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
             ) : (
               <div className="text-gray-400 text-center p-4 font-bold">ACCESSING OPTIC NERVE...</div>
             )
          ) : (
            <div className="flex flex-col items-center text-black bg-yellow-400 w-full h-full justify-center">
              <CheckCircle2 size={64} />
              <span className="mt-4 font-bold text-2xl uppercase">Verified</span>
            </div>
          )}
        </div>

        {!captured && (
          <Button onClick={takePhoto} variant="secondary">
            <Camera className="mr-2" size={20} /> Capture
          </Button>
        )}
      </div>
    );
  };

  const MathVerification = () => {
    const [num1] = useState(Math.floor(Math.random() * 50) + 10);
    const [num2] = useState(Math.floor(Math.random() * 50) + 10);
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = () => {
      if (parseInt(answer) === num1 + num2) {
        const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        setQuote(randomQuote);
        updateStreak();
        nextStep(WakeUpStep.QUOTE);
      } else {
        setError(true);
        setAnswer('');
      }
    };

    return (
      <div className="h-full flex flex-col p-6 bg-white">
        <h2 className="text-3xl font-extrabold text-black mb-2 uppercase">Cognition</h2>
        <p className="text-gray-500 mb-8 font-medium">Wake up your mind.</p>
        
        <Card className="flex flex-col items-center mb-8 py-12 bg-gray-50 border-gray-100">
          <Calculator size={48} className="text-gray-900 mb-6" />
          <div className="text-5xl font-black text-gray-900 mb-8 tracking-tighter">
            {num1} + {num2}
          </div>
          <Input 
            type="number" 
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setError(false);
            }}
            placeholder="?" 
            className={`text-center text-3xl py-6 font-bold ${error ? 'border-red-500 bg-red-50 text-red-900' : 'bg-white'}`}
            autoFocus
          />
        </Card>

        <Button onClick={handleSubmit} variant="primary">
          Verify
        </Button>
      </div>
    );
  };

  const QuoteScreen = () => {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-yellow-400 text-black text-center">
        <CloudSun size={64} className="text-black mb-10" />
        <h2 className="text-4xl font-extrabold mb-8 leading-none uppercase">Execution<br/>Starts Now.</h2>
        <div className="w-16 h-2 bg-black mb-10"></div>
        <blockquote className="text-xl font-bold leading-relaxed mb-16 max-w-xs">
          "{quote}"
        </blockquote>
        <Button onClick={onComplete} className="bg-black text-white hover:bg-gray-800 border-none w-full shadow-2xl">
          Enter Dashboard <ChevronRight size={20} />
        </Button>
      </div>
    );
  };

  return (
    <div className="h-full w-full relative bg-white">
      {step !== WakeUpStep.ALARM && step !== WakeUpStep.QUOTE && (
        <button onClick={onCancel} className="absolute top-6 right-6 text-gray-400 hover:text-black z-10 transition-colors">
          <X size={24} />
        </button>
      )}
      
      {step === WakeUpStep.ALARM && <AlarmScreen />}
      {step === WakeUpStep.STEPS && <StepVerification />}
      {step === WakeUpStep.WATER && <WaterVerification />}
      {step === WakeUpStep.MATH && <MathVerification />}
      {step === WakeUpStep.QUOTE && <QuoteScreen />}
    </div>
  );
};