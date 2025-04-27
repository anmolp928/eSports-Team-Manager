
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuthForms = () => {
  const [searchParams] = useSearchParams();
  const showLogin = searchParams.get("login") === "true";
  const showRegister = searchParams.get("register") === "true";
  const defaultTab = showRegister ? "register" : "login";

  const { login, register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    regNumber: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    regNumber: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.regNumber || !loginData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const success = login(loginData.regNumber, loginData.password);
    
    if (success) {
      toast({
        title: "Success",
        description: "You have successfully logged in.",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Error",
        description: "Invalid registration number or password. For demo, use 12306740 and any password.",
        variant: "destructive",
      });
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.regNumber || !registerData.username || !registerData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    const success = register(registerData.regNumber, registerData.username, registerData.password);
    
    if (success) {
      toast({
        title: "Success",
        description: "Account created successfully. You are now logged in.",
      });
      navigate("/dashboard");
    }
  };

  if (!showLogin && !showRegister) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-md">
      <Card className="w-full max-w-md neo-blur border-accent/20">
        <Tabs defaultValue={defaultTab} className="w-full">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-2 bg-white/5">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <CardDescription className="text-white/70 pt-4">
              Enter your credentials to access your account or create a new one
            </CardDescription>
          </CardHeader>
          
          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="regNumber">Registration Number</Label>
                  <Input 
                    id="regNumber" 
                    type="text" 
                    placeholder="e.g. 12306740" 
                    className="bg-white/5 border-white/10 text-white"
                    value={loginData.regNumber}
                    onChange={(e) => setLoginData({ ...loginData, regNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    className="bg-white/5 border-white/10 text-white"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  type="button"
                  className="border-accent/30 hover:bg-background/50"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-accent hover:bg-accent/80 text-background">
                  Login
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="regNumber">Registration Number</Label>
                  <Input 
                    id="regNumber" 
                    type="text" 
                    placeholder="e.g. 12306740" 
                    className="bg-white/5 border-white/10 text-white"
                    value={registerData.regNumber}
                    onChange={(e) => setRegisterData({ ...registerData, regNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    type="text" 
                    className="bg-white/5 border-white/10 text-white"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    className="bg-white/5 border-white/10 text-white"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    className="bg-white/5 border-white/10 text-white"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  type="button"
                  className="border-accent/30 hover:bg-background/50"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-accent hover:bg-accent/80 text-background">
                  Register
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AuthForms;
