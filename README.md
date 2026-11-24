# Morrow — local app

This is the complete Morrow app with all the combined updates already installed. No patch installers or earlier ZIPs are required.

Includes Milo at the top of the right sidebar in Game and Focus views, optional whole-quiz time limits, saved quiz mistakes, deeper topic analysis, printable personalised cheat sheets, Next Question, batch file analysis, and daily practice refreshed from newly analysed course files. The standalone focus timer and timer-based streak panel are removed.

## Start here

You need Node.js 22.13 or later. Your existing Node.js 26 installation is suitable.

1. Extract the ZIP.
2. Open the extracted `morrow-app` folder in VS Code.
3. Open **Terminal → New Terminal** in VS Code.
4. Run:

   ```bash
   npm run setup
   ```

5. Open the newly created `.env` file in VS Code. Add your OpenAI API key after the equals sign:

   ```dotenv
   OPENAI_API_KEY=your_actual_key_here
   OPENAI_MODEL=gpt-4.1-mini
   PORT=3000
   ```

   Use your real key, without the example text. No other API keys are required for this version. Do not add a key to any file in `public/` or `pages/`.

6. Save `.env`, then run:

   ```bash
   npm start
   ```

7. Open **http://localhost:3000** in your browser. Keep the terminal running while you use the app. Stop it with **Control+C**.

You do **not** need `npm install` to run the included app: the server bundle is already built. The sample practice, quizzes, uploads and calendar work even with an empty API key. Analysis and AI exercises need a valid API key with access to the configured model and available API billing. A ChatGPT subscription is not the app's API key.

## Try your real course

1. Select **Course files** in the sidebar.
2. Enter the course name, choose PDF/TXT/Markdown files or a folder, and select **Save course files**.
3. Leave **Analyse new files after upload** enabled to analyse new uploads, or use **Analyse all pending files**.
4. In the study workspace, select **Daily practice**, choose an analysed file and topic, and create an exercise.
5. For scheduling, open **Calendar**, enter exam dates and daily study time, then scroll to **Your next 7 days**. Use the same course name as your uploaded files to connect practice priorities to the schedule.

The sample exercises, optional map and curated quizzes on the overview remain a demonstration course. Uploaded material powers the real-course practice in the study workspace. This version does not automatically generate a game world or multiple-choice quiz bank from your uploads.

After two hints, the worked solution appears. Independently solved exercises and solutions reviewed with hints are tracked separately.

## Where things are saved

- API key: `.env`, read by the server only. Never commit or share this file.
- Course files, exams, settings and real-course practice: `data/` on this computer. This folder is created automatically. Back it up if needed.
- Sample-adventure progress, quiz history and cosmetic settings: this browser's local storage. They can differ between browsers.

This export does not include data from the hosted site or your browser's existing progress. It starts as a fresh local workspace.

The app runs in **single-user local mode** at `127.0.0.1`. It does not require ChatGPT sign-in, Cloudflare, Supabase or an external database. It deliberately does not accept public network connections. Public or multi-user deployment requires proper authentication, per-user storage and deployment configuration; this local server is not configured for that purpose.

When you select Analyse, the chosen file is sent to OpenAI. When you check a handwritten response, its image is sent to OpenAI. AI requests use `store: false`. API use may incur charges. Check your provider's usage limits. Do not share your `.env` or `data/` folder.

## Editing the app

- `pages/index.html`: overview and sample learning-map markup.
- `pages/study.html`: course uploads, real practice and calendar, including their browser logic.
- `public/`: styles, sample game logic and quiz bank.
- `source/api.ts`: editable source for AI calls and course API routes.
- `server/api.mjs`: prebuilt API bundle used at runtime.
- `server/server.mjs`: local HTTP server.
- `server/storage.mjs`: local file storage adapter.

HTML, CSS, and browser JavaScript changes appear after refreshing. Restart the server after changing `.env` or server files.

Only if you change `source/api.ts`, install the development tools and rebuild:

```bash
npm install
npm run build:api
npm start
```

The development build replaces the Cloudflare environment import with the local server environment. This keeps your API key on the server.

## Troubleshooting

- **`node` or `npm` not found:** install a supported Node.js version, then reopen Terminal.
- **`.env` not found:** run `npm run setup` inside the extracted app folder. Setup never overwrites an existing `.env`.
- **Can’t see `.env` in Finder:** open the folder in VS Code, or press Command+Shift+Period in Finder to show hidden files.
- **Port in use:** change `PORT=3000` to `PORT=3001` in `.env`, restart and use http://localhost:3001.
- **AI not configured:** add the key to `.env`, save and restart.
- **AI request failed:** check API billing, model access and internet connectivity. The configured model defaults to `gpt-4.1-mini`; you can change `OPENAI_MODEL` to another Responses API model supporting PDF/image input and JSON output.
- **A file is too large:** split it. Current limits are 3 MB per file, 20 files per upload and 30 saved course files.
- **Fonts look different offline:** the app uses Google Fonts with system-font fallbacks. AI features require internet access.
- **Voice input unavailable:** support varies by browser. Use typed answers or device dictation instead.

## Tests and current limits

Run `npm test`. Tests cover the local server, storage persistence, upload and exam operations, private-file protection, sample exercise maths and quiz scoring. No API key or paid call is needed for the tests.

Live OpenAI calls have not been verified with your key. AI-generated maths and sources should be checked against your course. Exercise generation uses extracted topic summaries, not full-document retrieval. Readiness is an evidence-based study aid, not a validated grade predictor. The calendar creates a rolling seven-day plan; it does not send reminders. The curated quiz bank contains 12 Linear Algebra questions.

Generated exercise requests have a 40-per-day limit. Analysis and answer checking are not covered by that limit; use provider spending controls if needed.


## Keeping your existing progress

Stop your old app before running this one. Copy your existing `.env` and `data/` folder into this new `morrow-app` folder to retain your API settings, uploads, exams and real-course practice. Keep your old folder as a backup. These personal files are not included in the download.

Continue using the same browser and localhost port to retain browser-stored quiz mistakes, sample progress and cosmetic choices. Changing browser or clearing site storage removes that local history.

## Quiz time limits and review

In Quiz setup, leave Time limit blank for an untimed quiz, or enter 1–180 minutes for the entire round. The deadline continues when the quiz closes, the tab changes or the page refreshes. When time expires, saved answers count and unanswered questions are marked incomplete.

Results offer Analyse my weak topics and My cheat sheet. My saved mistakes in setup keeps past wrong/assisted answers on this browser. Print / save as PDF exports the cheat sheet through your browser print dialog. The quiz remains a curated 12-question Linear Algebra bank; uploaded files power the separate AI daily-practice workspace.
