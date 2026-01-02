
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

interface RegisterPageProps {
  onRegister: (user: any) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password) {
      onRegister({
        id: 'user-new',
        email,
        full_name: name,
        avatar_url: `https://picsum.photos/seed/${name}/200`
      });
    }
  };

  return (
    <div className="flex flex-col px-8 pt-10 pb-10 h-full">
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-3xl font-bold text-pink-500">Tạo tài khoản</h1>
        <p className="text-gray-400">Tham gia cộng đồng ConCung</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" size={20} />
          <input
            type="text"
            placeholder="Họ và tên của mẹ"
            className="w-full bg-pink-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-pink-200 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" size={20} />
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-pink-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-pink-200 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" size={20} />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full bg-pink-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-pink-200 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-400 to-orange-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-200 flex items-center justify-center gap-2"
        >
          Đăng ký <ArrowRight size={20} />
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-500">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-pink-500 font-bold underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
