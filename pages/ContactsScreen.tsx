
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { User, Chat, FriendRequest } from '../types';
import { dbService } from '../services/dbService';

interface Props {
  user: User;
}

const ContactsScreen: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');
  const [searchTerm, setSearchTerm] = useState('');
  const [phoneSearch, setPhoneSearch] = useState('');
  const [searchResult, setSearchResult] = useState<User | null>(null);
  const [isSearchingPhone, setIsSearchingPhone] = useState(false);
  
  const [friends, setFriends] = useState<User[]>([]);
  const [pendingRequests, setPendingRequests] = useState<{request: FriendRequest, sender: User}[]>([]);

  const refreshData = useCallback(async () => {
    const allUsers = await dbService.getAllUsers();
    const { data: allRequests } = await dbService.getRequests(user.id);
    
    if (allRequests) {
      const friendIds = allRequests
        .filter(r => r.status === 'accepted')
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
    }
  }, [user.id]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handlePhoneSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneSearch.trim()) return;
    const found = await dbService.getUser(phoneSearch.trim());
    if (found && found.id !== user.id) {
      setSearchResult(found);
    } else {
      setSearchResult(null);
    }
  };

  const sendFriendRequest = async (targetId: string) => {
    const newRequest: FriendRequest = {
      id: 'req-' + Date.now(),
      fromUserId: user.id,
      toUserId: targetId,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    await dbService.createRequest(newRequest);
    alert("Đã gửi lời mời kết bạn!");
    setPhoneSearch('');
    setSearchResult(null);
    setIsSearchingPhone(false);
    refreshData();
  };

  const respondToRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    await dbService.updateRequest(requestId, status);
    
    if (status === 'accepted') {
      const reqItem = pendingRequests.find(r => r.request.id === requestId);
      if (reqItem) {
        const newChat: Chat = {
          id: 'chat-' + Date.now(),
          type: 'individual',
          participants: [user.id, reqItem.sender.id],
          messages: [],
          lastTimestamp: new Date().toISOString(),
          name: reqItem.sender.name,
          avatar: reqItem.sender.avatar
        };
        const { error } = await dbService.createChat(newChat);
        if (error) console.error("Create chat error:", error);
      }
    }
    refreshData();
  };

  const startChat = async (friend: User) => {
    const { data: allChats } = await dbService.getMyChats(user.id);
    let existingChat = allChats?.find(c => c.type === 'individual' && c.participants.includes(friend.id));
    
    if (!existingChat) {
      const newChat: Chat = {
        id: 'chat-' + Date.now(),
        type: 'individual',
        participants: [user.id, friend.id],
        messages: [],
        lastTimestamp: new Date().toISOString(),
        name: friend.name,
        avatar: friend.avatar
      };
      const { error } = await dbService.createChat(newChat);
      if (error) {
        alert("Lỗi tạo cuộc hội thoại: " + error.message);
        return;
      }
      navigate(`/chat/${newChat.id}`);
    } else {
      navigate(`/chat/${existingChat.id}`);
    }
  };

  return (
    <div className="bg-[#f1f2f7] dark:bg-background-dark min-h-screen flex flex-col pb-24 w-full max-w-[500px] mx-auto relative no-scrollbar">
      <header className="zalo-header-gradient px-4 pt-10 pb-3 sticky top-0 z-40 shadow-sm flex items-center gap-3">
        <div className="flex-1 flex items-center bg-white/20 rounded-lg px-3 py-1.5 backdrop-blur-md">
          <span className="material-symbols-outlined text-white text-[20px] mr-2">search</span>
          <input 
            placeholder="Tìm kiếm..." 
            className="bg-transparent border-none text-white text-sm focus:ring-0 w-full p-0"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={() => setIsSearchingPhone(!isSearchingPhone)} className="p-2 text-white"><span className="material-symbols-outlined">person_add</span></button>
      </header>

      <div className="flex bg-white dark:bg-slate-900 border-b">
        <button onClick={() => setActiveTab('friends')} className={`flex-1 py-3 text-sm font-bold border-b-2 ${activeTab === 'friends' ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}>BẠN BÈ</button>
        <button onClick={() => setActiveTab('requests')} className={`flex-1 py-3 text-sm font-bold border-b-2 ${activeTab === 'requests' ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}>LỜI MỜI ({pendingRequests.length})</button>
      </div>

      <main className="flex-1 overflow-y-auto">
        {isSearchingPhone && (
          <div className="p-4 bg-white border-b">
             <form onSubmit={handlePhoneSearch} className="flex gap-2">
                <input placeholder="Số điện thoại..." className="flex-1 h-11 px-4 bg-slate-100 rounded-lg" value={phoneSearch} onChange={e => setPhoneSearch(e.target.value)} />
                <button type="submit" className="px-6 bg-primary text-white rounded-lg font-bold">TÌM</button>
             </form>
             {searchResult && (
               <div className="mt-4 flex items-center gap-4 p-3 bg-blue-50 rounded-xl">
                  <img src={searchResult.avatar} className="size-12 rounded-full" />
                  <div className="flex-1">
                    <h4 className="font-bold">{searchResult.name}</h4>
                  </div>
                  <button onClick={() => sendFriendRequest(searchResult.id)} className="bg-primary text-white px-4 py-1 rounded-full text-xs font-bold">KẾT BẠN</button>
               </div>
             )}
          </div>
        )}

        {activeTab === 'friends' ? (
          <div className="bg-white divide-y">
            {friends.map(f => (
              <div key={f.id} className="flex items-center gap-4 px-4 py-3">
                <img src={f.avatar} className="size-12 rounded-full" />
                <h4 className="flex-1 font-medium">{f.name}</h4>
                <button onClick={() => startChat(f)} className="p-2 text-primary active:scale-90"><span className="material-symbols-outlined filled">chat</span></button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white divide-y">
            {pendingRequests.map(({ request, sender }) => (
              <div key={request.id} className="p-4 flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <img src={sender.avatar} className="size-12 rounded-full" />
                  <div className="flex-1"><h4 className="font-bold">{sender.name}</h4></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => respondToRequest(request.id, 'rejected')} className="flex-1 h-9 bg-slate-100 rounded-full font-bold">Từ chối</button>
                  <button onClick={() => respondToRequest(request.id, 'accepted')} className="flex-1 h-9 bg-blue-100 text-primary rounded-full font-bold">Đồng ý</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default ContactsScreen;
