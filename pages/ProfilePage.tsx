
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight, Camera, Phone, User, Lock, X, ShieldCheck } from 'lucide-react';

interface ProfilePageProps {
  user: any;
  onLogout: () => void;
  onUpdateUser: (data: any) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout, onUpdateUser }) => {
  const navigate = useNavigate();
  const [modalType, setModalType] = useState<'edit' | 'password' | null>(null);
  const [newName, setNewName] = useState(user.full_name);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateUser({ avatar_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const menuItems = [
    { icon: <User size={20} className="text-pink-400" />, label: 'Sửa hồ sơ', color: 'bg-pink-50', onClick: () => { setNewName(user.full_name); setModalType('edit'); } },
    { icon: <Lock size={20} className="text-orange-400" />, label: 'Đổi mật khẩu', color: 'bg-orange-50', onClick: () => setModalType('password') },
    { icon: <Bell size={20} className="text-blue-400" />, label: 'Thông báo', color: 'bg-blue-50' },
    { icon: <Shield size={20} className="text-green-400" />, label: 'Quyền riêng tư', color: 'bg-green-50' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#FFF9FA]">
      <div className="bg-white pt-16 pb-10 px-8 flex flex-col items-center rounded-b-[60px] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 rounded-full -mr-16 -mt-16 opacity-40"></div>
        <div className="relative mb-6">
          <img src={user.avatar_url} className="w-28 h-28 rounded-[36px] border-4 border-pink-50 object-cover shadow-xl" alt="Profile" />
          <label className="absolute bottom-[-4px] right-[-4px] bg-pink-500 text-white p-2.5 rounded-2xl border-4 border-white shadow-md cursor-pointer">
            <Camera size={16} />
            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
          </label>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{user.full_name}</h2>
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-6 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
           <Phone size={14} className="text-pink-300" />
           <span className="font-semibold tracking-wide">{user.phone}</span>
        </div>
        
        {/* Admin Access Button (only visible for Admins) */}
        {user.role === 'admin' && (
          <button 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-pink-200 animate-bounce mt-2"
          >
            <ShieldCheck size={16} /> Vào trang Quản trị
          </button>
        )}
      </div>

      <div className="mt-8 px-6 space-y-3">
        {menuItems.map((item, idx) => (
          <button key={idx} onClick={item.onClick} className="w-full bg-white p-4 rounded-[24px] flex items-center justify-between group hover:bg-pink-50 transition-all border border-pink-50/50">
            <div className="flex items-center gap-4">
              <div className={`w-11 h-11 rounded-2xl ${item.color} flex items-center justify-center`}>{item.icon}</div>
              <span className="text-sm font-bold text-gray-700">{item.label}</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </button>
        ))}

        <button onClick={onLogout} className="w-full bg-white p-4 rounded-[24px] flex items-center justify-between mt-6 border border-red-50 text-red-400">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center"><LogOut size={20} /></div>
            <span className="text-sm font-bold">Đăng xuất tài khoản</span>
          </div>
        </button>
      </div>
      
      <div className="mt-12 text-center pb-24">
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[4px] cursor-default select-none">
          ConCung Chat & Wallet v1.0.1
        </p>
      </div>

      {modalType === 'edit' && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalType(null)}></div>
          <div className="bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[40px] p-8 relative z-10 shadow-2xl animate-slide-up">
            <button onClick={() => setModalType(null)} className="absolute top-6 right-6 text-gray-300"><X size={24} /></button>
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Sửa thông tin</h2>
            <input type="text" className="w-full bg-pink-50 border-none py-4 px-6 rounded-2xl mb-6 font-bold" value={newName} onChange={e => setNewName(e.target.value)} />
            <button onClick={() => { onUpdateUser({full_name: newName}); setModalType(null); }} className="w-full bg-pink-500 text-white py-4 rounded-2xl font-bold">Lưu thay đổi</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
