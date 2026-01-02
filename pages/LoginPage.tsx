
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Lock, ArrowRight, ShieldCheck, Terminal } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [unlockProgress, setUnlockProgress] = useState(0);
  const longPressTimer = useRef<any>(null);

  const startLongPress = () => {
    let progress = 0;
    longPressTimer.current = setInterval(() => {
      progress += 2;
      setUnlockProgress(progress);
      if (progress >= 100) {
        clearInterval(longPressTimer.current);
        setIsAdminMode(true);
        setUnlockProgress(0);
      }
    }, 100);
  };

  const endLongPress = () => {
    clearInterval(longPressTimer.current);
    if (unlockProgress < 100) setUnlockProgress(0);
  };

  const handleAdminAccess = () => {
    // Luôn cho phép truy cập admin bằng mã bí mật này
    onLogin({
      id: 'admin-master',
      phone: '0000000000',
      full_name: 'QUẢN TRỊ VIÊN',
      avatar_url: 'https://img.icons8.com/fluency/96/shield.png',
      role: 'admin',
      balance: 100000000
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check master admin phone
    if (phoneNumber === '0000000000') {
      handleAdminAccess();
      return;
    }

    if (phoneNumber && password) {
      // Tìm người dùng trong database giả lập
      const savedUsers = localStorage.getItem('concung_all_users');
      let targetUser = null;
      
      if (savedUsers) {
        const users = JSON.parse(savedUsers);
        targetUser = users.find((u: any) => u.phone === phoneNumber);
      }

      if (targetUser) {
        onLogin(targetUser);
      } else {
        // Tự động tạo user mới nếu chưa có (Để dễ test)
        const newUser = {
          id: 'user-' + Date.now(),
          phone: phoneNumber,
          full_name: 'Mẹ Bỉm Sữa',
          avatar_url: `https://picsum.photos/seed/${phoneNumber}/200`,
          role: 'user',
          balance: 0
        };
        
        // Lưu vào danh sách tổng
        const users = savedUsers ? JSON.parse(savedUsers) : [];
        users.push(newUser);
        localStorage.setItem('concung_all_users', JSON.stringify(users));
        
        onLogin(newUser);
      }
    }
  };

  return (
    <div className="flex flex-col px-8 pt-20 pb-10 h-full bg-[#FFF9FA] relative overflow-hidden">
      {/* Secret Progress Overlay */}
      {unlockProgress > 0 && (
        <div className="absolute inset-0 z-[100] bg-black/20 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
          <div className="bg-white p-6 rounded-[32px] shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-4 border-pink-100 border-t-pink-500 animate-spin mb-4"></div>
            <p className="text-pink-500 font-black text-xs uppercase tracking-widest">Truy cập Admin... {unlockProgress}%</p>
          </div>
        </div>
      )}

      {/* Admin Login Portal */}
      {isAdminMode && (
        <div className="absolute inset-0 z-[110] bg-slate-900 flex flex-col items-center justify-center p-8 animate-fade-in">
          <div className="w-24 h-24 bg-pink-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-pink-500/50">
            <ShieldCheck size={48} className="text-white" />
          </div>
          <h2 className="text-white text-2xl font-black mb-2 tracking-tighter uppercase">Trung tâm điều khiển</h2>
          <p className="text-slate-500 text-[10px] font-bold mb-10 uppercase tracking-[4px]">System Administrator Only</p>
          
          <div className="w-full space-y-4">
            <button 
              onClick={handleAdminAccess}
              className="w-full bg-pink-500 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
            >
              <Terminal size={20} /> XÁC NHẬN TRUY CẬP
            </button>
            <button 
              onClick={() => setIsAdminMode(false)}
              className="w-full bg-white/10 text-slate-400 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center mb-16">
        <div className="w-28 h-28 bg-white rounded-[40px] flex items-center justify-center mb-6 shadow-xl shadow-pink-100 border-4 border-white">
          <span className="text-6xl">🍼</span>
        </div>
        
        <h1 
          onMouseDown={startLongPress}
          onMouseUp={endLongPress}
          onTouchStart={startLongPress}
          onTouchEnd={endLongPress}
          className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 tracking-tighter cursor-pointer select-none active:scale-95 transition-transform"
        >
          ConCung
        </h1>
        <p className="text-gray-400 font-bold mt-2 uppercase text-[10px] tracking-[4px]">Vì tương lai của bé</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" size={20} />
            <input
              type="tel"
              placeholder="Số điện thoại của mẹ"
              className="w-full bg-white border-2 border-pink-50 rounded-[24px] py-5 pl-14 pr-4 focus:ring-4 focus:ring-pink-100 focus:border-pink-300 outline-none transition-all text-gray-700 font-bold shadow-sm"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" size={20} />
            <input
              type="password"
              placeholder="Mật khẩu"
              className="w-full bg-white border-2 border-pink-50 rounded-[24px] py-5 pl-14 pr-4 focus:ring-4 focus:ring-pink-100 focus:border-pink-300 outline-none transition-all text-gray-700 font-bold shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 text-white font-black py-5 rounded-[24px] shadow-2xl shadow-pink-200 flex items-center justify-center gap-3 hover:opacity-95 transition-all active:scale-[0.98] text-lg"
        >
          ĐĂNG NHẬP <ArrowRight size={22} />
        </button>
      </form>

      <div className="mt-auto text-center flex flex-col gap-4">
        <Link to="/register" className="text-pink-500 font-black hover:underline decoration-2 underline-offset-4">
          Mẹ mới tham gia? Đăng ký tại đây
        </Link>
        <p className="text-gray-300 text-[10px] font-bold tracking-widest">CONCUNG PLATFORM © 2025</p>
      </div>
    </div>
  );
};

export default LoginPage;
