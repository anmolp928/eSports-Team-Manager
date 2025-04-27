
import { useState } from "react";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast/use-toast";
import { Send } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thank you for reaching out! We'll get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-center">
              <span className="text-gradient">Contact</span> Us
            </h1>
            <p className="text-center text-white/70 mb-12">
              Have questions? We're here to help!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-morphism rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input 
                      id="name" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your email address"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea 
                      id="message" 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message"
                      rows={5}
                      className="bg-white/5 border-white/10 resize-none"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-accent hover:bg-accent/80 text-background"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Sending message...</>
                    ) : (
                      <>
                        <Send size={16} className="mr-2" /> Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
              
              <div>
                <div className="glass-morphism rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-accent font-medium">Email</p>
                      <p>support@esportsmanager.com</p>
                    </div>
                    
                    <div>
                      <p className="text-accent font-medium">Business Hours</p>
                      <p>Monday to Friday: 9 AM - 6 PM EST</p>
                    </div>
                    
                    <div>
                      <p className="text-accent font-medium">Response Time</p>
                      <p>We aim to respond within 24 business hours</p>
                    </div>
                  </div>
                </div>
                
                <div className="glass-morphism rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-accent font-medium">How accurate is the AI assistant?</p>
                      <p className="text-white/70">
                        Our AI is trained on extensive eSports management data and is constantly learning. While highly accurate, we recommend using it as a supportive tool alongside your expertise.
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-accent font-medium">Can I use this for any eSports game?</p>
                      <p className="text-white/70">
                        Yes, our AI assistant is designed to provide general management advice applicable to all major eSports titles.
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-accent font-medium">Is my data secure?</p>
                      <p className="text-white/70">
                        We take data security seriously and implement industry standard encryption and security practices to protect your information.
                      </p>
                    </div>
                  </div>
                </div>
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

export default Contact;
