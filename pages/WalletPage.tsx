
import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, History, Plus, CreditCard, ShieldCheck } from 'lucide-react';

const WalletPage: React.FC = () => {
  const [balance, setBalance] = useState(2450000);
  const [transactions] = useState([
    { id: 1, type: 'topup', amount: 500000, desc: 'Nạp tiền từ ngân hàng', time: '12/10/2023 10:30', status: 'success' },
    { id: 2, type: 'withdraw', amount: 200000, desc: 'Mua tã bỉm ConCung', time: '11/10/2023 15:45', status: 'success' },
    { id: 3, type: 'transfer', amount: 150000, desc: 'Gửi cho Mẹ Gấu', time: '10/10/2023 09:12', status: 'success' },
  ]);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div className="flex flex-col h-full bg-[#FDF2F5]">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-pink-500 to-orange-400 pt-16 pb-12 px-8 rounded-b-[50px] text-white shadow-lg">
        <div className="flex items-center gap-2 mb-2 opacity-80">
          <ShieldCheck size={16} />
          <span className="text-xs font-medium">Số dư an toàn</span>
        </div>
        <h1 className="text-4xl font-bold mb-8">{formatCurrency(balance)}</h1>
        
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white/20 backdrop-blur-md py-4 rounded-3xl flex flex-col items-center gap-2 hover:bg-white/30 transition-all border border-white/10">
            <Plus size={24} />
            <span className="text-xs font-bold uppercase tracking-wider">Nạp tiền</span>
          </button>
          <button className="bg-white/20 backdrop-blur-md py-4 rounded-3xl flex flex-col items-center gap-2 hover:bg-white/30 transition-all border border-white/10">
            <CreditCard size={24} />
            <span className="text-xs font-bold uppercase tracking-wider">Rút tiền</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 -mt-6">
        <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-pink-100 flex justify-around">
          <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowDownLeft size={24} />
            </div>
            <span className="text-[10px] font-bold text-gray-500">Nhận</span>
          </div>
          <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowUpRight size={24} />
            </div>
            <span className="text-[10px] font-bold text-gray-500">Chuyển</span>
          </div>
          <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard size={24} />
            </div>
            <span className="text-[10px] font-bold text-gray-500">Thẻ</span>
          </div>
          <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <History size={24} />
            </div>
            <span className="text-[10px] font-bold text-gray-500">Hóa đơn</span>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="flex-1 px-6 mt-8 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-700">Lịch sử giao dịch</h3>
          <button className="text-pink-500 text-xs font-bold">Xem tất cả</button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-4 pb-10">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-white p-4 rounded-2xl flex items-center gap-4 border border-pink-50 shadow-sm">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                tx.type === 'topup' ? 'bg-green-50 text-green-500' : 'bg-orange-50 text-orange-500'
              }`}>
                {tx.type === 'topup' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-800 truncate">{tx.desc}</h4>
                <p className="text-[10px] text-gray-400">{tx.time}</p>
              </div>
              <div className={`font-bold ${tx.type === 'topup' ? 'text-green-500' : 'text-orange-500'}`}>
                {tx.type === 'topup' ? '+' : '-'}{formatCurrency(tx.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
