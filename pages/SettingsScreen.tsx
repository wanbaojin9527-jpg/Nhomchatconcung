
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

// Fix: Added Props interface to correctly type the passed user prop
interface Props {
  user: User;
}

const SettingsScreen: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate();

  const settingsItems = [
    { icon: 'verified_user', label: 'Tài khoản & Bảo mật', color: 'bg-blue-100 dark:bg-blue-500/10 text-primary' },
    { icon: 'lock', label: 'Quyền riêng tư', color: 'bg-blue-100 dark:bg-blue-500/10 text-primary' },
    { icon: 'cloud_upload', label: 'Sao lưu tin nhắn', color: 'bg-green-100 dark:bg-green-500/10 text-green-600' },
    { icon: 'notifications', label: 'Thông báo', color: 'bg-red-100 dark:bg-red-500/10 text-red-500', badge: '2' },
    { icon: 'folder_open', label: 'Dữ liệu & Bộ nhớ', color: 'bg-purple-100 dark:bg-purple-500/10 text-purple-600' },
    { icon: 'language', label: 'Ngôn ngữ', color: 'bg-orange-100 dark:bg-orange-500/10 text-orange-500', value: 'Tiếng Việt' }
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col pb-10">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-5 pt-12 pb-4 flex items-center border-b border-slate-100 dark:border-slate-800">
        <button onClick={() => navigate(-1)} className="size-11 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-slate-800 dark:text-white">arrow_back_ios_new</span>
        </button>
        <h2 className="flex-1 text-center text-xl font-black pr-11">Cài đặt</h2>
      </header>

      <main className="flex-1 px-5 py-8 space-y-10">
        {/* Account Summary */}
        <div className="bg-white dark:bg-surface-dark p-6 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-5 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer" onClick={() => navigate('/profile')}>
          <div className="size-20 rounded-[24px] overflow-hidden ring-4 ring-primary/10 border-2 border-white dark:border-slate-900 shadow-xl">
            {/* Fix: Use user prop instead of invalid CURRENT_USER import */}
            <img src={user.avatar} alt="Me" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{user.name}</h3>
            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{user.phoneNumber}</p>
          </div>
          <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-[28px]">qr_code_2</span>
        </div>

        {/* Settings List */}
        <div className="bg-white dark:bg-surface-dark rounded-[32px] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
          {settingsItems.map((item, i) => (
            <div key={i} className="flex items-center gap-5 p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group active:scale-[0.99]">
              <div className={`size-12 rounded-[16px] flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 ${item.color}`}>
                <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[16px] font-black text-slate-900 dark:text-white tracking-tight">{item.label}</p>
              </div>
              <div className="flex items-center gap-3">
                {item.value && <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wide">{item.value}</span>}
                {item.badge && (
                  <div className="size-5 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                    <span className="text-[10px] font-black text-white">{item.badge}</span>
                  </div>
                )}
                <span className="material-symbols-outlined text-slate-300 dark:text-slate-700 text-[20px]">chevron_right</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="flex flex-col items-center justify-center py-6 gap-2">
            <h3 className="text-xl font-black tracking-tighter bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">Connect Plus</h3>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em]">Phiên bản 2.4.0 (Build 184)</p>
        </div>
      </main>
    </div>
  );
};

export default SettingsScreen;
