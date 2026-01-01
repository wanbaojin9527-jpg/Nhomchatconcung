
import { User, Chat } from './types';

// Hệ thống bắt đầu trống rỗng.
// Connect AI đã bị loại bỏ theo yêu cầu.

export const CURRENT_USER: User = {
  id: 'default-user',
  name: 'Người dùng',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
  status: 'online',
  phoneNumber: '0000000000'
};

export const DUMMY_CHATS: Chat[] = [];
