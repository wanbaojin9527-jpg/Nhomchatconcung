
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, FriendRequest } from '../types';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const [requestCount, setRequestCount] = useState(0);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  const refreshData = useCallback(() => {
    const session = localStorage.getItem('cp_session');
    if (session) {
      const user: User = JSON.parse(session);
      
      const allRequests: FriendRequest[] = JSON.parse(localStorage.getItem('cp_friend_requests') || '[]');
      setRequestCount(allRequests.filter(r => r.toUserId === user.id && r.status === 'pending').length);

      const allChats = JSON.parse(localStorage.getItem('cp_chats') || '[]');
      setUnreadChatCount(allChats.filter((c: any) => {
        if (!c.participants.includes(user.id)) return false;
        const lastMsg = c.messages[c.messages.length - 1];
        return lastMsg && lastMsg.senderId !== user.id && lastMsg.status !== 'read';
      }).length);
    }
  }, []);

  useEffect(() => {
    refreshData();
    window.addEventListener('cp-data-update', refreshData);
    return () => window.removeEventListener('cp-data-update', refreshData);
  }, [refreshData]);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/home', icon: 'chat', label: 'Tin nhắn', count: unreadChatCount },
    { path: '/contacts', icon: 'contacts', label: 'Danh bạ', count: requestCount },
    { path: '/discover', icon: 'explore', label: 'Nhật ký' },
    { path: '/profile', icon: 'person', label: 'Cá nhân' }
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 pb-6 pt-2 z-50">
      <div className="flex justify-around items-end px-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 w-full transition-all relative`}
            >
              <div className="relative">
                <span className={`material-symbols-outlined text-[26px] ${active ? 'text-primary filled' : 'text-slate-500'}`}>
                  {item.icon}
                </span>
                {item.count ? (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[15px] h-3.5 flex items-center justify-center border border-white">
                    {item.count > 5 ? '5+' : item.count}
                  </span>
                ) : null}
              </div>
              <span className={`text-[10px] font-medium transition-colors ${active ? 'text-primary font-bold' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
