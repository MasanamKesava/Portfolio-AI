import { useState } from "react";
import {
  Phone,
  Mail,
  MessageCircle,
  Send,
  Clock,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import founderImage from "@/assets/founder-profile.png";

/** ⬇️ ADD: import your already-configured Supabase client */
import { supabase } from "@/lib/supabaseClient";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // ✅ HELPER: Basic validation (optional but recommended)
  const validate = () => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const phoneOk = /^[0-9+\-\s()]{7,20}$/.test(formData.phone);
    if (!formData.name.trim()) return "Please enter your name.";
    if (!emailOk) return "Please enter a valid email.";
    if (!phoneOk) return "Please enter a valid phone number.";
    if (formData.message.trim().length < 10)
      return "Please provide a bit more detail in the message (min 10 characters).";
    return null;
  };

  // ⬇️ REPLACE your existing handleSubmit with this one
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const err = validate();
    if (err) {
      toast({ title: "Fix & try again", description: err, variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const userAgent =
        typeof window !== "undefined" ? window.navigator.userAgent : null;

      /** Option A: direct insert to table */
      const { error } = await supabase
        .from("contact_messages")
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            user_agent: userAgent,
          },
        ]);

      if (error) throw error;

      // (Optional) also send an email copy via FormSubmit (keeps your current flow)
      try {
        const emailForm = new FormData();
        emailForm.append("name", formData.name);
        emailForm.append("email", formData.email);
        emailForm.append("phone", formData.phone);
        emailForm.append("message", formData.message);
        emailForm.append("_template", "table");
        emailForm.append("_captcha", "false");

        await fetch("https://formsubmit.co/masanamkesava@gmail.com", {
          method: "POST",
          body: emailForm,
        });
      } catch {
        // Ignore email errors so DB success still shows success to the user
      }

      toast({
        title: "Message Sent Successfully! 🎉",
        description:
          "Thanks for reaching out. We’ll get back to you within 24 hours.",
      });

      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err: any) {
      console.error("Contact submit failed:", err);
      toast({
        title: "Couldn’t send your message",
        description:
          err?.message || "Something went wrong. Please try again shortly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
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
    { question: "How quickly can I get my portfolio ready?",
      answer: "Most portfolios are completed within 2-3 business days. Rush orders can be delivered within 24 hours." },
    { question: "Do you provide resume writing services?",
      answer: "Yes! We offer AI-powered resume analysis and custom resume writing services optimized for ATS systems." },
    { question: "Can you help with placement preparation?",
      answer: "Absolutely! We provide interview preparation, coding practice resources, and placement readiness tracking." },
    { question: "What's included in the ₹1999 package?",
      answer: "Complete portfolio website, AI resume analysis, GitHub integration, and 3 months of support." },
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
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
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
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
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
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
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
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
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

                    {/* If you keep FormSubmit fallback above, these help format the email */}
                    <input type="hidden" name="_template" value="table" />
                    <input type="hidden" name="_captcha" value="false" />

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-primary hover:opacity-90 text-white shadow-glow text-lg py-3"
                    >
                      <Send className="mr-2 h-5 w-5" />
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right sidebar retained (unchanged) */}
            <div className="space-y-8">
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
                    <Button size="sm" asChild className="bg-gradient-primary hover:opacity-90 text-white">
                      <a href="tel:9059086142">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </a>
                    </Button>
                    <Button size="sm" asChild className="bg-gradient-accent hover:opacity-90 text-white">
                      <a href="https://wa.me/9059086142" target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Chat
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* contactMethods + response-time cards ... (unchanged) */}
              {/* ... keep your existing JSX here ... */}
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

          {/* FAQ + CTA sections ... (unchanged) */}
        </div>
      </div>
    </div>
  );
};

export default Contact;
