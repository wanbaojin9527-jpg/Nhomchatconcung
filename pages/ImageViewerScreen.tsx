
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ImageViewerScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black h-screen w-full flex flex-col font-display overflow-hidden select-none animate-in fade-in duration-300">
      {/* Dynamic Overlay Header */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/90 via-black/40 to-transparent pt-12 pb-16 px-6">
        <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto">
          <button onClick={() => navigate(-1)} className="size-11 flex items-center justify-center rounded-full text-white bg-white/10 hover:bg-white/20 active:scale-95 transition-all">
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>arrow_back</span>
          </button>
          <div className="flex flex-col items-center flex-1 mx-4 text-center">
            <h2 className="text-white text-lg font-black tracking-tight drop-shadow-lg">Nguyễn Văn A</h2>
            <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mt-0.5">10:30 AM • Hôm nay</span>
          </div>
          <button className="size-11 flex items-center justify-center rounded-full text-white bg-white/10 hover:bg-white/20 active:scale-95 transition-all">
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>more_vert</span>
          </button>
        </div>
      </div>

      {/* Main Image Container */}
      <div className="relative flex-1 flex items-center justify-center w-full h-full bg-black/40 backdrop-blur-3xl overflow-hidden">
        <div className="hidden md:flex absolute left-8 z-20 size-14 items-center justify-center rounded-full bg-white/10 text-white/50 backdrop-blur-xl hover:bg-white/20 hover:text-white transition-all cursor-pointer shadow-2xl">
          <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>chevron_left</span>
        </div>
        
        <div className="w-full h-full flex items-center justify-center animate-in zoom-in duration-500 delay-100">
           <img 
              alt="Shared content" 
              className="max-h-[85vh] max-w-full object-contain shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5" 
              src="https://picsum.photos/id/237/1000/1500" 
           />
        </div>

        <div className="hidden md:flex absolute right-8 z-20 size-14 items-center justify-center rounded-full bg-white/10 text-white/50 backdrop-blur-xl hover:bg-white/20 hover:text-white transition-all cursor-pointer shadow-2xl">
          <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>chevron_right</span>
        </div>
      </div>

      {/* Control Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/95 via-black/50 to-transparent pb-12 pt-24 px-8">
        <div className="w-full max-w-screen-xl mx-auto flex flex-col gap-10">
          <div className="flex w-full flex-row items-center justify-center gap-3">
            <div className="size-2 rounded-full bg-white/20 transition-all"></div>
            <div className="size-2 rounded-full bg-white/20 transition-all"></div>
            <div className="h-2.5 w-6 rounded-full bg-primary ring-4 ring-primary/20 transition-all"></div>
            <div className="size-2 rounded-full bg-white/20 transition-all"></div>
            <div className="size-2 rounded-full bg-white/20 transition-all"></div>
          </div>
          <div className="flex justify-center items-center gap-10 sm:gap-20">
            {[
                { icon: 'download', label: 'Lưu', active: false },
                { icon: 'share', label: 'Chia sẻ', active: true },
                { icon: 'forward', label: 'Gửi', active: false }
            ].map((btn, i) => (
                <button key={i} className="group flex flex-col items-center gap-3 min-w-[80px]">
                    <div className={`flex items-center justify-center rounded-[26px] shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-active:scale-95 ${
                        btn.active 
                            ? 'size-16 bg-gradient-to-br from-[#0a6cff] to-[#3BA4FF] text-white shadow-primary/40 ring-4 ring-primary/10' 
                            : 'size-14 bg-white/10 text-white backdrop-blur-xl border border-white/10 group-hover:bg-white/20'
                    }`}>
                        <span className="material-symbols-outlined" style={{ fontSize: btn.active ? '32px' : '26px' }}>{btn.icon}</span>
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all ${btn.active ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>{btn.label}</span>
                </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewerScreen;
