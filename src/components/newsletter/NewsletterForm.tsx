"use client";

import { useState, FormEvent } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email) {
      setStatus("error");
      setMessage("Please enter your email address");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Successfully subscribed!");
        setEmail("");
        
        // Reset after 5 seconds
        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 5000);
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to subscribe. Please try again.");
        
        // Reset error after 5 seconds
        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 5000);
      }
    } catch (error) {
      setStatus("error");
      setMessage("Network error. Please check your connection.");
      
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          disabled={status === "loading" || status === "success"}
          className="flex-1 px-3 py-2 bg-charcoal-light border border-charcoal-lighter rounded text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-sweet-red disabled:opacity-50 disabled:cursor-not-allowed"
          required
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="px-4 py-2 bg-sweet-red hover:bg-sweet-red-dark text-white text-sm font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
          {status === "success" && <CheckCircle2 className="w-4 h-4" />}
          {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed!" : "Subscribe"}
        </button>
      </form>

      {/* Status Message */}
      {message && (
        <div
          className={`mt-2 text-xs flex items-center gap-1 ${
            status === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {status === "error" && <AlertCircle className="w-3 h-3" />}
          {status === "success" && <CheckCircle2 className="w-3 h-3" />}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
