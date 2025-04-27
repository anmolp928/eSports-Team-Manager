
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getChatHistory, deleteChat } from "../services/chatService";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { History, Trash2, MessageCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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

const ChatHistory = () => {
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Load chat history when component mounts
    const history = getChatHistory();
    setChatHistory(history);
  }, []);

  const handleDeleteChat = (chatId: string) => {
    const success = deleteChat(chatId);
    if (success) {
      if (selectedChat?.id === chatId) {
        setSelectedChat(null);
      }
      setChatHistory(getChatHistory());
      toast({
        title: "Success",
        description: "Chat deleted successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete chat",
        variant: "destructive",
      });
    }
  };

  const filteredChats = chatHistory.filter(chat => 
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.messages.some(msg => msg.content.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">
            <span className="text-gradient">Chat</span> History
          </h1>
          
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
              <Input
                placeholder="Search conversations..."
                className="pl-10 bg-white/5 border-white/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 glass-morphism rounded-lg overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <History size={18} className="text-accent" />
                  <h2 className="text-lg font-semibold">Previous Conversations</h2>
                </div>
              </div>
              
              <div className="h-[600px] overflow-y-auto">
                {filteredChats.length > 0 ? (
                  filteredChats.map(chat => (
                    <div 
                      key={chat.id} 
                      className={`p-4 border-b border-white/10 cursor-pointer ${
                        selectedChat?.id === chat.id ? "bg-accent/20" : "hover:bg-white/5"
                      }`}
                      onClick={() => setSelectedChat(chat)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium truncate">{chat.title}</h3>
                          <p className="text-sm text-white/50">
                            {new Date(chat.createdAt).toLocaleDateString()}, {new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="text-sm text-white/70 truncate mt-1">
                            {chat.messages[0]?.content}
                          </p>
                        </div>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-white/50 hover:text-red-400 hover:bg-red-400/10"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="neo-blur border-white/10">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Chat</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this conversation? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-transparent border-white/10 hover:bg-white/10">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600 text-white"
                                onClick={() => handleDeleteChat(chat.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-white/50">
                    {searchTerm ? (
                      <>
                        <Search size={40} className="mx-auto mb-4 opacity-50" />
                        <p>No conversations match your search</p>
                      </>
                    ) : (
                      <>
                        <MessageCircle size={40} className="mx-auto mb-4 opacity-50" />
                        <p>No conversation history found</p>
                        <p className="text-sm mt-2">Start chatting to see your history here</p>
                        <Button 
                          className="mt-4 bg-accent hover:bg-accent/80 text-background"
                          onClick={() => window.location.href = "/chatbot"}
                        >
                          Start a conversation
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="col-span-2 glass-morphism rounded-lg overflow-hidden">
              {selectedChat ? (
                <div className="h-[600px] flex flex-col">
                  <div className="p-4 border-b border-white/10">
                    <h2 className="text-lg font-semibold">{selectedChat.title}</h2>
                    <p className="text-sm text-white/50">
                      {new Date(selectedChat.createdAt).toLocaleDateString()}, {new Date(selectedChat.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedChat.messages.map((message, index) => (
                      <div
                        key={`${message.id}-${index}`}
                        className={`flex ${
                          message.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === "user"
                              ? "bg-accent text-background"
                              : "bg-white/10 text-white"
                          }`}
                        >
                          <div className="text-sm font-medium">
                            {message.sender === "user" ? "You" : "Assistant"}
                          </div>
                          <div className="mt-1 whitespace-pre-wrap">{message.content}</div>
                          <div className="text-xs mt-1 opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t border-white/10">
                    <Button 
                      onClick={() => window.location.href = "/chatbot"}
                      className="bg-accent hover:bg-accent/80 text-background"
                    >
                      Continue this conversation
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-[600px] flex items-center justify-center">
                  <div className="text-center text-white/50">
                    <MessageCircle size={60} className="mx-auto mb-4 opacity-30" />
                    <p className="text-xl">Select a conversation</p>
                    <p className="text-sm mt-2">Choose from your previous chats to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ChatHistory;
