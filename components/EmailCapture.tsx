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
        className="rounded-2xl border border-teal/30 bg-teal/10 p-4 text-center"
      >
        <p className="text-base font-semibold text-ink">You're on the list 🎉</p>
        <p className="mt-1 text-sm text-ink/60">
          Climber DNA saved. Promos, buddies, and good vibes are coming your way —
          check your inbox soon.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handle} className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
      <p className="text-base font-semibold text-ink">🎟️ Join the Crux8 app waitlist</p>
      <p className="mt-1 text-sm text-ink/70">
        Find the perfect buddy for a session tonight or a group trip outdoors.
      </p>
      <p className="mt-1 text-sm font-semibold text-teal">
        Promos, buddies &amp; good vibes coming your way.
      </p>
      <div className="mt-3 flex gap-2">
        <input
          id="waitlist-email"
          name="email"
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
          className="tap-target min-w-0 flex-1 rounded-xl border border-ink/15 bg-cream px-4 text-base text-ink placeholder:text-ink/40 focus:border-gold focus:outline-none"
        />
        <motion.button
          whileTap={{ scale: 0.96 }}
          type="submit"
          disabled={state === "busy"}
          className="tap-target shrink-0 rounded-xl bg-gold px-5 font-bold text-white disabled:opacity-60"
        >
          {state === "busy" ? "…" : "Claim"}
        </motion.button>
      </div>
      {state === "error" && (
        <p className="mt-2 text-sm text-coral">Enter a valid email and try again.</p>
      )}
    </form>
  );
}
