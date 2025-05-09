import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";
import { MessageCircle, Send, AlertCircle } from "lucide-react";
import { supabase } from "../integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [apiError, setApiError] = useState<{message: string, type: string} | null>(null);
  const [demoModeActive, setDemoModeActive] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [localApiKey, setLocalApiKey] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('openai_api_key');
    if (storedApiKey) {
      setLocalApiKey(storedApiKey);
    }
    
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
  }, [currentUser?.username, messages.length]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    setApiError(null);
    
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
      const payload: any = { content: input.trim() };
      if (localApiKey) {
        payload.clientApiKey = localApiKey;
      }
      
      const { data, error } = await supabase.functions.invoke('chat', {
        body: payload
      });

      if (error) {
        console.error("Supabase functions error:", error);
        throw new Error(error.message);
      }
      
      if (data.error) {
        console.error("API error:", data.error);
        setApiError({
          message: data.error,
          type: data.errorType || 'UNKNOWN'
        });
        
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      if (data.response && data.response.includes("This is a demo response")) {
        setDemoModeActive(true);
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: data.response,
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      if (onSaveChat) {
        onSaveChat([...messages, userMessage, botMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {demoModeActive && (
        <Alert variant="default" className="mb-4 bg-accent/20 border-accent">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <span className="font-medium">Demo Mode Active</span>: This is using simulated responses. For full AI functionality, add your OpenAI API key in settings.
          </AlertDescription>
        </Alert>
      )}
      
      {localApiKey && (
        <Alert variant="default" className="mb-4 bg-green-500/20 border-green-500">
          <AlertCircle className="h-4 w-4 text-green-500" />
          <AlertDescription>
            <span className="font-medium">Using Local API Key</span>: Your API key is stored in this browser.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {apiError && apiError.type === 'QUOTA_EXCEEDED' && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              API quota exceeded. Please check your OpenAI account billing or update your API key in settings.
            </AlertDescription>
          </Alert>
        )}
        
        {apiError && apiError.type === 'INVALID_API_KEY' && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              The API key appears to be invalid. Please update your API key in settings.
            </AlertDescription>
          </Alert>
        )}
        
        {apiError && apiError.type === 'NO_API_KEY' && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No API key found. Please add your OpenAI API key in settings before using the chatbot.
            </AlertDescription>
          </Alert>
        )}
        
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
        
        <div className="mt-2 text-xs text-gray-400 flex justify-between">
          <span>Press Enter to send, Shift+Enter for new line</span>
          {demoModeActive && (
            <span className="text-accent">Using demo mode</span>
          )}
          {localApiKey && (
            <span className="text-green-500">Using local API key</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
