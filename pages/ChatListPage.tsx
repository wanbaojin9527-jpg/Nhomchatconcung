
import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatListPage: React.FC = () => {
  const navigate = useNavigate();
  const [chats] = useState([
    { id: '1', name: 'Mẹ Gấu', lastMsg: 'Sữa này bé có thích không mẹ?', time: '14:30', avatar: 'https://picsum.photos/seed/mom2/200', unread: 2 },
    { id: '2', name: 'Mẹ Bắp', lastMsg: 'Mai đi công viên không?', time: '12:15', avatar: 'https://picsum.photos/seed/mom3/200', unread: 0 },
    { id: '3', name: 'Mẹ Sam', lastMsg: 'Ok mẹ nhé!', time: 'Hôm qua', avatar: 'https://picsum.photos/seed/mom4/200', unread: 0 },
    { id: '4', name: 'Group: Hội Review Bỉm', lastMsg: 'Mẹ Lan: Loại này thấm tốt lắm...', time: 'Hôm qua', avatar: 'https://picsum.photos/seed/group1/200', unread: 5 },
  ]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-pink-500 pt-12 pb-6 px-6 rounded-b-[40px] text-white sticky top-0 z-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tin nhắn</h1>
          <button className="bg-white/20 p-2 rounded-full hover:bg-white/30">
            <Plus size={24} />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-200" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm bạn bè..."
            className="w-full bg-white/20 border-none rounded-2xl py-3 pl-12 pr-4 text-white placeholder-pink-100 outline-none focus:ring-2 focus:ring-white/40"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto mt-4">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => navigate(`/chat/${chat.id}`)}
            className="flex items-center gap-4 px-6 py-4 hover:bg-pink-50 cursor-pointer transition-colors active:bg-pink-100"
          >
            <div className="relative">
              <img src={chat.avatar} alt={chat.name} className="w-14 h-14 rounded-full border-2 border-pink-100 object-cover" />
              {chat.unread > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {chat.unread}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-gray-800 truncate">{chat.name}</h3>
                <span className="text-xs text-gray-400">{chat.time}</span>
              </div>
              <p className="text-sm text-gray-500 truncate">{chat.lastMsg}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatListPage;
