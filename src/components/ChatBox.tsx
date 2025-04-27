import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";
import { MessageCircle, Send } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBoxProps {
  onSaveChat?: (messages: Message[]) => void;
}

const ChatBox = ({ onSaveChat }: ChatBoxProps) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          content: `Hello ${currentUser?.username || "Manager"}! I'm your eSports team management assistant. How can I help you today?`,
          sender: "bot",
          timestamp: new Date()
        }
      ]);
    }
  }, [currentUser?.username]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input.trim(),
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    try {
      setTimeout(() => {
        const botResponse = generateBotResponse(input.trim());
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          content: botResponse,
          sender: "bot",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        
        if (onSaveChat) {
          onSaveChat([...messages, userMessage, botMessage]);
        }
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      setIsTyping(false);
    }
  };

  const generateBotResponse = (userInput: string): string => {
    const userInputLower = userInput.toLowerCase();
    
    if (userInputLower.includes("roster") || userInputLower.includes("team composition")) {
      return "Managing your roster effectively is crucial. Consider player roles, communication styles, and ensure you have substitutes ready. Would you like specific advice on roster construction for a particular game?";
    }
    
    if (userInputLower.includes("practice") || userInputLower.includes("training")) {
      return "Effective practice schedules are key to team success. I recommend structured sessions with clear goals, regular VOD reviews, and a balance between team play and individual skill development. How many hours is your team currently practicing?";
    }
    
    if (userInputLower.includes("tournament") || userInputLower.includes("competition")) {
      return "Tournament preparation requires both tactical and mental readiness. Make sure to research your opponents, prepare multiple strategies, and establish a healthy pre-match routine for your players. Which tournament are you preparing for?";
    }
    
    if (userInputLower.includes("scout") || userInputLower.includes("recruit")) {
      return "When scouting new talent, look beyond just skill metrics. Consider communication style, adaptability, mental fortitude, and team chemistry. Would you like me to suggest some scouting techniques for your specific game?";
    }
    
    if (userInputLower.includes("conflict") || userInputLower.includes("team dynamic")) {
      return "Team conflicts need addressing promptly but carefully. Create a safe environment for open dialogue, focus on specific behaviors rather than personalities, and work toward actionable solutions. Would you like specific conflict resolution strategies?";
    }
    
    if (userInputLower.includes("schedule") || userInputLower.includes("planning")) {
      return "Balancing practice, competitions, content creation, and rest is challenging. I recommend using a shared calendar system, planning at least a month ahead, and ensuring your players have dedicated rest periods to prevent burnout.";
    }
    
    if (userInputLower.includes("sponsorship") || userInputLower.includes("funding")) {
      return "Attracting sponsors requires demonstrating value beyond just competitive results. Build a strong social media presence, engage with your community, and prepare professional sponsorship decks with clear ROI metrics for potential partners.";
    }
    
    if (userInputLower.includes("meta") || userInputLower.includes("patch") || userInputLower.includes("update")) {
      return "Staying ahead of game changes is essential. Designate someone on your staff to track patch notes, have strategies ready for various metas, and practice flexibility in your team's approach to the game.";
    }
    
    if (userInputLower.includes("mental health") || userInputLower.includes("burnout")) {
      return "Player wellbeing should be a top priority. Implement regular check-ins, consider working with a sports psychologist, and create clear boundaries between game time and personal time for your team members.";
    }
    
    if (userInputLower.includes("hello") || userInputLower.includes("hi ")) {
      return `Hello! I'm your eSports team management assistant. I can help with roster decisions, practice schedules, tournament preparation, and more. What aspect of team management are you focusing on today?`;
    }
    
    if (userInputLower.includes("weather") || 
        userInputLower.includes("politics") || 
        userInputLower.includes("movie") || 
        userInputLower.includes("music")) {
      return "I'm specifically designed to help with eSports team management. Can I assist you with something related to managing your team, like practice schedules, roster decisions, or tournament preparation?";
    }
    
    return "As your eSports team management assistant, I can help with strategies for team development, scheduling, conflict resolution, and performance optimization. Could you provide more details about your specific management question?";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === "user"
                  ? "bg-accent text-background"
                  : "glass-morphism text-white"
              }`}
            >
              <div className="text-sm font-medium">
                {message.sender === "user" ? currentUser?.username || "You" : "Assistant"}
              </div>
              <div className="mt-1 whitespace-pre-wrap">{message.content}</div>
              <div className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] glass-morphism text-white rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="text-sm font-medium">Assistant</div>
                <div className="flex space-x-1">
                  <span className="animate-pulse">•</span>
                  <span className="animate-pulse delay-100">•</span>
                  <span className="animate-pulse delay-200">•</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-white/10 p-4">
        <div className="flex space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about team management, strategies, scheduling..."
            className="min-h-[80px] bg-white/5 border-white/10 resize-none"
          />
          <Button 
            onClick={handleSendMessage} 
            className="bg-accent hover:bg-accent/80 text-background self-end"
            disabled={isTyping || !input.trim()}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
