
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { MessageCircle, Users, LayoutGrid, Wallet, User, ShieldAlert } from 'lucide-react';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatListPage from './pages/ChatListPage';
import ChatDetailPage from './pages/ChatDetailPage';
import GroupListPage from './pages/GroupListPage';
import FeedPage from './pages/FeedPage';
import WalletPage from './pages/WalletPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('concung_session');
    if (session) {
      setUser(JSON.parse(session));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: any) => {
    // Đảm bảo role được set chính xác khi login
    const isAdmin = userData.phone === '0000000000' || userData.role === 'admin';
    const finalUser = { ...userData, role: isAdmin ? 'admin' : 'user' };
    localStorage.setItem('concung_session', JSON.stringify(finalUser));
    setUser(finalUser);
  };

  const handleUpdateUser = (updatedData: any) => {
    const newUser = { ...user, ...updatedData };
    localStorage.setItem('concung_session', JSON.stringify(newUser));
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('concung_session');
    setUser(null);
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-pink-400 font-bold">🍼 Đang vào ConCung...</div>;

  return (
    <HashRouter>
      <div className="max-w-md mx-auto h-screen bg-white shadow-xl relative overflow-hidden flex flex-col">
        <main className="flex-1 overflow-y-auto custom-scrollbar pb-20">
          <Routes>
            <Route path="/login" element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <RegisterPage onRegister={handleLogin} /> : <Navigate to="/" />} />
            
            {/* TRANG CHỦ THÔNG MINH: Admin thấy trang Quản trị, User thấy trang Tin nhắn */}
            <Route path="/" element={
              user ? (
                user.role === 'admin' ? <AdminDashboardPage /> : <ChatListPage />
              ) : <Navigate to="/login" />
            } />

            <Route path="/chat/:id" element={user ? <ChatDetailPage /> : <Navigate to="/login" />} />
            <Route path="/groups" element={user ? <GroupListPage /> : <Navigate to="/login" />} />
            <Route path="/feed" element={user ? <FeedPage user={user} /> : <Navigate to="/login" />} />
            <Route path="/wallet" element={user ? <WalletPage /> : <Navigate to="/login" />} />
            <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboardPage /> : <Navigate to="/" />} />
            <Route path="/profile" element={user ? <ProfilePage user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} /> : <Navigate to="/login" />} />
          </Routes>
        </main>

        {user && <BottomNav role={user.role} />}
      </div>
    </HashRouter>
  );
};

const BottomNav: React.FC<{ role: string }> = ({ role }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path || (path === '/' && location.pathname === '');
  const getIconColor = (path: string) => isActive(path) ? 'text-pink-500 scale-110' : 'text-gray-400';

  // Không hiện thanh điều hướng ở trang chat chi tiết hoặc khi chưa đăng nhập
  const hideNavPaths = ['/chat'];
  if (hideNavPaths.some(p => location.pathname.startsWith(p))) return null;

  return (
    <nav className="fixed bottom-0 max-w-md w-full bg-white border-t border-pink-50 px-6 py-3 flex justify-between items-center shadow-[0_-8px_20px_rgba(255,182,193,0.15)] rounded-t-[32px] z-50 transition-all">
      <Link to="/" className={`flex flex-col items-center gap-1 transition-all ${getIconColor('/')}`}>
        {role === 'admin' ? <ShieldAlert size={24} /> : <MessageCircle size={24} />}
        <span className="text-[10px] font-bold">{role === 'admin' ? 'Quản trị' : 'Tin nhắn'}</span>
      </Link>
      
      {/* Các tab khác chỉ dành cho User, Admin chỉ nên tập trung quản trị ở trang chủ hoặc chuyển qua khám phá */}
      <Link to="/groups" className={`flex flex-col items-center gap-1 transition-all ${getIconColor('/groups')}`}>
        <Users size={24} strokeWidth={isActive('/groups') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Nhóm</span>
      </Link>
      <Link to="/feed" className={`flex flex-col items-center gap-1 transition-all ${getIconColor('/feed')}`}>
        <LayoutGrid size={24} strokeWidth={isActive('/feed') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Khám phá</span>
      </Link>
      <Link to="/wallet" className={`flex flex-col items-center gap-1 transition-all ${getIconColor('/wallet')}`}>
        <Wallet size={24} strokeWidth={isActive('/wallet') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Ví</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center gap-1 transition-all ${getIconColor('/profile')}`}>
        <User size={24} strokeWidth={isActive('/profile') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Tôi</span>
      </Link>
    </nav>
  );
};

export default App;
