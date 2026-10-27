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

## Word Rush game

Open `/game` to play a 60-second falling-word typing round. Type a word exactly to clear it; no Enter key is needed. Each cleared word earns points, consecutive clears add a combo bonus, and three missed words end the round. The game pauses when the browser tab is hidden. The high score is saved in this browser's local storage and is separate from timed typing-test results.

## Progress dashboard

Open `/progress` to review saved tests. Filter by duration, difficulty, and mode; compare daily average net WPM and accuracy in the chart; and see your personal best, average accuracy, and result history. Up to 100 recent tests are kept in browser local storage. Results do not sync between devices.

## Typing guides

Open `/guides` for practical articles about typing speed, accuracy, and common mistakes. Each guide links to a relevant lesson, timed test, or progress view.

## About, contact, and policies

The `/about`, `/contact`, `/privacy`, and `/terms` pages explain the current product and link from every footer. No public contact email is listed yet, as requested. Before public launch, add a real contact method and operator country; if using email, copy `.env.example` to `.env.local` and set the address there. The privacy page also needs the chosen hosting provider and its relevant technical-data practices added after deployment is decided. Review the policies whenever ads or analytics are introduced.

## Optional email accounts

`/account` supports email/password sign-up, email confirmation, sign-in, password reset, and sign-out through Supabase Auth. The form stays unavailable and the Account navigation link stays hidden until Supabase is configured. Typing tests remain account-free, and local progress does **not** sync to accounts.

1. Create a Supabase project and copy its Project URL and **publishable key**. Never use a service-role or secret key in `NEXT_PUBLIC_` variables.
2. In Supabase Authentication settings, keep the Email provider and email confirmation enabled. Under URL Configuration, set the Site URL to your final production URL and add exact redirect URLs for `https://your-domain/account` and `http://localhost:3000/account` (and any preview URL you intend to test).
3. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Add the same two variables in Vercel Project Settings → Environment Variables, then redeploy.
4. Test sign-up, confirmation email, sign-in, password reset, and sign-out on the deployed URL. Configure a production SMTP provider in Supabase before opening registration to the public; the default email sender is for limited testing.
5. Before enabling accounts publicly, update the privacy policy with the final operator, hosting, support, retention, and account deletion process.

## Launch gaps

This is an initial typing engine, homepage, beginner lesson set, local progress dashboard, guide library, optional auth integration, and draft company and policy pages, not a public launch. A real contact method, hosting and account-deletion details, SEO sitemap and robots file, consent handling, and AdSense integration remain to be completed. Advertising should be connected only after approval.
