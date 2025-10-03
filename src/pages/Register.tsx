"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

// 🕒 Initial countdown time
const INITIAL_TIME_MS =
  5 * 24 * 60 * 60 * 1000 + // 5 days
  12 * 60 * 60 * 1000 +    // 12 hours
  30 * 60 * 1000 +        // 30 minutes
  45 * 1000;             // 45 seconds

const MAX_REGISTRATIONS = 10;

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [registeredCount, setRegisteredCount] = useState(0);
  const [registrationClosed, setRegistrationClosed] = useState(false);
  const [deadlineMs, setDeadlineMs] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_MS);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Optional reset (uncomment to clear saved deadline + count)
  /*
  useEffect(() => {
    localStorage.clear();
    console.log("🔄 LocalStorage reset — deadline and count cleared");
  }, []);
  */

  // ✅ Load saved deadline and count on mount
  useEffect(() => {
    const storedDeadline = localStorage.getItem("freePortfolio.deadlineMs");
    const storedCount = Number(localStorage.getItem("freePortfolio.registeredCount") || "0");
    const storedClosed = localStorage.getItem("freePortfolio.registrationClosed") === "true";

    setRegisteredCount(storedCount);
    setRegistrationClosed(storedClosed);

    if (storedDeadline) {
      setDeadlineMs(Number(storedDeadline));
    } else {
      const newDeadline = Date.now() + INITIAL_TIME_MS;
      localStorage.setItem("freePortfolio.deadlineMs", String(newDeadline));
      setDeadlineMs(newDeadline);
    }
  }, []);

  // ⏳ Countdown logic (persistent)
  useEffect(() => {
    if (!deadlineMs) return;

    const tick = () => {
      const remaining = Math.max(deadlineMs - Date.now(), 0);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        setRegistrationClosed(true);
        localStorage.setItem("freePortfolio.registrationClosed", "true");
      }
    };

    tick(); // run immediately
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [deadlineMs]);

  // 📩 Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registrationClosed || registeredCount >= MAX_REGISTRATIONS) return;

    setLoading(true);

    try {
      // Send email via FormSubmit
      await fetch("https://formsubmit.co/masanamkesava@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          _subject: "New Portfolio Registration",
          name,
          email,
          message: `A new user has registered for the free portfolio.\n\nName: ${name}\nEmail: ${email}`,
          _captcha: "false",
        }).toString(),
      });

      const newCount = registeredCount + 1;
      setRegisteredCount(newCount);
      localStorage.setItem("freePortfolio.registeredCount", String(newCount));

      if (newCount >= MAX_REGISTRATIONS) {
        setRegistrationClosed(true);
        localStorage.setItem("freePortfolio.registrationClosed", "true");
      }

      setSuccess(true);
      setName("");
      setEmail("");
    } catch (error) {
      alert("❌ Failed to send email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🧮 Format time left nicely
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const spotsLeft = Math.max(0, MAX_REGISTRATIONS - registeredCount);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-lg w-full bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg p-8 border border-border"
      >
        {!registrationClosed ? (
          <>
            <h1 className="text-3xl font-bold mb-2 text-center">
              🎉 Free Portfolio Registration
            </h1>
            <p className="text-center text-muted-foreground mb-6">
              Spots left:{" "}
              <span className="font-semibold text-primary">{spotsLeft}</span> / {MAX_REGISTRATIONS}
            </p>

            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground">Time remaining:</p>
              <p className="text-lg font-semibold">{formatTime(timeLeft)}</p>
            </div>

            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Registering..." : "Register Now"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold">Registration Successful ✅</h2>
                <p className="text-muted-foreground">
                  A confirmation has been sent. You secured your spot!
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-600">Registration Closed 🚫</h2>
            <p className="text-muted-foreground">
              {registeredCount >= MAX_REGISTRATIONS
                ? "All spots have been filled."
                : "The registration deadline has passed."}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
