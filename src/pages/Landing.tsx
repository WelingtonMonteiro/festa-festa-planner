
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock, Layout, MessageSquare, Settings, Smartphone, Users } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const Landing = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would validate credentials
    // For now, we'll just navigate to the dashboard
    navigate('/dashboard');
  };

  const features = [
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Event Management",
      description: "Schedule and manage all your events in one place with our intuitive calendar."
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Client Management",
      description: "Keep track of all your clients, their preferences, and history."
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: "Messaging",
      description: "Communicate with clients directly through our integrated messaging system."
    },
    {
      icon: <Layout className="h-10 w-10 text-primary" />,
      title: "Custom Themes",
      description: "Choose from a variety of themes and kits for your events."
    },
    {
      icon: <Settings className="h-10 w-10 text-primary" />,
      title: "Reports & Analytics",
      description: "Get detailed insights on your business performance."
    },
    {
      icon: <Smartphone className="h-10 w-10 text-primary" />,
      title: "Mobile Access",
      description: "Access your event planner on any device, anytime, anywhere."
    }
  ];

  const testimonials = [
    {
      quote: "This event planning system has transformed how I manage my business. I can now handle twice as many events with half the stress.",
      author: "Sarah Johnson, Event Planner"
    },
    {
      quote: "The client management features alone are worth the investment. My customers love how organized their events are now.",
      author: "Michael Rodriguez, Party Coordinator"
    },
    {
      quote: "I used to spend hours on administrative tasks. Now I can focus on what matters - creating amazing events for my clients.",
      author: "Emma Chen, Wedding Planner"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-festa-primary/10 via-background to-festa-secondary/10 py-20">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Simplify Your <span className="bg-gradient-to-r from-festa-primary via-festa-secondary to-festa-accent text-transparent bg-clip-text">Event Planning</span> Business
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              The all-in-one platform for professional event planners to manage clients, events, inventory, and finances in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="text-lg px-8"
                onClick={() => {
                  // Scroll to login section
                  document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8"
                onClick={() => {
                  // Scroll to features section
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex-1 relative min-h-[400px] w-full rounded-lg overflow-hidden shadow-xl border">
            <img 
              src="/placeholder.svg" 
              alt="Dashboard Preview" 
              className="absolute inset-0 w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end">
              <div className="p-4 text-white">
                <p className="text-sm font-medium">Dashboard Overview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Run Your Event Business
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform provides all the tools you need to manage events efficiently and grow your business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Carousel */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">See Our Platform in Action</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Take a look at some of the key features and interfaces of our event planning system.
            </p>
          </div>
          
          <Carousel className="max-w-5xl mx-auto">
            <CarouselContent>
              <CarouselItem>
                <div className="p-1">
                  <div className="overflow-hidden rounded-xl border shadow-lg">
                    <img src="/placeholder.svg" alt="Calendar View" className="w-full aspect-video object-cover" />
                    <div className="p-4 bg-card">
                      <h3 className="font-medium text-lg">Calendar Management</h3>
                      <p className="text-muted-foreground">View and manage all your events in an intuitive calendar interface.</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="p-1">
                  <div className="overflow-hidden rounded-xl border shadow-lg">
                    <img src="/placeholder.svg" alt="Client Dashboard" className="w-full aspect-video object-cover" />
                    <div className="p-4 bg-card">
                      <h3 className="font-medium text-lg">Client Dashboard</h3>
                      <p className="text-muted-foreground">Keep track of all client information, preferences and history.</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="p-1">
                  <div className="overflow-hidden rounded-xl border shadow-lg">
                    <img src="/placeholder.svg" alt="Theme Selection" className="w-full aspect-video object-cover" />
                    <div className="p-4 bg-card">
                      <h3 className="font-medium text-lg">Theme Selection</h3>
                      <p className="text-muted-foreground">Browse and select from multiple party themes and kits.</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <div className="flex justify-center mt-4">
              <CarouselPrevious className="relative -left-0 top-0 translate-y-0" />
              <CarouselNext className="relative -right-0 top-0 translate-y-0" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Here's why event planners trust our system to help run their businesses.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Time Savings</h3>
                <p className="text-muted-foreground">Save up to 15 hours per week on administrative tasks and event coordination.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Increased Revenue</h3>
                <p className="text-muted-foreground">On average, our users report a 30% increase in business capacity and revenue.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Client Satisfaction</h3>
                <p className="text-muted-foreground">Better organization leads to happier clients and more referrals.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Comprehensive Solution</h3>
                <p className="text-muted-foreground">All your tools in one place instead of juggling multiple software systems.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Data Security</h3>
                <p className="text-muted-foreground">Your business and client data is securely stored and backed up.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Always Available</h3>
                <p className="text-muted-foreground">Access your event management system 24/7 from any device, anywhere.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Don't just take our word for it. Here's what professional event planners have to say about our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <svg width="45" height="36" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary/20">
                      <path d="M13.5 18H9C9.33333 12 12.4 9 18.2 9V13.5C15.6 13.5 13.6667 15 13.5 18ZM31.5 18H27C27.3333 12 30.4 9 36.2 9V13.5C33.6 13.5 31.6667 15 31.5 18Z" fill="currentColor"/>
                      <path d="M13.5 18H9V27H18V18H13.5ZM31.5 18H27V27H36V18H31.5Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <p className="mb-4 italic">{testimonial.quote}</p>
                  <p className="text-sm font-medium">{testimonial.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section id="login-section" className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Log in to your account</CardTitle>
                <CardDescription>
                  Enter your credentials to access the event planning system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input 
                      id="email"
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-medium">
                        Password
                      </label>
                      <Button type="button" variant="link" className="p-0 h-auto text-xs">
                        Forgot password?
                      </Button>
                    </div>
                    <Input 
                      id="password"
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Log in</Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Button variant="link" className="p-0 h-auto">
                    Contact us
                  </Button>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold">Festa Planner</h3>
              <p className="text-muted-foreground mt-2">The complete event management solution</p>
            </div>
            <div className="flex space-x-8">
              <div>
                <h4 className="font-medium mb-3">Product</h4>
                <ul className="space-y-2">
                  <li><Button variant="link" className="p-0 h-auto">Features</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">Pricing</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">FAQ</Button></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Company</h4>
                <ul className="space-y-2">
                  <li><Button variant="link" className="p-0 h-auto">About</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">Contact</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">Privacy</Button></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© 2025 Festa Planner. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Button variant="ghost" size="icon" className="rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <span className="sr-only">Twitter</span>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
