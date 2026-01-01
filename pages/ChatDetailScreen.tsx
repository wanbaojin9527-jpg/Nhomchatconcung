
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Chat, Message, Reaction, LocationData } from '../types';
import { broadcastDataUpdate } from '../App';
import { GoogleGenAI } from "@google/genai";
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setError("Dữ liệu trực tuyến chưa được cấu hình.");
      return;
    }

    const fetchChat = async () => {
      try {
        const { data, error } = await supabase
          .from('chats')
          .select('*, messages(*)')
          .eq('id', chatId)
          .single();
        if (error) throw error;
        
        if (data) {
          // Map tin nhắn từ DB (lowercase) sang Frontend (camelCase)
          const mappedChat = {
            ...data,
            messages: (data.messages || []).map((m: any) => ({
              ...m,
              senderId: m.senderid,
              senderName: m.sendername,
              chatId: m.chatid,
              imageUrl: m.imageurl,
              stickerUrl: m.stickerurl
            }))
          };
          setChat(mappedChat);
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError("Không thể tải cuộc hội thoại.");
      }
    };

    fetchChat();

    // Subscribe nhận tin nhắn mới ngay lập tức
    const channel = supabase
      .channel(`chat-${chatId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages', 
        filter: `chatid=eq.${chatId}` // Dùng chatid lowercase
      }, (payload) => {
        const m = payload.new as any;
        const mappedMsg: Message = {
          ...m,
          senderId: m.senderid,
          senderName: m.sendername,
          chatId: m.chatid,
          imageUrl: m.imageurl,
          stickerUrl: m.stickerurl
        };
        setChat(prev => {
          if (!prev) return prev;
          return { ...prev, messages: [...prev.messages, mappedMsg] };
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [chatId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat?.messages]);

  const handleSend = async (options: any = {}) => {
    const text = options.text || inputText;
    if (!text.trim() && !options.image && !options.sticker) return;
    if (!isSupabaseConfigured) {
      alert("Tính năng này yêu cầu kết nối Supabase.");
      return;
    }

    setIsSyncing(true);
    
    // Tạo object theo định dạng database
    const dbMessage = {
      id: Date.now().toString(),
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
      const { error } = await supabase.from('messages').insert([dbMessage]);
      if (error) throw error;
      setInputText('');
    } catch (err) {
      console.error("Send error:", err);
      alert("Không thể gửi tin nhắn.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zalo-bg dark:bg-slate-950 w-full max-w-[500px] mx-auto relative overflow-hidden font-body shadow-2xl">
      <header className="z-40 bg-white dark:bg-slate-900 border-b p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2"><span className="material-symbols-outlined">arrow_back_ios_new</span></button>
          <div>
            <h2 className="text-sm font-bold dark:text-white flex items-center gap-2">
               {chat?.name || 'Phòng chat'}
               {isSyncing && <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>}
            </h2>
            <p className="text-[10px] text-slate-400">
              {isSupabaseConfigured ? 'Đang trực tuyến' : 'Chế độ ngoại tuyến'}
            </p>
          </div>
        </div>
        <button className="p-2 text-slate-400"><span className="material-symbols-outlined">more_horiz</span></button>
      </header>

      {error && (
        <div className="bg-red-50 p-3 text-red-500 text-xs text-center font-bold">
          {error}
        </div>
      )}

      <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {chat?.messages.map((msg) => {
          const isMe = msg.senderId === user.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-3 py-2 rounded-2xl shadow-sm ${isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 dark:text-white rounded-tl-none'}`}>
                 {!isMe && <p className="text-[9px] font-bold opacity-60 mb-1">{msg.senderName}</p>}
                 <p className="text-sm">{msg.text}</p>
                 <span className="text-[9px] opacity-50 block mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            </div>
          );
        })}
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t p-3 flex items-center gap-2 pb-8">
        <input 
          className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-full px-4 py-2.5 text-sm focus:ring-primary dark:text-white"
          placeholder="Nhập tin nhắn..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button onClick={() => handleSend()} className="size-10 bg-primary text-white rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-lg">
           <span className="material-symbols-outlined filled">send</span>
        </button>
      </footer>
    </div>
  );
};

export default ChatDetailScreen;
