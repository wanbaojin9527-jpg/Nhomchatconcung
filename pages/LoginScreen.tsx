
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../types';
import { dbService } from '../services/dbService';

interface Props {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await dbService.getUser(phone);
      if (user && user.password === password) {
        onLogin(user);
        navigate('/home');
      } else {
        setError('Số điện thoại hoặc mật khẩu không đúng');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi kết nối máy chủ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background-dark p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="text-center">
          <div className="size-20 zalo-header-gradient rounded-3xl mx-auto flex items-center justify-center shadow-xl mb-6">
            <span className="material-symbols-outlined text-white text-4xl filled">chat_bubble</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Connect Plus</h1>
          <p className="text-slate-500 mt-2 font-medium">Đăng nhập bằng Cloud Database</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <input 
              type="tel" 
              placeholder="Số điện thoại" 
              className="w-full h-14 px-5 rounded-2xl bg-white dark:bg-slate-800 border-none shadow-sm dark:text-white focus:ring-2 focus:ring-primary"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              disabled={isLoading}
            />
            <input 
              type="password" 
              placeholder="Mật khẩu" 
              className="w-full h-14 px-5 rounded-2xl bg-white dark:bg-slate-800 border-none shadow-sm dark:text-white focus:ring-2 focus:ring-primary"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          {error && <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg">{error}</p>}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-14 bg-primary text-white font-black rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-all mt-4 flex items-center justify-center gap-2"
          >
            {isLoading ? <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'ĐĂNG NHẬP'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm">
          Chưa có tài khoản? <Link to="/register" className="text-primary font-bold hover:underline">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
