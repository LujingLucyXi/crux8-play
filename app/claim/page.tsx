import type { Metadata } from "next";
import { results } from "@/games/climber-personality/results";
import { DIMENSIONS } from "@/games/climber-personality/dimensions";
import { L, type Lang } from "@/lib/gameTypes";
import { getHouseForArchetype, getHouseById } from "@/lib/houses";
import BackgroundFX from "@/components/BackgroundFX";
import Emblem from "@/components/Emblem";
import StatBar from "@/components/StatBar";

// The live Crux8 app (web-first). The claim params ride along so the app's
// /claim route can import the DNA in one tap. (Native App Store link swaps
// in here if/when the iOS build ships.)
const APP_URL = "https://crux8.app";

function appClaimUrl(searchParams: Props["searchParams"]): string {
  const params = new URLSearchParams();
  if (searchParams.r) params.set("r", searchParams.r);
  if (searchParams.d) params.set("d", searchParams.d);
  if (searchParams.n) params.set("n", searchParams.n);
  if (searchParams.h) params.set("h", searchParams.h);
  if (searchParams.l) params.set("l", searchParams.l);
  return `${APP_URL}/claim?${params.toString()}`;
}

type Props = {
  searchParams: { r?: string; d?: string; n?: string; h?: string; l?: string };
};

function langOf(l: string | undefined): Lang {
  return l === "zh" ? "zh" : "en";
}

// DNA values travel as ?d=v,v,v,v,v,v in DIMENSIONS order (claim URL contract).
function parseDna(d: string | undefined): number[] {
  const parts = (d || "").split(",");
  return DIMENSIONS.map((_, i) => {
    const n = parseInt(parts[i] || "", 10);
    return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
  });
}

export function generateMetadata({ searchParams }: Props): Metadata {
  const result = results.find((x) => x.id === searchParams.r) || results[0];
  const lang = langOf(searchParams.l);
  const name = L(result.name, lang);
  const title =
    lang === "zh"
      ? `把「${name}」带进 Crux8 App 🧬`
      : `Bring ${name} into the Crux8 app 🧬`;
  const description =
    lang === "zh"
      ? "认领你的 Climber DNA，认识新的攀岩 / 徒步搭子。"
      : "Claim your Climber DNA and meet new climbing/hiking friends.";
  return { title, description };
}

// Web fallback for the quiz → app claim link (/claim?r=..&d=..&n=..&h=..&l=..).
// When the app is installed and universal links are configured, iOS intercepts
// this URL and opens the app directly — this page only renders otherwise.
// No waitlist, no backend: the DNA is self-contained in the URL.
export default function ClaimPage({ searchParams }: Props) {
  const result = results.find((x) => x.id === searchParams.r);
  const lang = langOf(searchParams.l);

  if (!result) {
    return (
      <main className="relative flex min-h-dvh flex-col items-center justify-center px-6 pb-10 pt-10 text-center">
        <BackgroundFX />
        <p className="text-4xl">🧭</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-[#F5EFE0]">
          {lang === "zh" ? "这个认领链接好像坏了" : "This claim link looks broken"}
        </h1>
        <p className="mt-2 max-w-xs text-sm text-white/60">
          {lang === "zh"
            ? "重新打开你的 quiz 结果页，再点一次「前往 Crux8 App」。"
            : "Reopen your quiz result and tap “Continue to the Crux8 app” again."}
        </p>
      </main>
    );
  }

  const values = parseDna(searchParams.d);
  const dna = DIMENSIONS.map((dim, i) => ({
    label: dim.label,
    emoji: dim.emoji,
    value: values[i],
  }));
  const house = getHouseById(searchParams.h || null) || getHouseForArchetype(result.id);
  const nickname = (searchParams.n || "").slice(0, 30);

  return (
    <main className="relative flex min-h-dvh flex-col items-center px-6 pb-10 pt-10">
      <BackgroundFX />

      <p className="text-center text-xs font-bold tracking-[0.45em] text-gold">
        CRUX8 PLAY
      </p>
      <p className="mt-2 text-center text-sm font-medium text-white/50">
        {lang === "zh" ? "你的 Climber DNA 到了" : "Your Climber DNA has arrived"}
      </p>

      <div className="mt-6 flex flex-col items-center text-center">
        <Emblem id={result.id} accent={result.accent} size={144} />
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-gold">
          {L(result.name, lang)}
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-lg font-semibold text-[#F5EFE0]">
          “{L(result.tagline, lang)}”
        </p>
        <p
          className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white"
          style={{ background: house.color }}
        >
          {house.emoji} {L(house.name, lang)}
        </p>
        {nickname && (
          <p className="mt-2 text-sm font-semibold text-gold">
            {lang === "zh" ? `${nickname}，就是你！` : `That's you, ${nickname}!`}
          </p>
        )}
      </div>

      <div className="mt-6 w-full max-w-sm">
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

      <a
        href={appClaimUrl(searchParams)}
        className="tap-target mt-8 w-full max-w-sm rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] py-4 text-center text-lg font-bold text-white shadow-lg shadow-purple-500/25"
      >
        {lang === "zh"
          ? "前往 Crux8 App，认识新的攀岩 / 徒步搭子 🧗"
          : "Continue to the Crux8 app to meet new climbing/hiking friends 🧗"}
      </a>
      <p className="mt-3 max-w-xs text-center text-xs text-white/45">
        {lang === "zh"
          ? "你的 DNA 会一起带过去 — 在下一个页面登录即可认领。"
          : "Your DNA travels with you — sign in on the next screen to claim it."}
      </p>
    </main>
  );
}
