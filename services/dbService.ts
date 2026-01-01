
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
    const { data, error } = await supabase.from('users').select('*').eq('phoneNumber', phone).single();
    if (error) return null;
    return data as User;
  },

  async createUser(user: User) {
    checkConnection();
    const { data, error } = await supabase.from('users').insert([user]).select().single();
    return { data, error };
  },

  async updateUser(user: User) {
    checkConnection();
    const { error } = await supabase.from('users').update(user).eq('id', user.id);
    return { error };
  },

  // CHATS & MESSAGES
  async getMyChats(userId: string) {
    if (!isSupabaseConfigured) return { data: [], error: null };
    const { data, error } = await supabase
      .from('chats')
      .select('*, messages(*)')
      .contains('participants', [userId]);
    return { data: data as Chat[], error };
  },

  async sendMessage(chatId: string, message: Message) {
    checkConnection();
    const { error } = await supabase.from('messages').insert([{ ...message, chatId }]);
    return { error };
  },

  // POSTS
  async getPosts() {
    if (!isSupabaseConfigured) return { data: [], error: null };
    const { data, error } = await supabase
      .from('posts')
      .select('*, comments(*)')
      .order('created_at', { ascending: false });
    return { data: data as Post[], error };
  },

  async createPost(post: Post) {
    checkConnection();
    const { error } = await supabase.from('posts').insert([post]);
    return { error };
  },

  // FRIEND REQUESTS
  async getRequests(userId: string) {
    if (!isSupabaseConfigured) return { data: [], error: null };
    const { data, error } = await supabase
      .from('friend_requests')
      .select('*')
      .or(`fromUserId.eq.${userId},toUserId.eq.${userId}`);
    return { data: data as FriendRequest[], error };
  }
};
