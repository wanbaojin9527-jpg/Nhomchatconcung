
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Image as ImageIcon } from 'lucide-react';

const FeedPage: React.FC = () => {
  const [posts] = useState([
    {
      id: 1,
      user: 'Mẹ Lan Anh',
      avatar: 'https://picsum.photos/seed/mom6/200',
      content: 'Hôm nay bé con nhà mình biết lật rồi nè các mẹ ơi! Vui quá đi mất 💖🍼',
      image: 'https://picsum.photos/seed/baby1/600/400',
      time: '2 giờ trước',
      likes: 124,
      comments: 15
    },
    {
      id: 2,
      user: 'Mẹ Bé Bông',
      avatar: 'https://picsum.photos/seed/mom7/200',
      content: 'Mẹ nào có kinh nghiệm chọn bỉm cho bé da nhạy cảm không ạ? Tư vấn em với!',
      image: null,
      time: '5 giờ trước',
      likes: 45,
      comments: 32
    }
  ]);

  return (
    <div className="flex flex-col h-full bg-[#FDF2F5]">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-pink-500">ConCung Feed</h1>
        <button className="w-10 h-10 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center">
          <ImageIcon size={20} />
        </button>
      </div>

      {/* Post Creator */}
      <div className="bg-white p-4 mb-3">
        <div className="flex gap-3">
          <img src="https://picsum.photos/seed/mom1/200" className="w-10 h-10 rounded-full" alt="Me" />
          <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-400 cursor-pointer">
            Hôm nay bé yêu thế nào rồi mẹ?
          </div>
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-3 pb-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <img src={post.avatar} className="w-10 h-10 rounded-full" alt={post.user} />
                <div>
                  <h4 className="font-bold text-sm">{post.user}</h4>
                  <span className="text-[10px] text-gray-400">{post.time}</span>
                </div>
              </div>
              <button className="text-gray-300">
                <MoreHorizontal size={20} />
              </button>
            </div>
            
            <p className="text-sm text-gray-800 mb-4 leading-relaxed">{post.content}</p>
            
            {post.image && (
              <img src={post.image} className="w-full h-64 object-cover rounded-2xl mb-4" alt="Post" />
            )}

            <div className="flex justify-between items-center pt-2 border-t border-gray-50 text-gray-500">
              <div className="flex gap-6">
                <button className="flex items-center gap-1 hover:text-pink-500 transition-colors">
                  <Heart size={20} className="text-pink-400" />
                  <span className="text-xs font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                  <MessageCircle size={20} className="text-blue-300" />
                  <span className="text-xs font-medium">{post.comments}</span>
                </button>
              </div>
              <button className="hover:text-gray-800">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedPage;
