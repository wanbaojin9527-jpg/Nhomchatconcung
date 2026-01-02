
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Image as ImageIcon, Camera, X, Send, Trash2 } from 'lucide-react';

interface Post {
  id: number;
  user: string;
  avatar: string;
  content: string;
  image: string | null;
  time: string;
  likes: number;
  comments: number;
}

interface FeedPageProps {
  user: any;
}

const FeedPage: React.FC<FeedPageProps> = ({ user }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showCreator, setShowCreator] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Load posts from localStorage to sync deletions
  useEffect(() => {
    const savedPosts = localStorage.getItem('concung_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  const savePosts = (updatedPosts: Post[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('concung_posts', JSON.stringify(updatedPosts));
  };

  const handlePost = () => {
    if (!newPostContent.trim() && !previewImage) return;
    const newPost: Post = {
      id: Date.now(),
      user: user.full_name,
      avatar: user.avatar_url,
      content: newPostContent,
      image: previewImage,
      time: 'Vừa xong',
      likes: 0,
      comments: 0
    };
    savePosts([newPost, ...posts]);
    setNewPostContent('');
    setPreviewImage(null);
    setShowCreator(false);
  };

  const handleDeletePost = (postId: number) => {
    if (window.confirm("Admin có chắc chắn muốn xóa bài viết này không?")) {
      const updated = posts.filter(p => p.id !== postId);
      savePosts(updated);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FFF9FA]">
      <div className="bg-gradient-to-r from-pink-400 to-rose-400 pt-12 pb-6 px-6 rounded-b-[40px] text-white sticky top-0 z-20 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Khám phá</h1>
            <p className="text-[10px] text-pink-100 font-bold uppercase tracking-wider">Cộng đồng mẹ bỉm</p>
          </div>
          <button onClick={() => setShowCreator(true)} className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center"><Camera size={22} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
        {showCreator && (
          <div className="mx-4 mt-6 bg-white rounded-[32px] p-5 shadow-xl border border-pink-50 animate-pop-in">
            <textarea placeholder="Mẹ đang nghĩ gì thế?..." className="w-full bg-pink-50/50 border-none rounded-2xl p-4 text-sm outline-none h-24" value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} />
            {previewImage && <img src={previewImage} className="w-full h-48 object-cover rounded-2xl mt-4" alt="Preview" />}
            <div className="flex justify-between items-center mt-4">
              <label className="text-pink-500 cursor-pointer font-bold text-xs flex items-center gap-1">
                <ImageIcon size={20} /> Ảnh <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
              <button onClick={handlePost} className="bg-pink-500 text-white px-6 py-2 rounded-xl font-bold text-xs">Đăng bài</button>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-4 px-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-[32px] p-5 shadow-sm border border-pink-50/50">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <img src={post.avatar} className="w-12 h-12 rounded-2xl object-cover" alt={post.user} />
                  <div>
                    <h4 className="font-bold text-sm text-gray-800">{post.user}</h4>
                    <span className="text-[10px] text-gray-400 font-medium">{post.time}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {user.role === 'admin' && (
                    <button 
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors"
                      title="Admin: Xóa bài viết"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  <button className="text-gray-300 p-1"><MoreHorizontal size={20} /></button>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">{post.content}</p>
              {post.image && <img src={post.image} className="w-full max-h-[400px] object-cover rounded-[24px] mb-4 shadow-sm" alt="Post" />}
              <div className="flex justify-between items-center pt-4 border-t border-pink-50/50">
                <div className="flex gap-6">
                  <button className="flex items-center gap-1.5 text-gray-400 font-bold text-xs"><Heart size={20} /> {post.likes || 0}</button>
                  <button className="flex items-center gap-1.5 text-gray-400 font-bold text-xs"><MessageCircle size={20} /> {post.comments || 0}</button>
                </div>
                <Share2 size={20} className="text-gray-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `.animate-pop-in { animation: pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); } @keyframes pop-in { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}} />
    </div>
  );
};

export default FeedPage;
