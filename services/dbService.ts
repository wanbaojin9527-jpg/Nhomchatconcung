
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, Chat, Message, Post, FriendRequest, Comment } from '../types';

const checkConnection = () => {
  if (!isSupabaseConfigured) {
    throw new Error("Cơ sở dữ liệu chưa được kết nối. Vui lòng cấu hình Supabase.");
  }
};

export const dbService = {
  // USERS
  async getUser(phone: string) {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase.from('users').select('*').eq('phonenumber', phone).single();
    if (error) return null;
    return { ...data, phoneNumber: data.phonenumber } as User;
  },

  async getAllUsers() {
    if (!isSupabaseConfigured) return [];
    const { data } = await supabase.from('users').select('*');
    return (data || []).map(u => ({ ...u, phoneNumber: u.phonenumber })) as User[];
  },

  async createUser(user: User) {
    checkConnection();
    const dbUser = {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      phonenumber: user.phoneNumber,
      password: user.password,
      status: user.status
    };
    return await supabase.from('users').insert([dbUser]);
  },

  // CHATS & MESSAGES
  async getMyChats(userId: string) {
    if (!isSupabaseConfigured) return { data: [], error: null };
    const { data, error } = await supabase
      .from('chats')
      .select('*, messages(*)')
      .contains('participants', [userId]);
    
    if (data) {
      const mappedData = data.map(chat => ({
        ...chat,
        lastTimestamp: chat.lasttimestamp,
        messages: (chat.messages || []).map((m: any) => ({
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
      }));
      return { data: mappedData as Chat[], error };
    }
    return { data: [], error };
  },

  async createChat(chat: Chat) {
    checkConnection();
    const dbChat = {
      id: chat.id,
      type: chat.type,
      participants: chat.participants,
      name: chat.name,
      avatar: chat.avatar,
      lasttimestamp: chat.lastTimestamp || new Date().toISOString()
    };
    return await supabase.from('chats').insert([dbChat]);
  },

  async sendMessage(msg: any) {
    checkConnection();
    return await supabase.from('messages').insert([msg]);
  },

  // POSTS
  async getPosts() {
    if (!isSupabaseConfigured) return { data: [], error: null };
    const { data, error } = await supabase
      .from('posts')
      .select('*, comments(*)')
      .order('created_at', { ascending: false });
    
    if (data) {
      const mappedPosts = data.map(post => ({
        ...post,
        userId: post.userid,
        userName: post.username,
        userAvatar: post.useravatar,
        imageUrl: post.imageurl,
        likedBy: post.likedby || [],
        comments: (post.comments || []).map((c: any) => ({
          ...c,
          userId: c.userid,
          userName: c.username,
          userAvatar: c.useravatar,
          likedBy: c.likedby || []
        }))
      }));
      return { data: mappedPosts as Post[], error };
    }
    return { data: [], error };
  },

  async createPost(post: Post) {
    checkConnection();
    const dbPost = {
      id: post.id,
      userid: post.userId,
      username: post.userName,
      useravatar: post.userAvatar,
      content: post.content,
      imageurl: post.imageUrl,
      likes: post.likes,
      likedby: post.likedBy
    };
    return await supabase.from('posts').insert([dbPost]);
  },

  async updatePost(post: Post) {
    checkConnection();
    return await supabase.from('posts').update({
      likes: post.likes,
      likedby: post.likedBy
    }).eq('id', post.id);
  },

  // FRIEND REQUESTS
  async getRequests(userId: string) {
    if (!isSupabaseConfigured) return { data: [], error: null };
    const { data, error } = await supabase
      .from('friend_requests')
      .select('*')
      .or(`fromuserid.eq.${userId},touserid.eq.${userId}`);
    
    if (data) {
      const mapped = data.map(r => ({
        ...r,
        fromUserId: r.fromuserid,
        toUserId: r.touserid
      }));
      return { data: mapped as FriendRequest[], error };
    }
    return { data: [], error };
  },

  async createRequest(req: FriendRequest) {
    checkConnection();
    return await supabase.from('friend_requests').insert([{
      id: req.id,
      fromuserid: req.fromUserId,
      touserid: req.toUserId,
      status: req.status,
      timestamp: req.timestamp
    }]);
  },

  async updateRequest(requestId: string, status: string) {
    checkConnection();
    return await supabase.from('friend_requests').update({ status }).eq('id', requestId);
  }
};
