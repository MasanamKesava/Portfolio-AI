import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  CheckCircle,
  Timer,
  Gift,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const REGISTERED_COUNT_KEY = "freePortfolio.registeredCount";

/**
 * GLOBAL IST DEADLINE
 * - Read once from env (recommended to set with +05:30 offset)
 * - Example: VITE_COUNTDOWN_DEADLINE=2025-10-10T00:00:00+05:30
 */
const DEADLINE_ISO =
  import.meta.env.VITE_COUNTDOWN_DEADLINE || "2025-10-10T00:00:00+05:30";
const DEADLINE_MS = new Date(DEADLINE_ISO).getTime();

/** Convert remaining ms to d/h/m/s parts */
function toTimeParts(ms: number) {
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

  // Registration count (locally persisted). If you want global cap, back this with a backend.
  const [registeredCount, setRegisteredCount] = useState(1);
  const registrationClosed = registeredCount >= 10;

  // Countdown ticking driver
  const [tick, setTick] = useState(0);

  // Hydrate local count
  useEffect(() => {
    try {
      const saved = localStorage.getItem(REGISTERED_COUNT_KEY);
      if (saved) {
        const n = parseInt(saved, 10);
        if (!Number.isNaN(n)) setRegisteredCount(n);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Persist local count
  useEffect(() => {
    try {
      localStorage.setItem(REGISTERED_COUNT_KEY, String(registeredCount));
    } catch {
      // ignore storage errors
    }
  }, [registeredCount]);

  // Tick every second
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Derive remaining time from single global deadline
  const timeLeft = useMemo(() => {
    const remaining = Math.max(0, DEADLINE_MS - Date.now());
    return toTimeParts(remaining);
  }, [tick]);

  // Pretty label in IST
  const deadlineStrIST = useMemo(
    () =>
      new Date(DEADLINE_MS).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "full",
        timeStyle: "long",
      }),
    []
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    course: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Close ONLY when 10 registrations are done
    if (registrationClosed) {
      toast({
        title: "Registration Closed",
        description: "Sorry, we've reached our limit of 10 users.",
        variant: "destructive",
      });
      return;
    }

    // Countdown is informational; do NOT block on deadline.
    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("college", formData.college);
      submitData.append("course", formData.course);
      submitData.append(
        "_subject",
        "🎉 New Registration - FREE Portfolio Website Offer!"
      );
      submitData.append("_template", "table");
      submitData.append("_captcha", "false");

      const response = await fetch(
        "https://formsubmit.co/masanamkesava@gmail.com",
        {
          method: "POST",
          body: submitData,
        }
      );

      if (!response.ok) throw new Error("Registration failed");

      setRegisteredCount((c) => c + 1);

      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        college: "",
        course: "",
      });
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
                <Gift className="h-5 w-5 mr-2" />
                LIMITED TIME OFFER
              </Badge>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Get Your FREE Portfolio!
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              First 10 users get a completely FREE professional portfolio website
              worth ₹999!
            </p>

            {/* Global Countdown (IST for everyone) */}
            <div className="glass-card p-6 rounded-2xl max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-center mb-4">
                <Timer className="h-6 w-6 text-accent mr-2" />
                <span className="text-lg font-semibold">
                  Offer Ends ({deadlineStrIST})
                </span>
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-gradient-primary p-3 rounded-lg text-white">
                  <div className="text-2xl font-bold">{timeLeft.days}</div>
                  <div className="text-sm">Days</div>
                </div>
                <div className="bg-gradient-primary p-3 rounded-lg text-white">
                  <div className="text-2xl font-bold">{timeLeft.hours}</div>
                  <div className="text-sm">Hours</div>
                </div>
                <div className="bg-gradient-primary p-3 rounded-lg text-white">
                  <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                  <div className="text-sm">Minutes</div>
                </div>
                <div className="bg-gradient-primary p-3 rounded-lg text-white">
                  <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                  <div className="text-sm">Seconds</div>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                *Countdown is universal (IST). Registrations close after 10
                sign-ups regardless of timer.
              </p>
            </div>

            {/* Spots */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">
                  {registeredCount}/10 Registered
                </span>
              </div>
              <div className="text-accent font-bold text-lg">
                Only {spotsLeft} spots left!
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <Sparkles className="mr-3 h-6 w-6 text-primary" />
                    {registrationClosed
                      ? "Registration Closed"
                      : "Claim Your FREE Portfolio"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {registrationClosed ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">
                        Registration Closed!
                      </h3>
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
                      <div>
                        <Label
                          htmlFor="name"
                          className="block text-sm font-medium mb-2"
                        >
                          Full Name *
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="glass-card pl-10"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="email"
                          className="block text-sm font-medium mb-2"
                        >
                          Email Address *
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="glass-card pl-10"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="phone"
                          className="block text-sm font-medium mb-2"
                        >
                          Phone Number *
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="glass-card pl-10"
                            placeholder="+91 XXXXX XXXXX"
                          />
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="college"
                          className="block text-sm font-medium mb-2"
                        >
                          College/University *
                        </Label>
                        <div className="relative">
                          <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="college"
                            name="college"
                            type="text"
                            required
                            value={formData.college}
                            onChange={handleInputChange}
                            className="glass-card pl-10"
                            placeholder="Your college/university name"
                          />
                        </div>
                      </div>

                      <div>
                        <Label
                          ht
