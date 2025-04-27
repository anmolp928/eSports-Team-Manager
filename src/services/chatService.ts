
// This would typically connect to an actual API service
// For demo purposes, we're using localStorage

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export const saveChat = (messages: Message[]): string => {
  const existingChats = getChatHistory();
  
  // Extract a title from the first user message
  const firstUserMessage = messages.find(msg => msg.sender === 'user');
  let title = firstUserMessage 
    ? firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '')
    : 'New conversation';
  
  const chatId = `chat-${Date.now()}`;
  const newChat: ChatSession = {
    id: chatId,
    title,
    messages,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  existingChats.push(newChat);
  localStorage.setItem('chatHistory', JSON.stringify(existingChats));
  
  return chatId;
};

export const getChatHistory = (): ChatSession[] => {
  const history = localStorage.getItem('chatHistory');
  if (!history) return [];
  
  // Parse the JSON and convert string dates back to Date objects
  const parsed = JSON.parse(history);
  return parsed.map((chat: any) => ({
    ...chat,
    createdAt: new Date(chat.createdAt),
    updatedAt: new Date(chat.updatedAt),
    messages: chat.messages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }))
  }));
};

export const getChatById = (id: string): ChatSession | undefined => {
  const history = getChatHistory();
  return history.find(chat => chat.id === id);
};

export const deleteChat = (id: string): boolean => {
  const history = getChatHistory();
  const updatedHistory = history.filter(chat => chat.id !== id);
  
  if (updatedHistory.length === history.length) {
    return false; // Nothing was deleted
  }
  
  localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
  return true;
};
