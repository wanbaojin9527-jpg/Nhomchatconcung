
import React from 'react';
import { Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight, Camera } from 'lucide-react';

interface ProfilePageProps {
  user: any;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout }) => {
  const menuItems = [
    { icon: <Bell size={20} className="text-pink-400" />, label: 'Thông báo', color: 'bg-pink-50' },
    { icon: <Shield size={20} className="text-blue-400" />, label: 'Quyền riêng tư', color: 'bg-blue-50' },
    { icon: <Settings size={20} className="text-gray-400" />, label: 'Cài đặt', color: 'bg-gray-100' },
    { icon: <HelpCircle size={20} className="text-orange-400" />, label: 'Trợ giúp', color: 'bg-orange-50' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#FFF9FA]">
      {/* Profile Header */}
      <div className="bg-white pt-16 pb-10 px-8 flex flex-col items-center rounded-b-[60px] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-100 rounded-full -ml-12 -mb-12 opacity-50"></div>
        
        <div className="relative mb-6">
          <img src={user.avatar_url} className="w-28 h-28 rounded-full border-4 border-pink-100 object-cover shadow-lg" alt="Profile" />
          <button className="absolute bottom-1 right-1 bg-pink-500 text-white p-2 rounded-full border-4 border-white shadow-md">
            <Camera size={16} />
          </button>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{user.full_name}</h2>
        <p className="text-gray-400 text-sm mb-6">{user.email}</p>
        
        <div className="flex gap-8">
          <div className="text-center">
            <span className="block font-bold text-gray-800">42</span>
            <span className="text-[10px] text-gray-400 uppercase font-bold">Bạn bè</span>
          </div>
          <div className="text-center border-x border-pink-50 px-8">
            <span className="block font-bold text-gray-800">12</span>
            <span className="text-[10px] text-gray-400 uppercase font-bold">Bài đăng</span>
          </div>
          <div className="text-center">
            <span className="block font-bold text-gray-800">5</span>
            <span className="text-[10px] text-gray-400 uppercase font-bold">Nhóm</span>
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="mt-8 px-6 space-y-3">
        {menuItems.map((item, idx) => (
          <button key={idx} className="w-full bg-white p-4 rounded-3xl flex items-center justify-between group hover:bg-pink-50 transition-colors shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-2xl ${item.color} flex items-center justify-center`}>
                {item.icon}
              </div>
              <span className="text-sm font-bold text-gray-700">{item.label}</span>
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-pink-500 transition-colors" />
          </button>
        ))}

        <button
          onClick={onLogout}
          className="w-full bg-white p-4 rounded-3xl flex items-center justify-between mt-6 border-2 border-transparent hover:border-pink-100 transition-all text-red-400 group shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
              <LogOut size={20} />
            </div>
            <span className="text-sm font-bold">Đăng xuất</span>
          </div>
        </button>
      </div>
      
      <div className="mt-10 text-center pb-20">
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[4px]">ConCung v1.0.0</p>
      </div>
    </div>
  );
};

export default ProfilePage;
