
import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  History, 
  CreditCard, 
  ShieldCheck, 
  X, 
  ChevronRight, 
  CheckCircle2, 
  Building2,
  Clock,
  Wallet as WalletIcon,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';

interface BankInfo {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

interface Transaction {
  id: string;
  type: 'withdraw' | 'transfer';
  amount: number;
  desc: string;
  time: string;
  status: 'pending' | 'success' | 'rejected';
  rejectReason?: string;
}

const WalletPage: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [modalType, setModalType] = useState<'withdraw' | 'transfer' | 'linkBank' | 'status' | null>(null);
  const [bankInfo, setBankInfo] = useState<BankInfo | null>(null);
  
  const [inputAmount, setInputAmount] = useState('');
  const [targetUser, setTargetUser] = useState('');
  const [tempBank, setTempBank] = useState<BankInfo>({ bankName: '', accountNumber: '', accountName: '' });
  const [lastAction, setLastAction] = useState({ type: '', amount: 0, status: '' });

  // Load from localStorage to sync with Admin
  useEffect(() => {
    const savedTxs = localStorage.getItem('concung_transactions');
    const savedBalance = localStorage.getItem('concung_balance');
    const savedBank = localStorage.getItem('concung_bank');
    
    if (savedTxs) setTransactions(JSON.parse(savedTxs));
    if (savedBalance) setBalance(parseInt(savedBalance));
    if (savedBank) setBankInfo(JSON.parse(savedBank));
  }, []);

  // Save to localStorage whenever state changes
  const updatePersistence = (newTxs: Transaction[], newBalance: number) => {
    setTransactions(newTxs);
    setBalance(newBalance);
    localStorage.setItem('concung_transactions', JSON.stringify(newTxs));
    localStorage.setItem('concung_balance', newBalance.toString());
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString('vi-VN') + ' đ';
  };

  const addTransaction = (type: Transaction['type'], amount: number, desc: string, status: Transaction['status'] = 'success') => {
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      amount,
      desc,
      time: new Date().toLocaleString('vi-VN', { 
        day: '2-digit', month: '2-digit', year: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
      }),
      status
    };
    const newTxs = [newTx, ...transactions];
    const newBalance = balance - amount;
    updatePersistence(newTxs, newBalance);
    setLastAction({ type, amount, status });
    setModalType('status');
  };

  const handleWithdrawRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(inputAmount);
    
    if (!bankInfo) {
      setModalType('linkBank');
      return;
    }
    if (isNaN(amount) || amount < 50000) {
      alert("Số tiền rút tối thiểu là 50.000 đ");
      return;
    }
    if (amount > balance) {
      alert("Số dư trong ví không đủ!");
      return;
    }

    addTransaction('withdraw', amount, `Rút về ${bankInfo.bankName}`, 'pending');
    setInputAmount('');
  };

  const handleLinkBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempBank.bankName && tempBank.accountNumber && tempBank.accountName) {
      setBankInfo(tempBank);
      localStorage.setItem('concung_bank', JSON.stringify(tempBank));
      setModalType('withdraw');
    }
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(inputAmount);
    if (isNaN(amount) || amount <= 0 || amount > balance) return;

    addTransaction('transfer', amount, `Chuyển cho mẹ ${targetUser || 'ẩn danh'}`, 'success');
    setInputAmount('');
    setTargetUser('');
  };

  return (
    <div className="flex flex-col h-full bg-[#FFF9FA]">
      <div className="bg-gradient-to-br from-pink-500 to-rose-400 pt-16 pb-12 px-8 rounded-b-[60px] text-white shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
            <ShieldCheck size={14} className="text-pink-100" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Ví an toàn cho mẹ</span>
          </div>
          <WalletIcon size={24} className="opacity-40" />
        </div>
        <div className="mb-10 text-center sm:text-left">
          <p className="text-pink-100 text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">Số dư khả dụng</p>
          <h1 className="text-4xl font-black tracking-tight mb-2">{formatCurrency(balance)}</h1>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setModalType('withdraw')} className="bg-white text-pink-500 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg font-bold">
            <CreditCard size={20} /> <span className="text-xs uppercase">Rút tiền</span>
          </button>
          <button onClick={() => setModalType('transfer')} className="bg-pink-400/30 backdrop-blur-md border border-white/20 text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold">
            <ArrowUpRight size={20} /> <span className="text-xs uppercase">Chuyển tiền</span>
          </button>
        </div>
      </div>

      <div className="flex-1 px-6 mt-8 flex flex-col overflow-hidden">
        {!bankInfo ? (
          <button onClick={() => setModalType('linkBank')} className="w-full bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center gap-3 text-orange-600 mb-6">
            <AlertCircle size={20} />
            <div className="text-left">
              <p className="text-xs font-bold">Chưa liên kết ngân hàng</p>
              <p className="text-[10px] opacity-80">Liên kết để có thể rút tiền mẹ nhé</p>
            </div>
            <ChevronRight size={16} className="ml-auto" />
          </button>
        ) : (
          <div className="w-full bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center gap-3 text-blue-600 mb-6">
            <Building2 size={20} />
            <div className="text-left">
              <p className="text-xs font-bold">{bankInfo.bankName}</p>
              <p className="text-[10px] opacity-80">STK: ****{bankInfo.accountNumber.slice(-4)}</p>
            </div>
            <button onClick={() => setModalType('linkBank')} className="ml-auto text-[10px] font-bold underline">Thay đổi</button>
          </div>
        )}

        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-6">
          <History size={18} className="text-pink-400" /> Hoạt động ví
        </h3>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-24">
          {transactions.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-10 opacity-40">
              <History size={40} className="text-pink-200 mb-4" />
              <p className="text-xs font-bold text-gray-300">Chưa có giao dịch</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex flex-col gap-2">
                  <div className={`bg-white p-4 rounded-[24px] flex items-center gap-4 border border-pink-50 shadow-sm relative overflow-hidden`}>
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                      tx.status === 'pending' ? 'bg-orange-50 text-orange-500' : 
                      tx.status === 'rejected' ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400'
                    }`}>
                      {tx.type === 'withdraw' ? <CreditCard size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-gray-800 truncate">{tx.desc}</h4>
                      </div>
                      <p className="text-[10px] text-gray-400">{tx.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-gray-800">-{formatCurrency(tx.amount)}</p>
                      <p className={`text-[9px] font-bold ${
                        tx.status === 'pending' ? 'text-orange-400' : 
                        tx.status === 'rejected' ? 'text-red-500' : 'text-green-500'
                      }`}>
                        {tx.status === 'pending' ? 'CHỜ DUYỆT' : tx.status === 'rejected' ? 'BỊ TỪ CHỐI' : 'THÀNH CÔNG'}
                      </p>
                    </div>
                  </div>
                  
                  {/* REJECTION REASON DISPLAY */}
                  {tx.status === 'rejected' && tx.rejectReason && (
                    <div className="mx-2 bg-red-50 border border-red-100 rounded-2xl p-3 flex gap-2 animate-slide-up">
                      <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black text-red-600 uppercase tracking-wider mb-0.5">Lý do từ chối:</p>
                        <p className="text-xs text-red-700 font-medium leading-relaxed">{tx.rejectReason}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODALS (Reuse same logic as previous version but add persistence) */}
      {modalType === 'linkBank' && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalType(null)}></div>
          <div className="bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[40px] p-8 relative z-10 shadow-2xl animate-slide-up">
            <button onClick={() => setModalType(null)} className="absolute top-6 right-6 text-gray-300"><X size={24} /></button>
            <form onSubmit={handleLinkBank} className="space-y-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-4"><Building2 size={32} /></div>
                <h2 className="text-xl font-bold text-gray-800">Liên kết ngân hàng</h2>
              </div>
              <div className="space-y-4">
                <input type="text" placeholder="Tên ngân hàng" className="w-full bg-gray-50 border-none py-4 px-6 rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none font-bold" value={tempBank.bankName} onChange={e => setTempBank({...tempBank, bankName: e.target.value})} required />
                <input type="text" placeholder="Số tài khoản" className="w-full bg-gray-50 border-none py-4 px-6 rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none font-bold" value={tempBank.accountNumber} onChange={e => setTempBank({...tempBank, accountNumber: e.target.value})} required />
                <input type="text" placeholder="Tên chủ tài khoản (KHÔNG DẤU)" className="w-full bg-gray-50 border-none py-4 px-6 rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none font-bold uppercase" value={tempBank.accountName} onChange={e => setTempBank({...tempBank, accountName: e.target.value})} required />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white py-4 rounded-2xl font-bold">Xác nhận liên kết</button>
            </form>
          </div>
        </div>
      )}

      {modalType === 'withdraw' && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalType(null)}></div>
          <div className="bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[40px] p-8 relative z-10 shadow-2xl animate-slide-up">
            <button onClick={() => setModalType(null)} className="absolute top-6 right-6 text-gray-300"><X size={24} /></button>
            <form onSubmit={handleWithdrawRequest} className="space-y-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-4"><CreditCard size={32} /></div>
                <h2 className="text-xl font-bold text-gray-800">Yêu cầu rút tiền</h2>
              </div>
              <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                <p className="text-[10px] font-bold text-orange-600 mb-1 uppercase">Rút về</p>
                <p className="text-sm font-bold text-gray-700">{bankInfo?.bankName} - {bankInfo?.accountNumber}</p>
              </div>
              <input type="number" placeholder="Số tiền (Tối thiểu 50k)" className="w-full bg-gray-50 border-none py-6 px-6 rounded-3xl focus:ring-2 focus:ring-orange-200 outline-none text-3xl font-black text-orange-500" value={inputAmount} onChange={(e) => setInputAmount(e.target.value)} required />
              <button type="submit" className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white py-4 rounded-2xl font-bold">Gửi yêu cầu duyệt</button>
            </form>
          </div>
        </div>
      )}

      {modalType === 'status' && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalType(null)}></div>
          <div className="bg-white w-full max-w-sm rounded-[40px] p-10 relative z-10 shadow-2xl text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${lastAction.status === 'pending' ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'}`}>
              {lastAction.status === 'pending' ? <Clock size={40} /> : <CheckCircle2 size={40} />}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{lastAction.status === 'pending' ? 'Đã gửi yêu cầu' : 'Thành công!'}</h2>
            <p className="text-sm text-gray-400 mb-8 leading-relaxed">
              {lastAction.status === 'pending' ? 'Yêu cầu của mẹ đang chờ Admin phê duyệt.' : 'Giao dịch đã hoàn thành.'}
            </p>
            <button onClick={() => setModalType(null)} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold">Đóng</button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
      `}} />
    </div>
  );
};

export default WalletPage;
