import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Brain,
  FileText,
  Github,
  Award,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  Timer,
  Phone,
  Mail,
  MessageCircle,
  Zap,
  Target,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Heart,
  Shield,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import founderImage from "@/assets/kesava-profile.png";

/** Prefilled mailto link (subject + body) and GitHub profile */
const MAILTO_HREF =
  "mailto:masanamkesava@gmail.com?subject=Hi%20Kesava%20Request%20for%20Website%20Portfolio%20and%20Resume&body=Hi%20Kesava%0D%0A%0D%0AI%20found%20it%20useful%20for%20making%20my%20resume%20and%20portfolio.%20We%20want%20to%20talk%20to%20you.%0D%0A%0D%0ARegards,%0D%0A[Your%20Name]%0D%0A[details]";
const GITHUB_URL = "https://github.com/MasanamKesava";

const Index = () => {
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 12,
    minutes: 30,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0)
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <Brain className="h-9 w-9" />,
      title: "AI Resume Analyzer",
      description:
        "Get intelligent feedback on your resume with AI-powered scoring and suggestions",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <FileText className="h-9 w-9" />,
      title: "ATS-Friendly Templates",
      description:
        "Professional resume templates optimized for Applicant Tracking Systems",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Github className="h-9 w-9" />,
      title: "GitHub Integration",
      description:
        "Automatically import your projects and showcase your coding journey",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Award className="h-9 w-9" />,
      title: "Placement Tracker",
      description:
        "Monitor your placement readiness with comprehensive progress tracking",
      color: "from-orange-500 to-red-500",
    },
  ];

  const testimonials = [
    {
      name: "Priya ",
      role: "Software Engineer ",
      content:
        "This platform helped me land my dream job! The AI resume analyzer was incredibly helpful.",
      rating: 5,
    },
    {
      name: "Kathyaini",
      role: "Senior .NET Developer",
      content:
        "The GitHub integration saved me hours of work. My portfolio looks amazing now!",
      rating: 5,
    },
  ];

  const stats = [
    { number: "500+", label: "Success Stories" },
    { number: "3", label: "U.S. Clients Deployed" },
    { number: "95%", label: "Placement Success Rate" },
    { number: "1000+", label: "Templates Available" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* animations */}
      <style>{`
        @keyframes wiggle {
          0%,100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-2px) rotate(-0.6deg); }
          50% { transform: translateY(1px) rotate(0.6deg); }
          75% { transform: translateY(-1px) rotate(-0.4deg); }
        }
        .animate-wiggle-slow     { animation: wiggle 3.5s ease-in-out infinite; }
        .animate-wiggle-slower   { animation: wiggle 4.2s ease-in-out infinite; animation-delay:.6s; }
        .animate-wiggle-slowest  { animation: wiggle 4.8s ease-in-out infinite; animation-delay:1s; }

        @keyframes bob {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-6px); }
        }
        .animate-bob        { animation: bob 3.6s ease-in-out infinite; }
        .animate-bob-delay  { animation: bob 3.6s ease-in-out infinite; animation-delay: .9s; }

        .glow-ring {
          box-shadow:
            0 0 0 8px rgba(124, 58, 237, 0.16),
            0 18px 40px rgba(124, 58, 237, 0.28);
        }
      `}</style>
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left */}
            <div className="space-y-8">
              <div className="flex gap-3 mb-6">
                <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-2 text-sm">
                  <Zap className="h-4 w-4 mr-2" />
                  AI - Powered Platform
                </Badge>
                <Badge className="bg-success/20 text-success border-success/30 px-4 py-2 text-sm">
                  <CheckCircle className="h-4 w-4 mr-2" /> 3 US Clients Deployed
                </Badge>
              </div>

              <h1 className="text-[44px] md:text-[56px] font-extrabold leading-tight">
                <span className="text-primary"> AI - Powered </span>
                <br />
                <span className="text-foreground"> Portfolio & Resume </span>
                <br />
                <span className="text-primary"> Builder </span>
              </h1>

              <p className="text-[18px] md:text-[20px] text-muted-foreground max-w-xl leading-relaxed">
                Transform your career with our intelligent platform.Build ATS -
                friendly resumes, stunning portfolios, and get AI - powered
                insights to land your dream job.
              </p>

              {/* Rating & Success */}
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="text-[15px] text-muted-foreground">
                    5.0 Rating
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-success" />
                  <span className="text-[15px] text-muted-foreground">
                    100 % Success Rate
                  </span>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-extrabold text-primary">
                    ₹1999
                  </div>
                  <div className="text-2xl text-muted-foreground line-through">
                    ₹5000
                  </div>
                  <Badge className="bg-accent text-white px-3 py-1 text-sm">
                    60 % OFF
                  </Badge>
                </div>
                <p className="text-success font-semibold text-[17px]">
                  First 10 users get FREE Portfolio Website!
                </p>
                <div className="text-accent text-[16px]">
                  Offer ends in:{" "}
                  <span className="font-bold"> {timeLeft.days} Days </span>
                </div>
              </div>

              <Link to="/contact">
                <Button className="bg-gradient-primary hover:opacity-90 text-white shadow-glow text-lg px-9 py-5">
                  Get Started Now
                </Button>
              </Link>

              {/* Hours */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  Business Hours
                </h3>
                <div className="space-y-2 text-center text-[15px]">
                  <div className="flex justify-between">
                    <span>Mon - Fri: </span>
                    <span className="text-primary"> 9:00 AM - 6:00 PM </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday: </span>
                    <span className="text-primary"> 10:00 AM - 4:00 PM </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday: </span>
                    <span className="text-muted-foreground"> Closed </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right – Bigger profile card with bob animation */}
            <div className="relative">
              <div className="relative mx-auto max-w-xl rounded-[32px] bg-black/40 backdrop-blur-md border border-white/10 p-10 shadow-2xl animate-bob">
                {/* photo */}
                <div className="relative w-64 h-64 md:w-72 md:h-72 mx-auto">
                  <img
                    src={founderImage}
                    alt="Kesava Masanam"
                    className="w-full h-full rounded-2xl object-cover glow-ring"
                  />
                  <div className="absolute -top-3 -right-3 rounded-full p-3 bg-primary/90 shadow-lg ring-4 ring-primary/30">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* details */}
                <div className="mt-7 text-center animate-bob-delay">
                  <h3 className="text-[28px] md:text-[30px] font-extrabold text-indigo-300">
                    Kesava Masanam
                  </h3>
                  <p className="text-[16px] md:text-[17px] text-gray-300 mt-1">
                    Portfolio & AI Specialist
                  </p>

                  {/* contact */}
                  <div className="mt-5 space-y-2 text-[15px]">
                    <div className="flex items-center justify-center gap-2 text-indigo-200">
                      <Mail className="w-4 h-4" />
                      <a href={MAILTO_HREF} className="hover:underline">
                        masanamkesava@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-indigo-200">
                      <Phone className="w-4 h-4" />
                      <a href="tel:+919059086142" className="hover:underline">
                        +91 9059086142
                      </a>
                    </div>
                  </div>
                </div>

                {/* LEFT floating giggle cards */}
                <div className="hidden lg:block">
                  <div className="absolute left-[-78px] top-8">
                    <div className="animate-wiggle-slow rounded-2xl bg-gradient-to-b from-indigo-900/40 to-indigo-900/10 border border-indigo-500/20 px-6 py-5 text-center shadow-lg">
                      <div className="text-[24px] font-bold text-indigo-300">
                        500 +
                      </div>
                      <div className="text-[12px] text-indigo-200/80">
                        Portfolio Templates
                      </div>
                    </div>
                  </div>

                  <div className="absolute left-[-78px] bottom-10">
                    <div className="animate-wiggle-slower rounded-2xl bg-gradient-to-b from-indigo-900/40 to-indigo-900/10 border border-indigo-500/20 px-6 py-5 text-center shadow-lg">
                      <div className="text-[18px] font-semibold text-indigo-300">
                        AI
                      </div>
                      <div className="text-[12px] text-indigo-200/80">
                        Powered Tools
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT floating giggle card */}
                <div className="hidden lg:block">
                  <div className="absolute right-[-78px] bottom-6">
                    <div className="animate-wiggle-slowest rounded-2xl bg-gradient-to-b from-indigo-900/40 to-indigo-900/10 border border-indigo-500/20 px-7 py-6 text-center shadow-lg">
                      <div className="text-[24px] font-bold text-indigo-300">
                        98 %
                      </div>
                      <div className="text-[12px] text-indigo-200/80">
                        Job Success Rate
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Right */}
          </div>
        </div>
      </section>
      {/* Pricing */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8"> Special Launch Pricing </h2>
          <div className="glass-card p-9 rounded-3xl max-w-md mx-auto hover-lift">
            <div className="mb-6">
              <div className="text-6xl font-bold text-accent mb-2">₹1999 </div>
              <div className="text-lg text-muted-foreground line-through">
                ₹5000
              </div>
              <Badge className="bg-accent text-white"> 60 % OFF </Badge>
            </div>
            <div className="space-y-4 mb-8 text-[16px]">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success mr-3" />
                <span>AI Resume Analysis </span>
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success mr-3" />
                <span>Unlimited Templates </span>
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success mr-3" />
                <span>GitHub Integration </span>
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success mr-3" />
                <span>Portfolio Website </span>
              </div>
            </div>
            <Link to="/contact">
              <Button className="bg-gradient-primary hover:opacity-90 text-white shadow-glow text-lg px-9 py-5">
                Get Started Free
              </Button>
            </Link>
          </div>
          <p className="text-center mt-6 text-accent font-semibold">
            🎉 First 10 users get FREE Portfolio Website worth ₹5000!
          </p>
        </div>
      </section>
      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4"> Powerful Features </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to stand out in placements
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="glass-card border-0 hover-lift hover-glow"
              >
                <CardContent className="p-7 text-center">
                  <div
                    className={`w-18 h-18 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-[19px] font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[15px] text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-[15px] text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* About */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Meet Your Success Partner
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Hi! I'm the founder of PortfolioBuilder. Having successfully
                deployed 3 client portfolios in the U.S.and helped hundreds of
                students land their dream jobs, I understand what recruiters are
                looking for.
              </p>
              <div className="space-y-4 text-[16px]">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-success mr-3" />
                  <span>3 U.S.Client Portfolios Successfully Deployed </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-success mr-3" />
                  <span>500 + Reference Portfolios Available </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-success mr-3" />
                  <span>95 % Placement Success Rate </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button
                  asChild
                  className="bg-gradient-primary hover:opacity-90 text-white"
                >
                  <a href="tel:9059086142">
                    <Phone className="mr-2 h-4 w-4" />
                    Call: 9059086142
                  </a>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-accent hover:opacity-90 text-white"
                >
                  <a
                    href="https://wa.me/9059086142"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp Chat
                  </a>
                </Button>
              </div>
            </div>

            <div className="text-center">
              <div className="glass-card p-9 rounded-3xl hover-lift">
                <img
                  src={founderImage}
                  alt="Founder"
                  className="w-72 h-72 object-cover rounded-2xl mx-auto mb-4 shadow-glow"
                />
                <h3 className="text-[24px] font-bold mb-2"> Kesava Masanam </h3>
                <p className="text-[15px] text-muted-foreground mb-4">
                  Founder & Portfolio Expert
                </p>
                <div className="flex justify-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="glass-button"
                  >
                    <a href={MAILTO_HREF}>
                      <Mail className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="glass-button"
                  >
                    <a
                      href={GITHUB_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Portfolio Samples */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4"> Portfolio Samples </h2>
            <p className="text-xl text-muted-foreground">
              See how our students showcase their skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Tech Portfolio",
                description:
                  "Modern developer portfolio with projects showcase",
                image:
                  "https://res.cloudinary.com/dswrgvg3c/image/upload/v1758576631/tech_ksczhd.png",
              },
              {
                title: "Design Portfolio",
                description:
                  "Creative designer portfolio with stunning visuals",
                image:
                  "https://res.cloudinary.com/dswrgvg3c/image/upload/v1758576468/Design_rqdid9.png",
              },
              {
                title: "Data Science Portfolio",
                description:
                  "Analytics-focused portfolio with project insights",
                image:
                  "https://res.cloudinary.com/dswrgvg3c/image/upload/v1758576986/data_science_ra0pzj.png",
              },
            ].map((sample, index) => (
              <Card
                key={index}
                className="glass-card border-0 overflow-hidden hover-lift group"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={sample.image}
                    alt={sample.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">
                    {" "}
                    {sample.title}{" "}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {sample.description}
                  </p>
                  <Link to="/products">
                    <Button
                      variant="outline"
                      size="sm"
                      className="glass-button"
                    >
                      View Sample
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4"> Success Stories </h2>
            <p className="text-xl text-muted-foreground">
              See what our users are saying
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, index) => (
              <Card key={index} className="glass-card border-0 hover-lift">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4"> "{t.content}" </p>
                  <div>
                    <div className="font-semibold"> {t.name} </div>
                    <div className="text-sm text-muted-foreground">
                      {t.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12 rounded-3xl">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Build Your Future ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students who have already transformed their
              careers with our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* ✅ Start Your Journey navigates to /contact */}
              <Button
                className="bg-gradient-primary hover:opacity-90 text-white shadow-glow text-lg px-8 py-4"
                onClick={() => navigate("/register")}
              >
                Register FREE Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              {/* Secondary CTA also routes to /contact */}
              <Button
                variant="outline"
                className="glass-button text-lg px-8 py-4"
                onClick={() => navigate("/contact")}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
      { /* Footer */ }
      <footer className="border-t border-border bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand + blurb */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-foreground">
                  PortfolioAI
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Transform your career with our AI-powered portfolio and resume
                builder. Join thousands of students who have successfully landed
                their dream jobs.
              </p>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-500/10 dark:hover:bg-purple-500/20"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  +91 9059086142
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-500/10 dark:hover:bg-purple-500/20"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  <a
                    href="https://wa.me/9059086142"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-foreground font-semibold mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/resume-builder"
                    className="text-muted-foreground hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                  >
                    Resume Builder
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                  >
                    AI Tools
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="text-muted-foreground hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                  >
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link
                    to="#pricing"
                    className="text-muted-foreground hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-muted-foreground hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-foreground font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/products"
                    className="text-muted-foreground hover:text-purple-700 dark:hover:text-purple-300 transition-colors flex items-center gap-1"
                  >
                    Sample Portfolios <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="/resume-builder"
                    className="text-muted-foreground hover:text-purple-700 dark:hover:text-purple-300 transition-colors flex items-center gap-1"
                  >
                    Resume Templates <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/MasanamKesava"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-purple-700 dark:hover:text-purple-300 transition-colors flex items-center gap-1"
                  >
                    GitHub Repos <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact / hours */}
            <div>
              <h3 className="text-foreground font-semibold mb-4">
                Get In Touch
              </h3>
              <div className="space-y-3 text-sm">
                <div className="text-muted-foreground">
                  <strong className="text-foreground">Business Hours:</strong>
                  <br />
                  Mon - Fri: 9:00 AM - 6:00 PM
                  <br />
                  Sat - Sun: 10:00 AM - 4:00 PM
                </div>
              </div>
            </div>
          </div>

          {/* Offer strip */}
          <div className="rounded-lg p-4 mb-8 border border-border bg-gradient-to-r from-green-500/10 to-purple-500/10">
            <div className="flex items-center justify-center gap-2 text-center">
              <Zap className="w-5 h-5 text-green-700 dark:text-green-400" />
              <span className="font-medium text-green-700 dark:text-green-400">
                Special Launch Offer
              </span>
            </div>
            <p className="text-sm mt-1 text-center text-muted-foreground">
              First 10 users get FREE Portfolio Website worth ₹5000. Only 5 days
              left!
            </p>
          </div>

          {/* CTA strip */}
          <div className="rounded-lg p-6 mb-8 border border-border bg-gradient-to-r from-purple-500/10 to-pink-500/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Ready to Transform Your Career?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Contact Kesava Masanam for personalized portfolio and resume
                  solutions
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-500/10 dark:hover:bg-purple-500/20"
                >
                  <a href={MAILTO_HREF}>
                    <Mail className="w-4 h-4 mr-2" />
                    masanamkesava@gmail.com
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-500/10 dark:hover:bg-purple-500/20"
                >
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub Profile
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="border-t border-border pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>© 2025 PortfolioAI. All rights reserved.</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  Made with <Heart className="w-4 h-4 text-red-500" /> by Kesava
                  Masanam
                </span>
              </div>
              <div className="flex gap-6 text-sm">
                <Link
                  to="#"
                  className="text-muted-foreground hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="https://www.termsfeed.com/live/b7d4049b-4aac-48ee-8b84-12a1b71f3a8c"
                  className="text-muted-foreground hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  to="https://www.termsfeed.com/live/49188121-f740-4aa8-8d64-6b9c19f8937b"
                  className="text-muted-foreground hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  Support
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-6 border-t border-border text-xs">
              <div className="flex items-center gap-1 text-foreground/80">
                <Shield className="w-4 h-4 text-green-700 dark:text-green-400" />
                <span>Trusted by students from top colleges</span>
              </div>
              <div className="flex items-center gap-1 text-foreground/80">
                <CheckCircle className="w-4 h-4 text-green-700 dark:text-green-400" />
                <span>98% job success rate</span>
              </div>
              <div className="flex items-center gap-1 text-foreground/80">
                <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span>3 US clients successfully deployed</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
