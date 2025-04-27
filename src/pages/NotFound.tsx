
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-6 inline-block">
          <div className="h-40 w-40 rounded-full bg-accent/10 flex items-center justify-center mx-auto animate-pulse">
            <span className="text-7xl font-black text-gradient">404</span>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-xl text-white/70 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Button asChild className="bg-accent hover:bg-accent/80 text-background">
          <Link to="/">
            <Home size={18} className="mr-2" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
