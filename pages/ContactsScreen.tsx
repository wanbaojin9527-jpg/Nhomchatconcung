
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { User, Chat, FriendRequest } from '../types';
import { broadcastDataUpdate } from '../App';

interface Props {
  user: User;
}

const ContactsScreen: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');
  const [searchTerm, setSearchTerm] = useState('');
  const [phoneSearch, setPhoneSearch] = useState('');
  const [searchResult, setSearchResult] = useState<User | null>(null);
  const [isSearchingPhone, setIsSearchingPhone] = useState(false);
  
  const [friends, setFriends] = useState<User[]>([]);
  const [pendingRequests, setPendingRequests] = useState<{request: FriendRequest, sender: User}[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (location.state && (location.state as any).activeTab) {
      setActiveTab((location.state as any).activeTab);
    }
  }, [location.state]);

  const refreshData = useCallback(() => {
    const allUsers: User[] = JSON.parse(localStorage.getItem('cp_users') || '[]');
    const allRequests: FriendRequest[] = JSON.parse(localStorage.getItem('cp_friend_requests') || '[]');
    
    const friendIds = allRequests
      .filter(r => r.status === 'accepted' && (r.fromUserId === user.id || r.toUserId === user.id))
      .map(r => r.fromUserId === user.id ? r.toUserId : r.fromUserId);
    
    setFriends(allUsers.filter(u => friendIds.includes(u.id)));

    const requestsToMe = allRequests
      .filter(r => r.status === 'pending' && r.toUserId === user.id)
      .map(r => ({
        request: r,
        sender: allUsers.find(u => u.id === r.fromUserId) as User
      }))
      .filter(item => item.sender);
    setPendingRequests(requestsToMe);
    setPendingCount(requestsToMe.length);

    const sent = allRequests
      .filter(r => r.status === 'pending' && r.fromUserId === user.id)
      .map(r => r.toUserId);
    setSentRequests(sent);
  }, [user.id]);

  useEffect(() => {
    refreshData();
    window.addEventListener('cp-data-update', refreshData);
    return () => window.removeEventListener('cp-data-update', refreshData);
  }, [refreshData]);

  const handlePhoneSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneSearch.trim()) return;
    const allUsers: User[] = JSON.parse(localStorage.getItem('cp_users') || '[]');
    const found = allUsers.find(u => u.phoneNumber === phoneSearch.trim() && u.id !== user.id);
    setSearchResult(found || null);
  };

  const sendFriendRequest = (targetId: string) => {
    const allRequests: FriendRequest[] = JSON.parse(localStorage.getItem('cp_friend_requests') || '[]');
    const newRequest: FriendRequest = {
      id: 'req-' + Date.now(),
      fromUserId: user.id,
      toUserId: targetId,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cp_friend_requests', JSON.stringify([...allRequests, newRequest]));
    broadcastDataUpdate();
    setPhoneSearch('');
    setSearchResult(null);
    setIsSearchingPhone(false);
  };

  const startChat = (friendId: string) => {
    const allChats: Chat[] = JSON.parse(localStorage.getItem('cp_chats') || '[]');
    // Tìm chat cá nhân đã tồn tại giữa 2 người
    let existingChat = allChats.find(c => 
      c.type === 'individual' && 
      c.participants.includes(user.id) && 
      c.participants.includes(friendId)
    );
    
    if (!existingChat) {
      existingChat = {
        id: 'chat-' + Date.now(),
        type: 'individual',
        participants: [user.id, friendId],
        messages: [],
        lastTimestamp: 'Vừa xong'
      };
      localStorage.setItem('cp_chats', JSON.stringify([...allChats, existingChat]));
      broadcastDataUpdate();
    }
    
    navigate(`/chat/${existingChat.id}`);
  };

  const respondToRequest = (requestId: string, status: 'accepted' | 'rejected') => {
    const allRequests: FriendRequest[] = JSON.parse(localStorage.getItem('cp_friend_requests') || '[]');
    const reqIndex = allRequests.findIndex(r => r.id === requestId);
    
    if (reqIndex !== -1) {
      allRequests[reqIndex].status = status;
      localStorage.setItem('cp_friend_requests', JSON.stringify(allRequests));
      
      if (status === 'accepted') {
        const req = allRequests[reqIndex];
        const allChats: Chat[] = JSON.parse(localStorage.getItem('cp_chats') || '[]');
        const newChat: Chat = {
          id: 'chat-' + Date.now(),
          type: 'individual',
          participants: [req.fromUserId, req.toUserId],
          messages: [{
            id: 'sys-' + Date.now(),
            senderId: 'system',
            senderName: 'Hệ thống',
            text: 'Hai bạn đã trở thành bạn bè. Hãy bắt đầu trò chuyện!',
            timestamp: new Date().toISOString(),
            status: 'read'
          }],
          lastTimestamp: 'Vừa xong'
        };
        localStorage.setItem('cp_chats', JSON.stringify([...allChats, newChat]));
      }
      broadcastDataUpdate();
    }
  };

  const filteredFriends = friends.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="bg-[#f1f2f7] dark:bg-background-dark min-h-screen flex flex-col pb-24 w-full max-w-[500px] mx-auto relative no-scrollbar">
      {/* Header chuẩn Zalo */}
      <header className="flex-none zalo-header-gradient px-4 pt-10 pb-3 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 flex items-center bg-white/20 rounded-lg px-3 py-1.5 backdrop-blur-md">
            <span className="material-symbols-outlined text-white text-[20px] mr-2">search</span>
            <input 
              type="text" 
              placeholder="Tìm bạn bè, tin nhắn..." 
              className="bg-transparent border-none text-white placeholder:text-white/70 text-sm focus:ring-0 w-full p-0"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => { setIsSearchingPhone(!isSearchingPhone); setSearchResult(null); }}
            className="p-2 text-white active:bg-white/10 rounded-full"
          >
            <span className="material-symbols-outlined text-[26px]">person_add</span>
          </button>
        </div>
      </header>

      {/* Tab Selector */}
      <div className="flex bg-white dark:bg-slate-900 border-b border-slate-100 sticky top-[92px] z-30">
        <button 
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'friends' ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}
        >
          BẠN BÈ
        </button>
        <button 
          onClick={() => setActiveTab('requests')}
          className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all relative ${activeTab === 'requests' ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}
        >
          LỜI MỜI
          {pendingCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingCount}</span>
          )}
        </button>
      </div>

      <main className="flex-1 overflow-y-auto no-scrollbar">
        {isSearchingPhone && (
          <div className="p-4 bg-white border-b animate-in slide-in-from-top duration-300">
             <form onSubmit={handlePhoneSearch} className="flex gap-2">
                <input 
                  placeholder="Nhập số điện thoại..." 
                  className="flex-1 h-11 px-4 bg-slate-100 border-none rounded-lg text-sm"
                  value={phoneSearch}
                  onChange={e => setPhoneSearch(e.target.value)}
                />
                <button type="submit" className="px-6 bg-primary text-white rounded-lg font-bold text-sm">TÌM</button>
             </form>
             {searchResult && (
               <div className="mt-4 flex items-center gap-4 p-3 bg-blue-50 rounded-xl">
                  <img src={searchResult.avatar} className="size-12 rounded-full" alt="Avt" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{searchResult.name}</h4>
                    <p className="text-xs text-slate-500">{searchResult.phoneNumber}</p>
                  </div>
                  <button onClick={() => sendFriendRequest(searchResult.id)} className="bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold">KẾT BẠN</button>
               </div>
             )}
          </div>
        )}

        {activeTab === 'friends' ? (
          <div className="bg-white divide-y divide-slate-50">
            {filteredFriends.length === 0 ? (
              <div className="py-20 text-center text-slate-400 text-sm">Không tìm thấy bạn bè</div>
            ) : (
              filteredFriends.map(f => (
                <div key={f.id} className="flex items-center gap-4 px-4 py-3 active:bg-slate-50 cursor-pointer transition-colors">
                  <img src={f.avatar} className="size-12 rounded-full object-cover" alt="Avt" />
                  <div className="flex-1" onClick={() => navigate('/profile', { state: { profileUser: f } })}>
                    <h4 className="font-medium text-[16px]">{f.name}</h4>
                  </div>
                  <button 
                    onClick={() => startChat(f.id)} 
                    className="p-3 text-slate-400 hover:text-primary active:scale-90 transition-all"
                  >
                    <span className="material-symbols-outlined text-[24px]">chat</span>
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-2 py-2">
            <h3 className="px-4 py-2 text-[13px] font-bold text-slate-500 uppercase">Lời mời đã nhận ({pendingRequests.length})</h3>
            <div className="bg-white divide-y divide-slate-50">
              {pendingRequests.length === 0 ? (
                <div className="py-20 text-center text-slate-400 text-sm">Chưa có lời mời nào</div>
              ) : (
                pendingRequests.map(({ request, sender }) => (
                  <div key={request.id} className="p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                      <img src={sender.avatar} className="size-14 rounded-full object-cover shadow-sm" alt="Sender" />
                      <div className="flex-1">
                        <h4 className="font-bold text-[16px] text-slate-900 leading-tight">{sender.name}</h4>
                        <p className="text-[12px] text-slate-500 mt-0.5">Từ số điện thoại • {new Date(request.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-14">
                      <button 
                        onClick={() => respondToRequest(request.id, 'rejected')}
                        className="flex-1 h-9 bg-slate-100 text-slate-700 rounded-full font-bold text-sm active:bg-slate-200"
                      >
                        Từ chối
                      </button>
                      <button 
                        onClick={() => respondToRequest(request.id, 'accepted')}
                        className="flex-1 h-9 bg-blue-100 text-primary rounded-full font-bold text-sm active:bg-blue-200"
                      >
                        Đồng ý
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default ContactsScreen;
