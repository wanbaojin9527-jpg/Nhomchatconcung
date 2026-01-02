
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Lock, User, ArrowRight } from 'lucide-react';

interface RegisterPageProps {
  onRegister: (user: any) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phoneNumber && password) {
      // Simulate Supabase phone registration
      onRegister({
        id: 'user-new',
        phone: phoneNumber,
        full_name: name,
        avatar_url: `https://picsum.photos/seed/${name}/200`
      });
    }
  };

  return (
    <div className="flex flex-col px-8 pt-10 pb-10 h-full">
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-3xl font-bold text-pink-500">Tham gia ngay</h1>
        <p className="text-gray-400">Kết nối cộng đồng mẹ & bé</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" size={20} />
          <input
            type="text"
            placeholder="Tên của mẹ"
            className="w-full bg-pink-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-pink-200 outline-none text-gray-700"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" size={20} />
          <input
            type="tel"
            placeholder="Số điện thoại"
            className="w-full bg-pink-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-pink-200 outline-none text-gray-700"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" size={20} />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full bg-pink-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-pink-200 outline-none text-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-400 to-orange-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-200 flex items-center justify-center gap-2 hover:opacity-95 transition-all active:scale-[0.98]"
        >
          Đăng ký <ArrowRight size={20} />
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-500">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-pink-500 font-bold hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
