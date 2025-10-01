import { useState } from "react";
import {
  Phone,
  Mail,
  MessageCircle,
  Send,
  Clock,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import founderImage from "@/assets/founder-profile.png";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Handle form submission with success message
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Submit form data to FormSubmit
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    fetch("https://formsubmit.co/masanamkesava@gmail.com", {
      method: "POST",
      body: formData,
    }).then(() => {
      // Show success toast and reset form after successful submission
      toast({
        title: "Message Sent Successfully! 🎉",
        description: "Thank you for your message. We'll get back to you within 24 hours.",
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
    }).catch((error) => {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactMethods = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      detail: "+91 9059086142",
      description: "Available 9 AM - 8 PM IST",
      action: "tel:9059086142",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      detail: "masanamkesava@gmail.com",
      description: "We'll respond within 24 hours",
      action:
        "mailto:masanamkesava@gmail.com?subject=Hi%20Kesava%20Request%20for%20Website%20Portfolio%20and%20Resume&body=Hi%20Kesava%0D%0A%0D%0AI%20found%20it%20useful%20for%20making%20my%20resume%20and%20portfolio.%20We%20want%20to%20talk%20to%20you.%0D%0A%0D%0ARegards,%0D%0A[Your%20Name]%0D%0A[details]",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "WhatsApp",
      detail: "Chat with us instantly",
      description: "Quick support & queries",
      action: "https://wa.me/9059086142",
      color: "from-green-400 to-green-600",
    },
  ];

  const faqs = [
    {
      question: "How quickly can I get my portfolio ready?",
      answer:
        "Most portfolios are completed within 2-3 business days. Rush orders can be delivered within 24 hours.",
    },
    {
      question: "Do you provide resume writing services?",
      answer:
        "Yes! We offer AI-powered resume analysis and custom resume writing services optimized for ATS systems.",
    },
    {
      question: "Can you help with placement preparation?",
      answer:
        "Absolutely! We provide interview preparation, coding practice resources, and placement readiness tracking.",
    },
    {
      question: "What's included in the ₹1999 package?",
      answer:
        "Complete portfolio website, AI resume analysis, GitHub integration, and 3 months of support.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-20 pb-16">
        {/* Header Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Get In Touch
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Ready to transform your career? Let's discuss how we can help you
              build the perfect portfolio and land your dream job.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <MessageSquare className="mr-3 h-6 w-6 text-primary" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium mb-2"
                        >
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="glass-card"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium mb-2"
                        >
                          Phone Number *
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="glass-card"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2"
                      >
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="glass-card"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium mb-2"
                      >
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="glass-card"
                        placeholder="Tell us about your requirements, timeline, and any specific needs..."
                      />
                    </div>

                    {/* Hidden FormSubmit options */}
                    <input type="hidden" name="_template" value="table" />
                    <input type="hidden" name="_captcha" value="false" />

                    <Button
                      type="submit"
                      className="w-full bg-gradient-primary hover:opacity-90 text-white shadow-glow text-lg py-3"
                    >
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-8">
              {/* Founder Card */}
              <Card className="glass-card border-0">
                <CardContent className="p-6 text-center">
                  <img
                    src={founderImage}
                    alt="Kesava Masanam"
                    className="w-24 h-24 object-cover rounded-full mx-auto mb-4 ring-2 ring-primary/20"
                  />
                  <h3 className="text-xl font-bold mb-1">Kesava Masanam</h3>
                  <p className="text-muted-foreground mb-4">
                    Founder & Portfolio Expert
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    3+ years experience • 500+ successful portfolios • U.S.
                    client expertise
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Button
                      size="sm"
                      asChild
                      className="bg-gradient-primary hover:opacity-90 text-white"
                    >
                      <a href="tel:9059086142">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      asChild
                      className="bg-gradient-accent hover:opacity-90 text-white"
                    >
                      <a
                        href="https://wa.me/9059086142"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Chat
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Methods */}
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <Card key={index} className="glass-card border-0 hover-lift">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-r ${method.color} flex items-center justify-center text-white flex-shrink-0`}
                        >
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{method.title}</h4>
                          <p className="text-sm text-primary mb-1">
                            {method.detail}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {method.description}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="glass-button"
                        >
                          <a
                            href={method.action}
                            target={
                              method.action.startsWith("http")
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              method.action.startsWith("http")
                                ? "noopener noreferrer"
                                : undefined
                            }
                          >
                            Contact
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Response Time */}
              <Card className="glass-card border-0">
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold mb-2">Quick Response Time</h4>
                  <p className="text-sm text-muted-foreground">
                    We typically respond to all inquiries within 2-4 hours
                    during business hours.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground">
                Quick answers to common questions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <Card key={index} className="glass-card border-0 hover-lift">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-3 text-primary">
                      {faq.question}
                    </h4>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-12">
            <div className="glass-card p-8 rounded-3xl text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6">
                Don't wait! The launch offer ends soon. Contact us now and
                secure your spot.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="bg-gradient-primary hover:opacity-90 text-white shadow-glow"
                >
                  <a
                    href="https://wa.me/9059086142"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Start WhatsApp Chat
                  </a>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-accent hover:opacity-90 text-white"
                >
                  <a href="tel:9059086142">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now: 9059086142
                  </a>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Contact;
