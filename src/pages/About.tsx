
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const About = () => {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-8">
              About <span className="text-gradient">eSports Team Manager</span>
            </h1>
            
            <p className="text-xl text-white/80 mb-8">
              Your AI assistant designed specifically for professional eSports team management.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto mt-16">
            <div className="glass-morphism rounded-lg p-8 mb-12">
              <h2 className="text-2xl font-semibold mb-6">Our Mission</h2>
              
              <p className="text-lg text-white/80 mb-6">
                eSports Team Manager provides specialized AI assistance to help team managers make better decisions,
                optimize performance, and navigate the complex world of professional eSports.
              </p>
              
              <p className="text-lg text-white/80">
                We understand the unique challenges of managing eSports teams - from roster decisions and
                practice schedules to tournament preparation and player development.
                Our AI assistant is here to provide expert guidance every step of the way.
              </p>
            </div>
            
            <div className="glass-morphism rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">What We Offer</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2 text-accent">Strategic Guidance</h3>
                    <p className="text-white/80">
                      Get advice on team composition, meta adaptation, and opponent analysis.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2 text-accent">Team Management</h3>
                    <p className="text-white/80">
                      Optimize practice schedules, manage player development, and handle team dynamics.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2 text-accent">Tournament Preparation</h3>
                    <p className="text-white/80">
                      Develop game plans, analyze performance data, and prepare for competitive events.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-2 text-accent">Player Development</h3>
                    <p className="text-white/80">
                      Create personalized improvement plans and track progress over time.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2 text-accent">Mental Health Support</h3>
                    <p className="text-white/80">
                      Resources and strategies to promote player wellbeing and prevent burnout.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2 text-accent">Business Growth</h3>
                    <p className="text-white/80">
                      Advice on sponsorship acquisition, branding, and fan engagement.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Button 
                  className="bg-accent hover:bg-accent/80 text-background"
                  onClick={() => window.location.href = "/chatbot"}
                >
                  Try It Now <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
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

export default About;
