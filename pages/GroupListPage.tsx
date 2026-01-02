
import React, { useState } from 'react';
import { Search, Plus, X, Camera, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GroupListPage: React.FC = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<any[]>([]); // Clean state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName) return;

    const newGroup = {
      id: `g-${Date.now()}`,
      name: newGroupName,
      avatar: previewAvatar || `https://picsum.photos/seed/${newGroupName}/200`,
      members: 1,
      lastMsg: 'Nhóm vừa được tạo thành công'
    };

    setGroups([newGroup, ...groups]);
    setShowCreateModal(false);
    setNewGroupName('');
    setPreviewAvatar(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-pink-400 pt-12 pb-6 px-6 rounded-b-[40px] text-white sticky top-0 z-20 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Nhóm</h1>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all shadow-md"
          >
            <Plus size={24} />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-100" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm nhóm của mẹ..."
            className="w-full bg-white/20 border-none rounded-2xl py-3 pl-12 pr-4 text-white placeholder-pink-50 outline-none focus:ring-2 focus:ring-white/40 shadow-inner"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        {groups.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
            <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center mb-6 animate-float">
              <span className="text-6xl">🏡</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa tham gia nhóm nào</h3>
            <p className="text-gray-400 text-sm max-w-[240px] leading-relaxed">
              Tạo nhóm để kết nối và chia sẻ hành trình nuôi con cùng các mẹ bỉm sữa nhé!
            </p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="mt-8 bg-orange-400 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-orange-100 hover:bg-orange-500 active:scale-95 transition-all"
            >
              Tạo nhóm mới
            </button>
          </div>
        ) : (
          <div className="mt-4 px-2">
            {groups.map((group) => (
              <div
                key={group.id}
                onClick={() => navigate(`/chat/${group.id}`)}
                className="flex items-center gap-4 px-4 py-4 hover:bg-orange-50 cursor-pointer rounded-3xl transition-all border-b border-orange-50/50"
              >
                <img src={group.avatar} alt={group.name} className="w-16 h-16 rounded-[24px] object-cover shadow-sm border-2 border-white" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-gray-800 truncate">{group.name}</h3>
                    <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">
                      {group.members} TV
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 truncate font-medium">{group.lastMsg}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center p-0 sm:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}></div>
          <div className="bg-white w-full rounded-t-[40px] sm:rounded-[40px] p-8 relative z-10 shadow-2xl animate-slide-up max-w-md">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-6 right-6 text-gray-300 hover:text-gray-500 transition-colors">
              <X size={24} />
            </button>
            
            <div className="flex flex-col items-center">
              <div className="relative mb-8 group">
                <div className="w-28 h-28 bg-orange-50 rounded-[32px] flex items-center justify-center overflow-hidden border-2 border-dashed border-orange-200 group-hover:border-orange-400 transition-colors shadow-inner">
                  {previewAvatar ? (
                    <img src={previewAvatar} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <Users size={48} className="text-orange-200" />
                  )}
                </div>
                <label className="absolute bottom-[-8px] right-[-8px] bg-orange-400 text-white p-2.5 rounded-2xl border-4 border-white shadow-lg cursor-pointer hover:bg-orange-500 transition-all active:scale-90">
                  <Camera size={18} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-2">Tạo nhóm mới</h2>
              <p className="text-gray-400 text-xs text-center mb-8 px-10">Đặt tên và chọn ảnh đại diện thật dễ thương cho nhóm mẹ bỉm nhé</p>
              
              <form onSubmit={handleCreateGroup} className="w-full space-y-6">
                <div className="w-full relative">
                  <input 
                    type="text"
                    autoFocus
                    placeholder="Tên nhóm của mẹ..."
                    className="w-full bg-gray-50 border-none py-4 px-6 rounded-2xl focus:ring-2 focus:ring-orange-100 outline-none text-gray-700 font-bold"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={!newGroupName}
                  className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-100 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  Tạo nhóm ngay
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-float { animation: float 4s infinite ease-in-out; }
      `}} />
    </div>
  );
};

export default GroupListPage;
