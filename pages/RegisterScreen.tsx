
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../types';
import { dbService } from '../services/dbService';

interface Props {
  onRegister: (user: User) => void;
}

const RegisterScreen: React.FC<Props> = ({ onRegister }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Kiểm tra xem số điện thoại đã tồn tại chưa
      const existingUser = await dbService.getUser(formData.phone);
      if (existingUser) {
        setError('Số điện thoại này đã được đăng ký');
        setIsLoading(false);
        return;
      }

      const newUser: User = {
        id: 'u-' + Date.now(),
        name: formData.name,
        phoneNumber: formData.phone,
        password: formData.password,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
        status: 'online',
      };

      const { error: dbError } = await dbService.createUser(newUser);
      
      if (dbError) {
        throw dbError;
      }

      onRegister(newUser);
      navigate('/home');
    } catch (err: any) {
      setError('Lỗi đăng ký: ' + (err.message || 'Không thể kết nối Database'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background-dark p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <div className="size-20 zalo-header-gradient rounded-3xl mx-auto flex items-center justify-center shadow-xl mb-6">
            <span className="material-symbols-outlined text-white text-4xl filled">person_add</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Đăng ký</h1>
          <p className="text-slate-500 mt-2">Tạo tài khoản mới lưu trữ trên Cloud</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="Họ và tên" 
              className="w-full h-14 px-5 rounded-2xl bg-white dark:bg-slate-800 border-none shadow-sm dark:text-white focus:ring-2 focus:ring-primary"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              disabled={isLoading}
            />
            <input 
              type="tel" 
              placeholder="Số điện thoại" 
              className="w-full h-14 px-5 rounded-2xl bg-white dark:bg-slate-800 border-none shadow-sm dark:text-white focus:ring-2 focus:ring-primary"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              disabled={isLoading}
            />
            <input 
              type="password" 
              placeholder="Mật khẩu" 
              className="w-full h-14 px-5 rounded-2xl bg-white dark:bg-slate-800 border-none shadow-sm dark:text-white focus:ring-2 focus:ring-primary"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              disabled={isLoading}
            />
          </div>
          
          {error && <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg">{error}</p>}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-14 bg-primary text-white font-black rounded-full shadow-lg shadow-primary/30 active:scale-95 transition-all mt-4 flex items-center justify-center"
          >
            {isLoading ? <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'TẠO TÀI KHOẢN'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm">
          Đã có tài khoản? <Link to="/login" className="text-primary font-bold hover:underline">Đăng nhập ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterScreen;
