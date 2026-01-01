
import React, { useState, useEffect, useCallback } from 'react';
import BottomNav from '../components/BottomNav';
import { User, Post, FriendRequest, AppNotification, Comment } from '../types';
import { broadcastDataUpdate } from '../App';

interface Props {
  user: User;
}

const DiscoverScreen: React.FC<Props> = ({ user }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newContent, setNewContent] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{[key: string]: string}>({});

  const renderTextWithLinks = (text?: string) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => 
      urlRegex.test(part) ? (
        <a 
          key={i} 
          href={part} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 hover:underline break-all"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      ) : part
    );
  };

  const refreshPosts = useCallback(() => {
    const savedPosts = JSON.parse(localStorage.getItem('cp_posts') || '[]');
    setPosts(savedPosts);
  }, []);

  useEffect(() => {
    refreshPosts();
    window.addEventListener('cp-data-update', refreshPosts);
    return () => window.removeEventListener('cp-data-update', refreshPosts);
  }, [refreshPosts]);

  const handlePost = () => {
    if (!newContent && !selectedImage) return;
    const newPost: Post = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: newContent,
      imageUrl: selectedImage || undefined,
      timestamp: 'Vừa xong',
      likes: 0,
      likedBy: [],
      comments: []
    };
    const currentPosts = JSON.parse(localStorage.getItem('cp_posts') || '[]');
    localStorage.setItem('cp_posts', JSON.stringify([newPost, ...currentPosts]));
    broadcastDataUpdate();
    setNewContent('');
    setSelectedImage(null);
    setShowEditor(false);
  };

  const handleToggleLike = (postId: string) => {
    const savedPosts: Post[] = JSON.parse(localStorage.getItem('cp_posts') || '[]');
    const postIndex = savedPosts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
      const post = savedPosts[postIndex];
      const hasLiked = post.likedBy.includes(user.id);
      if (hasLiked) {
        post.likedBy = post.likedBy.filter(id => id !== user.id);
        post.likes = Math.max(0, post.likes - 1);
      } else {
        post.likedBy.push(user.id);
        post.likes += 1;
      }
      localStorage.setItem('cp_posts', JSON.stringify(savedPosts));
      broadcastDataUpdate();
    }
  };

  const handleToggleLikeComment = (postId: string, commentId: string) => {
    const savedPosts: Post[] = JSON.parse(localStorage.getItem('cp_posts') || '[]');
    const postIndex = savedPosts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
      const commentIndex = savedPosts[postIndex].comments.findIndex(c => c.id === commentId);
      if (commentIndex !== -1) {
        const comment = savedPosts[postIndex].comments[commentIndex];
        if (!comment.likedBy) comment.likedBy = [];
        
        const hasLiked = comment.likedBy.includes(user.id);
        if (hasLiked) {
          comment.likedBy = comment.likedBy.filter(id => id !== user.id);
          comment.likes = Math.max(0, (comment.likes || 1) - 1);
        } else {
          comment.likedBy.push(user.id);
          comment.likes = (comment.likes || 0) + 1;
        }
        
        localStorage.setItem('cp_posts', JSON.stringify(savedPosts));
        broadcastDataUpdate();
      }
    }
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;
    const savedPosts: Post[] = JSON.parse(localStorage.getItem('cp_posts') || '[]');
    const postIndex = savedPosts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
      const newComment: Comment = {
        id: 'cmt-' + Date.now(),
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        text: text,
        timestamp: 'Vừa xong',
        likes: 0,
        likedBy: []
      };
      savedPosts[postIndex].comments.push(newComment);
      localStorage.setItem('cp_posts', JSON.stringify(savedPosts));
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      broadcastDataUpdate();
    }
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
        <div className="flex items-center gap-1">
          <button onClick={() => setShowEditor(true)} className="p-2 text-white active:bg-white/10 rounded-full transition-colors"><span className="material-symbols-outlined text-[26px]">edit_square</span></button>
          <button className="p-2 text-white active:bg-white/10 rounded-full transition-colors"><span className="material-symbols-outlined text-[26px]">notifications</span></button>
        </div>
      </header>

      <main className="flex-1 space-y-2">
        <div className="bg-white dark:bg-slate-900 p-4 flex items-center gap-3 shadow-sm">
          <img src={user.avatar} className="size-11 rounded-full object-cover border border-slate-100" alt="Me" />
          <button onClick={() => setShowEditor(true)} className="flex-1 text-left text-slate-400 py-2.5 px-4 text-sm border border-slate-100 dark:border-slate-800 rounded-full hover:bg-slate-50 transition-colors">Hôm nay bạn thế nào?</button>
        </div>
        {posts.map(post => {
          const isLiked = post.likedBy.includes(user.id);
          return (
            <div key={post.id} className="bg-white dark:bg-slate-900 py-4 shadow-sm animate-in fade-in slide-in-from-bottom duration-300">
              <div className="flex items-center gap-3 px-4 mb-3">
                <img src={post.userAvatar} className="size-11 rounded-full object-cover shadow-sm border border-slate-100" alt="Avt" />
                <div><h4 className="font-bold text-[15px] dark:text-slate-100">{post.userName}</h4><p className="text-[11px] text-slate-400">{post.timestamp}</p></div>
              </div>
              {post.content && <div className="px-4 text-[15px] mb-3 leading-relaxed dark:text-slate-200">{renderTextWithLinks(post.content)}</div>}
              {post.imageUrl && (
                <div className="px-0 sm:px-4">
                  <img src={post.imageUrl} className="w-full object-cover max-h-[400px] sm:rounded-xl shadow-sm" alt="Post" />
                </div>
              )}
              <div className="flex items-center gap-6 px-4 mt-4 py-2 border-y border-slate-50 dark:border-slate-800">
                <button 
                  onClick={() => handleToggleLike(post.id)} 
                  className={`flex items-center gap-2 text-sm font-bold transition-all active:scale-125 ${isLiked ? 'text-red-500' : 'text-slate-500'}`}
                >
                  <span className={`material-symbols-outlined text-[24px] ${isLiked ? 'filled' : ''}`}>favorite</span> 
                  {post.likes > 0 ? post.likes : 'Thích'}
                </button>
                <button className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                  <span className="material-symbols-outlined text-[24px]">chat_bubble</span> 
                  {post.comments.length > 0 ? post.comments.length : 'Bình luận'}
                </button>
              </div>

              {/* Comments Section */}
              {post.comments.length > 0 && (
                <div className="px-4 mt-3 space-y-3 bg-slate-50/50 dark:bg-slate-800/30 p-3 mx-2 rounded-xl">
                    {post.comments.map(cmt => {
                        const isCmtLiked = cmt.likedBy?.includes(user.id);
                        return (
                          <div key={cmt.id} className="flex gap-2 animate-in slide-in-from-left duration-200">
                              <img src={cmt.userAvatar} className="size-8 rounded-full shrink-0 mt-0.5" alt="Avt" />
                              <div className="flex-1 flex flex-col items-start">
                                <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl rounded-tl-none shadow-sm w-full relative">
                                    <p className="text-[12px] font-black text-slate-900 dark:text-slate-100">{cmt.userName}</p>
                                    <div className="text-[13px] text-slate-700 dark:text-slate-300 leading-snug">{renderTextWithLinks(cmt.text)}</div>
                                    
                                    {/* Thả tim bình luận mini button */}
                                    <button 
                                      onClick={() => handleToggleLikeComment(post.id, cmt.id)}
                                      className={`absolute -right-2 -bottom-2 size-6 rounded-full bg-white dark:bg-slate-700 shadow-md flex items-center justify-center border border-slate-50 transition-transform active:scale-125 ${isCmtLiked ? 'text-red-500' : 'text-slate-300'}`}
                                    >
                                      <span className={`material-symbols-outlined text-[14px] ${isCmtLiked ? 'filled' : ''}`}>favorite</span>
                                    </button>
                                </div>
                                <div className="flex items-center gap-3 mt-1 ml-2">
                                  <span className="text-[10px] text-slate-400">{cmt.timestamp}</span>
                                  {cmt.likes ? <span className="text-[10px] text-red-500 font-black">{cmt.likes} ❤️</span> : null}
                                  <button onClick={() => handleToggleLikeComment(post.id, cmt.id)} className={`text-[10px] font-black ${isCmtLiked ? 'text-red-500' : 'text-slate-500'}`}>Thích</button>
                                </div>
                              </div>
                          </div>
                        );
                    })}
                </div>
              )}

              {/* Add Comment Input */}
              <div className="px-4 mt-4 flex items-center gap-2">
                 <img src={user.avatar} className="size-8 rounded-full" alt="Me" />
                 <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full px-4 flex items-center">
                    <input 
                      placeholder="Viết bình luận..." 
                      className="w-full bg-transparent border-none text-[13px] py-1.5 focus:ring-0 dark:text-white"
                      value={commentInputs[post.id] || ''}
                      onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && handleAddComment(post.id)}
                    />
                    <button onClick={() => handleAddComment(post.id)} className="text-primary font-bold text-xs p-1">
                      <span className="material-symbols-outlined text-[20px]">send</span>
                    </button>
                 </div>
              </div>
            </div>
          )
        })}
      </main>
      
      {/* Editor Modal is unchanged... */}
      {showEditor && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditor(false)}></div>
          <div className="w-full max-w-[500px] h-full bg-white dark:bg-slate-900 flex flex-col animate-in slide-in-from-right duration-300 relative">
            <header className="px-4 pt-10 pb-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <button onClick={() => setShowEditor(false)} className="text-slate-600 dark:text-white p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><span className="material-symbols-outlined">close</span></button>
              <h3 className="font-bold dark:text-white">Nhật ký mới</h3>
              <button onClick={handlePost} disabled={!newContent && !selectedImage} className="px-5 py-1.5 bg-primary text-white rounded-full font-bold text-xs disabled:opacity-30 shadow-md">ĐĂNG</button>
            </header>
            <textarea 
              className="flex-1 p-6 border-none focus:ring-0 text-[18px] resize-none dark:bg-slate-900 placeholder:text-slate-300 dark:text-white font-medium" 
              placeholder="Hôm nay bạn thế nào?" 
              value={newContent} 
              onChange={e => setNewContent(e.target.value)} 
              autoFocus
            />
            {selectedImage && (
              <div className="px-4 pb-4 relative animate-in zoom-in duration-200">
                 <img src={selectedImage} className="w-full rounded-2xl max-h-[300px] object-cover shadow-lg border border-slate-100" alt="Preview" />
                 <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-6 bg-black/60 text-white rounded-full p-1.5 shadow-md hover:scale-110 transition-transform"><span className="material-symbols-outlined text-[18px]">close</span></button>
              </div>
            )}
            <div className="p-4 pb-12 border-t border-slate-100 dark:border-slate-800 flex gap-6 bg-slate-50 dark:bg-slate-900/50">
              <label className="cursor-pointer text-slate-700 dark:text-slate-300 flex items-center gap-2 font-bold text-sm bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
                <input type="file" className="hidden" accept="image/*" onChange={handleImagePick} />
                <span className="material-symbols-outlined text-[24px] text-green-500 filled">image</span> Album ảnh
              </label>
              <button className="text-slate-700 dark:text-slate-300 flex items-center gap-2 font-bold text-sm bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-[24px] text-blue-500 filled">videocam</span> Video
              </button>
            </div>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
};

export default DiscoverScreen;
