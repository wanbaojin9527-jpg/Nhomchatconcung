
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative flex h-screen w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0A6CFF] to-[#3BA4FF] text-white">
      <div className="absolute -top-[10%] -right-[10%] h-[50vh] w-[50vh] rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
      <div className="absolute top-[20%] -left-[10%] h-[30vh] w-[30vh] rounded-full bg-primary/20 blur-2xl pointer-events-none"></div>
      
      <div className="flex-1"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-1000">
        <div className="mb-6 flex items-center justify-center rounded-[2.5rem] bg-white/10 p-10 shadow-2xl backdrop-blur-md ring-1 ring-white/20 transform hover:scale-105 transition-transform duration-500">
          <span className="material-symbols-outlined text-[72px] text-white drop-shadow-lg filled">add_comment</span>
        </div>
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-5xl font-extrabold tracking-tighter text-white drop-shadow-md">Connect Plus</h1>
          <p className="text-blue-100/80 font-medium tracking-widest text-sm uppercase">Connecting Vietnam</p>
        </div>
      </div>
      
      <div className="relative z-10 flex flex-1 flex-col items-center justify-end pb-12">
        <div className="mb-6 flex gap-3">
          <div className="h-2 w-2 animate-bounce rounded-full bg-white/80" style={{ animationDelay: '0ms' }}></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-white/80" style={{ animationDelay: '200ms' }}></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-white/80" style={{ animationDelay: '400ms' }}></div>
        </div>
        <p className="text-blue-200/60 text-xs font-semibold tracking-[0.2em]">v1.0.0-PROTOTYPE</p>
      </div>
    </div>
  );
};

export default SplashScreen;
