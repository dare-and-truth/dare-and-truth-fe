'use client';

import { ChatRoom, Message, UserChat } from '@/app/types';
import { generateMockChatRooms, generateMockMessages, searchUsers } from "@/lib/mock-data";
import { create } from 'zustand';



interface ChatState {
  chatRooms: ChatRoom[];
  messages: Record<string, Message[]>;
  loading: boolean;
  fetchChatRooms: (username: string) => Promise<void>;
  fetchMessages: (chatRoomId: string, username: string) => Promise<void>;
  sendMessage: (params: {
    chatRoomId: string;
    text: string;
    name: string;
    username: string;
  }) => Promise<void>;
  resetNewMessage: (username: string, chatRoomId: string) => Promise<void>;
  createChatRoom: (
    userData: UserChat,
    currentUserChatname: string,
  ) => Promise<void>;
  checkChatRoomExists: (
    username: string,
    currentUsername: string,
  ) => Promise<{ exists: boolean; user?: UserChat }>;
  chatRoomDetails: (chatRoomId: string) => ChatRoom | undefined;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chatRooms: [],
  messages: {},
  loading: true,

  fetchChatRooms: async (username: string) => {
    set({ loading: true });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const chatRooms = generateMockChatRooms(username);
    set({ chatRooms, loading: false });
  },

  fetchMessages: async (chatRoomId: string, username: string) => {
    // Check if we already have messages for this chat room
    if (get().messages[chatRoomId]?.length > 0) return;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const messages = generateMockMessages(chatRoomId, username);

    set((state) => ({
      messages: {
        ...state.messages,
        [chatRoomId]: messages,
      },
    }));
  },

  sendMessage: async ({ chatRoomId, text, name, username }) => {
    const newMessage: Message = {
      name,
      text,
      timestamp: Date.now(),
    };

    // Update messages
    set((state) => ({
      messages: {
        ...state.messages,
        [chatRoomId]: [...(state.messages[chatRoomId] || []), newMessage],
      },
    }));

    // Simulate a response after a delay (for demo purposes)
    setTimeout(
      () => {
        const responseMessage: Message = {
          name: username,
          text: getRandomResponse(),
          timestamp: Date.now(),
        };

        set((state) => ({
          messages: {
            ...state.messages,
            [chatRoomId]: [
              ...(state.messages[chatRoomId] || []),
              responseMessage,
            ],
          },
        }));
      },
      2000 + Math.random() * 3000,
    ); // Random delay between 2-5 seconds
  },

  resetNewMessage: async (username: string, chatRoomId: string) => {
    set((state) => ({
      chatRooms: state.chatRooms.map((room) =>
        room.id === chatRoomId
          ? { ...room, [`${username}NewMessage`]: false }
          : room,
      ),
    }));
  },

  createChatRoom: async (userData, currentUsername) => {
    // Check if chat room already exists
    const existingRoom = get().chatRooms.find(
      (room) => room.chatName === userData.displayName,
    );
    if (existingRoom) return;

    // Create new chat room
    const newChatRoom: ChatRoom = {
      id: `chat${get().chatRooms.length + 1}`,
      chatName: userData.displayName,
      avatarURL: userData.avatarURL,
      lastMessage: 'Say hello!',
      lastMessageTime: new Date().toISOString(),
      [`${currentUsername}NewMessage`]: false,
    };

    set((state) => ({
      chatRooms: [newChatRoom, ...state.chatRooms],
      messages: {
        ...state.messages,
        [newChatRoom.id]: [],
      },
    }));
  },

  checkChatRoomExists: async (username: string, currentUsername: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Check if chat room already exists
    const exists = get().chatRooms.some(
      (room) => room.chatName.toLowerCase() === username.toLowerCase(),
    );

    // Find user
    const users = searchUsers(username, currentUsername);
    const user = users.length > 0 ? users[0] : null;

    return { exists, user };
  },

  chatRoomDetails: (chatRoomId: string) => {
    return get().chatRooms.find((room) => room.id === chatRoomId);
  },
}));

// Random responses for demo
const randomResponses = [
  "That's interesting!",
  'Thanks for letting me know.',
  "I'll get back to you on that.",
  'Sounds good!',
  'I appreciate your message.',
  "Let's talk more about this later.",
  'Great to hear from you!',
  'I was just thinking about that.',
  'That makes sense.',
  'I agree with you.',
  'What do you think we should do next?',
  "I'm not sure I understand. Can you explain?",
  "That's a great idea!",
  "I'll be available tomorrow if you want to discuss this further.",
  'Thanks for sharing that with me.',
  "I've been meaning to tell you about that.",
  'Let me check and get back to you.',
  "I'm looking forward to it!",
  "That's exactly what I needed to know.",
  "How's your day going so far?",
];

function getRandomResponse(): string {
  return randomResponses[Math.floor(Math.random() * randomResponses.length)];
}
