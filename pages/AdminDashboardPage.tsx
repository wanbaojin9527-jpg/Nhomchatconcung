
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  X,
  Users,
  Search,
  Edit3,
  Trash2,
  Database,
  Wallet,
  CheckCircle2,
  AlertCircle,
  MessageSquare
} from 'lucide-react';

interface UserProfile {
  id: string;
  phone: string;
  full_name: string;
  avatar_url: string;
  role: 'user' | 'admin';
  balance: number;
}

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'wallet' | 'posts'>('users');
  
  // Modal states
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const savedUsers = localStorage.getItem('concung_all_users');
    if (savedUsers) {
      setAllUsers(JSON.parse(savedUsers));
    } else {
      // Seed data if empty for demo
      const initialUsers: UserProfile[] = [
        { id: 'admin-master', phone: '0000000000', full_name: 'QUẢN TRỊ VIÊN', avatar_url: 'https://img.icons8.com/fluency/96/shield.png', role: 'admin', balance: 999999999 },
        { id: 'user-1', phone: '0901234567', full_name: 'Mẹ Bé Gấu', avatar_url: 'https://picsum.photos/seed/1/200', role: 'user', balance: 500000 },
        { id: 'user-2', phone: '0988777666', full_name: 'Mẹ Bỉm Sữa HN', avatar_url: 'https://picsum.photos/seed/2/200', role: 'user', balance: 250000 }
      ];
      localStorage.setItem('concung_all_users', JSON.stringify(initialUsers));
      setAllUsers(initialUsers);
    }
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updatedUsers = allUsers.map(u => u.id === editingUser.id ? editingUser : u);
    setAllUsers(updatedUsers);
    localStorage.setItem('concung_all_users', JSON.stringify(updatedUsers));
    
    // Update current session if the edited user is the logged in user
    const session = localStorage.getItem('concung_session');
    if (session) {
      const sessionUser = JSON.parse(session);
      if (sessionUser.id === editingUser.id) {
        localStorage.setItem('concung_session', JSON.stringify(editingUser));
      }
    }

    setEditingUser(null);
    alert("CẬP NHẬT THÔNG TIN VÀ SỐ DƯ THÀNH CÔNG! ✅");
  };

  const deleteUser = (id: string) => {
    if (id === 'admin-master') return alert("Không thể xóa Admin!");
    if (window.confirm("Xóa vĩnh viễn người dùng này?")) {
      const updated = allUsers.filter(u => u.id !== id);
      setAllUsers(updated);
      localStorage.setItem('concung_all_users', JSON.stringify(updated));
    }
  };

  const filteredUsers = allUsers.filter(u => 
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.phone.includes(searchTerm)
  );

  return (
    <div className="flex flex-col h-full bg-[#f0f4f8] font-sans">
      {/* HEADER DARK THEME - CỰC KỲ QUYỀN LỰC */}
      <div className="bg-slate-900 pt-16 pb-10 px-6 text-white rounded-b-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-[-30px] right-[-30px] w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-pink-500/40">
              <ShieldCheck size={36} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight uppercase">Control Panel</h1>
              <p className="text-[10px] font-bold text-pink-400 tracking-[3px] uppercase">Quản lý toàn hệ thống</p>
            </div>
          </div>
          <button onClick={() => navigate('/profile')} className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all">
            <X size={24} />
          </button>
        </div>

        {/* SEARCH BAR TRONG HEADER */}
        <div className="relative z-10">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Tìm tên hoặc SĐT người dùng..." 
            className="w-full bg-white/10 border border-white/10 py-5 pl-14 pr-6 rounded-[24px] text-white placeholder-slate-500 focus:bg-white/20 focus:outline-none transition-all font-bold" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* DANH SÁCH NGƯỜI DÙNG - HIỂN THỊ NGAY LẬP TỨC */}
      <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar pb-32">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
            <Users size={16} /> Danh sách hội viên ({filteredUsers.length})
          </h2>
          <div className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase">
            Online System
          </div>
        </div>

        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-[32px] p-12 text-center border-2 border-dashed border-slate-200">
              <AlertCircle size={48} className="text-slate-200 mx-auto mb-4" />
              <p className="text-sm font-bold text-slate-400">Không tìm thấy người dùng nào!</p>
            </div>
          ) : (
            filteredUsers.map(user => (
              <div key={user.id} className="bg-white rounded-[32px] p-5 shadow-sm border border-slate-100 flex items-center justify-between animate-slide-up hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={user.avatar_url} className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-50 shadow-sm" alt="Avt" />
                    {user.role === 'admin' && (
                      <div className="absolute -top-2 -right-2 bg-pink-500 text-white p-1 rounded-lg border-2 border-white">
                        <ShieldCheck size={12} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-base leading-tight">{user.full_name}</h3>
                    <p className="text-[11px] text-slate-400 font-bold">{user.phone}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Wallet size={10} className="text-green-500" />
                      <p className="text-xs font-black text-green-600">{(user.balance || 0).toLocaleString()} đ</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditingUser(user)}
                    className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90"
                    title="Chỉnh sửa thông tin & Số dư"
                  >
                    <Edit3 size={20} />
                  </button>
                  <button 
                    onClick={() => deleteUser(user.id)}
                    className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-90"
                    title="Xóa người dùng"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* FOOTER ĐIỀU HƯỚNG NHANH CHO ADMIN */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-4 flex justify-around items-center rounded-t-[40px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-40">
        <button onClick={() => setActiveTab('users')} className={`flex flex-col items-center gap-1 ${activeTab === 'users' ? 'text-pink-500' : 'text-slate-400'}`}>
          <Users size={24} />
          <span className="text-[10px] font-black uppercase">Hội viên</span>
        </button>
        <button onClick={() => { setActiveTab('wallet'); alert("Tính năng duyệt rút tiền ở tab này!"); }} className="flex flex-col items-center gap-1 text-slate-400">
          <Wallet size={24} />
          <span className="text-[10px] font-black uppercase">Duyệt Ví</span>
        </button>
        <button onClick={() => { setActiveTab('posts'); alert("Quản lý bài đăng ở tab này!"); }} className="flex flex-col items-center gap-1 text-slate-400">
          <MessageSquare size={24} />
          <span className="text-[10px] font-black uppercase">Bài viết</span>
        </button>
      </div>

      {/* MODAL CHỈNH SỬA CHI TIẾT (BAO GỒM SỐ DƯ) */}
      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => setEditingUser(null)}></div>
          <div className="bg-white w-full max-w-sm rounded-[45px] p-8 relative z-10 shadow-2xl scale-in border-4 border-slate-900">
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 bg-slate-100 rounded-[35px] flex items-center justify-center mb-4 overflow-hidden border-4 border-pink-100 shadow-inner">
                <img src={editingUser.avatar_url} className="w-full h-full object-cover" alt="Avt" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Cấu hình Hội viên</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">ID: {editingUser.id}</p>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-3">Tên hiển thị</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border-2 border-slate-100 py-4 px-6 rounded-2xl text-sm font-bold text-slate-800 focus:border-slate-900 outline-none transition-all" 
                  value={editingUser.full_name} 
                  onChange={e => setEditingUser({...editingUser, full_name: e.target.value})} 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-3">Số điện thoại</label>
                <input 
                  type="tel" 
                  className="w-full bg-slate-50 border-2 border-slate-100 py-4 px-6 rounded-2xl text-sm font-bold text-slate-800 focus:border-slate-900 outline-none transition-all" 
                  value={editingUser.phone} 
                  onChange={e => setEditingUser({...editingUser, phone: e.target.value})} 
                />
              </div>

              <div className="space-y-1.5 bg-pink-50/50 p-4 rounded-3xl border-2 border-pink-100">
                <label className="text-[10px] font-black text-pink-500 uppercase ml-1 flex items-center gap-2">
                  <Database size={12} /> Số dư ví cá nhân (đ)
                </label>
                <input 
                  type="number" 
                  className="w-full bg-white border-2 border-pink-200 py-5 px-6 rounded-2xl text-2xl font-black text-pink-600 focus:border-pink-500 outline-none transition-all shadow-inner" 
                  value={editingUser.balance} 
                  onChange={e => setEditingUser({...editingUser, balance: parseInt(e.target.value) || 0})} 
                  autoFocus
                />
                <p className="text-[9px] text-pink-400 font-bold mt-2 text-center uppercase">Nhập số tiền mẹ muốn thay đổi cho user này</p>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 bg-slate-900 text-white py-5 rounded-[24px] font-black text-sm flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all">
                  CẬP NHẬT <CheckCircle2 size={20} />
                </button>
                <button type="button" onClick={() => setEditingUser(null)} className="px-6 bg-slate-100 text-slate-400 rounded-[24px] font-black text-xs active:scale-95 uppercase">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-up { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes scale-in { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .scale-in { animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
      `}} />
    </div>
  );
};

export default AdminDashboardPage;
