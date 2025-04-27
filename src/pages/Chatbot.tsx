
import { useState } from "react";
import Navbar from "../components/Navbar";
import ChatBox from "../components/ChatBox";
import { saveChat } from "../services/chatService";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot = () => {
  const { toast } = useToast();

  const handleSaveChat = (messages: Message[]) => {
    if (messages.length > 2) { // Only save meaningful conversations
      const chatId = saveChat(messages);
      console.log("Chat saved with ID:", chatId);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-4 flex-1 flex flex-col">
          <div className="glass-morphism rounded-lg overflow-hidden flex-1 flex flex-col">
            <div className="border-b border-white/10 p-4">
              <h1 className="text-xl font-bold">
                <span className="text-gradient">eSports</span> Team Manager Assistant
              </h1>
              <p className="text-sm text-white/70">
                Ask for advice on team management, strategies, training, and more
              </p>
            </div>
            
            <div className="flex-1 flex flex-col">
              <ChatBox onSaveChat={handleSaveChat} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Chatbot;
