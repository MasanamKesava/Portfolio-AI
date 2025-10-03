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
          title: "Registered (email pending)",
          description: "We received your registration, but email forwarding failed. We’ll contact you manually.",
          duration: 3000,
          action: <ToastAction altText="Close">🎉🎉 Close</ToastAction>,
        });
      } else {
        toast({
          title: "Registered!",
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
        title: "Reset complete",
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
                <span className="text-lg font-semibold">Offer Ends ({deadlineStrIST})</span>
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                {(["days","hours","minutes","seconds"] as const).map((k) => (
                  <div key={k} className="bg-gradient-primary p-3 rounded-lg text-white">
                    <div className="text-2xl font-bold">{(timeLeft as any)[k]}</div>
                    <div className="text-sm">{k[0].toUpperCase()+k.slice(1)}</div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                *Countdown is universal (IST). Registrations close after {limit} sign-ups.
              </p>
            </div>

            {/* Spots */}
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

            {/* Admin */}
            {isAdmin && (
              <div className="flex justify-center">
                <Button type="button" onClick={handleAdminReset} className="bg-red-600 hover:bg-red-700 text-white">
                  Admin: Reset Registrations
                </Button>
              </div>
            )}
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
                    {registrationClosed ? "Registration Closed" : "Claim Your FREE Portfolio"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {registrationClosed ? (
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
                      {[
                        {
                          id: "name",
                          label: "Full Name *",
                          icon: User,
                          type: "text",
                          placeholder: "Enter your full name",
                        },
                        {
                          id: "email",
                          label: "Email Address *",
                          icon: Mail,
                          type: "email",
                          placeholder: "your.email@example.com",
                        },
                        {
                          id: "phone",
                          label: "Phone Number *",
                          icon: Phone,
                          type: "tel",
                          placeholder: "+91 XXXXX XXXXX",
                        },
                        {
                          id: "college",
                          label: "College/University *",
                          icon: GraduationCap,
                          type: "text",
                          placeholder: "Your college/university name",
                        },
                        {
                          id: "course",
                          label: "Course/Major *",
                          icon: null,
                          type: "text",
                          placeholder: "e.g., Computer Science, IT, etc.",
                        },
                      ].map(({ id, label, icon: Icon, type, placeholder }) => (
                        <div key={id}>
                          <Label htmlFor={id} className="block text-sm font-medium mb-2">
                            {label}
                          </Label>
                          <div className="relative">
                            {Icon && <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
                            <Input
                              id={id}
                              name={id}
                              type={type}
                              required
                              value={(formData as any)[id]}
                              onChange={handleInputChange}
                              className={Icon ? "glass-card pl-10" : "glass-card"}
                              placeholder={placeholder}
                            />
                          </div>
                        </div>
                      ))}

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-primary hover:opacity-90 text-white shadow-glow text-lg py-3"
                      >
                        {isSubmitting ? "Registering..." : (<>Claim FREE Portfolio<ArrowRight className="ml-2 h-5 w-5" /></>)}
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

        {/* FAQ unchanged */}
        {/* ... keep your FAQ section as-is ... */}
      </div>
    </div>
  );
}
