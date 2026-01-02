
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  X,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Trash2,
  Users
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

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  
  // God Mode States
  const [showAdjModal, setShowAdjModal] = useState(false);
  const [adjAmount, setAdjAmount] = useState('');
  const [adjType, setAdjType] = useState<'add' | 'sub'>('add');

  useEffect(() => {
    // Luôn load dữ liệu mới nhất từ localStorage
    const savedTxs = localStorage.getItem('concung_transactions');
    const savedBalance = localStorage.getItem('concung_balance');
    if (savedTxs) setTransactions(JSON.parse(savedTxs));
    if (savedBalance) setBalance(parseInt(savedBalance));
  }, []);

  const syncData = (newTxs: Transaction[], newBalance: number) => {
    setTransactions(newTxs);
    setBalance(newBalance);
    localStorage.setItem('concung_transactions', JSON.stringify(newTxs));
    localStorage.setItem('concung_balance', newBalance.toString());
  };

  const handleApprove = (id: string) => {
    const newTxs = transactions.map(tx => 
      tx.id === id ? { ...tx, status: 'success' as const } : tx
    );
    // Khi duyệt rút tiền, tiền đã bị trừ từ trước nên balance không đổi
    syncData(newTxs, balance);
    alert("Đã duyệt yêu cầu rút tiền thành công!");
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRejectModal || !rejectReason.trim()) return;
    const tx = transactions.find(t => t.id === showRejectModal);
    if (!tx) return;

    const newTxs = transactions.map(t => 
      t.id === showRejectModal ? { ...t, status: 'rejected' as const, rejectReason } : t
    );
    // Hoàn tiền lại cho người dùng khi bị từ chối
    syncData(newTxs, balance + tx.amount);
    setShowRejectModal(null);
    setRejectReason('');
    alert("Đã từ chối yêu cầu và hoàn tiền vào ví người dùng.");
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
      desc: `Admin ${adjType === 'add' ? 'cộng' : 'trừ'} tiền hệ thống`,
      time: new Date().toLocaleString(),
      status: 'success'
    };

    syncData([newTx, ...transactions], newBalance);
    setShowAdjModal(false);
    setAdjAmount('');
  };

  const clearHistory = () => {
    if (window.confirm("Admin muốn xóa toàn bộ lịch sử giao dịch? (Không ảnh hưởng số dư thực)")) {
      syncData([], balance);
    }
  };

  const pendingTxs = transactions.filter(t => t.status === 'pending');
  const otherTxs = transactions.filter(t => t.status !== 'pending');

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-gray-900 pt-16 pb-8 px-6 text-white rounded-b-[40px] shadow-xl relative">
        <button onClick={() => navigate('/profile')} className="absolute top-14 right-6 text-gray-400 hover:text-white"><X size={24} /></button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20"><ShieldCheck size={28} /></div>
          <div>
            <h1 className="text-xl font-bold">Quản trị Hệ thống</h1>
            <p className="text-[10px] text-pink-400 uppercase tracking-widest font-black">Full Access - God Mode</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Quỹ ví người dùng</p>
            <p className="text-xl font-black text-pink-400">{balance.toLocaleString()} đ</p>
          </div>
          <button onClick={() => setShowAdjModal(true)} className="bg-pink-500 p-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs shadow-lg active:scale-95 transition-all">
            <Wallet size={16} /> Chỉnh số dư
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-24 custom-scrollbar">
        {/* PENDING TRANSACTIONS SECTION */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Yêu cầu rút tiền ({pendingTxs.length})</h2>
            <div className="h-px bg-gray-200 flex-1 ml-4"></div>
          </div>
          
          {pendingTxs.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border-2 border-dashed border-gray-200">
              <Clock size={32} className="text-gray-200 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-300">Không có yêu cầu chờ duyệt</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingTxs.map(tx => (
                <div key={tx.id} className="bg-white rounded-[32px] p-6 shadow-sm border border-orange-100 animate-slide-up">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm mb-1">{tx.desc}</h4>
                      <p className="text-[10px] text-gray-400">{tx.time}</p>
                    </div>
                    <p className="text-lg font-black text-orange-500">-{tx.amount.toLocaleString()} đ</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleApprove(tx.id)} className="flex-1 bg-green-500 text-white py-3 rounded-2xl font-bold text-xs shadow-md shadow-green-100">Duyệt</button>
                    <button onClick={() => setShowRejectModal(tx.id)} className="flex-1 bg-red-50 text-red-500 py-3 rounded-2xl font-bold text-xs">Từ chối</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SYSTEM HISTORY SECTION */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Lịch sử hệ thống</h2>
            <button onClick={clearHistory} className="text-[10px] text-red-400 font-bold flex items-center gap-1 hover:underline transition-all"><Trash2 size={12} /> Dọn dẹp</button>
          </div>
          <div className="space-y-3">
            {otherTxs.map(tx => (
              <div key={tx.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-gray-100">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  tx.status === 'success' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'
                }`}>
                  {tx.type === 'admin_adj' ? <ShieldCheck size={20}/> : (tx.status === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />)}
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-gray-700">{tx.desc}</h4>
                  <p className="text-[9px] text-gray-400">{tx.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black">{tx.amount.toLocaleString()} đ</p>
                  <p className={`text-[8px] font-bold ${tx.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                    {tx.status.toUpperCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GOD MODE ADJUST MODAL */}
      {showAdjModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowAdjModal(false)}></div>
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 relative z-10 shadow-2xl scale-in">
            <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">Can thiệp số dư</h2>
            <p className="text-xs text-gray-400 text-center mb-6">Admin có quyền thay đổi ví bất kỳ ai</p>
            
            <div className="flex gap-2 mb-6">
              <button onClick={() => setAdjType('add')} className={`flex-1 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${adjType === 'add' ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}><ArrowUpCircle size={16}/> Cộng tiền</button>
              <button onClick={() => setAdjType('sub')} className={`flex-1 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${adjType === 'sub' ? 'bg-red-500 text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}><ArrowDownCircle size={16}/> Trừ tiền</button>
            </div>

            <input type="number" placeholder="Số tiền..." className="w-full bg-gray-50 border-none py-4 px-6 rounded-2xl mb-6 font-black text-2xl text-center outline-none" value={adjAmount} onChange={e => setAdjAmount(e.target.value)} />
            
            <button onClick={handleManualAdjust} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold shadow-xl active:scale-95 transition-all">Lưu thay đổi hệ thống</button>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowRejectModal(null)}></div>
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 relative z-10 shadow-2xl scale-in">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Lý do từ chối</h2>
            <textarea placeholder="Ví dụ: Sai số tài khoản, thông tin ngân hàng không khớp..." className="w-full bg-red-50 border border-red-100 rounded-2xl p-4 text-sm min-h-[120px] mb-6 outline-none focus:ring-2 focus:ring-red-200" value={rejectReason} onChange={e => setRejectReason(e.target.value)} required />
            <button onClick={handleReject} className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-100 active:scale-95 transition-all">Xác nhận từ chối & Hoàn tiền</button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes scale-in { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.4s ease-out; }
        .scale-in { animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}} />
    </div>
  );
};

export default AdminDashboardPage;
