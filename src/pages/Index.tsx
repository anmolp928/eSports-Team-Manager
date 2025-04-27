
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import AuthForms from "../components/AuthForms";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated && window.location.search.includes("login=true")) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <Navbar />
      <AuthForms />
      
      <main className="pt-20 min-h-screen">
        <section className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
          <div className="animate-float mb-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center animate-pulse-glow">
              <MessageCircle size={60} className="text-background" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            <span className="text-gradient">eSports</span> Team Manager
            <span className="text-accent">.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10">
            Your AI-powered assistant for professional eSports team management.
            Get real-time advice on training schedules, roster decisions, and tournament preparation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/80 text-background"
              onClick={() => navigate(isAuthenticated ? "/chatbot" : "/?login=true")}
            >
              Start Chatting <ArrowRight className="ml-2" size={18} />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-accent/30 hover:bg-accent/10"
              onClick={() => navigate("/about")}
            >
              Learn More
            </Button>
          </div>
        </section>
        
        <section className="py-16 bg-gradient-to-b from-transparent to-accent/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Features to <span className="text-gradient">Elevate</span> Your Team
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Team Management",
                  description: "Get AI-powered advice on roster decisions, practice schedules, and team dynamics."
                },
                {
                  title: "Tournament Prep",
                  description: "Strategic guidance for upcoming tournaments, opponent analysis, and performance optimization."
                },
                {
                  title: "Performance Analysis",
                  description: "Track your team's progress and receive actionable insights to improve results."
                }
              ].map((feature, index) => (
                <div key={index} className="glass-morphism p-6 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-accent">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 border-t border-white/10">
        <div className="container mx-auto px-4 text-center text-white/60 text-sm">
          <p>&copy; {new Date().getFullYear()} eSports Team Manager. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Index;
