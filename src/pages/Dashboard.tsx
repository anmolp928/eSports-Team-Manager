
import { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast/use-toast";
import { User, Edit, Save, X } from "lucide-react";

const Dashboard = () => {
  const { currentUser, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(currentUser?.username || "");

  const handleUpdateProfile = () => {
    if (username.trim()) {
      updateUser(username);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } else {
      toast({
        title: "Error",
        description: "Username cannot be empty",
        variant: "destructive",
      });
    }
  };

  const cancelEdit = () => {
    setUsername(currentUser?.username || "");
    setIsEditing(false);
  };

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">
              <span className="text-gradient">Profile</span> Dashboard
            </h1>
            
            <div className="glass-morphism rounded-lg p-6 mb-8">
              <div className="flex items-center gap-6 mb-6">
                <div className="h-24 w-24 rounded-full bg-accent/20 flex items-center justify-center">
                  <User size={48} className="text-accent" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold">{currentUser?.username || "User"}</h2>
                  <p className="text-white/70">Registration: {currentUser?.regNumber || "N/A"}</p>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  Profile Information
                  {!isEditing && (
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="ml-2 h-6 w-6 border-accent/30"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit size={14} />
                    </Button>
                  )}
                </h3>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        variant="outline"
                        onClick={cancelEdit}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        <X size={16} className="mr-1" /> Cancel
                      </Button>
                      <Button onClick={handleUpdateProfile} className="bg-accent hover:bg-accent/80 text-background">
                        <Save size={16} className="mr-1" /> Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-white/50">Username</p>
                        <p>{currentUser?.username || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-white/50">Registration Number</p>
                        <p>{currentUser?.regNumber || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="glass-morphism rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Chatbot Statistics</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: "Total Conversations", value: "5" },
                  { label: "Questions Asked", value: "23" },
                  { label: "Last Conversation", value: "Today" },
                ].map((stat, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <p className="text-sm text-white/50">{stat.label}</p>
                    <p className="text-2xl font-bold text-accent">{stat.value}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <Button 
                  variant="outline"
                  className="border-accent/30 hover:bg-accent/10"
                  onClick={() => window.location.href = "/history"}
                >
                  View Chat History
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
