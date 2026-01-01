
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { User, AppNotification, FriendRequest } from '../types';
import { broadcastDataUpdate } from '../App';

interface Props {
  user: User;
}

const NotificationsScreen: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  const refreshData = useCallback(() => {
    // 1. Social Notifications
    const allNotifs: AppNotification[] = JSON.parse(localStorage.getItem('cp_notifications') || '[]');
    const myNotifs = allNotifs.filter(n => n.userId === user.id);
    myNotifs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setNotifications(myNotifs);

    // Mark as read immediately when viewed
    if (myNotifs.some(n => !n.isRead)) {
      const updatedNotifs = allNotifs.map(n => n.userId === user.id ? { ...n, isRead: true } : n);
      localStorage.setItem('cp_notifications', JSON.stringify(updatedNotifs));
      // Tránh loop vô tận bằng cách không gọi broadcast ở đây ngay lập tức
    }

    // 2. Friend Requests Count
    const allRequests: FriendRequest[] = JSON.parse(localStorage.getItem('cp_friend_requests') || '[]');
    const count = allRequests.filter(r => r.toUserId === user.id && r.status === 'pending').length;
    setPendingRequestsCount(count);
  }, [user.id]);

  useEffect(() => {
    refreshData();
    window.addEventListener('cp-data-update', refreshData);
    return () => window.removeEventListener('cp-data-update', refreshData);
  }, [refreshData]);

  return (
    <div className="bg-[#f1f2f7] dark:bg-background-dark min-h-screen flex flex-col pb-24 w-full max-w-[500px] mx-auto relative no-scrollbar">
      <header className="flex-none zalo-header-gradient px-4 pt-10 pb-3 sticky top-0 z-40 shadow-sm flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 text-white"><span className="material-symbols-outlined">arrow_back</span></button>
        <h2 className="text-white text-lg font-bold ml-2">Thông báo</h2>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar">
        {/* Lời mời kết bạn Entry */}
        <div 
            onClick={() => navigate('/contacts', { state: { activeTab: 'requests' } })}
            className="bg-white dark:bg-slate-900 p-4 mb-2 flex items-center gap-4 active:bg-slate-50 cursor-pointer shadow-sm"
        >
            <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[30px] filled">person_add</span>
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-[16px]">Lời mời kết bạn</h4>
                <p className="text-[13px] text-slate-500">
                    {pendingRequestsCount > 0 ? `Bạn có ${pendingRequestsCount} lời mời mới` : 'Xem các lời mời kết bạn'}
                </p>
            </div>
            {pendingRequestsCount > 0 && (
                <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{pendingRequestsCount}</div>
            )}
            <span className="material-symbols-outlined text-slate-300">chevron_right</span>
        </div>

        {/* Danh sách thông báo hoạt động */}
        <div className="space-y-[1px]">
          <h3 className="px-4 py-2 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Hoạt động gần đây</h3>
          {notifications.length === 0 ? (
            <div className="bg-white p-10 text-center text-slate-400 text-sm">Chưa có thông báo nào</div>
          ) : (
            notifications.map(notif => (
              <div 
                key={notif.id} 
                onClick={() => notif.type === 'new_post' && navigate('/discover')}
                className="bg-white dark:bg-slate-900 p-4 flex items-start gap-4 active:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="relative shrink-0">
                    <img src={notif.fromUserAvatar} className="size-12 rounded-full object-cover shadow-sm border border-slate-50" alt="Avt" />
                    <div className="absolute -bottom-1 -right-1 size-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="material-symbols-outlined text-white text-[14px] filled">
                            {notif.type === 'new_post' ? 'edit_square' : 'favorite'}
                        </span>
                    </div>
                </div>
                <div className="flex-1">
                    <p className="text-[14px] leading-snug">
                        <span className="font-bold text-slate-900">{notif.fromUserName}</span> {notif.content}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.timestamp).toLocaleDateString()}
                    </p>
                </div>
                {!notif.isRead && <div className="size-2 bg-primary rounded-full mt-2"></div>}
              </div>
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default NotificationsScreen;
