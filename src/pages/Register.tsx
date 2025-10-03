import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User, Mail, Phone, GraduationCap, CheckCircle, Timer, Gift, Users, Sparkles, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const REGISTERED_COUNT_KEY = "freePortfolio.registeredCount";
const REGISTRATION_CLOSED_KEY = "freePortfolio.registrationClosed";

// --- Option 1: Global countdown ---
// Use current time + fixed duration for everyone
const OFFER_DURATION_MS =
  5 * 24 * 60 * 60 * 1000 + // 5 days
  12 * 60 * 60 * 1000 +     // 12 hours
  30 * 60 * 1000 +          // 30 minutes
  45 * 1000;                // 45 seconds

const GLOBAL_DEADLINE_MS = Date.now() + OFFER_DURATION_MS;

function timeLeftFromMs(ms: number) {
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

const Register = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationClosed, setRegistrationClosed] = useState(false);
  const [registeredCount, setRegisteredCount] = useState(1); // default fallback
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", college: "", course: "",
  });
  const [timeLeft, setTimeLeft] = useState(() => timeLeftFromMs(GLOBAL_DEADLINE_MS - Date.now()));

  // Hydrate count/closed from localStorage
  useEffect(() => {
    try {
      const savedCount = localStorage.getItem(REGISTERED_COUNT_KEY);
      const savedClosed = localStorage.getItem(REGISTRATION_CLOSED_KEY);
      if (savedCount !== null) {
        const n = parseInt(savedCount, 10);
        if (!Number.isNaN(n)) setRegisteredCount(n);
      }
      if (savedClosed !== null) setRegistrationClosed(savedClosed === "true");
    } catch {}
  }, []);

  // Persist count/closed changes
  useEffect(() => {
    try {
      localStorage.setItem(REGISTERED_COUNT_KEY, String(registeredCount));
      localStorage.setItem(REGISTRATION_CLOSED_KEY, String(registrationClosed));
    } catch {}
  }, [registeredCount, registrationClosed]);

  // Countdown interval
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = GLOBAL_DEADLINE_MS - Date.now();
      setTimeLeft(timeLeftFromMs(Math.max(0, remaining)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registrationClosed) {
      toast({
        title: "Registration Closed",
        description: "Sorry, we've reached our limit of 10 users.",
        variant: "destructive",
      });
      return;
    }

    if (GLOBAL_DEADLINE_MS - Date.now() <= 0) {
      toast({
        title: "Offer Ended",
        description: "The limited-time offer has expired.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("college", formData.college);
      submitData.append("course", formData.course);
      submitData.append("_subject", `🎉 New Registration - FREE Portfolio Website Offer!`);
      submitData.append("_template", "table");
      submitData.append("_captcha", "false");

      // Autoresponse message
      submitData.append("_autoresponse", `
Subject: Thank You for Your Interest, ${formData.name}! Your Request is Confirmed!

Body:

Thank you for your request! We have received your information and will contact you shortly.

Your Free Website Portfolio and ATS-Friendly Resume are now in process, and you can expect to receive them soon.

If you are happy with our service, we would be grateful if you could share this opportunity with your friends.

Best regards,
      `.trim());

      const response = await fetch("https://formsubmit.co/masanamkesava@gmail.com", {
        method: "POST",
        body: submitData,
      });

      if (!response.ok) throw new Error("Registration failed");

      const newCount = registeredCount + 1;
      setRegisteredCount(newCount);
      if (newCount >= 10) setRegistrationClosed(true);

      toast({
        title: "Registration Successful! 🎉",
        description: "You'll receive your FREE portfolio website details via email within 24 hours.",
      });

      setFormData({ name: "", email: "", phone: "", college: "", course: "" });
    } catch (err) {
      console.error("Registration error:", err);
      toast({
        title: "Registration Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const spotsLeft = Math.max(0, 10 - registeredCount);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 pb-16">
        {/* Header */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 text-lg">
                <Gift className="h-5 w-5 mr-2" /> LIMITED TIME OFFER
              </Badge>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Get Your FREE Portfolio!
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              First 10 users get a completely FREE professional portfolio website worth ₹999!
            </p>

            {/* Countdown */}
            <div className="glass-card p-6 rounded-2xl max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-center mb-4">
                <Timer className="h-6 w-6 text-accent mr-2" />
                <span className="text-lg font-semibold">Offer Ends In:</span>
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                {["days","hours","minutes","seconds"].map((key) => (
                  <div key={key} className="bg-gradient-primary p-3 rounded-lg text-white">
                    <div className="text-2xl font-bold">{timeLeft[key as keyof typeof timeLeft]}</div>
                    <div className="text-sm">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Spots */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">{registeredCount}/10 Registered</span>
              </div>
              <div className="text-accent font-bold text-lg">Only {spotsLeft} spots left!</div>
            </div>
          </div>
        </section>

        {/* Form & Sidebar */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <Sparkles className="mr-3 h-6 w-6 text-primary" />
                    {registrationClosed ? "Registration Closed" : "Claim Your FREE Portfolio"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {registrationClosed ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Registration Closed!</h3>
                      <p className="text-muted-foreground mb-6">
                        We've reached our limit of 10 FREE portfolio websites.
                        Thank you for your interest!
                      </p>
                      <Link to="/contact">
                        <Button className="bg-gradient-primary hover:opacity-90 text-white shadow-glow">
                          Contact Us for Paid Options
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {[
                        { label: "Full Name *", name: "name", icon: User, placeholder: "Enter your full name", type: "text" },
                        { label: "Email Address *", name: "email", icon: Mail, placeholder: "your.email@example.com", type: "email" },
                        { label: "Phone Number *", name: "phone", icon: Phone, placeholder: "+91 XXXXX XXXXX", type: "tel" },
                        { label: "College/University *", name: "college", icon: GraduationCap, placeholder: "Your college/university name", type: "text" },
                      ].map(({label,name,icon:Icon,placeholder,type}) => (
                        <div key={name}>
                          <Label htmlFor={name} className="block text-sm font-medium mb-2">{label}</Label>
                          <div className="relative">
                            <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id={name} name={name} type={type} required
                              value={formData[name as keyof typeof formData]}
                              onChange={handleInputChange}
                              className="glass-card pl-10" placeholder={placeholder}
                            />
                          </div>
                        </div>
                      ))}

                      <div>
                        <Label htmlFor="course" className="block text-sm font-medium mb-2">
                          Course/Major *
                        </Label>
                        <Input
                          id="course" name="course" type="text" required
                          value={formData.course} onChange={handleInputChange}
                          className="glass-card" placeholder="e.g., Computer Science, IT, etc."
                        />
                      </div>

                      <Button
                        type="submit" disabled={isSubmitting}
                        className="w-full bg-gradient-primary hover:opacity-90 text-white shadow-glow text-lg py-3"
                      >
                        {isSubmitting ? "Registering..." : (
                          <>
                            Claim FREE Portfolio
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        By registering, you agree to receive updates about your FREE portfolio website.
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">What You Get FREE</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    ["Professional Portfolio Website", "Custom-designed portfolio worth ₹999"],
                    ["AI Resume Analysis", "Get intelligent feedback on your resume"],
                    ["GitHub Integration", "Showcase your projects automatically"],
                    ["3 Months Support", "Free updates and maintenance"],
                  ].map(([title, desc]) => (
                    <div key={title} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                      <div>
                        <h4 className="font-semibold">{title}</h4>
                        <p className="text-sm text-muted-foreground">{desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass-card border-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
                <CardContent className="p-6 text-center">
                  <Timer className="h-8 w-8 text-red-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold mb-2 text-red-500">⚡ Limited Time Only!</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This offer is only available for the first 10 users. After that,
                    portfolio websites will cost ₹999.
                  </p>
                  <div className="text-2xl font-bold text-red-500">
                    {spotsLeft} spots remaining
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Success Stories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-2 border-primary/20 pl-4">
                    <p className="text-sm text-muted-foreground">
                      "Got my dream job at Microsoft thanks to my portfolio!"
                    </p>
                    <p className="text-xs font-semibold mt-1">- Priya, Software Engineer</p>
                  </div>
                  <div className="border-l-2 border-primary/20 pl-4">
                    <p className="text-sm text-muted-foreground">
                      "The portfolio helped me stand out from 200+ applicants."
                    </p>
                    <p className="text-xs font-semibold mt-1">- Rahul, Full Stack Developer</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 mt-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                ["Is this really FREE?",
                 "Yes! The first 10 users get a completely FREE portfolio website worth ₹999. No hidden charges, no credit card required."],
                ["How long will it take?",
                 "Your portfolio will be ready within 2-3 business days after registration. We'll send you updates via email."],
                ["What if I'm not satisfied?",
                 "We offer unlimited revisions until you're 100% satisfied with your portfolio. Your success is our priority."],
                ["Can I customize later?",
                 "Absolutely! You get 3 months of free support and can request changes anytime during this period."],
              ].map(([q, a]) => (
                <Card key={q} className="glass-card border-0">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-3 text-primary">{q}</h4>
                    <p className="text-muted-foreground text-sm">{a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Register;
