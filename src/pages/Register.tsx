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
import { supabase } from "@/lib/supabaseClient";

type Status = {
  registeredCount: number;
  limit: number;
  isOpen: boolean;
};

/** ---- EDIT THESE IF YOUR NAMES DIFFER ---- */
const REG_TABLE = "free_portfolio_registrations";
const STATUS_TABLE = "free_portfolio_status"; // if you don’t have this, it just won’t trigger
const RPC_GET_STATUS = "get_free_portfolio_status";
const RPC_REGISTER = "register_free_portfolio";
const RPC_RESET = "reset_free_portfolio"; // optional
/** ---------------------------------------- */

const DEADLINE_ISO =
  import.meta.env.VITE_COUNTDOWN_DEADLINE || "2025-10-10T00:00:00+05:30";
const DEADLINE_MS = new Date(DEADLINE_ISO).getTime();

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

  // Global status from Supabase
  const [registeredCount, setRegisteredCount] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // ✅ Proper loading gate to prevent flicker of counts
  const [isStatusLoading, setIsStatusLoading] = useState<boolean>(true);

  // Only compute closed AFTER status loads (prevents header flip-flop)
  const registrationClosed =
    !isStatusLoading && (!isOpen || registeredCount >= limit);

  const spotsLeft = Math.max(0, limit - registeredCount);

  // Live ticking countdown
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const timeLeft = useMemo(() => {
    const remaining = Math.max(0, DEADLINE_MS - Date.now());
    return toTimeParts(remaining);
  }, [tick]);

  const deadlineStrIST = useMemo(
    () =>
      new Date(DEADLINE_MS).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "full",
        timeStyle: "long",
      }),
    []
  );

  // Load + refresh helpers
  const refetchStatus = async () => {
    try {
      const { data, error } = await supabase.rpc(RPC_GET_STATUS);
      if (error) {
        console.error("Status error:", error);
        // fail-open defaults
        setRegisteredCount(0);
        setLimit(10);
        setIsOpen(true);
      } else {
        const s = data as Status;
        setRegisteredCount(s?.registeredCount ?? 0);
        setLimit(s?.limit ?? 10);
        setIsOpen(!!s?.isOpen);
      }
    } finally {
      setIsStatusLoading(false); // ✅ stop loading no matter what
    }
  };

  // Initial load
  useEffect(() => {
    setIsStatusLoading(true);
    refetchStatus();
  }, []);

  // Realtime: reflect INSERT/DELETE/UPDATE on registrations & optional status tables
  useEffect(() => {
    const channel = supabase
      .channel("free-portfolio-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: REG_TABLE },
        () => refetchStatus()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: STATUS_TABLE },
        () => refetchStatus()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Form
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
        description: "Sorry, we’ve reached the limit.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1) Atomic register via RPC
      const { data, error } = await supabase.rpc(RPC_REGISTER, {
        p_name: formData.name,
        p_email: formData.email,
        p_phone: formData.phone,
        p_college: formData.college,
        p_course: formData.course,
      });

      if (error) throw error;

      const ok = data?.ok === true;
      const newCount = Number(data?.registeredCount ?? registeredCount);
      if (!ok) {
        setRegisteredCount(newCount || registeredCount);
        toast({
          title: "Registration Closed",
          description: data?.message || "No spots remaining.",
          variant: "destructive",
        });
        return;
      }

      // 2) Update UI (realtime will also update others)
      setRegisteredCount(newCount);

      // 3) Optional: forward to Formsubmit
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

        await fetch("https://formsubmit.co/masanamkesava@gmail.com", {
          method: "POST",
          body: submitData,
        });
      } catch (fwdErr) {
        console.warn("Formsubmit forward failed:", fwdErr);
      }

      toast({
        title: "Registered!🎉🎉",
        description: "We’ll get back to you within 24 hours.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        college: "",
        course: "",
      });
    } catch (err: unknown) {
      console.error("Registration error:", err);
      toast({
        title: "Registration Failed",
        description:
          err && typeof err === "object" && "message" in err
            ? (err as { message?: string }).message
            : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---- Optional Admin Reset (hidden unless you set localStorage flag) ----
  const isAdmin =
    typeof window !== "undefined" &&
    window.localStorage?.getItem("freePortfolio.isAdmin") === "1";

  const handleAdminReset = async () => {
    try {
      const { error: rpcErr } = await supabase.rpc(RPC_RESET);
      if (rpcErr) throw rpcErr;
      await refetchStatus();
      toast({
        title: "Reset complete",
        description: "All registrations cleared and counts refreshed.",
      });
    } catch (err: unknown) {
      console.error("Admin reset error:", err);
      toast({
        title: "Reset failed",
        description:
          err && typeof err === "object" && "message" in err
            ? (err as { message?: string }).message
            : "Check RLS or create RPC `reset_free_portfolio`.",
        variant: "destructive",
      });
    }
  };
  // ----------------------------------------------------------------------

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

            {/* Global Countdown (IST) */}
            <div className="glass-card p-6 rounded-2xl max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-center mb-4">
                <Timer className="h-6 w-6 text-accent mr-2" />
                <span className="text-lg font-semibold">Offer Ends ({deadlineStrIST})</span>
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
                *Countdown is universal (IST). Registrations close after 10 sign-ups.
              </p>
            </div>

            {/* Spots (no-flicker: keep layout, hide numbers until loaded) */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span
                  className="text-lg font-semibold inline-block"
                  style={{ visibility: isStatusLoading ? "hidden" : "visible" }}
                >
                  {registeredCount}/{limit} Registered
                </span>
                {/* Reserve space when loading to avoid layout shift */}
                {isStatusLoading && (
                  <span className="text-lg font-semibold inline-block opacity-0 select-none">
                    00/00 Registered
                  </span>
                )}
              </div>
              <div
                className="text-accent font-bold text-lg"
                style={{ visibility: isStatusLoading ? "hidden" : "visible" }}
              >
                Only {spotsLeft} spots left!
              </div>
              {isStatusLoading && (
                <div className="text-accent font-bold text-lg opacity-0 select-none">
                  Only 00 spots left!
                </div>
              )}
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
                    {/* Keep it open visually until status known to avoid flicker */}
                    {!isStatusLoading && registrationClosed
                      ? "Registration Closed"
                      : "Claim Your FREE Portfolio"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!isStatusLoading && registrationClosed ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Registration Closed!</h3>
                      <p className="text-muted-foreground mb-6">
                        We’ve reached our limit of {limit} FREE portfolio websites. Thank you for your interest!
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
                        <Label htmlFor="name" className="block text-sm font-medium mb-2">
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
                        <Label htmlFor="email" className="block text-sm font-medium mb-2">
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
                        <Label htmlFor="phone" className="block text-sm font-medium mb-2">
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
                        <Label htmlFor="college" className="block text-sm font-medium mb-2">
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
                        <Label htmlFor="course" className="block text-sm font-medium mb-2">
                          Course/Major *
                        </Label>
                        <Input
                          id="course"
                          name="course"
                          type="text"
                          required
                          value={formData.course}
                          onChange={handleInputChange}
                          className="glass-card"
                          placeholder="e.g., Computer Science, IT, etc."
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-primary hover:opacity-90 text-white shadow-glow text-lg py-3"
                      >
                        {isSubmitting ? (
                          "Registering..."
                        ) : (
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
                    ["Professional Portfolio Website", "Custom-designed portfolio worth ₹5000"],
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
                    This offer is only available for the first {limit} users. After that,
                    portfolio websites will cost ₹5000.
                  </p>
                  {/* Keep layout; hide number while loading */}
                  <div
                    className="text-2xl font-bold text-red-500"
                    style={{ visibility: isStatusLoading ? "hidden" : "visible" }}
                  >
                    {spotsLeft} spots remaining
                  </div>
                  {isStatusLoading && (
                    <div className="text-2xl font-bold text-red-500 opacity-0 select-none">
                      00 spots remaining
                    </div>
                  )}
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
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                [
                  "Is this really FREE?",
                  "Yes! The first 10 users get a completely FREE portfolio website worth ₹5000. No hidden charges, no credit card required.",
                ],
                [
                  "How long will it take?",
                  "Your portfolio will be ready within 2-3 business days after registration. We'll send you updates via email.",
                ],
                [
                  "What if I'm not satisfied?",
                  "We offer unlimited revisions until you're 100% satisfied with your portfolio. Your success is our priority.",
                ],
                [
                  "Can I customize later?",
                  "Absolutely! You get 3 months of free support and can request changes anytime during this period.",
                ],
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
