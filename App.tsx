
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import HomeScreen from './pages/HomeScreen';
import ChatDetailScreen from './pages/ChatDetailScreen';
import ContactsScreen from './pages/ContactsScreen';
import DiscoverScreen from './pages/DiscoverScreen';
import ProfileScreen from './pages/ProfileScreen';
import NotificationsScreen from './pages/NotificationsScreen';
import SettingsScreen from './pages/SettingsScreen';
import ImageViewerScreen from './pages/ImageViewerScreen';
import { User } from './types';

export const broadcastDataUpdate = () => {
  window.dispatchEvent(new CustomEvent('cp-data-update'));
};

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const savedDark = localStorage.getItem('cp_dark_mode') === 'true';
    setIsDarkMode(savedDark);
    
    const session = localStorage.getItem('cp_session');
    if (session) {
      setCurrentUser(JSON.parse(session));
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cp_session' && !e.newValue) {
        setCurrentUser(null);
      }
      if (['cp_chats', 'cp_friend_requests', 'cp_posts', 'cp_users', 'cp_notifications'].includes(e.key || '')) {
        broadcastDataUpdate();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('cp_dark_mode', isDarkMode.toString());
  }, [isDarkMode]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('cp_session', JSON.stringify(user));
    broadcastDataUpdate();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cp_session');
    broadcastDataUpdate();
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('cp_session', JSON.stringify(updatedUser));
    
    const users: User[] = JSON.parse(localStorage.getItem('cp_users') || '[]');
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('cp_users', JSON.stringify(users));
    }
    broadcastDataUpdate();
  };

  return (
    <Router>
      <div className="app-container border-x border-slate-100 dark:border-slate-800 transition-colors duration-500 overflow-x-hidden relative">
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<LoginScreen onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterScreen onRegister={handleLogin} />} />
          
          <Route path="/home" element={currentUser ? <HomeScreen user={currentUser} /> : <Navigate to="/login" />} />
          <Route path="/chat/:chatId" element={currentUser ? <ChatDetailScreen user={currentUser} /> : <Navigate to="/login" />} />
          <Route path="/contacts" element={currentUser ? <ContactsScreen user={currentUser} /> : <Navigate to="/login" />} />
          <Route path="/discover" element={currentUser ? <DiscoverScreen user={currentUser} /> : <Navigate to="/login" />} />
          <Route path="/notifications" element={currentUser ? <NotificationsScreen user={currentUser} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={currentUser ? <ProfileScreen user={currentUser} onLogout={handleLogout} onUpdateUser={handleUpdateUser} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} /> : <Navigate to="/login" />} />
          <Route path="/settings" element={currentUser ? <SettingsScreen user={currentUser} /> : <Navigate to="/login" />} />
          <Route path="/image-viewer" element={<ImageViewerScreen />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
