
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
        setError("Cuộc trò chuyện này chưa tồn tại trong cơ sở dữ liệu.");
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
      }
    } catch (err: any) {
      setError("Lỗi kết nối máy chủ.");
    }
  }, [chatId]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setError("Dữ liệu trực tuyến chưa được cấu hình.");
      return;
    }
    fetchChat();

    const channel = supabase
      .channel(`chat-${chatId}`)
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat?.messages]);

  const handleSend = async (options: any = {}) => {
    const text = options.text || inputText;
    if (!text.trim() && !options.image && !options.sticker) return;
    
    if (!chat) {
      alert("Không tìm thấy dữ liệu cuộc trò chuyện. Hãy thử quay lại và vào lại.");
      return;
    }

    setIsSyncing(true);
    const msgId = `m-${Date.now()}`;
    
    const dbMessage = {
      id: msgId,
      chatid: chatId,
      senderid: user.id,
      sendername: user.name,
      text: text,
      timestamp: new Date().toISOString(),
      status: 'sent',
      imageurl: options.image || null,
      stickerurl: options.sticker || null
    };

    try {
      const { error: sendError } = await dbService.sendMessage(dbMessage);
      if (sendError) {
        console.error("Supabase error detail:", sendError);
        alert(`Lỗi gửi: ${sendError.message}. Hãy đảm bảo bạn đã chạy SQL DISABLE RLS.`);
      } else {
        setInputText('');
      }
    } catch (err) {
      console.error("Critical error sending message:", err);
      alert("Lỗi hệ thống khi gửi tin nhắn.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zalo-bg dark:bg-slate-950 w-full max-w-[500px] mx-auto relative overflow-hidden font-body shadow-2xl">
      <header className="z-40 bg-white dark:bg-slate-900 border-b p-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><span className="material-symbols-outlined">arrow_back_ios_new</span></button>
          <div>
            <h2 className="text-sm font-bold dark:text-white flex items-center gap-2">
               {chat?.name || 'Đang tải...'}
               {isSyncing && <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>}
            </h2>
            <p className="text-[10px] text-slate-400">Trực tuyến</p>
          </div>
        </div>
        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><span className="material-symbols-outlined">more_horiz</span></button>
      </header>

      {error && (
        <div className="bg-red-50 p-4 m-2 rounded-xl border border-red-100 shadow-sm">
          <p className="text-red-600 text-[11px] text-center font-bold">{error}</p>
          <button onClick={() => fetchChat()} className="block mx-auto mt-2 text-[10px] bg-red-100 px-3 py-1 rounded-full text-red-700 font-bold uppercase tracking-wider">Thử lại</button>
        </div>
      )}

      <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {chat?.messages.map((msg) => {
          const isMe = msg.senderId === user.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-3 py-2 rounded-2xl shadow-sm ${isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 dark:text-white rounded-tl-none'}`}>
                 {!isMe && <p className="text-[9px] font-bold opacity-60 mb-1">{msg.senderName}</p>}
                 <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{msg.text}</p>
                 <span className="text-[9px] opacity-50 block mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            </div>
          );
        })}
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t p-3 flex items-center gap-2 pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <input 
          className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-primary dark:text-white transition-all shadow-inner"
          placeholder="Nhập tin nhắn..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !isSyncing && handleSend()}
          disabled={isSyncing}
        />
        <button 
          onClick={() => handleSend()} 
          disabled={isSyncing}
          className={`size-12 bg-primary text-white rounded-full flex items-center justify-center active:scale-95 transition-all shadow-lg ${isSyncing ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-primary-dark shadow-primary/20'}`}
        >
           {isSyncing ? <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <span className="material-symbols-outlined filled text-[24px]">send</span>}
        </button>
      </footer>
    </div>
  );
};

export default ChatDetailScreen;
