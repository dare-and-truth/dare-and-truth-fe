import { ChatRoom, Message, UserChat } from '@/app/types';


// Mock users with avatars
export const mockUsers: UserChat[] = [
  {
    displayName: 'john_doe',
    avatarURL: 'https://i.pravatar.cc/150?img=1',
  },
  {
    displayName: 'jane_smith',
    avatarURL: 'https://i.pravatar.cc/150?img=5',
  },
  {
    displayName: 'alex_wong',
    avatarURL: 'https://i.pravatar.cc/150?img=3',
  },
  {
    displayName: 'emily_chen',
    avatarURL: 'https://i.pravatar.cc/150?img=9',
  },
  {
    displayName: 'mike_johnson',
    avatarURL: 'https://i.pravatar.cc/150?img=4',
  },
  {
    displayName: 'sarah_parker',
    avatarURL: 'https://i.pravatar.cc/150?img=10',
  },
  {
    displayName: 'sarah_parker',
    avatarURL: 'https://i.pravatar.cc/150?img=10',
  },
  {
    displayName: 'sarah_parker',
    avatarURL: 'https://i.pravatar.cc/150?img=10',
  },
  {
    displayName: 'sarah_parker',
    avatarURL: 'https://i.pravatar.cc/150?img=10',
  },
  {
    displayName: 'sarah_parker',
    avatarURL: 'https://i.pravatar.cc/150?img=10',
  },
  {
    displayName: 'sarah_parker',
    avatarURL: 'https://i.pravatar.cc/150?img=10',
  },
  {
    displayName: 'sarah_parker',
    avatarURL: 'https://i.pravatar.cc/150?img=10',
  },
  
];

// Generate mock chat rooms
export const generateMockChatRooms = (currentUser: string): ChatRoom[] => {
  return mockUsers
    .filter((user) => user.displayName !== currentUser)
    .map((user, index) => ({
      id: `chat${index + 1}`,
      chatName: user.displayName,
      avatarURL: user.avatarURL,
      lastMessage: mockConversations[index % mockConversations.length][0].text,
      lastMessageTime: new Date(
        Date.now() - Math.random() * 86400000,
      ).toISOString(),
      [`${currentUser}NewMessage`]: index % 3 === 0, // Every third chat has a new message
    }));
};

// Mock conversations
export const mockConversations: Message[][] = [
  [
    {
      name: 'john_doe',
      text: 'Hey, how are you doing today?',
      timestamp: Date.now() - 3600000,
    },
    {
      name: 'current_user',
      text: "I'm good, thanks! Just working on a new project.",
      timestamp: Date.now() - 3500000,
    },
    {
      name: 'john_doe',
      text: 'That sounds interesting! What kind of project?',
      timestamp: Date.now() - 3400000,
    },
    {
      name: 'current_user',
      text: "It's a chat application, similar to Instagram's DM feature.",
      timestamp: Date.now() - 3300000,
    },
    {
      name: 'john_doe',
      text: "That's cool! Let me know if you need any help testing it.",
      timestamp: Date.now() - 3200000,
    },
    {
      name: 'current_user',
      text: "Thanks, I appreciate that! I'll definitely let you know when it's ready for testing.",
      timestamp: Date.now() - 3100000,
    },
    {
      name: 'john_doe',
      text: 'Great! Looking forward to seeing it. 👍',
      timestamp: Date.now() - 3000000,
    },
  ],
  [
    {
      name: 'jane_smith',
      text: 'Did you see the new photos I posted?',
      timestamp: Date.now() - 7200000,
    },
    {
      name: 'current_user',
      text: "Not yet, I'll check them out now!",
      timestamp: Date.now() - 7100000,
    },
    {
      name: 'jane_smith',
      text: 'Let me know what you think! I took them during my trip to Japan.',
      timestamp: Date.now() - 7000000,
    },
    {
      name: 'current_user',
      text: "Just saw them - they're amazing! The cherry blossoms look beautiful.",
      timestamp: Date.now() - 6900000,
    },
    {
      name: 'jane_smith',
      text: 'Thank you! It was such an incredible experience. 🌸',
      timestamp: Date.now() - 6800000,
    },
    {
      name: 'current_user',
      text: "I've always wanted to visit Japan during cherry blossom season.",
      timestamp: Date.now() - 6700000,
    },
    {
      name: 'jane_smith',
      text: "You should definitely go! It's worth it.",
      timestamp: Date.now() - 6600000,
    },
  ],
  [
    {
      name: 'alex_wong',
      text: 'Hey, are you coming to the meetup tomorrow?',
      timestamp: Date.now() - 172800000,
    },
    {
      name: 'current_user',
      text: "Yes, I'm planning to be there! What time does it start again?",
      timestamp: Date.now() - 172700000,
    },
    {
      name: 'alex_wong',
      text: 'It starts at 6 PM at the usual place.',
      timestamp: Date.now() - 172600000,
    },
    {
      name: 'current_user',
      text: 'Perfect, thanks! See you there.',
      timestamp: Date.now() - 172500000,
    },
    {
      name: 'alex_wong',
      text: "Great! I'm bringing a few new people who are interested in our project.",
      timestamp: Date.now() - 172400000,
    },
    {
      name: 'current_user',
      text: "That's awesome! Looking forward to meeting them.",
      timestamp: Date.now() - 172300000,
    },
  ],
  [
    {
      name: 'emily_chen',
      text: 'Hi! I wanted to ask you about the design resources you mentioned.',
      timestamp: Date.now() - 259200000,
    },
    {
      name: 'current_user',
      text: 'Of course! What specifically would you like to know?',
      timestamp: Date.now() - 259100000,
    },
    {
      name: 'emily_chen',
      text: 'Do you have any recommendations for UI kits for mobile apps?',
      timestamp: Date.now() - 259000000,
    },
    {
      name: 'current_user',
      text: "Yes! I've been using this great kit from UI8 - I'll send you the link.",
      timestamp: Date.now() - 258900000,
    },
    {
      name: 'emily_chen',
      text: 'That would be perfect, thank you so much!',
      timestamp: Date.now() - 258800000,
    },
    {
      name: 'current_user',
      text: 'Here you go: https://ui8.net/products/mobile-ui-kit. Let me know if you need anything else!',
      timestamp: Date.now() - 258700000,
    },
    {
      name: 'emily_chen',
      text: 'This looks amazing! Thanks again for your help. 😊',
      timestamp: Date.now() - 258600000,
    },
  ],
  [
    {
      name: 'mike_johnson',
      text: "Hey, do you have the notes from yesterday's meeting?",
      timestamp: Date.now() - 432000000,
    },
    {
      name: 'current_user',
      text: 'Yes, I do! Would you like me to send them to you?',
      timestamp: Date.now() - 431900000,
    },
    {
      name: 'mike_johnson',
      text: 'That would be great, thanks!',
      timestamp: Date.now() - 431800000,
    },
    {
      name: 'current_user',
      text: 'Just sent them to your email. Let me know if you received them.',
      timestamp: Date.now() - 431700000,
    },
    {
      name: 'mike_johnson',
      text: 'Got them, thank you! This is really helpful.',
      timestamp: Date.now() - 431600000,
    },
    {
      name: 'current_user',
      text: 'No problem! Happy to help.',
      timestamp: Date.now() - 431500000,
    },
  ],
  [
    {
      name: 'sarah_parker',
      text: 'Hi there! I saw your comment on my post. Thanks for the feedback!',
      timestamp: Date.now() - 518400000,
    },
    {
      name: 'current_user',
      text: "You're welcome! I really enjoyed your article.",
      timestamp: Date.now() - 518300000,
    },
    {
      name: 'sarah_parker',
      text: "I'm glad to hear that! I'm working on a follow-up piece now.",
      timestamp: Date.now() - 518200000,
    },
    {
      name: 'current_user',
      text: "That's exciting! What will it be about?",
      timestamp: Date.now() - 518100000,
    },
    {
      name: 'sarah_parker',
      text: "It's going to dive deeper into the technical aspects we only touched on in the first article.",
      timestamp: Date.now() - 518000000,
    },
    {
      name: 'current_user',
      text: "Sounds interesting! I'm looking forward to reading it.",
      timestamp: Date.now() - 517900000,
    },
    {
      name: 'sarah_parker',
      text: "I'll make sure to let you know when it's published! 📝",
      timestamp: Date.now() - 517800000,
    },
  ],
];

// Generate mock messages for a specific chat room
export const generateMockMessages = (
  chatRoomId: string,
  currentUser: string,
): Message[] => {
  const chatIndex = Number.parseInt(chatRoomId.replace('chat', '')) - 1;
  const conversation = mockConversations[chatIndex % mockConversations.length];

  return conversation.map((message) => ({
    ...message,
    name: message.name === 'current_user' ? currentUser : message.name,
  }));
};

// Format timestamp to readable time
export const formatMessageTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays === 0) {
    // Today - show time
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInDays === 1) {
    // Yesterday
    return 'Yesterday';
  } else if (diffInDays < 7) {
    // Within a week - show day name
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    // Older - show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

// Search for users
export const searchUsers = (query: string, currentUser: string): UserChat[] => {
  if (!query.trim()) return [];

  return mockUsers.filter(
    (user) =>
      user.displayName !== currentUser &&
      user.displayName.toLowerCase().includes(query.toLowerCase()),
  );
};
