import type { Question } from "@/lib/gameTypes";

// Dimensions: send, social, beta, adventure, chill
export const questions: Question[] = [
  {
    id: "q1",
    prompt: "Your climbing session starts at 7 PM. You…",
    answers: [
      { id: "A", label: "Already warming up at 6:30.", scores: { send: 2, beta: 1 } },
      { id: "B", label: "7:05 is basically 7.", scores: { chill: 1, social: 1 } },
      { id: "C", label: "Depends who is going.", scores: { social: 2 } },
      { id: "D", label: "I might be 30 minutes late.", scores: { adventure: 1, chill: 2 } },
    ],
  },
  {
    id: "q2",
    prompt: "Your partner says: “One more try.” You…",
    answers: [
      { id: "A", label: "Let's send it.", scores: { send: 2, adventure: 1 } },
      { id: "B", label: "One more = five more.", scores: { send: 2, beta: 1 } },
      { id: "C", label: "Film it first.", scores: { social: 1, beta: 1 } },
      { id: "D", label: "I need food.", scores: { chill: 2, social: 1 } },
    ],
  },
  {
    id: "q3",
    prompt: "You fall off your project. Your next move?",
    answers: [
      { id: "A", label: "Immediately try again.", scores: { send: 2 } },
      { id: "B", label: "Analyze the beta.", scores: { beta: 2 } },
      { id: "C", label: "Change the shoes.", scores: { beta: 1, adventure: 1 } },
      { id: "D", label: "Take a break and talk about it.", scores: { social: 2, chill: 1 } },
    ],
  },
  {
    id: "q4",
    prompt: "Your perfect climbing session is…",
    answers: [
      { id: "A", label: "3 hours of pure sending.", scores: { send: 2 } },
      { id: "B", label: "Good climbs + good people.", scores: { social: 2, chill: 1 } },
      { id: "C", label: "Trying something completely new.", scores: { adventure: 2, beta: 1 } },
      { id: "D", label: "Climbing followed by food/drinks.", scores: { social: 1, chill: 2 } },
    ],
  },
  {
    id: "q5",
    prompt: "What matters most in a climbing partner?",
    answers: [
      { id: "A", label: "Strong.", scores: { send: 2 } },
      { id: "B", label: "Reliable.", scores: { beta: 1, chill: 1 } },
      { id: "C", label: "Fun.", scores: { social: 2 } },
      { id: "D", label: "Adventurous.", scores: { adventure: 2 } },
    ],
  },
];
