
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  X,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Trash2,
  Users,
  MessageSquare,
  AlertCircle,
  Database,
  TrendingUp,
  Search,
  PlusCircle,
  MousePointer2
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'withdraw' | 'transfer' | 'admin_adj';
  amount: number;
  desc: string;
  time: string;
  status: 'pending' | 'success' | 'rejected';
  rejectReason?: string;
}

interface Post {
  id: number;
  user: string;
  content: string;
  time: string;
  image?: string;
}

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [balance, setBalance] = useState(0);
  const [activeTab, setActiveTab] = useState<'wallet' | 'posts' | 'users'>('wallet');
  
  // Modals
  const [showAdjModal, setShowAdjModal] = useState(false);
  const [adjAmount, setAdjAmount] = useState('');
  const [adjType, setAdjType] = useState<'add' | 'sub'>('add');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    const savedTxs = localStorage.getItem('concung_transactions');
    const savedBalance = localStorage.getItem('concung_balance');
    const savedPosts = localStorage.getItem('concung_posts');
    
    if (savedTxs) setTransactions(JSON.parse(savedTxs));
    if (savedBalance) setBalance(parseInt(savedBalance));
    if (savedPosts) setPosts(JSON.parse(savedPosts));
  };

  const saveData = (newTxs: Transaction[], newBalance: number) => {
    setTransactions(newTxs);
    setBalance(newBalance);
    localStorage.setItem('concung_transactions', JSON.stringify(newTxs));
    localStorage.setItem('concung_balance', newBalance.toString());
  };

  const handleApprove = (id: string) => {
    const newTxs = transactions.map(tx => tx.id === id ? { ...tx, status: 'success' as const } : tx);
    saveData(newTxs, balance);
    alert("✅ ĐÃ DUYỆT THÀNH CÔNG! Tiền đã được trừ khỏi hệ thống.");
  };

  const handleReject = (id: string) => {
    const reason = prompt("Lý do từ chối (Lời nhắn cho mẹ):", "Thông tin ngân hàng không chính xác");
    if (reason === null) return;

    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    const newTxs = transactions.map(t => 
      t.id === id ? { ...t, status: 'rejected' as const, rejectReason: reason } : t
    );
    // Hoàn trả lại tiền vào ví người dùng khi bị từ chối
    saveData(newTxs, balance + tx.amount);
    alert("❌ ĐÃ TỪ CHỐI! Tiền đã được hoàn lại vào ví của mẹ.");
  };

  const handleManualAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(adjAmount);
    if (isNaN(val) || val <= 0) return;

    const finalVal = adjType === 'add' ? val : -val;
    const newBalance = balance + finalVal;
    
    const newTx: Transaction = {
      id: `adj-${Date.now()}`,
      type: 'admin_adj',
      amount: val,
      desc: `ADMIN: ${adjType === 'add' ? 'CỘNG' : 'TRỪ'} TIỀN HỆ THỐNG`,
      time: new Date().toLocaleString(),
      status: 'success'
    };

    saveData([newTx, ...transactions], newBalance);
    setShowAdjModal(false);
    setAdjAmount('');
  };

  // Helper để test nhanh tính năng phê duyệt
  const createSampleRequest = () => {
    const amount = 50000;
    if (balance < amount) {
      alert("Số dư hệ thống không đủ để tạo yêu cầu mẫu (Cần ít nhất 50k)");
      return;
    }
    const newTx: Transaction = {
      id: `sample-${Date.now()}`,
      type: 'withdraw',
      amount: amount,
      desc: "Yêu cầu mẫu (Test Admin)",
      time: new Date().toLocaleString(),
      status: 'pending'
    };
    saveData([newTx, ...transactions], balance - amount);
    alert("Đã tạo 1 yêu cầu rút tiền mẫu bên dưới để bạn TEST PHÊ DUYỆT!");
  };

  const pendingTxs = transactions.filter(t => t.status === 'pending');

  return (
    <div className="flex flex-col h-full bg-[#f0f2f5] font-sans">
      {/* HEADER QUYỀN NĂNG */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 pt-16 pb-10 px-6 text-white rounded-b-[50px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-pink-500/20 rounded-full blur-[80px]"></div>
        
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-pink-500 rounded-3xl flex items-center justify-center shadow-xl shadow-pink-500/30 border-2 border-white/20 animate-pulse">
              <ShieldCheck size={36} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">ADMIN CONTROL</h1>
              <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Master Access Granted</p>
            </div>
          </div>
          <button onClick={() => navigate('/profile')} className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all border border-white/10">
            <X size={24} />
          </button>
        </div>

        {/* CHỨC NĂNG THAY ĐỔI SỐ DƯ (CARD CHÍNH) */}
        <div className="bg-white/10 backdrop-blur-xl rounded-[32px] p-6 border border-white/10 shadow-inner relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tổng quỹ hệ thống</p>
              <h2 className="text-3xl font-black text-pink-400">{balance.toLocaleString()} đ</h2>
            </div>
            <div className="flex gap-2">
               <button 
                onClick={createSampleRequest}
                className="bg-blue-500/20 text-blue-300 p-3 rounded-2xl border border-blue-500/30 hover:bg-blue-500/40 transition-all"
                title="Tạo yêu cầu mẫu để TEST"
              >
                <PlusCircle size={20} />
              </button>
              <button 
                onClick={() => setShowAdjModal(true)} 
                className="bg-pink-500 hover:bg-pink-600 px-6 py-4 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg shadow-pink-500/40 active:scale-95 transition-all uppercase"
              >
                <TrendingUp size={20} /> THAY ĐỔI SỐ DƯ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABS ĐIỀU HƯỚNG */}
      <div className="flex px-6 gap-2 mt-6">
        <button onClick={() => setActiveTab('wallet')} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'wallet' ? 'bg-slate-900 text-white shadow-xl translate-y-[-2px]' : 'bg-white text-slate-400 border border-slate-200'}`}>
          <Wallet size={16} /> PHÊ DUYỆT VÍ ({pendingTxs.length})
        </button>
        <button onClick={() => setActiveTab('posts')} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'posts' ? 'bg-slate-900 text-white shadow-xl translate-y-[-2px]' : 'bg-white text-slate-400 border border-slate-200'}`}>
          <MessageSquare size={16} /> BÀI VIẾT ({posts.length})
        </button>
        <button onClick={() => setActiveTab('users')} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'users' ? 'bg-slate-900 text-white shadow-xl translate-y-[-2px]' : 'bg-white text-slate-400 border border-slate-200'}`}>
          <Users size={16} /> NGƯỜI DÙNG
        </button>
      </div>

      {/* NỘI DUNG CHÍNH */}
      <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar pb-32">
        
        {/* TAB PHÊ DUYỆT VÍ */}
        {activeTab === 'wallet' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Danh sách chờ duyệt</h3>
              {pendingTxs.length > 0 && (
                <div className="flex items-center gap-1 text-[10px] font-black text-orange-500 animate-pulse">
                  <AlertCircle size={12} /> CÓ {pendingTxs.length} YÊU CẦU MỚI
                </div>
              )}
            </div>
            
            {pendingTxs.length === 0 ? (
              <div className="bg-white rounded-[40px] p-12 text-center border-2 border-dashed border-slate-200 flex flex-col items-center">
                <CheckCircle2 size={48} className="text-slate-200 mb-4" />
                <p className="text-sm font-bold text-slate-400">Tất cả yêu cầu đã được xử lý!</p>
                <button onClick={createSampleRequest} className="mt-4 text-[10px] font-black text-pink-500 underline uppercase tracking-widest">Bấm vào đây để tạo yêu cầu mẫu để test</button>
              </div>
            ) : (
              pendingTxs.map(tx => (
                <div key={tx.id} className="bg-white rounded-[35px] p-6 shadow-xl shadow-slate-200/50 border border-white animate-slide-up relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="font-black text-slate-800 text-lg leading-tight">{tx.desc}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 flex items-center gap-1">
                        <Database size={10} /> ID: {tx.id} • {tx.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-orange-600">-{tx.amount.toLocaleString()} đ</span>
                    </div>
                  </div>
                  
                  {/* CÁC NÚT PHÊ DUYỆT CỰC KỲ RÕ RÀNG */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleApprove(tx.id)} 
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-5 rounded-[22px] font-black text-xs shadow-lg shadow-green-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={18} /> DUYỆT NGAY
                    </button>
                    <button 
                      onClick={() => handleReject(tx.id)} 
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 py-5 rounded-[22px] font-black text-xs active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle size={18} /> TỪ CHỐI
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* CÁC TAB KHÁC (GIỮ NGUYÊN HOẶC TINH CHỈNH NHẸ) */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Quản lý nội dung</h3>
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-3xl p-5 border border-slate-100 flex items-start justify-between shadow-sm">
                <div className="flex-1 pr-4">
                  <p className="font-black text-slate-800 text-sm">{post.user}</p>
                  <p className="text-xs text-slate-500 mt-1">{post.content}</p>
                </div>
                <button onClick={() => {
                  if(window.confirm("Xóa bài này?")) {
                    const newPosts = posts.filter(p => p.id !== post.id);
                    setPosts(newPosts);
                    localStorage.setItem('concung_posts', JSON.stringify(newPosts));
                  }
                }} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-[40px] p-12 text-center border-2 border-slate-100">
            <Users size={48} className="text-slate-200 mx-auto mb-4" />
            <h3 className="font-black text-slate-800 text-sm mb-2">Hội Viên ConCung</h3>
            <p className="text-xs text-slate-400">Danh sách người dùng đang được tải...</p>
          </div>
        )}
      </div>

      {/* MODAL THAY ĐỔI SỐ DƯ (GHI ĐÈ HỆ THỐNG) */}
      {showAdjModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl" onClick={() => setShowAdjModal(false)}></div>
          <div className="bg-white w-full max-w-sm rounded-[50px] p-10 relative z-10 shadow-2xl scale-in border-4 border-slate-900">
            <div className="w-20 h-20 bg-slate-900 text-pink-500 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Database size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2 text-center tracking-tighter uppercase">Can thiệp Database</h2>
            <p className="text-[10px] text-slate-400 text-center mb-8 font-black uppercase tracking-widest">Bơm hoặc thu hồi tiền từ quỹ tổng</p>
            
            <div className="flex gap-2 mb-8">
              <button onClick={() => setAdjType('add')} className={`flex-1 py-5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all ${adjType === 'add' ? 'bg-green-500 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                <ArrowUpCircle size={20}/> CỘNG TIỀN
              </button>
              <button onClick={() => setAdjType('sub')} className={`flex-1 py-5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all ${adjType === 'sub' ? 'bg-rose-500 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                <ArrowDownCircle size={20}/> TRỪ TIỀN
              </button>
            </div>

            <div className="relative mb-8">
              <input 
                type="number" 
                placeholder="NHẬP SỐ TIỀN..." 
                className="w-full bg-slate-50 border-4 border-slate-100 py-6 px-6 rounded-3xl font-black text-3xl text-center outline-none focus:border-slate-900 transition-all text-slate-900" 
                value={adjAmount} 
                onChange={e => setAdjAmount(e.target.value)} 
                autoFocus
              />
            </div>
            
            <button onClick={handleManualAdjust} className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 text-sm">
              LƯU THAY ĐỔI HỆ THỐNG <ShieldCheck size={20} />
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-up { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes scale-in { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .scale-in { animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
      `}} />
    </div>
  );
};

export default AdminDashboardPage;
