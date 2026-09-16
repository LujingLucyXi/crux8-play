import type { GameDefinition } from "@/lib/gameTypes";
import { questions } from "./questions";
import { results } from "./results";
import { scoreClimber, RESULT_DIMENSIONS } from "./scoring";

export const climberPersonality: GameDefinition = {
  id: "climber-personality",
  title: "What Type of Climber Are You?",
  subtitle: "你是哪种攀岩搭子？",
  dimensions: [...RESULT_DIMENSIONS, "chill"],
  questions,
  results,
  score: (answerIds, seed) => scoreClimber(answerIds, seed),
};

export default climberPersonality;
