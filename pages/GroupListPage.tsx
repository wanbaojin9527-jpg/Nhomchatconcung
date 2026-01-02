
import React, { useState } from 'react';
import { Search, Plus, Hash } from 'lucide-react';

const GroupListPage: React.FC = () => {
  const [groups] = useState([
    { id: 'g1', name: 'Hội Mẹ Bỉm HCM', members: 1250, lastMsg: 'Mẹ Hoa: Cho em xin link mua...', avatar: 'https://picsum.photos/seed/g1/200' },
    { id: 'g2', name: 'Review Ăn Dặm', members: 840, lastMsg: 'Mẹ Tú: Bé nhà em không chịu...', avatar: 'https://picsum.photos/seed/g2/200' },
    { id: 'g3', name: 'Thanh Lý Đồ Cũ Bé', members: 3200, lastMsg: 'Admin: Quy định đăng bài...', avatar: 'https://picsum.photos/seed/g3/200' },
  ]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="bg-pink-50 pt-12 pb-6 px-6 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Cộng đồng</h1>
          <button className="bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600">
            <Plus size={24} />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" size={18} />
          <input
            type="text"
            placeholder="Tìm nhóm, chủ đề..."
            className="w-full bg-white border-pink-100 border rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-4 rounded-3xl text-white shadow-md cursor-pointer hover:scale-95 transition-transform">
          <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
            <Hash size={24} />
          </div>
          <h3 className="font-bold">Khám phá</h3>
          <p className="text-[10px] opacity-80">Gợi ý chủ đề hay</p>
        </div>
        <div className="bg-gradient-to-br from-pink-400 to-pink-500 p-4 rounded-3xl text-white shadow-md cursor-pointer hover:scale-95 transition-transform">
          <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
            <Plus size={24} />
          </div>
          <h3 className="font-bold">Tạo nhóm</h3>
          <p className="text-[10px] opacity-80">Kết nối các mẹ</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 mt-2">
        <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 px-2">Nhóm của bạn</h4>
        {groups.map((group) => (
          <div key={group.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-pink-50 cursor-pointer mb-2 transition-colors">
            <img src={group.avatar} className="w-14 h-14 rounded-2xl object-cover shadow-sm" alt={group.name} />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-gray-800">{group.name}</h3>
              <p className="text-[10px] text-gray-400 mb-1">{group.members} thành viên</p>
              <p className="text-xs text-gray-500 truncate italic">{group.lastMsg}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupListPage;
