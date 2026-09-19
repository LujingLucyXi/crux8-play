"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Lang } from "@/lib/gameTypes";
import { tr } from "@/lib/i18n";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailCapture({
  lang,
  onSubmit,
}: {
  lang: Lang;
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
        <p className="text-base font-semibold text-ink">{tr("emailDoneTitle", lang)}</p>
        <p className="mt-1 text-sm text-ink/60">{tr("emailDoneSub", lang)}</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handle} className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
      <p className="text-base font-semibold text-ink">{tr("emailTitle", lang)}</p>
      <p className="mt-1 text-sm text-ink/70">{tr("emailSub", lang)}</p>
      <p className="mt-1 text-sm font-semibold text-teal">{tr("emailPerk", lang)}</p>
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
          placeholder={tr("emailPlaceholder", lang)}
          aria-label="Email address"
          className="tap-target min-w-0 flex-1 rounded-xl border border-ink/15 bg-cream px-4 text-base text-ink placeholder:text-ink/40 focus:border-gold focus:outline-none"
        />
        <motion.button
          whileTap={{ scale: 0.96 }}
          type="submit"
          disabled={state === "busy"}
          className="tap-target shrink-0 rounded-xl bg-gold px-5 font-bold text-white disabled:opacity-60"
        >
          {state === "busy" ? tr("emailBusy", lang) : tr("emailClaim", lang)}
        </motion.button>
      </div>
      {state === "error" && (
        <p className="mt-2 text-sm text-coral">{tr("emailError", lang)}</p>
      )}
    </form>
  );
}
