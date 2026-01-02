
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Camera, Smile } from 'lucide-react';

const ChatDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'other', text: 'Chào mẹ nhé! Bé nhà mẹ được mấy tháng rồi?', time: '14:20' },
    { id: 2, sender: 'me', text: 'Dạ bé nhà em được 6 tháng rồi ạ. Đang bắt đầu ăn dặm.', time: '14:25' },
    { id: 3, sender: 'other', text: 'Thế mẹ dùng loại bột gì thế?', time: '14:30' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMsg]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-[#FFF9FA]">
      {/* Header */}
      <div className="bg-white border-b border-pink-100 pt-12 pb-4 px-4 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 text-pink-500">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-3">
          <img src={`https://picsum.photos/seed/${id}/200`} className="w-10 h-10 rounded-full border border-pink-100" alt="Avatar" />
          <div>
            <h2 className="font-bold text-gray-800 leading-tight">Mẹ Gấu</h2>
            <span className="text-[10px] text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Trực tuyến
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
              msg.sender === 'me' 
                ? 'bg-gradient-to-br from-pink-400 to-pink-500 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 rounded-tl-none border border-pink-50'
            }`}>
              <p className="text-sm">{msg.text}</p>
              <span className={`text-[10px] block mt-1 ${msg.sender === 'me' ? 'text-pink-100 text-right' : 'text-gray-400'}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 pb-8 flex items-center gap-3">
        <button className="text-pink-300">
          <Camera size={24} />
        </button>
        <button className="text-pink-300">
          <Smile size={24} />
        </button>
        <div className="flex-1 bg-pink-50 rounded-2xl flex items-center px-4">
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            className="w-full bg-transparent border-none py-3 outline-none text-sm text-gray-700 placeholder-pink-300"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
        </div>
        <button 
          onClick={handleSend}
          className={`p-3 rounded-full ${input.trim() ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-400'} transition-all`}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatDetailPage;
