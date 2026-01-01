
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { User, Chat } from '../types';
import { dbService } from '../services/dbService';
import { supabase } from '../lib/supabase';

interface Props {
  user: User;
}

const HomeScreen: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadChats = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await dbService.getMyChats(user.id);
      if (data) {
        // Sắp xếp theo tin nhắn mới nhất
        const sorted = [...data].sort((a, b) => {
          const timeA = a.messages && a.messages.length > 0 ? new Date(a.messages[a.messages.length-1].timestamp).getTime() : 0;
          const timeB = b.messages && b.messages.length > 0 ? new Date(b.messages[b.messages.length-1].timestamp).getTime() : 0;
          return timeB - timeA;
        });
        setChats(sorted);
      }
    } catch (err) {
      console.error("Lỗi tải chat:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadChats();
    
    // Subscribe lắng nghe tin nhắn mới để cập nhật danh sách chat realtime
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        loadChats();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [loadChats]);

  const filteredChats = chats.filter(c => {
    const name = c.name || "Trò chuyện";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="bg-[#f1f2f7] dark:bg-background-dark min-h-screen flex flex-col no-scrollbar">
      <header className="zalo-header-gradient px-4 pt-10 pb-3 sticky top-0 z-40 shadow-sm flex items-center gap-3">
        <div className="flex-1 flex items-center bg-white/20 rounded-lg px-3 py-1.5 backdrop-blur-md">
          <span className="material-symbols-outlined text-white text-[20px] mr-2">search</span>
          <input 
            className="bg-transparent border-none text-white placeholder:text-white/70 text-sm focus:ring-0 w-full p-0" 
            placeholder="Tìm bạn bè, tin nhắn..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"><span className="material-symbols-outlined text-[28px]">add</span></button>
      </header>

      <main className="flex-1 bg-white dark:bg-background-dark overflow-y-auto pb-24">
        {isLoading && (
          <div className="py-10 text-center">
            <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Đang tải dữ liệu Cloud...</p>
          </div>
        )}
        
        {!isLoading && filteredChats.length === 0 && (
          <div className="py-20 text-center px-10">
            <span className="material-symbols-outlined text-[64px] text-slate-200 mb-4">chat_bubble</span>
            <p className="text-slate-400 font-medium">Chưa có cuộc hội thoại nào. Hãy bắt đầu kết nối với bạn bè!</p>
          </div>
        )}

        {filteredChats.map((chat) => {
          const lastMsg = chat.messages && chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;
          
          return (
            <div key={chat.id} onClick={() => navigate(`/chat/${chat.id}`)} className="flex items-center gap-4 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-900 border-b dark:border-slate-800 cursor-pointer transition-colors">
              <div className="relative shrink-0">
                <div className={`size-14 rounded-full flex items-center justify-center overflow-hidden border border-slate-100 bg-slate-50`}>
                   <img src={chat.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${chat.name || 'Chat'}`} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-[16px] dark:text-white truncate">{chat.name || "Phòng chat"}</h4>
                  <span className="text-[10px] text-slate-400">
                    {lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                <p className={`text-sm truncate flex items-center gap-1 text-slate-500`}>
                   {lastMsg?.text || 'Bắt đầu cuộc trò chuyện...'}
                </p>
              </div>
            </div>
          );
        })}
      </main>

      <BottomNav />
    </div>
  );
};

export default HomeScreen;
