
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

export function ApiSettings() {
  const [newApiKey, setNewApiKey] = useState("");
  const { toast } = useToast();

  const updateApiKey = async () => {
    try {
      const { error } = await supabase.functions.invoke("update-api-key", {
        body: { apiKey: newApiKey }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "API key updated successfully",
      });
      setNewApiKey("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update API key",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
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
          <div className="flex flex-col gap-2">
            <label htmlFor="apiKey">OpenAI API Key</label>
            <Input
              id="apiKey"
              type="password"
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
              placeholder="Enter your OpenAI API key"
            />
          </div>
          <Button onClick={updateApiKey} className="w-full">
            Update API Key
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
