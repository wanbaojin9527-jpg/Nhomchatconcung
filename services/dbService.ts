
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
    // Đổi 'phoneNumber' thành 'phonenumber' (Postgres mặc định lowercase)
    const { data, error } = await supabase.from('users').select('*').eq('phonenumber', phone).single();
    if (error) return null;
    
    // Ánh xạ lại về camelCase cho Frontend
    return {
      ...data,
      phoneNumber: data.phonenumber
    } as User;
  },

  async createUser(user: User) {
    checkConnection();
    // Chuyển đối tượng sang định dạng Database (snake_case/lowercase)
    const dbUser = {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      phonenumber: user.phoneNumber, // Ánh xạ đúng cột
      password: user.password,
      status: user.status
    };
    const { data, error } = await supabase.from('users').insert([dbUser]).select().single();
    return { data, error };
  },

  async updateUser(user: User) {
    checkConnection();
    const dbUser = {
      name: user.name,
      avatar: user.avatar,
      phonenumber: user.phoneNumber,
      password: user.password,
      status: user.status
    };
    const { error } = await supabase.from('users').update(dbUser).eq('id', user.id);
    return { error };
  },

  // CHATS & MESSAGES
  async getMyChats(userId: string) {
    if (!isSupabaseConfigured) return { data: [], error: null };
    const { data, error } = await supabase
      .from('chats')
      .select('*, messages(*)')
      .contains('participants', [userId]);
    
    if (data) {
      // Map lại dữ liệu tin nhắn từ lowercase DB sang camelCase Frontend
      const mappedData = data.map(chat => ({
        ...chat,
        messages: (chat.messages || []).map((m: any) => ({
          ...m,
          senderId: m.senderid,
          senderName: m.sendername,
          chatId: m.chatid,
          imageUrl: m.imageurl,
          stickerUrl: m.stickerurl
        }))
      }));
      return { data: mappedData as Chat[], error };
    }
    return { data: [], error };
  },

  async sendMessage(chatId: string, message: Message) {
    checkConnection();
    const dbMessage = {
      id: message.id,
      chatid: chatId,
      senderid: message.senderId,
      sendername: message.senderName,
      text: message.text,
      imageurl: message.imageUrl,
      stickerurl: message.stickerUrl,
      status: message.status,
      timestamp: message.timestamp
    };
    const { error } = await supabase.from('messages').insert([dbMessage]);
    return { error };
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
        likedBy: post.likedby || []
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
    const { error } = await supabase.from('posts').insert([dbPost]);
    return { error };
  }
};
