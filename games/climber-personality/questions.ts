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
      { id: "B", label: "Study the beta before the next go.", scores: { beta: 3 } },
      { id: "C", label: "Swap into stickier shoes and adjust.", scores: { beta: 1, adventure: 1 } },
      { id: "D", label: "Take a break and talk it out.", scores: { social: 2, chill: 2 } },
    ],
  },
  {
    id: "q4",
    prompt: "Your perfect climbing session is…",
    answers: [
      { id: "A", label: "Hours of pure sending.", scores: { power: 3, stoke: 1 } },
      { id: "B", label: "Good climbs + good people.", scores: { social: 2, chill: 1, stoke: 1 } },
      { id: "C", label: "Trying routes I've never touched.", scores: { adventure: 3, beta: 1 } },
      { id: "D", label: "80% sitting on the mat, 20% climbing, 100% vibes.", scores: { social: 2, chill: 2 } },
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
      { id: "B", label: "Watch someone crush it, then steal their beta.", scores: { beta: 3 } },
      { id: "C", label: "Ask everyone which ones are good.", scores: { social: 3 } },
      { id: "D", label: "Go straight for the wildest-looking line.", scores: { adventure: 3 } },
    ],
  },
  {
    id: "q8",
    prompt: "Your energy during a session is best described as…",
    answers: [
      { id: "A", label: "Loud and amped — LET'S GO.", scores: { power: 1, stoke: 3 } },
      { id: "B", label: "Quiet and focused, in my own zone.", scores: { chill: 3, beta: 1 } },
      { id: "C", label: "Chatting and hyping everyone up.", scores: { social: 3 } },
      { id: "D", label: "Restless — always onto the next new thing.", scores: { adventure: 3, chill: 1 } },
    ],
  },
  {
    id: "q9",
    prompt: "A grade harder than you've ever flashed. You…",
    answers: [
      { id: "A", label: "Throw yourself at it. Now.", scores: { power: 2, stoke: 2 } },
      { id: "B", label: "Break it into micro-beta.", scores: { beta: 3 } },
      { id: "C", label: "Rally the crew to try it together.", scores: { social: 2, stoke: 1 } },
      { id: "D", label: "Nah, not for me, not today. Onto the next.", scores: { adventure: 2, chill: 1 } },
    ],
  },
  {
    id: "q10",
    prompt: "Right after a session, you're…",
    answers: [
      { id: "A", label: "Logging every attempt in an app.", scores: { beta: 3, power: 1 } },
      { id: "B", label: "Food / drinks / boba — the real crux.", scores: { social: 3, chill: 1 } },
      { id: "C", label: "Already plotting the next session before I've even left.", scores: { adventure: 3, stoke: 1 } },
      { id: "D", label: "Flat on the mat, cooked, content.", scores: { chill: 3 } },
    ],
  },
  {
    id: "q11",
    prompt: "It's comp day at the gym. You…",
    answers: [
      { id: "A", label: "Signed up weeks ago — I'm here to win.", scores: { power: 1, stoke: 2 } },
      { id: "B", label: "Cheering the loudest from the crowd.", scores: { social: 3 } },
      { id: "C", label: "Doing the fun-looking problems, ignoring the scorecard.", scores: { adventure: 2, chill: 1 } },
      { id: "D", label: "Comp? I'll just do my normal session.", scores: { chill: 2, beta: 1 } },
    ],
  },
  {
    id: "q12",
    prompt: "Your dream climbing trip is…",
    answers: [
      { id: "A", label: "A hard crag with one perfect project.", scores: { power: 2, beta: 1 } },
      { id: "B", label: "Multi-day, tent, no wifi, no plan.", scores: { adventure: 3, chill: 1 } },
      { id: "C", label: "Wherever the crew is going.", scores: { social: 3 } },
      { id: "D", label: "A few easy climbs and a big lunch.", scores: { chill: 3 } },
    ],
  },
  {
    id: "q13",
    prompt: "A newer climber asks you for help. You…",
    answers: [
      { id: "A", label: "Break down the beta, move by move.", scores: { beta: 3 } },
      { id: "B", label: "Hype them up until they send it.", scores: { social: 2, stoke: 2 } },
      { id: "C", label: "Just show them — by trying it yourself.", scores: { power: 2, stoke: 1 } },
      { id: "D", label: "Point them to someone else — I'm resting.", scores: { chill: 2 } },
    ],
  },
];
