import { useState, useEffect, useMemo } from "react";
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

// Keys for localStorage (only count/closed persist)
const REGISTERED_COUNT_KEY = "freePortfolio.registeredCount";
const REGISTRATION_CLOSED_KEY = "freePortfolio.registrationClosed";

// Absolute deadline (Asia/Kolkata timezone)
const TARGET_DATE = new Date("2025-10-03T12:30:55+05:30").getTime();

function timeLeftFromMs(ms: number) {
  const safeMs = Math.max(0, ms);
  const totalSeconds = Math.floor(safeMs / 1000);
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
  const [registeredCount, setRegisteredCount] = useState(1);

  // "now" ticks every second
  const [now, setNow] = useState<number>(Date.now());

  // Form state
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", college: "", course: "",
  });

  // Countdown derived from fixed deadline
  const timeLeft = useMemo(() => timeLeftFromMs(TARGET_DATE - now), [now]);

  // Hydrate count/closed from localStorage
  useEffect(() => {
    try {
      const savedCount = localStorage.getItem(REGISTERED_COUNT_KEY);
      const savedClosed = localStorage.getItem(REGISTRATION_CLOSED_KEY);

      if (savedCount !== null) {
        const n = parseInt(savedCount, 10);
        if (!Number.isNaN(n)) setRegisteredCount(n);
      }
      if (savedClosed !== null) {
        setRegistrationClosed(savedClosed === "true");
      }
    } catch {
      // ignore errors
    }
  }, []);

  // Persist count/closed
  useEffect(() => {
    try {
      localStorage.setItem(REGISTERED_COUNT_KEY, String(registeredCount));
      localStorage.setItem(REGISTRATION_CLOSED_KEY, String(registrationClosed));
    } catch {}
  }, [registeredCount, registrationClosed]);

  // Update now every second
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Auto-close when deadline ends
  useEffect(() => {
    if (TARGET_DATE - now <= 0 && !registrationClosed) {
      setRegistrationClosed(true);
    }
  }, [now, registrationClosed]);

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

    if (TARGET_DATE - now <= 0) {
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
      submitData.append("_subject", "🎉 New Registration - FREE Portfolio Website Offer!");
      submitData.append("_template", "table");
      submitData.append("_captcha", "false");

      const response = await fetch("https://formsubmit.co/masanamkesava@gmail.com", {
        method: "POST",
        body: submitData,
      });

      if (!response.ok) throw new Error("Registration failed");

      const newCount = registeredCount + 1;
      setRegisteredCount(newCount);
      if (newCount >= 10) setRegistrationClosed(true);

      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
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
                <Gift className="h-5 w-5 mr-2" />
                LIMITED TIME OFFER
              </Badge>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Get Your FREE Portfolio!
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              First 10 users get a completely FREE professional portfolio website worth ₹5000!
            </p>

            {/* Countdown */}
            <div className="glass-card p-6 rounded-2xl max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-center mb-4">
                <Timer className="h-6 w-6 text-accent mr-2" />
                <span className="text-lg font-semibold">Offer Ends In:</span>
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

        {/* Form + Sidebar (same as your code, omitted for brevity) */}
      </div>
    </div>
  );
};

export default Register;
