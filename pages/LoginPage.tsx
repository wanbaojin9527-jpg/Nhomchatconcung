
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Lock, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  
  // Secret Admin Trigger logic
  const longPressTimer = useRef<any>(null);
  const [unlockProgress, setUnlockProgress] = useState(0);

  const startLongPress = () => {
    let progress = 0;
    longPressTimer.current = setInterval(() => {
      progress += 20;
      setUnlockProgress(progress);
      if (progress >= 100) {
        clearInterval(longPressTimer.current);
        // Direct God-mode Login
        onLogin({
          id: 'admin-1',
          phone: '0000000000',
          full_name: 'Hệ thống Quản trị',
          avatar_url: 'https://img.icons8.com/fluency/96/shield.png'
        });
      }
    }, 1000);
  };

  const endLongPress = () => {
    clearInterval(longPressTimer.current);
    setUnlockProgress(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber && password) {
      if (phoneNumber === '0000000000') {
        onLogin({
          id: 'admin-1',
          phone: phoneNumber,
          full_name: 'Hệ thống Quản trị',
          avatar_url: 'https://img.icons8.com/fluency/96/shield.png'
        });
      } else {
        onLogin({
          id: 'user-1',
          phone: phoneNumber,
          full_name: 'Mẹ Bỉm Sữa',
          avatar_url: 'https://picsum.photos/seed/mom1/200'
        });
      }
    }
  };

  return (
    <div className="flex flex-col px-8 pt-16 pb-10 h-full bg-[#FFF9FA] relative">
      {/* Secret Progress Bar */}
      {unlockProgress > 0 && (
        <div className="absolute top-0 left-0 w-full h-1.5 bg-pink-100 z-50">
          <div 
            className="h-full bg-pink-500 transition-all duration-1000 ease-linear" 
            style={{ width: `${unlockProgress}%` }}
          ></div>
        </div>
      )}

      <div className="flex flex-col items-center mb-12">
        <div className="w-24 h-24 bg-pink-100 rounded-[40px] flex items-center justify-center mb-4 shadow-inner">
          <span className="text-5xl">🍼</span>
        </div>
        
        {/* Secret trigger on "ConCung" */}
        <h1 
          onMouseDown={startLongPress}
          onMouseUp={endLongPress}
          onTouchStart={startLongPress}
          onTouchEnd={endLongPress}
          className="text-4xl font-black text-pink-500 tracking-tight cursor-default select-none active:scale-95 transition-transform"
        >
          ConCung
        </h1>
        
        <p className="text-gray-400 font-medium">Cộng đồng mẹ & bé an toàn</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 group-focus-within:text-pink-500 transition-colors" size={20} />
          <input
            type="tel"
            placeholder="Số điện thoại"
            className="w-full bg-white border-2 border-pink-50 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-pink-100 focus:border-pink-200 outline-none transition-all text-gray-700 font-bold"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 group-focus-within:text-pink-500 transition-colors" size={20} />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full bg-white border-2 border-pink-50 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-pink-100 focus:border-pink-200 outline-none transition-all text-gray-700 font-bold"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold py-4 rounded-2xl shadow-xl shadow-pink-200 flex items-center justify-center gap-2 hover:opacity-95 transition-all active:scale-[0.98]"
        >
          Đăng nhập <ArrowRight size={20} />
        </button>
      </form>

      <div className="mt-auto text-center">
        <p className="text-gray-500 text-sm">
          Mẹ mới đến đây?{' '}
          <Link to="/register" className="text-pink-500 font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
