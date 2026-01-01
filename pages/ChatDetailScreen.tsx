
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Chat, Message } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { dbService } from '../services/dbService';

interface Props {
  user: User;
}

const ChatDetailScreen: React.FC<Props> = ({ user }) => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const [chat, setChat] = useState<Chat | null>(null);
  const [inputText, setInputText] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchChat = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*, messages(*)')
        .eq('id', chatId)
        .single();
      
      if (error) {
        console.error("Chat fetch error:", error);
        setError("Cuộc trò chuyện này chưa có hoặc đã bị xóa.");
        return;
      }
      
      if (data) {
        const mappedChat = {
          ...data,
          lastTimestamp: data.lasttimestamp,
          messages: (data.messages || []).map((m: any) => ({
            ...m,
            senderId: m.senderid,
            senderName: m.sendername,
            chatId: m.chatid,
            imageUrl: m.imageurl,
            stickerUrl: m.stickerurl,
            audioUrl: m.audiourl,
            fileUrl: m.fileurl,
            fileName: m.filename
          })).sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        };
        setChat(mappedChat);
        setError(null);
      }
    } catch (err: any) {
      setError("Lỗi kết nối máy chủ Cloud.");
    }
  }, [chatId]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setError("Dữ liệu trực tuyến chưa được cấu hình.");
      return;
    }
    fetchChat();

    // Lắng nghe tin nhắn mới Realtime
    const channel = supabase
      .channel(`chat-realtime-${chatId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages', 
        filter: `chatid=eq.${chatId}`
      }, (payload) => {
        const m = payload.new as any;
        const mappedMsg: Message = {
          ...m,
          senderId: m.senderid,
          senderName: m.sendername,
          chatId: m.chatid,
          imageUrl: m.imageurl,
          stickerUrl: m.stickerurl,
          audioUrl: m.audiourl,
          fileUrl: m.fileurl,
          fileName: m.filename
        };
        setChat(prev => {
          if (!prev) return prev;
          if (prev.messages.some(ex => ex.id === mappedMsg.id)) return prev;
          return { ...prev, messages: [...prev.messages, mappedMsg] };
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [chatId, fetchChat]);

  // Cuộn xuống cuối cùng khi có tin nhắn mới
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chat?.messages]);

  const handleSend = async (options: any = {}) => {
    const text = options.text || inputText;
    if (!text.trim() && !options.image && !options.sticker) return;
    
    if (!chat) return;

    setIsSyncing(true);
    const msgId = `m-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Khớp tuyệt đối với các cột trong SQL
    const dbMessage = {
      id: msgId,
      chatid: chatId,
      senderid: user.id,
      sendername: user.name,
      text: text,
      timestamp: new Date().toISOString(),
      status: 'sent',
      imageurl: options.image || null,
      stickerurl: options.sticker || null,
      audiourl: null,
      fileurl: null,
      filename: null
    };

    try {
      const { error: sendError } = await dbService.sendMessage(dbMessage);
      if (sendError) {
        console.error("Gửi tin nhắn thất bại:", sendError);
        alert(`Lỗi Cloud: ${sendError.message}`);
      } else {
        setInputText('');
      }
    } catch (err) {
      console.error("Lỗi hệ thống khi gửi:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zalo-bg dark:bg-slate-950 w-full max-w-[500px] mx-auto relative overflow-hidden font-body shadow-2xl">
      <header className="z-40 bg-white dark:bg-slate-900 border-b p-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <div className="flex items-center gap-3">
             <img src={chat?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${chat?.name}`} className="size-9 rounded-full border dark:border-slate-700" alt="Avt" />
             <div>
               <h2 className="text-sm font-bold dark:text-white flex items-center gap-2 leading-none">
                  {chat?.name || '...'}
                  {isSyncing && <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>}
               </h2>
               <p className="text-[10px] text-green-500 font-medium">Trực tuyến</p>
             </div>
          </div>
        </div>
        <button className="p-2 text-slate-400"><span className="material-symbols-outlined">more_horiz</span></button>
      </header>

      {error && (
        <div className="m-4 p-3 bg-red-50 text-red-600 text-xs text-center font-bold rounded-lg border border-red-100">
          {error}
          <button onClick={fetchChat} className="block mx-auto mt-2 underline text-[10px] uppercase">Thử tải lại</button>
        </div>
      )}

      <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-slate-50 dark:bg-slate-900/50">
        {chat?.messages.map((msg) => {
          const isMe = msg.senderId === user.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl shadow-sm ${isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 dark:text-white rounded-tl-none'}`}>
                 {!isMe && <p className="text-[10px] font-black text-primary mb-1">{msg.senderName}</p>}
                 <p className="text-[14px] whitespace-pre-wrap break-words leading-relaxed">{msg.text}</p>
                 <span className={`text-[9px] block mt-1 text-right ${isMe ? 'text-white/60' : 'text-slate-400'}`}>
                   {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                 </span>
              </div>
            </div>
          );
        })}
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t p-3 flex items-center gap-2 pb-10">
        <button className="text-slate-400 p-1"><span className="material-symbols-outlined">add_circle</span></button>
        <input 
          className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary dark:text-white transition-all shadow-inner"
          placeholder="Tin nhắn"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !isSyncing && handleSend()}
          disabled={isSyncing}
        />
        <button 
          onClick={() => handleSend()} 
          disabled={isSyncing || !inputText.trim()}
          className={`size-10 bg-primary text-white rounded-full flex items-center justify-center active:scale-95 transition-all shadow-lg shadow-primary/20 ${isSyncing || !inputText.trim() ? 'opacity-30 grayscale' : ''}`}
        >
           {isSyncing ? <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <span className="material-symbols-outlined filled text-[20px]">send</span>}
        </button>
      </footer>
    </div>
  );
};

export default ChatDetailScreen;
