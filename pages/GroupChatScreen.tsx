
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DUMMY_CHATS } from '../constants';

const GroupChatScreen: React.FC = () => {
  const navigate = useNavigate();
  const group = DUMMY_CHATS.find(c => c.type === 'group') || DUMMY_CHATS[0];

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col max-w-2xl mx-auto shadow-2xl">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-slate-800 dark:text-white">arrow_back_ios_new</span>
          </button>
          <div className="relative cursor-pointer">
            <div className="size-11 rounded-[14px] overflow-hidden border border-slate-200 dark:border-slate-700">
              <img src={group.avatar || 'https://picsum.photos/id/20/200/200'} alt="Group" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-[-2px] right-[-2px] size-3.5 bg-green-500 border-[3px] border-white dark:border-background-dark rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-[17px] font-black leading-tight text-slate-900 dark:text-white">{group.name}</h2>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">12 thành viên • 5 online</p>
          </div>
        </div>
        <button className="size-10 flex items-center justify-center rounded-full text-primary hover:bg-primary/10 transition-colors">
          <span className="material-symbols-outlined filled">info</span>
        </button>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-5 py-8 space-y-8 no-scrollbar">
        <div className="flex justify-center">
            <span className="px-4 py-1.5 text-[10px] font-black text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 rounded-full uppercase tracking-widest border border-slate-200 dark:border-slate-800">
                Hôm nay 10:30
            </span>
        </div>

        <div className="flex justify-center">
            <div className="bg-slate-50 dark:bg-surface-dark/40 px-5 py-2 rounded-full border border-slate-100 dark:border-slate-800/50">
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">person_add</span>
                    <span><strong>Hoàng</strong> đã thêm <strong>Lan</strong> vào nhóm</span>
                </p>
            </div>
        </div>

        {/* Incoming Group Message */}
        <div className="flex items-end gap-3 max-w-[85%]">
          <div className="size-9 rounded-[12px] overflow-hidden shrink-0 shadow-md border-2 border-white dark:border-slate-900">
            <img src="https://picsum.photos/id/101/200/200" alt="Sender" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-1.5 items-start">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Tuấn</span>
            <div className="p-4 rounded-[22px] rounded-bl-none bg-white dark:bg-bubble-incoming shadow-sm border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-[15px] font-medium leading-relaxed">
              <p>Mọi người đã xem file thiết kế mới chưa? <span className="text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded-lg cursor-pointer hover:underline">@Hương</span> kiểm tra giúp mình nhé.</p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 ml-1">10:45</span>
          </div>
        </div>

        {/* Outgoing Group Message */}
        <div className="flex items-end gap-3 max-w-[85%] self-end justify-end">
          <div className="flex flex-col gap-1.5 items-end">
            <div className="p-4 rounded-[22px] rounded-br-none bg-gradient-primary shadow-lg shadow-primary/20 text-white text-[15px] font-medium leading-relaxed">
              <p>Mình đã xem qua rồi, trông rất ổn. Chiều nay họp chốt nhé!</p>
            </div>
            <div className="flex items-center gap-1.5 px-1">
               <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600">10:48</span>
               <span className="material-symbols-outlined text-[16px] text-primary">done_all</span>
            </div>
          </div>
          <div className="size-9 rounded-[12px] overflow-hidden shrink-0 shadow-md border-2 border-white dark:border-slate-900">
            <img src="https://picsum.photos/id/102/200/200" alt="Me" className="w-full h-full object-cover" />
          </div>
        </div>
      </main>

      {/* Input Area */}
      <footer className="px-4 pt-3 pb-10 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-end gap-3">
          <button className="size-11 flex items-center justify-center rounded-full text-slate-400 hover:text-primary transition-all">
            <span className="material-symbols-outlined text-[28px]">add_circle</span>
          </button>
          <div className="flex-1 bg-slate-50 dark:bg-surface-dark rounded-[24px] border border-slate-100 dark:border-slate-700 flex items-center px-1 py-1 focus-within:ring-2 focus-within:ring-primary/50 transition-all shadow-inner">
             <input className="flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 text-[15px] font-medium py-3 px-4 focus:ring-0" placeholder="Nhập tin nhắn..." type="text"/>
             <button className="size-9 flex items-center justify-center rounded-full text-slate-400 mr-1">
                <span className="material-symbols-outlined">sentiment_satisfied</span>
             </button>
          </div>
          <button className="size-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 transition-all shadow-lg hover:bg-gradient-primary hover:text-white active:scale-95 group">
            <span className="material-symbols-outlined text-[24px] ml-1 group-hover:animate-pulse">send</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default GroupChatScreen;
