
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, MessageCircle, History, User, Settings, LogOut, Menu, X } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, logout, currentUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "About", path: "/about", icon: <Settings size={18} /> },
    { name: "Contact", path: "/contact", icon: <MessageCircle size={18} /> },
  ];

  const authenticatedLinks = [
    { name: "Chatbot", path: "/chatbot", icon: <MessageCircle size={18} /> },
    { name: "Chat History", path: "/history", icon: <History size={18} /> },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center">
            <span className="font-bold text-xl text-background">E</span>
          </div>
          <div className="font-black text-xl">
            <span className="text-gradient">eSports</span>
            <span className="text-white">Manager</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all ${
                  isActive(link.path)
                    ? "text-accent bg-accent/10"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
            
            {isAuthenticated && 
              authenticatedLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all ${
                    isActive(link.path)
                      ? "text-accent bg-accent/10"
                      : "text-white/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))
            }
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="border-accent/30 bg-background/50 hover:bg-accent/20 hover:text-white"
                  >
                    <User size={18} className="mr-2" />
                    <span className="font-medium">{currentUser?.username || "User"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="neo-blur text-white">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/dashboard">
                    <DropdownMenuItem className="cursor-pointer">
                      <User size={16} className="mr-2" />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-400 hover:text-red-300"
                    onClick={() => logout()}
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  asChild 
                  className="border-accent/30 bg-background/50 hover:bg-accent/20 hover:text-white"
                >
                  <Link to="/?login=true">Login</Link>
                </Button>
                <Button asChild className="bg-accent hover:bg-accent/80 text-background">
                  <Link to="/?register=true">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="border-accent/30 bg-background/50 hover:bg-accent/20"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent className="neo-blur border-accent/20 text-white">
              <div className="flex flex-col space-y-6 pt-6">
                <div className="flex flex-col space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-all ${
                        isActive(link.path)
                          ? "text-accent bg-accent/10"
                          : "text-white/80 hover:text-white hover:bg-accent/5"
                      }`}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  ))}
                  
                  {isAuthenticated &&
                    authenticatedLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-all ${
                          isActive(link.path)
                            ? "text-accent bg-accent/10"
                            : "text-white/80 hover:text-white hover:bg-accent/5"
                        }`}
                      >
                        {link.icon}
                        <span>{link.name}</span>
                      </Link>
                    ))
                  }
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  {isAuthenticated ? (
                    <div className="flex flex-col space-y-2">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-md transition-all text-white/80 hover:text-white hover:bg-accent/5"
                      >
                        <User size={18} />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-3 py-2 rounded-md transition-all text-red-400 hover:text-red-300 hover:bg-red-400/10 text-left"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-center border-accent/30 bg-background/50"
                        asChild
                      >
                        <Link to="/?login=true">Login</Link>
                      </Button>
                      <Button 
                        className="w-full justify-center bg-accent text-background"
                        asChild
                      >
                        <Link to="/?register=true">Sign Up</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
