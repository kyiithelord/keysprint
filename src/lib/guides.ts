export type Guide = {
  slug: string;
  title: string;
  description: string;
  label: string;
  readTime: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  practice: { heading: string; steps: string[]; href: string; cta: string };
};

export const guides: Guide[] = [
  {
    slug: "improve-typing-speed",
    title: "How to improve typing speed",
    description: "Build typing speed with a steady routine, useful WPM comparisons, and short practice sessions that protect accuracy.",
    label: "SPEED / GUIDE 01",
    readTime: "4 MIN READ",
    intro: "Speed is easier to build when your hands know where to go. A repeatable practice routine helps you type smoothly without rushing through mistakes.",
    sections: [
      { heading: "Start with a baseline you can repeat", paragraphs: ["Take a 30 or 60 second test and write down its net WPM and accuracy. Keep the same duration, difficulty, and mode when you compare later results. A 15 second burst and a two minute test measure different kinds of effort, so their scores are less useful side by side.", "On Typencil, one word equals five characters. Net WPM counts correct characters; raw WPM counts all typed characters. If raw WPM rises while net WPM stays flat, focus on clean input before trying to go faster."] },
      { heading: "Build a small daily routine", paragraphs: ["Warm up with one easy 15 second round. Then spend a few minutes on a lesson that feels slightly difficult, such as top row reaches or complete sentences. Finish with two tests at the same setting and compare them to your baseline.", "Short sessions are easier to repeat than one long, tiring session. Stop or take a break when your shoulders, wrists, or fingers feel tense. Good practice is deliberate, not a race to finish the most rounds."] },
      { heading: "Use a steady rhythm", paragraphs: ["Read one word ahead while your fingers type the current one. Aim for an even pace rather than a burst followed by a long pause. If a key combination repeatedly slows you down, practice that pattern in a lesson before returning to the timed test.", "Review your progress over several sessions. A single score can vary with the passage and your attention; a series of comparable tests shows a clearer direction."] },
    ],
    practice: { heading: "Try a speed-building session", steps: ["Complete a 15 second warm-up test.", "Practice one lesson that contains a difficult key pattern.", "Take two 60 second tests with the same settings and compare net WPM and accuracy."], href: "/#practice", cta: "Start a free test →" },
  },
  {
    slug: "improve-typing-accuracy",
    title: "How to improve typing accuracy",
    description: "Learn how to reduce typing errors, use Backspace deliberately, and build accurate keyboard habits through focused exercises.",
    label: "ACCURACY / GUIDE 02",
    readTime: "4 MIN READ",
    intro: "Accuracy tells you how often the text you have typed matches the prompt. Better accuracy makes your speed more useful because you spend less time correcting errors.",
    sections: [
      { heading: "Understand what the number means", paragraphs: ["Typencil compares each character in your current input with the matching character in the target text. Accuracy is correct characters divided by all currently typed characters. When you use Backspace, the removed character no longer counts; the live percentage updates from the text that remains.", "A blank input displays 100% because no characters have been evaluated yet. Once you start, look at the incorrect character count alongside the percentage. A small number of errors can change a short test more than a long one."] },
      { heading: "Slow down at the difficult pattern", paragraphs: ["Notice whether errors happen around a certain key, a capital letter, a space, or punctuation. Practice that exact pattern slowly three or four times. Try to feel the correct finger movement instead of watching your hands.", "If you keep missing a key, return to its home-row position between reaches. The small bumps on F and J can help your index fingers find the starting place without looking down."] },
      { heading: "Correct, then continue", paragraphs: ["Backspace is useful when you spot an error. Make the correction and return to a comfortable rhythm. Repeatedly stopping to inspect every character can break your flow, so aim to read ahead while staying aware of the feedback.", "During practice, finish a line with every character correct. During a timed test, compare both accuracy and net WPM. That pairing tells a fuller story than raw speed alone."] },
    ],
    practice: { heading: "Try an accuracy session", steps: ["Choose a lesson with a key group you often miss.", "Complete the line with every character correct, using Backspace when needed.", "Take a 30 second test and check net WPM, accuracy, and incorrect characters."], href: "/lessons", cta: "Practice a lesson →" },
  },
  {
    slug: "common-typing-mistakes",
    title: "Common typing mistakes and how to fix them",
    description: "Recognize frequent typing habits that cause errors, from looking at the keyboard to rushing punctuation, and practice practical fixes.",
    label: "HABITS / GUIDE 03",
    readTime: "5 MIN READ",
    intro: "Most typing mistakes are small habits repeated many times. Find one that describes your current practice, work on it for a few rounds, and check whether your results change.",
    sections: [
      { heading: "Looking down for every key", paragraphs: ["Glancing at the keyboard can feel faster at first, but it interrupts reading and makes each word a search task. Place your index fingers on the F and J bumps, rest the other fingers on the home row, and try a short exercise while watching the prompt.", "It is normal to slow down while learning the key map. Start with A S D F and J K L ;, then add the top and bottom rows as you become more comfortable."] },
      { heading: "Rushing spaces and punctuation", paragraphs: ["A word may be correct while the space after it is missing. In sentence practice, commas, periods, capitals, and spaces are all part of the target text. Read a little ahead so you know what comes after the word you are typing.", "If punctuation keeps causing errors, practice a complete sentence slowly. Use Shift with the hand opposite the letter you are capitalizing, then let your fingers return to their starting positions."] },
      { heading: "Chasing raw WPM", paragraphs: ["Raw WPM rises when you type more characters, even if some are wrong. Net WPM only counts correct characters. If the gap between raw and net WPM grows, your hands may be moving faster than your accuracy can support.", "Reduce your pace slightly and aim for a smooth sequence of correct words. When that feels comfortable, increase speed in small steps rather than trying to jump to a much higher number in one round."] },
      { heading: "Practicing without a clear comparison", paragraphs: ["Changing duration or difficulty every round can make progress hard to see. Choose one setup for a few sessions, then use your saved results to compare net WPM and accuracy. Try different modes for variety, but compare similar tests when judging improvement."] },
    ],
    practice: { heading: "Choose one habit to work on", steps: ["Pick one mistake from this guide.", "Practice the related lesson slowly, correcting each error.", "Take two tests with the same settings and review the results in My progress."], href: "/progress", cta: "Review your progress →" },
  },
];
