
export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  phoneNumber: string;
  password?: string;
  bio?: string;
}

export interface Reaction {
  emoji: string;
  userId: string;
}

export interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text?: string;
  imageUrl?: string;
  audioUrl?: string;
  location?: LocationData;
  stickerUrl?: string;
  fileUrl?: string; 
  fileName?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  replyToId?: string;
  replyToText?: string;
  replyToSenderName?: string;
  reactions?: Reaction[];
  isPinned?: boolean;
  isRecalled?: boolean; 
  isEdited?: boolean; 
}

export interface Chat {
  id: string;
  type: 'individual' | 'group' | 'cloud';
  participants: string[];
  ownerId?: string;
  name?: string;
  avatar?: string;
  messages: Message[];
  lastTimestamp: string;
  pinnedMessageId?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  likes?: number;
  likedBy?: string[]; // Danh sách ID những người đã thả tim bình luận
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  imageUrl?: string;
  timestamp: string;
  likes: number;
  likedBy: string[]; 
  comments: Comment[];
}

export interface AppNotification {
  id: string;
  userId: string;
  type: 'new_post' | 'friend_accepted' | 'like' | 'comment';
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  relatedId?: string;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
}
