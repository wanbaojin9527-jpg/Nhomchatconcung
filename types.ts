
export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  bio?: string;
}

export interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  profiles?: Profile; // Joined data
}

export interface Group {
  id: string;
  name: string;
  avatar_url?: string;
  created_by: string;
  created_at: string;
}

export interface GroupMessage {
  id: number;
  group_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  profiles?: Profile;
}

export interface Post {
  id: number;
  user_id: string;
  content: string;
  image_url?: string;
  created_at: string;
  profiles?: Profile;
}

export interface Wallet {
  user_id: string;
  balance: number;
}

export interface Transaction {
  id: number;
  amount: number;
  type: 'topup' | 'withdraw' | 'transfer';
  description: string;
  created_at: string;
}
