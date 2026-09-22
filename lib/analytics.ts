"use client";

import posthog from "posthog-js";
import { getDeviceType, getReferralSource } from "./session";

let initialized = false;
let enabled = false;

export type AnalyticsEvent =
  | "page_view"
  | "game_started"
  | "nickname_set"
  | "question_answered"
  | "game_completed"
  | "result_viewed"
  | "share_clicked"
  | "share_success"
  | "play_again"
  | "crux8_cta_clicked"
  | "waitlist_submitted"
  | "invite_clicked";

export function initAnalytics() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return; // analytics disabled — gameplay unaffected
  try {
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      capture_pageview: false,
      persistence: "memory",
    });
    enabled = true;
  } catch {
    enabled = false;
  }
}

// Analytics must NEVER block or break gameplay — everything is wrapped.
export function track(event: AnalyticsEvent, props: Record<string, unknown> = {}) {
  try {
    const payload = {
      ...props,
      game_id: props.game_id ?? "climber-personality",
      device_type: getDeviceType(),
      referral_source: getReferralSource(),
      ts: new Date().toISOString(),
    };
    if (enabled) posthog.capture(event, payload);
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.debug("[analytics]", event, payload);
    }
  } catch {
    /* swallow — never break the game */
  }
}
