import { useState, useEffect, useMemo } from "react";
import { Timer, Users, Gift, Sparkles, ArrowRight } from "lucide-react";
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

export default function Register() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationClosed, setRegistrationClosed] = useState(false);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [deadlineMs, setDeadlineMs] = useState<number | null>(null);
  const [, setTick] = useState(0);

  // Optional reset (DEV only)
  /*
  useEffect(() => {
    localStorage.clear();
    console.log("🧹 LocalStorage cleared — reset registration + deadline");
  }, []);
  */

  // Hydrate saved state
  useEffect(() => {
    const savedCount = localStorage.getItem(REGISTERED_COUNT_KEY);
    const savedClosed = localStorage.getItem(REGISTRATION_CLOSED_KEY);
    const savedDeadline = localStorage.getItem(DEADLINE_KEY);

    if (savedCount) {
      const n = parseInt(savedCount, 10);
      if (!Number.isNaN(n)) setRegisteredCount(n);
    }
    if (savedClosed) setRegistrationClosed(savedClosed === "true");

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
  }, []);

  // Countdown tick
  useEffect(() => {
    if (deadlineMs === null) return;
    const id = setInterval(() => {
      const remaining = deadlineMs - Date.now();
      if (remaining <= 0) {
        clearInterval(id);
        setRegistrationClosed(true);
        localStorage.setItem(REGISTRATION_CLOSED_KEY, "true");
      }
      setTick((x) => x + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [deadlineMs]);

  // Persist registration data
  useEffect(() => {
    localStorage.setItem(REGISTERED_COUNT_KEY, String(registeredCount));
    localStorage.setItem(REGISTRATION_CLOSED_KEY, String(registrationClosed));
  }, [registeredCount, registrationClosed]);

  const timeLeft = useMemo(() => {
    if (deadlineMs === null) return INITIAL_TIME;
    const remaining = deadlineMs - Date.now();
    return timeLeftFromMs(remaining);
  }, [deadlineMs]);

  const spotsLeft = Math.max(0, MAX_REGISTRATIONS - registeredCount);

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
    if (registrationClosed) {
      toast({
        title: "Registration Closed",
        description: "Sorry, either the time expired or max registrations reached.",
        variant: "destructive",
      });
      return;
    }
    if (deadlineMs !== null && deadlineMs - Date.now() <= 0) {
      setRegistrationClosed(true);
      localStorage.setItem(REGISTRATION_CLOSED_KEY, "true");
      toast({ title: "Offer Ended", description: "The timer expired.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([k, v]) => submitData.append(k, v));
      submitData.append("_subject", "🎉 New FREE Portfolio Registration");
      submitData.append("_template", "table");
      submitData.append("_captcha", "false");

      const response = await fetch("https://formsubmit.co/masanamkesava@gmail.com", {
        method: "POST",
        body: submitData,
      });

      if (!response.ok) throw new Error("Failed to submit");

      const newCount = registeredCount + 1;
      setRegisteredCount(newCount);
      if (newCount >= MAX_REGISTRATIONS) {
        setRegistrationClosed(true);
        localStorage.setItem(REGISTRATION_CLOSED_KEY, "true");
      }

      toast({ title: "Registration Successful", description: "We'll contact you soon!" });
      setFormData({ name: "", email: "", phone: "", college: "", course: "" });
    } catch {
      toast({ title: "Error", description: "Please try again later.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar />
      <div className="pt-24 pb-16 max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 text-lg mb-4">
            <Gift className="h-5 w-5 mr-2" />
            LIMITED TIME OFFER
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Get Your FREE Portfolio Website!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            First 10 users get a professionally built portfolio site worth ₹999 completely free.
          </p>
        </div>

        {/* Countdown */}
        <div className="max-w-lg mx-auto text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Timer className="h-5 w-5 mr-2 text-emerald-600" />
            <span className="font-semibold text-lg">Offer Ends In</span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {["days", "hours", "minutes", "seconds"].map((unit) => (
              <div key={unit} className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg text-white p-3">
                <div className="text-2xl font-bold">{(timeLeft as any)[unit]}</div>
                <div className="text-sm capitalize">{unit}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Users className="h-5 w-5 text-green-700" />
            <span className="font-medium">{registeredCount}/{MAX_REGISTRATIONS} Registered — <span className="text-green-600 font-semibold">{spotsLeft} spots left</span></span>
          </div>
        </div>

        {registrationClosed ? (
          <div className="text-center bg-red-100 border border-red-300 p-6 rounded-xl text-red-800 font-semibold text-lg shadow">
            🚫 Registration Closed — Either the timer expired or all spots are filled.
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">Register Now</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4">
                {["name", "email", "phone", "college", "course"].map((field) => (
                  <div key={field} className="grid gap-1">
                    <Label htmlFor={field} className="capitalize">{field}</Label>
                    <Input
                      id={field}
                      name={field}
                      value={(formData as any)[field]}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                ))}
                <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
                  {isSubmitting ? "Submitting..." : "Submit & Claim Offer"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
