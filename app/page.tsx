"use client";

import GameEngine from "@/components/GameEngine";
import climberPersonality from "@/games/climber-personality";

export default function Page() {
  return (
    <main className="stage">
      <div className="frame">
        <GameEngine game={climberPersonality} />
      </div>
    </main>
  );
}
