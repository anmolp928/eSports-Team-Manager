
import { useState } from "react";
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
  const { toast } = useToast();

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

      toast({
        title: "Success",
        description: "API key updated successfully",
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
        description: "Failed to update API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
          <div className="text-xs text-gray-500 text-center">
            Don't have an OpenAI API key? <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-accent underline">Get one here</a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
