import type { GameDefinition } from "@/lib/gameTypes";
import { DIMENSIONS } from "./dimensions";
import { questions } from "./questions";
import { results } from "./results";
import { scoreClimber } from "./scoring";

export const climberPersonality: GameDefinition = {
  id: "climber-personality",
  title: "What Type of Climber Are You?",
  subtitle: "你是哪种攀岩搭子？",
  dimensions: DIMENSIONS,
  questions,
  results,
  score: (answerIds, seed) => scoreClimber(answerIds, seed),
};

export default climberPersonality;
