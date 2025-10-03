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
const STATUS_TABLE = "free_portfolio_status";
const RPC_GET_STATUS = "get_free_portfolio_status";
const RPC_REGISTER = "register_free_portfolio";
const RPC_RESET = "reset_free_portfolio";
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

  // ✅ Loading state to avoid flickering
  const [isStatusLoading, setIsStatusLoading] = useState(true);

  const registrationClosed = !isOpen || registeredCount >= limit;
  const spotsLeft = Math.max(0, limit - registeredCount);

  // Live ticking countdown
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const timeLeft = (() => {
    const remaining = Math.max(0, DEADLINE_MS - Date.now());
    return toTimeParts(remaining);
  })();
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
    setIsStatusLoading(true);
    const { data, error } = await supabase.rpc(RPC_GET_STATUS);
    if (error) {
      console.error("Status error:", error);
      setRegisteredCount(0);
      setLimit(10);
      setIsOpen(true);
      setIsStatusLoading(false);
      return;
    }
    const s = data as Status;
    setRegisteredCount(s?.registeredCount ?? 0);
    setLimit(s?.limit ?? 10);
    setIsOpen(!!s?.isOpen);
    setIsStatusLoading(false);
  };

  // Initial load
  useEffect(() => {
    refetchStatus();
  }, []);

  // Realtime updates
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

      setRegisteredCount(newCount);

      // Optional Formsubmit email forwarding
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

  // Admin reset
  const isAdmin =
    typeof window !== "undefined" &&
    window.localStorage?.getItem("freePortfolio.isAdmin") === "1";

  const handleAdminReset = async () => {
    try {
      const { error: rpcErr } = await supabase.rpc(RPC_RESET);
      if (rpcErr) {
        console.warn("RPC reset failed, trying table delete fallback:", rpcErr.message);
        const { error: delErr } = await supabase
          .from(REG_TABLE)
          .delete()
          .neq("id", 0);
        if (delErr) throw delErr;
      }

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

            {/* Global Countdown */}
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

            {/* Spots section with skeleton while loading */}
            {isStatusLoading ? (
              <div className="flex justify-center mb-8 animate-pulse">
                <div className="h-6 w-48 bg-muted rounded"></div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-lg font-semibold">
                    {registeredCount}/{limit} Registered
                  </span>
                </div>
                <div className="text-accent font-bold text-lg">
                  Only {spotsLeft} spots left!
                </div>
              </div>
            )}

            {/* Admin-only reset */}
            {isAdmin && (
              <div className="flex justify-center">
                <Button
                  type="button"
                  onClick={handleAdminReset}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Admin: Reset Registrations
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* FORM + Sidebar */}
        {/* ... [the rest of your code remains unchanged] */}
        {/* ✅ No changes needed below this line */}
      </div>
    </div>
  );
};

export default Register;
