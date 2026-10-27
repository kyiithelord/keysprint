export type Lesson = {
  id: string;
  title: string;
  level: string;
  goal: string;
  explanation: string;
  tips: string[];
  exercise: string;
};

export const lessons: Lesson[] = [
  {
    id: "home-row",
    title: "Find the home row",
    level: "01 / FOUNDATION",
    goal: "Get comfortable with A S D F and J K L ;",
    explanation: "Rest your left fingers on A S D F and your right fingers on J K L ;. Your index fingers should find the small raised marks on F and J. Return to these keys after each reach.",
    tips: ["Keep your wrists relaxed and your fingers lightly curved.", "Look at the text on screen. Use the F and J bumps to find your place.", "Accuracy matters first; speed will follow."],
    exercise: "asdf jkl; asdf jkl; sad lad; fall; ask; flask; dad; salad;",
  },
  {
    id: "top-row",
    title: "Reach for the top row",
    level: "02 / REACH",
    goal: "Practice Q W E R T and Y U I O P",
    explanation: "Start at the home row, reach up for a top-row key, then bring that finger home. Keep the other fingers close to their starting positions.",
    tips: ["Use a light touch instead of lifting your whole hand.", "Return to the home row after each reach.", "Read one word ahead to keep a steady rhythm."],
    exercise: "we were quiet. write your type. pretty white paper. you are ready.",
  },
  {
    id: "bottom-row",
    title: "Complete the letter map",
    level: "03 / CONTROL",
    goal: "Add Z X C V B and N M",
    explanation: "Reach down for the bottom row and return to the home row. Use your thumbs for spaces, and keep your hands relaxed as the words get longer.",
    tips: ["Move the finger that owns the key, not your entire hand.", "Press the space bar with either thumb.", "Pause briefly if your hands begin to tense."],
    exercise: "mix and match. brave moves make calm minds. zoom back home.",
  },
  {
    id: "sentences",
    title: "Build a smooth rhythm",
    level: "04 / FLOW",
    goal: "Type complete sentences with capitals and punctuation",
    explanation: "Sentence practice brings letters, spaces, capitals, and punctuation together. Read a few characters ahead and aim for a consistent pace.",
    tips: ["Hold Shift with the opposite hand for a capital letter.", "Let punctuation be part of the rhythm.", "Correct mistakes with Backspace, then continue."],
    exercise: "Good practice takes patience. Each accurate line builds confidence. Keep going!",
  },
];
