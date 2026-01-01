
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { User } from '../types';

interface Props {
  user: User;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

const ProfileScreen: React.FC<Props> = ({ user, onLogout, onUpdateUser, isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateUser({ ...user, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const menuItems = [
    { icon: 'wallet', label: 'Ví QR', color: 'text-blue-500' },
    { icon: 'cloud', label: 'Cloud của tôi', color: 'text-sky-400', sub: 'Lưu trữ tài liệu quan trọng' },
    { icon: 'shield_person', label: 'Tài khoản và bảo mật', color: 'text-green-500' },
    { icon: 'lock', label: 'Quyền riêng tư', color: 'text-orange-400' },
    { icon: 'palette', label: 'Giao diện', color: 'text-purple-500', isToggle: true },
  ];

  return (
    <div className="bg-[#f1f2f7] dark:bg-background-dark min-h-screen flex flex-col pb-32 no-scrollbar">
      <header className="zalo-header-gradient px-4 pt-10 pb-4 sticky top-0 z-40 shadow-sm flex items-center justify-between">
         <div className="relative flex-1 flex items-center bg-white/20 rounded-lg px-3 py-1.5 backdrop-blur-md">
            <span className="material-symbols-outlined text-white text-[20px] mr-2">search</span>
            <input placeholder="Tìm kiếm" className="bg-transparent border-none text-white placeholder:text-white/70 text-sm focus:ring-0 w-full p-0"/>
         </div>
         <button onClick={() => navigate('/settings')} className="p-2 text-white"><span className="material-symbols-outlined text-[26px]">settings</span></button>
      </header>

      <main className="flex-1 space-y-2">
        <div 
          onClick={handleAvatarClick}
          className="bg-white dark:bg-slate-900 p-4 flex items-center gap-4 active:bg-slate-50 transition-colors cursor-pointer"
        >
          <img src={user.avatar} className="size-16 rounded-full object-cover border border-slate-100" alt="Avatar" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user.name}</h3>
            <p className="text-[13px] text-slate-500">Xem trang cá nhân</p>
          </div>
          <span className="material-symbols-outlined text-primary text-[32px]">qr_code_2</span>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>

        <div className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
          {menuItems.map((item, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-4 px-4 py-4 active:bg-slate-50 dark:active:bg-slate-800 transition-colors cursor-pointer"
              onClick={() => item.isToggle ? setIsDarkMode(!isDarkMode) : navigate('/settings')}
            >
              <span className={`material-symbols-outlined ${item.color} text-[26px]`}>{item.icon}</span>
              <div className="flex-1">
                <p className="text-[15px] font-medium text-slate-900 dark:text-white">{item.label}</p>
                {item.sub && <p className="text-[11px] text-slate-400">{item.sub}</p>}
              </div>
              {item.isToggle ? (
                <div className={`w-10 h-5 rounded-full relative transition-all ${isDarkMode ? 'bg-primary' : 'bg-slate-200'}`}>
                  <div className={`size-4 bg-white rounded-full absolute top-0.5 transition-all ${isDarkMode ? 'right-0.5' : 'left-0.5'}`} />
                </div>
              ) : (
                <span className="material-symbols-outlined text-slate-300">chevron_right</span>
              )}
            </div>
          ))}
        </div>

        <div className="p-4">
          <button 
            onClick={onLogout}
            className="w-full py-3.5 bg-white dark:bg-slate-900 text-red-500 font-bold rounded-xl active:bg-red-50 transition-colors shadow-sm"
          >
            Đăng xuất
          </button>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default ProfileScreen;
