"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailCapture({
  onSubmit,
}: {
  // returns true on success (stored). Never throws.
  onSubmit: (email: string) => Promise<boolean>;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setState("error");
      return;
    }
    setState("busy");
    const ok = await onSubmit(email.trim());
    setState(ok ? "done" : "error");
  }

  if (state === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-teal/50 bg-teal/15 p-4 text-center"
      >
        <p className="text-base font-semibold text-white">You're on the list 🎉</p>
        <p className="mt-1 text-sm text-white/70">
          Your Climber DNA is saved — we&apos;ll bring it into the app when it launches.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handle} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
      <p className="text-base font-semibold text-white">Save my Climber DNA 🧬</p>
      <p className="mt-1 text-sm text-white/60">
        Get early access to the Crux8 app + keep your result.
      </p>
      <div className="mt-3 flex gap-2">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder="you@email.com"
          aria-label="Email address"
          className="tap-target min-w-0 flex-1 rounded-xl border border-white/15 bg-navy/60 px-4 text-base text-white placeholder:text-white/40 focus:border-gold focus:outline-none"
        />
        <motion.button
          whileTap={{ scale: 0.96 }}
          type="submit"
          disabled={state === "busy"}
          className="tap-target shrink-0 rounded-xl bg-gold px-5 font-bold text-navy disabled:opacity-60"
        >
          {state === "busy" ? "…" : "Save"}
        </motion.button>
      </div>
      {state === "error" && (
        <p className="mt-2 text-sm text-coral">Enter a valid email and try again.</p>
      )}
    </form>
  );
}
