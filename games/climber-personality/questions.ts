import type { Question } from "@/lib/gameTypes";

// Dimensions: power, beta, social, adventure, chill, stoke
export const questions: Question[] = [
  {
    id: "q1",
    prompt: "Your climbing session starts at 7 PM. You…",
    answers: [
      { id: "A", label: "Already warming up at 6:30.", scores: { power: 2, stoke: 2, beta: 1 } },
      { id: "B", label: "7:05 is basically 7.", scores: { chill: 1, social: 1, stoke: 1 } },
      { id: "C", label: "Depends who's going.", scores: { social: 3 } },
      { id: "D", label: "I might be 30 minutes late.", scores: { chill: 2, adventure: 1 } },
    ],
  },
  {
    id: "q2",
    prompt: "Your partner says: “One more try.” You…",
    answers: [
      { id: "A", label: "Let's send it.", scores: { power: 2, stoke: 2 } },
      { id: "B", label: "One more = five more.", scores: { power: 2, beta: 1, stoke: 1 } },
      { id: "C", label: "Film it first.", scores: { social: 2, beta: 1 } },
      { id: "D", label: "I need food.", scores: { chill: 2, social: 1 } },
    ],
  },
  {
    id: "q3",
    prompt: "You fall off your project. Your next move?",
    answers: [
      { id: "A", label: "Immediately try again.", scores: { power: 2, stoke: 2 } },
      { id: "B", label: "Analyze the beta.", scores: { beta: 3 } },
      { id: "C", label: "Change the shoes.", scores: { beta: 1, adventure: 1 } },
      { id: "D", label: "Take a break and talk about it.", scores: { social: 2, chill: 2 } },
    ],
  },
  {
    id: "q4",
    prompt: "Your perfect climbing session is…",
    answers: [
      { id: "A", label: "3 hours of pure sending.", scores: { power: 3, stoke: 1 } },
      { id: "B", label: "Good climbs + good people.", scores: { social: 2, chill: 1, stoke: 1 } },
      { id: "C", label: "Trying something completely new.", scores: { adventure: 3, beta: 1 } },
      { id: "D", label: "Climbing followed by food/drinks.", scores: { social: 2, chill: 2 } },
    ],
  },
  {
    id: "q5",
    prompt: "What matters most in a climbing partner?",
    answers: [
      { id: "A", label: "Strong.", scores: { power: 2, beta: 1 } },
      { id: "B", label: "Reliable.", scores: { beta: 1, chill: 1, social: 1 } },
      { id: "C", label: "Fun.", scores: { social: 2, stoke: 1 } },
      { id: "D", label: "Adventurous.", scores: { adventure: 2, stoke: 1 } },
    ],
  },
  {
    id: "q6",
    prompt: "Someone opens your chalk bag. Inside is…",
    answers: [
      { id: "A", label: "Measured chalk + a clean brush.", scores: { beta: 3 } },
      { id: "B", label: "Some chalk, probably. Who checks?", scores: { chill: 2 } },
      { id: "C", label: "Tape, snacks, three energy gels.", scores: { power: 1, stoke: 2, adventure: 1 } },
      { id: "D", label: "It's not mine — I forgot mine again.", scores: { social: 2, chill: 1 } },
    ],
  },
  {
    id: "q7",
    prompt: "The gym just set new routes. You…",
    answers: [
      { id: "A", label: "Already tried them all before warming up.", scores: { power: 2, stoke: 2 } },
      { id: "B", label: "Study them from the ground first.", scores: { beta: 3 } },
      { id: "C", label: "Ask everyone which ones are good.", scores: { social: 3 } },
      { id: "D", label: "Skip them — I'm heading outdoors.", scores: { adventure: 3 } },
    ],
  },
  {
    id: "q8",
    prompt: "Your climbing-session vibe is…",
    answers: [
      { id: "A", label: "Hype music, sending energy.", scores: { power: 1, stoke: 3 } },
      { id: "B", label: "Lo-fi, calm, dialed in.", scores: { chill: 3, beta: 1 } },
      { id: "C", label: "Whatever the group's playing.", scores: { social: 3 } },
      { id: "D", label: "Birdsong. I'm outside.", scores: { adventure: 3, chill: 1 } },
    ],
  },
  {
    id: "q9",
    prompt: "A grade harder than you've ever flashed. You…",
    answers: [
      { id: "A", label: "Throw yourself at it. Now.", scores: { power: 2, stoke: 2 } },
      { id: "B", label: "Break it into micro-beta.", scores: { beta: 3 } },
      { id: "C", label: "Rally the crew to try it together.", scores: { social: 2, stoke: 1 } },
      { id: "D", label: "Save it for an outdoor trip.", scores: { adventure: 2, chill: 1 } },
    ],
  },
  {
    id: "q10",
    prompt: "Right after a session, you're…",
    answers: [
      { id: "A", label: "Logging every attempt in an app.", scores: { beta: 3, power: 1 } },
      { id: "B", label: "At the taco place with everyone.", scores: { social: 3, chill: 1 } },
      { id: "C", label: "Planning next weekend's crag trip.", scores: { adventure: 3, stoke: 1 } },
      { id: "D", label: "Flat on the mat, cooked, content.", scores: { chill: 3 } },
    ],
  },
];
