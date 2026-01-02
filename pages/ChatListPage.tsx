
import React, { useState } from 'react';
import { Search, Plus, UserPlus, Users, MessageSquarePlus, X, Phone, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatListPage: React.FC = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<any[]>([]); // Clean state
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState<'friend' | 'group' | 'new' | null>(null);
  
  // Modal states
  const [phoneSearch, setPhoneSearch] = useState('');

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneSearch) return;
    alert(`Đã gửi yêu cầu kết bạn đến số: ${phoneSearch}`);
    setShowModal(null);
    setPhoneSearch('');
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-400 pt-12 pb-6 px-6 rounded-b-[40px] text-white sticky top-0 z-20 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Tin nhắn</h1>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className={`p-2 rounded-full transition-all shadow-md ${showMenu ? 'bg-white text-pink-500 rotate-45' : 'bg-white/20 text-white hover:bg-white/30'}`}
          >
            <Plus size={24} />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-200" size={18} />
          <input
            type="text"
            placeholder="Tìm tin nhắn..."
            className="w-full bg-white/20 border-none rounded-2xl py-3 pl-12 pr-4 text-white placeholder-pink-100 outline-none focus:ring-2 focus:ring-white/40 shadow-inner"
          />
        </div>
      </div>

      {/* Action Menu (Overlay) */}
      {showMenu && (
        <>
          <div className="fixed inset-0 bg-black/20 z-[35] animate-fade-in" onClick={() => setShowMenu(false)}></div>
          <div className="absolute right-6 top-32 bg-white rounded-3xl shadow-2xl p-2 z-[40] min-w-[220px] border border-pink-50 animate-pop-in">
            <button 
              onClick={() => { setShowMenu(false); setShowModal('friend'); }}
              className="flex items-center gap-3 w-full p-4 hover:bg-pink-50 rounded-2xl text-gray-700 font-semibold text-sm transition-colors"
            >
              <div className="w-9 h-9 bg-blue-100 text-blue-500 rounded-xl flex items-center justify-center shadow-sm">
                <UserPlus size={18} />
              </div>
              Thêm bạn bằng SĐT
            </button>
            <button 
              onClick={() => { setShowMenu(false); navigate('/groups'); }}
              className="flex items-center gap-3 w-full p-4 hover:bg-pink-50 rounded-2xl text-gray-700 font-semibold text-sm transition-colors"
            >
              <div className="w-9 h-9 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center shadow-sm">
                <Users size={18} />
              </div>
              Tạo nhóm chát
            </button>
            <button 
              onClick={() => { setShowMenu(false); setShowModal('new'); }}
              className="flex items-center gap-3 w-full p-4 hover:bg-pink-50 rounded-2xl text-gray-700 font-semibold text-sm transition-colors"
            >
              <div className="w-9 h-9 bg-pink-100 text-pink-500 rounded-xl flex items-center justify-center shadow-sm">
                <MessageSquarePlus size={18} />
              </div>
              Tin nhắn mới
            </button>
          </div>
        </>
      )}

      {/* Chat List Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        {chats.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
            <div className="w-32 h-32 bg-pink-50 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
              <span className="text-6xl">🍼</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có tin nhắn nào</h3>
            <p className="text-gray-400 text-sm max-w-[240px] leading-relaxed">
              Dùng dấu <span className="text-pink-400 font-bold">+</span> phía trên để bắt đầu trò chuyện với các mẹ khác nhé!
            </p>
          </div>
        ) : (
          <div className="mt-4 px-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => navigate(`/chat/${chat.id}`)}
                className="flex items-center gap-4 px-6 py-4 hover:bg-pink-50 cursor-pointer border-b border-pink-50/30 rounded-3xl transition-all"
              >
                <img src={chat.avatar} alt={chat.name} className="w-14 h-14 rounded-full border-2 border-white shadow-sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-gray-800 truncate">{chat.name}</h3>
                    <span className="text-[10px] text-gray-400">{chat.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate font-medium">{chat.lastMsg}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal - Add Friend by Phone */}
      {showModal === 'friend' && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(null)}></div>
          <div className="bg-white w-full rounded-t-[40px] sm:rounded-[40px] p-8 relative z-10 shadow-2xl animate-slide-up max-w-md">
            <button onClick={() => setShowModal(null)} className="absolute top-6 right-6 text-gray-300 hover:text-gray-500 transition-colors">
              <X size={24} />
            </button>
            
            <form onSubmit={handleAddFriend} className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mb-6">
                <UserPlus size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Thêm bạn bằng SĐT</h2>
              <p className="text-gray-400 text-xs text-center mb-8">Kết nối với các mẹ qua số điện thoại cá nhân</p>
              
              <div className="w-full relative mb-8">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input 
                  type="tel"
                  autoFocus
                  placeholder="Nhập số điện thoại..."
                  className="w-full bg-gray-50 border-none py-4 pl-12 pr-4 rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none text-gray-700 font-bold"
                  value={phoneSearch}
                  onChange={(e) => setPhoneSearch(e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className="w-full bg-blue-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:opacity-90 active:scale-[0.98] transition-all">
                Tìm kiếm bạn bè
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal - New Message */}
      {showModal === 'new' && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(null)}></div>
          <div className="bg-white w-full rounded-t-[40px] sm:rounded-[40px] p-8 relative z-10 shadow-2xl animate-slide-up max-w-md">
            <button onClick={() => setShowModal(null)} className="absolute top-6 right-6 text-gray-300 hover:text-gray-500 transition-colors">
              <X size={24} />
            </button>
            <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-3xl flex items-center justify-center mb-6">
                <MessageSquarePlus size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Tin nhắn mới</h2>
              <p className="text-gray-400 text-xs text-center mb-8">Bắt đầu một cuộc trò chuyện mới</p>
              <div className="w-full space-y-4">
                <div className="p-4 border border-pink-50 rounded-2xl text-center text-sm text-gray-400">
                  Chọn người liên hệ hoặc tìm kiếm ở trên
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pop-in { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-pop-in { animation: pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
      `}} />
    </div>
  );
};

export default ChatListPage;
