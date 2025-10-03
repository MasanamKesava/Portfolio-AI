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

const REGISTERED_COUNT_KEY = "freePortfolio.registeredCount";
const REGISTRATION_CLOSED_KEY = "freePortfolio.registrationClosed";
const DEADLINE_KEY = "freePortfolio.deadlineMs";

const MAX_REGISTRATIONS = 10;

// Initial visible duration for first-time visitors
const INITIAL_TIME = { days: 5, hours: 12, minutes: 30, seconds: 45 };

function timeLeftFromMs(ms: number) {
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

function initialDurationMs() {
  const { days, hours, minutes, seconds } = INITIAL_TIME;
  return (
    days * 24 * 60 * 60 * 1000 +
    hours * 60 * 60 * 1000 +
    minutes * 60 * 1000 +
    seconds * 1000
  );
}

const Register = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationClosed, setRegistrationClosed] = useState(false);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [deadlineMs, setDeadlineMs] = useState<number | null>(null);
  const [, setTick] = useState(0); // dummy tick to force re-render

  // Optional reset — uncomment during development to clear storage
  /*
  useEffect(() => {
    localStorage.clear();
    console.log("🧹 LocalStorage cleared — deadline & count reset");
  }, []);
  */

  const timeLeft = useMemo(() => {
    if (deadlineMs === null) return INITIAL_TIME;
    const remaining = deadlineMs - Date.now();
    return timeLeftFromMs(remaining);
  }, [deadlineMs]);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const savedCount = localStorage.getItem(REGISTERED_COUNT_KEY);
      const savedClosed = localStorage.getItem(REGISTRATION_CLOSED_KEY);
      const savedDeadline = localStorage.getItem(DEADLINE_KEY);

      if (savedCount !== null) {
        const n = parseInt(savedCount, 10);
        if (!Number.isNaN(n)) setRegisteredCount(n);
      }
      if (savedClosed !== null) {
        setRegistrationClosed(savedClosed === "true");
      }

      if (savedDeadline) {
        const parsed = parseInt(savedDeadline, 10);
        if (!Number.isNaN(parsed)) {
          setDeadlineMs(parsed);
        } else {
          const d = Date.now() + initialDurationMs();
          localStorage.setItem(DEADLINE_KEY, String(d));
          setDeadlineMs(d);
        }
      } else {
        const d = Date.now() + initialDurationMs();
        localStorage.setItem(DEADLINE_KEY, String(d));
        setDeadlineMs(d);
      }
    } catch {
      if (deadlineMs === null) {
        setDeadlineMs(Date.now() + initialDurationMs());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist changes
  useEffect(() => {
    try {
      localStorage.setItem(REGISTERED_COUNT_KEY, String(registeredCount));
      localStorage.setItem(REGISTRATION_CLOSED_KEY, String(registrationClosed));
    } catch {}
  }, [registeredCount, registrationClosed]);

  // Countdown ticking
  useEffect(() => {
    if (deadlineMs === null) return;
    const id = setInterval(() => {
      const remaining = deadlineMs - Date.now();
      if (remaining <= 0) {
        clearInterval(id);
        setRegistrationClosed(true); // ⏰ auto-close when time ends
        localStorage.setItem(REGISTRATION_CLOSED_KEY, "true");
      }
      setTick((x) => x + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [deadlineMs]);

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", college: "", course: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registrationClosed) {
      toast({
        title: "Registration Closed",
        description: "Sorry, we've reached our limit or the timer expired.",
        variant: "destructive",
      });
      return;
    }

    if (deadlineMs !== null && deadlineMs - Date.now() <= 0) {
      toast({
        title: "Offer Ended",
        description: "The limited-time offer has expired.",
        variant: "destructive",
      });
      setRegistrationClosed(true);
      localStorage.setItem(REGISTRATION_CLOSED_KEY, "true");
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([k, v]) => submitData.append(k, v));
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
      if (newCount >= MAX_REGISTRATIONS) {
        setRegistrationClosed(true);
        localStorage.setItem(REGISTRATION_CLOSED_KEY, "true");
      }

      toast({ title: "Message Sent!", description: "We'll get back to you within 24 hours." });

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

  const spotsLeft = Math.max(0, MAX_REGISTRATIONS - registeredCount);

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
              First 10 users get a completely FREE professional portfolio website worth ₹999!
            </p>

            {/* Countdown */}
            <div className="glass-card p-6 rounded-2xl max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-center mb-4">
                <Timer className="h-6 w-6 text-accent mr-2" />
                <span className="text-lg font-semibold">Offer Ends In:</span>
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                {["days", "hours", "minutes", "seconds"].map((unit) => (
                  <div key={unit} className="bg-gradient-primary p-3 rounded-lg text-white">
                    <div className="text-2xl font-bold">{(timeLeft as any)[unit]}</div>
                    <div className="text-sm capitalize">{unit}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Spots */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">
                  {registeredCount}/{MAX_REGISTRATIONS} Registered
                </span>
              </div>
              <div className="text-accent font-bold text-lg">
                Only {spotsLeft} spots left!
              </div>
            </div>
          </div>
        </section>

        {/* Registration Form + Sidebar */}
        {/* (Your existing JSX below remains unchanged) */}
        {/* ... */}
      </div>
    </div>
  );
};

export default Register;
