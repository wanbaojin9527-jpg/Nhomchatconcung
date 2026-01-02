
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { MessageCircle, Users, LayoutGrid, Wallet, User, PlusCircle, LogOut } from 'lucide-react';

// Pages (defined in same file for simplicity as per instructions, but logic-wise separate)
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatListPage from './pages/ChatListPage';
import ChatDetailPage from './pages/ChatDetailPage';
import GroupListPage from './pages/GroupListPage';
import FeedPage from './pages/FeedPage';
import WalletPage from './pages/WalletPage';
import ProfilePage from './pages/ProfilePage';

// Mock Auth Context (In a real app, use Supabase Auth)
const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for session (Mocking Supabase session)
    const session = localStorage.getItem('concung_session');
    if (session) {
      setUser(JSON.parse(session));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: any) => {
    localStorage.setItem('concung_session', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('concung_session');
    setUser(null);
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-pink-400">Đang tải...</div>;

  return (
    <HashRouter>
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-xl relative overflow-hidden flex flex-col">
        <main className="flex-1 overflow-y-auto custom-scrollbar pb-20">
          <Routes>
            <Route path="/login" element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <RegisterPage onRegister={handleLogin} /> : <Navigate to="/" />} />
            
            <Route path="/" element={user ? <ChatListPage /> : <Navigate to="/login" />} />
            <Route path="/chat/:id" element={user ? <ChatDetailPage /> : <Navigate to="/login" />} />
            <Route path="/groups" element={user ? <GroupListPage /> : <Navigate to="/login" />} />
            <Route path="/feed" element={user ? <FeedPage /> : <Navigate to="/login" />} />
            <Route path="/wallet" element={user ? <WalletPage /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <ProfilePage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          </Routes>
        </main>

        {user && <BottomNav />}
      </div>
    </HashRouter>
  );
};

const BottomNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 max-w-md w-full bg-white border-t border-pink-100 px-6 py-3 flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)] rounded-t-3xl z-50">
      <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-pink-500' : 'text-gray-400'}`}>
        <MessageCircle size={24} />
        <span className="text-[10px] font-bold">Chat</span>
      </Link>
      <Link to="/groups" className={`flex flex-col items-center gap-1 ${isActive('/groups') ? 'text-pink-500' : 'text-gray-400'}`}>
        <Users size={24} />
        <span className="text-[10px] font-bold">Nhóm</span>
      </Link>
      <Link to="/feed" className={`flex flex-col items-center gap-1 ${isActive('/feed') ? 'text-pink-500' : 'text-gray-400'}`}>
        <LayoutGrid size={24} />
        <span className="text-[10px] font-bold">Feed</span>
      </Link>
      <Link to="/wallet" className={`flex flex-col items-center gap-1 ${isActive('/wallet') ? 'text-pink-500' : 'text-gray-400'}`}>
        <Wallet size={24} />
        <span className="text-[10px] font-bold">Ví</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-pink-500' : 'text-gray-400'}`}>
        <User size={24} />
        <span className="text-[10px] font-bold">Tôi</span>
      </Link>
    </nav>
  );
};

export default App;
