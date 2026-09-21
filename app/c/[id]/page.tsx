import type { Metadata } from "next";
import Link from "next/link";
import { results } from "@/games/climber-personality/results";
import { DIMENSIONS } from "@/games/climber-personality/dimensions";
import { L, type Lang } from "@/lib/gameTypes";
import BackgroundFX from "@/components/BackgroundFX";
import Emblem from "@/components/Emblem";
import StatBar from "@/components/StatBar";
import SharedExtras from "./extras";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://play.crux8.app";

type Props = {
  params: { id: string };
  searchParams: { s?: string; l?: string };
};

function lookup(id: string) {
  return results.find((x) => x.id === id) || results[0];
}

function langOf(l: string | undefined): Lang {
  return l === "zh" ? "zh" : "en";
}

// DNA values travel as ?s=v,v,v,v,v,v in DIMENSIONS order (same as /api/card).
function parseDna(s: string | undefined): number[] {
  const parts = (s || "").split(",");
  return DIMENSIONS.map((_, i) => {
    const n = parseInt(parts[i] || "", 10);
    return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
  });
}

function pageUrl(id: string, s: string, lang: Lang) {
  return `${SITE_URL}/c/${id}?s=${encodeURIComponent(s)}&l=${lang}`;
}

export function generateMetadata({ params, searchParams }: Props): Metadata {
  const result = lookup(params.id);
  const lang = langOf(searchParams.l);
  const s = searchParams.s || "";
  const name = L(result.name, lang);
  const card = `${SITE_URL}/api/card?r=${result.id}&s=${encodeURIComponent(
    s
  )}&l=${lang}`;
  const title =
    lang === "zh"
      ? `我是「${name}」🧗 | Crux8 Play`
      : `I'm ${name} 🧗 | Crux8 Play`;
  const description =
    lang === "zh"
      ? `${L(result.tagline, lang)} 来测测你的攀岩 DNA！`
      : `${L(result.tagline, lang)} What's your Climber DNA?`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl(result.id, s, lang),
      siteName: "Crux8 Play",
      type: "website",
      images: [{ url: card, width: 1080, height: 1920, alt: name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [card],
    },
  };
}

// The landing spot for a shared card link: shows the friend's archetype card
// (the same medallion + DNA the unfurl image shows) with a CTA into the quiz.
export default function SharedCard({ params, searchParams }: Props) {
  const result = lookup(params.id);
  const lang = langOf(searchParams.l);
  const values = parseDna(searchParams.s);
  const dna = DIMENSIONS.map((d, i) => ({
    label: d.label,
    emoji: d.emoji,
    value: values[i],
  }));

  return (
    <main className="relative flex min-h-dvh flex-col items-center px-6 pb-10 pt-10">
      <BackgroundFX />

      <p className="text-center text-xs font-bold tracking-[0.45em] text-gold">
        CRUX8 PLAY
      </p>
      <p className="mt-2 text-center text-sm font-medium text-white/50">
        {lang === "zh" ? "一张攀岩人格卡片" : "A climber personality card"}
      </p>

      <SharedExtras id={result.id} dnaValues={values} lang={lang} />

      <div className="mt-6 flex flex-col items-center text-center">
        <Emblem id={result.id} accent={result.accent} size={168} />
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-gold">
          {L(result.name, lang)}
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-lg font-semibold text-[#F5EFE0]">
          “{L(result.tagline, lang)}”
        </p>
        {result.secondary && (
          <p className="mt-2 max-w-xs text-sm text-white/60">
            {L(result.secondary, lang)}
          </p>
        )}
      </div>

      <div className="mt-6 w-full max-w-sm">
        <p className="mb-3 text-center text-sm font-semibold tracking-[0.2em] text-white/50">
          {lang === "zh" ? "攀岩 DNA" : "CLIMBER DNA"}
        </p>
        <div className="flex flex-col gap-3 rounded-3xl bg-white/[0.05] p-5 shadow-lg shadow-black/40 ring-1 ring-white/10">
          {dna.map((d, i) => (
            <StatBar
              key={d.label.en}
              label={`${d.emoji} ${L(d.label, lang)}`}
              value={d.value}
              delay={0.15 + i * 0.1}
            />
          ))}
        </div>
      </div>

      <Link
        href="/"
        className="tap-target mt-8 w-full max-w-sm rounded-2xl bg-gradient-to-r from-[#F6D47C] via-[#E8B83A] to-[#B9862A] py-4 text-center text-lg font-bold text-[#1a1206] shadow-lg shadow-gold/25"
      >
        {lang === "zh"
          ? "⚡ 测测我是什么类型"
          : "⚡ Discover your archetype"}
      </Link>
      <p className="mt-3 text-center text-xs text-white/45">
        {lang === "zh"
          ? "60 秒 · 无需注册 · 纯粹攀岩"
          : "60 seconds · No sign-up · Just climbing"}
      </p>
    </main>
  );
}
