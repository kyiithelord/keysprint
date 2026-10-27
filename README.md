# KeySprint

A free typing test and beginner lesson prototype based on the KeySprint BRD. Built with Next.js, TypeScript, React, and Tailwind CSS.

## Run locally

Install Node.js 20 or newer, then run:

```sh
npm install
npm run dev
```

Open `http://localhost:3000`.

Run the scoring checks with `npm test`, and verify the production build with `npm run build`.

## Scoring rules

- The timer starts with the first typed character and ends at the selected duration.
- Raw WPM = current typed characters / 5 / elapsed minutes.
- Net WPM = current correct characters / 5 / elapsed minutes.
- Accuracy = current correct characters / current typed characters × 100.
- Backspace removes the deleted character from both current counts. Scores are rounded to whole numbers for display.
- Empty input has 0 WPM and displays 100% accuracy because no keystrokes have been evaluated.
- Results and personal bests are saved in browser local storage. Best scores are compared within the same duration, difficulty, and mode.

The long test prompt renders a small moving window of characters so timer updates do not redraw the full passage. On mobile, changing test settings resets the test without opening the on-screen keyboard.

## Beginner lessons

Open `/lessons` for four guided exercises: home row, top row, bottom row, and complete sentences. Each exercise shows character feedback, accuracy, and progress. A lesson is complete when every character matches the prompt; completion is stored on this device.

## Progress dashboard

Open `/progress` to review saved tests. Filter by duration, difficulty, and mode; compare daily average net WPM and accuracy in the chart; and see your personal best, average accuracy, and result history. Up to 100 recent tests are kept in browser local storage. Results do not sync between devices.

## Typing guides

Open `/guides` for practical articles about typing speed, accuracy, and common mistakes. Each guide links to a relevant lesson, timed test, or progress view.

## About, contact, and policies

The `/about`, `/contact`, `/privacy`, and `/terms` pages explain the current product and link from every footer. No public contact email is listed yet, as requested. Before public launch, add a real contact method and operator country; if using email, copy `.env.example` to `.env.local` and set the address there. The privacy page also needs the chosen hosting provider and its relevant technical-data practices added after deployment is decided. Review the policies whenever ads or analytics are introduced.

## Launch gaps

This is an initial typing engine, homepage, beginner lesson set, local progress dashboard, guide library, and draft company and policy pages, not a public launch. A real contact method, hosting details, SEO sitemap and robots file, consent handling, deployment, and AdSense integration remain to be completed. Advertising should be connected only after approval.
