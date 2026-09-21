import type { Metadata } from "next";
import CrewBoard from "./board";
import { getCrewMembers } from "@/lib/crew";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://play.crux8.app";

export async function generateMetadata({
  params,
}: {
  params: { code: string };
}): Promise<Metadata> {
  const code = params.code.toUpperCase();
  const members = await getCrewMembers(code);
  const n = members?.length ?? 0;
  const title = `Join climbing crew ${code} 🧗 | Crux8 Play`;
  const description =
    n > 0
      ? `${n} climber${n === 1 ? " has" : "s have"} joined crew ${code} — get your card and join them.`
      : `You've been invited to climbing crew ${code} — get your card and join.`;
  const url = `${SITE}/crew/${code}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Crux8 Play",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function CrewPage({ params }: { params: { code: string } }) {
  return <CrewBoard code={params.code} />;
}
