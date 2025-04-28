
import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ApiSettings() {
  const [newApiKey, setNewApiKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [useLocalStorage, setUseLocalStorage] = useState(false);
  const { toast } = useToast();

  // Check if we have a locally stored API key
  useEffect(() => {
    const localApiKey = localStorage.getItem("openai_api_key");
    if (localApiKey) {
      setUseLocalStorage(true);
    }
  }, []);

  const updateApiKey = async () => {
    if (!newApiKey.trim()) {
      toast({
        title: "Error",
        description: "API key cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("update-api-key", {
        body: { apiKey: newApiKey }
      });

      if (error) {
        console.error("Supabase functions error:", error);
        throw new Error(error.message);
      }
      
      if (data?.error) {
        console.error("API error:", data.error);
        throw new Error(data.error);
      }

      // If the API key was stored locally (fallback method)
      if (data?.storageMethod === 'local') {
        localStorage.setItem("openai_api_key", newApiKey);
        setUseLocalStorage(true);
      }

      toast({
        title: "Success",
        description: data?.message || "API key updated successfully",
      });
      
      setNewApiKey("");
      setDialogOpen(false);
      
      // Refresh the page to ensure the new key is used
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error updating API key:", error);
      toast({
        title: "Error",
        description: "Failed to update API key. Using local storage as fallback.",
        variant: "destructive",
      });
      
      // Fallback to localStorage if Supabase function fails
      localStorage.setItem("openai_api_key", newApiKey);
      setUseLocalStorage(true);
      
      setNewApiKey("");
      setDialogOpen(false);
      
      // Refresh the page to ensure the new key is used
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeApiKey = () => {
    if (useLocalStorage) {
      localStorage.removeItem("openai_api_key");
      setUseLocalStorage(false);
      toast({
        title: "Success",
        description: "API key removed successfully",
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">API Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Alert>
            <AlertDescription>
              Enter your OpenAI API key to use the chatbot. If you don't have an API key, you can still use the chatbot in demo mode with simulated responses.
            </AlertDescription>
          </Alert>
          
          {useLocalStorage && (
            <Alert className="bg-accent/10 border-accent">
              <AlertDescription>
                You currently have an API key stored in your browser. This key will only work on this device and browser.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col gap-2">
            <label htmlFor="apiKey">OpenAI API Key</label>
            <Input
              id="apiKey"
              type="password"
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
              placeholder="Enter your OpenAI API key (sk-...)"
            />
          </div>
          
          <Button 
            onClick={updateApiKey} 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update API Key"}
          </Button>
          
          {useLocalStorage && (
            <Button 
              onClick={removeApiKey} 
              variant="outline"
              className="w-full border-destructive/30 hover:bg-destructive/10 text-destructive"
            >
              Remove API Key
            </Button>
          )}
          
          <div className="text-xs text-gray-500 text-center">
            Don't have an OpenAI API key? <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-accent underline">Get one here</a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
