
import React, { useState, useEffect, useCallback } from 'react';
import BottomNav from '../components/BottomNav';
import { User, Post, Comment } from '../types';
import { dbService } from '../services/dbService';
import { supabase } from '../lib/supabase';

interface Props {
  user: User;
}

const DiscoverScreen: React.FC<Props> = ({ user }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newContent, setNewContent] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    const { data } = await dbService.getPosts();
    if (data) setPosts(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadPosts();
    
    const channel = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        loadPosts();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [loadPosts]);

  const handlePost = async () => {
    if (!newContent && !selectedImage) return;
    const newPost: Post = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: newContent,
      imageUrl: selectedImage || undefined,
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      comments: []
    };
    
    await dbService.createPost(newPost);
    setNewContent('');
    setSelectedImage(null);
    setShowEditor(false);
  };

  const handleToggleLike = async (post: Post) => {
    const hasLiked = post.likedBy.includes(user.id);
    const updatedLikedBy = hasLiked 
      ? post.likedBy.filter(id => id !== user.id) 
      : [...post.likedBy, user.id];
    
    const updatedPost = {
      ...post,
      likedBy: updatedLikedBy,
      likes: updatedLikedBy.length
    };

    await dbService.updatePost(updatedPost);
    // UI sẽ tự cập nhật nhờ realtime subscription
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-[#f1f2f7] dark:bg-background-dark min-h-screen flex flex-col pb-24 w-full max-w-[500px] mx-auto relative no-scrollbar">
      <header className="zalo-header-gradient px-4 pt-10 pb-3 sticky top-0 z-40 shadow-sm flex items-center justify-between">
        <h2 className="text-white text-lg font-bold">Nhật ký</h2>
        <button onClick={() => setShowEditor(true)} className="p-2 text-white"><span className="material-symbols-outlined">edit_square</span></button>
      </header>

      <main className="flex-1 space-y-2">
        <div className="bg-white dark:bg-slate-900 p-4 flex items-center gap-3 shadow-sm">
          <img src={user.avatar} className="size-11 rounded-full object-cover" alt="Me" />
          <button onClick={() => setShowEditor(true)} className="flex-1 text-left text-slate-400 py-2.5 px-4 text-sm border border-slate-100 dark:border-slate-800 rounded-full">Hôm nay bạn thế nào?</button>
        </div>

        {isLoading && <div className="p-10 text-center text-slate-400">Đang tải nhật ký...</div>}

        {posts.map(post => {
          const isLiked = post.likedBy.includes(user.id);
          return (
            <div key={post.id} className="bg-white dark:bg-slate-900 py-4 shadow-sm">
              <div className="flex items-center gap-3 px-4 mb-3">
                <img src={post.userAvatar} className="size-11 rounded-full object-cover shadow-sm" alt="Avt" />
                <div>
                  <h4 className="font-bold text-[15px] dark:text-slate-100">{post.userName}</h4>
                  <p className="text-[11px] text-slate-400">{new Date(post.timestamp).toLocaleString()}</p>
                </div>
              </div>
              {post.content && <div className="px-4 text-[15px] mb-3 leading-relaxed dark:text-slate-200">{post.content}</div>}
              {post.imageUrl && <img src={post.imageUrl} className="w-full object-cover max-h-[400px]" alt="Post" />}
              
              <div className="flex items-center gap-6 px-4 mt-4 py-2 border-y border-slate-50 dark:border-slate-800">
                <button onClick={() => handleToggleLike(post)} className={`flex items-center gap-2 text-sm font-bold ${isLiked ? 'text-red-500' : 'text-slate-500'}`}>
                  <span className={`material-symbols-outlined ${isLiked ? 'filled' : ''}`}>favorite</span> 
                  {post.likes || 0}
                </button>
                <button className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                  <span className="material-symbols-outlined">chat_bubble</span> {post.comments?.length || 0}
                </button>
              </div>
            </div>
          )
        })}
      </main>

      {showEditor && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditor(false)}></div>
          <div className="w-full max-w-[500px] h-full bg-white dark:bg-slate-900 flex flex-col relative">
            <header className="px-4 pt-10 pb-3 flex items-center justify-between border-b border-slate-100">
              <button onClick={() => setShowEditor(false)} className="p-2"><span className="material-symbols-outlined">close</span></button>
              <h3 className="font-bold">Nhật ký mới</h3>
              <button onClick={handlePost} disabled={!newContent && !selectedImage} className="px-5 py-1.5 bg-primary text-white rounded-full font-bold text-xs disabled:opacity-30">ĐĂNG</button>
            </header>
            <textarea 
              className="flex-1 p-6 border-none focus:ring-0 text-[18px] resize-none dark:bg-slate-900 dark:text-white" 
              placeholder="Bạn đang nghĩ gì?" 
              value={newContent} 
              onChange={e => setNewContent(e.target.value)} 
            />
            {selectedImage && (
              <div className="px-4 pb-4 relative">
                 <img src={selectedImage} className="w-full rounded-2xl max-h-[300px] object-cover" alt="Preview" />
                 <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-6 bg-black/50 text-white rounded-full p-1"><span className="material-symbols-outlined">close</span></button>
              </div>
            )}
            <div className="p-4 pb-12 border-t flex gap-4">
              <label className="cursor-pointer flex items-center gap-2 font-bold text-sm bg-slate-100 px-4 py-2 rounded-full">
                <input type="file" className="hidden" accept="image/*" onChange={handleImagePick} />
                <span className="material-symbols-outlined text-green-500">image</span> Ảnh
              </label>
            </div>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
};

export default DiscoverScreen;
