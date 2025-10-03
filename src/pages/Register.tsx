import { useMemo, useState } from "react";
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
import { ToastAction } from "@/components/ui/toast"; // ✅ added
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { useFreePortfolioStatus } from "@/hooks/useFreePortfolioStatus";
import { useCountdown } from "@/hooks/useCountdown";
import { sendRegistrationEmail } from "@/lib/email";

const RPC_REGISTER = "register_free_portfolio";

const DEADLINE_ISO = import.meta.env.VITE_COUNTDOWN_DEADLINE || "2025-10-10T00:00:00+05:30";

export default function Register() {
  const { toast } = useToast();
  const { parts: timeLeft, deadlineStrIST } = useCountdown(DEADLINE_ISO);
  const { registrationClosed, registeredCount, limit, spotsLeft, resetAll } = useFreePortfolioStatus();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    course: "",
  });

  const isAdmin =
    typeof window !== "undefined" &&
    window.localStorage?.getItem("freePortfolio.isAdmin") === "1";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    if (!formData.name.trim()) return "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Valid email is required.";
    if (!/^\+?\d[\d\s-]{7,15}$/.test(formData.phone)) return "Valid phone is required.";
    if (!formData.college.trim()) return "College/University is required.";
    if (!formData.course.trim()) return "Course/Major is required.";
    return null;
  };

  const submitRegistration = async () => {
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
    return { ok, newCount, message: data?.message as string | undefined };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registrationClosed) {
      toast({
        title: "Registration Closed",
        description: "Sorry, we’ve reached the limit.",
        variant: "destructive",
        duration: 3000,
        action: <ToastAction altText="Close">🎉🎉 Close</ToastAction>,
      });
      return;
    }

    const v = validate();
    if (v) {
      toast({
        title: "Fix form errors",
        description: v,
        variant: "destructive",
        duration: 3000,
        action: <ToastAction altText="Close">🎉🎉 Close</ToastAction>,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1) Atomic registration
      const { ok, message } = await submitRegistration();
      if (!ok) {
        toast({
          title: "Registration Closed",
          description: message || "No spots remaining.",
          variant: "destructive",
          duration: 3000,
          action: <ToastAction altText="Close">🎉🎉 Close</ToastAction>,
        });
        return;
      }

      // 2) Email notify via FormSubmit (checked)
      const emailRes = await sendRegistrationEmail(formData, {
        to: "masanamkesava@gmail.com",
        nextUrl: "https://formsubmit.co/thanks",
      });

      if (!emailRes.ok) {
        console.warn("FormSubmit failed:", emailRes.status, emailRes.message);
        toast({
          title: "Registered (email pending) 🎉🎉",
          description: "We received your registration, but email forwarding failed. We’ll contact you manually.",
          duration: 3000,
          action: <ToastAction altText="Close">🎉🎉 Close</ToastAction>,
        });
      } else {
        toast({
          title: "Registered! 🎉🎉",
          description: "We’ll get back to you within 24 hours.",
          duration: 3000,
          action: <ToastAction altText="Close">🎉🎉 Close</ToastAction>,
        });
      }

      setFormData({ name: "", email: "", phone: "", college: "", course: "" });
    } catch (err: any) {
      console.error("Registration error:", err);
      toast({
        title: "Registration Failed",
        description: err?.message ?? "Please try again.",
        variant: "destructive",
        duration: 3000,
        action: <ToastAction altText="Close">🎉🎉 Close</ToastAction>,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminReset = async () => {
    try {
      await resetAll();
      toast({
        title: "Reset complete 🎉🎉",
        description: "All registrations cleared and counts refreshed.",
        duration: 3000,
        action: <ToastAction altText="Close">🎉🎉 Close</ToastAction>,
      });
    } catch (err: any) {
      toast({
        title: "Reset failed",
        description: err?.message ?? "Check RLS or create RPC `reset_free_portfolio`.",
        variant: "destructive",
        duration: 3000,
        action: <ToastAction altText="Close">🎉🎉 Close</ToastAction>,
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* ... UI remains unchanged ... */}
    </div>
  );
}
