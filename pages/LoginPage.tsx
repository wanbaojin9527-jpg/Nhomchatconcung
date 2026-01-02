
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate Supabase login
    if (email && password) {
      onLogin({
        id: 'user-1',
        email: email,
        full_name: 'Mẹ Bỉm Sữa',
        avatar_url: 'https://picsum.photos/seed/mom1/200'
      });
    }
  };

  return (
    <div className="flex flex-col px-8 pt-16 pb-10 h-full">
      <div className="flex flex-col items-center mb-12">
        <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">🍼</span>
        </div>
        <h1 className="text-3xl font-bold text-pink-500">ConCung</h1>
        <p className="text-gray-400">Đăng nhập để kết nối</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" size={20} />
          <input
            type="email"
            placeholder="Email của bạn"
            className="w-full bg-pink-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" size={20} />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full bg-pink-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-400 to-orange-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-200 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          Đăng nhập <ArrowRight size={20} />
        </button>
      </form>

      <div className="mt-auto text-center">
        <p className="text-gray-500">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-pink-500 font-bold underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
