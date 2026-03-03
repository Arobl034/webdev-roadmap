# ◎ Web Dev Roadmap Tracker

A dark-themed, responsive learning progress tracker for web development fundamentals. Built with React + Vite.

## Features

- 📊 Animated overall progress bar with per-section percentages
- 🗂 18 topics across HTML/CSS, JavaScript, and React.js
- 🔴🟡🟢 3-state topic tracking — Not Started / In Progress / Complete
- 🔍 Live search + filter by status and difficulty
- 🗃 Click any card to open a full detail modal (press Esc to close)
- 💾 Progress auto-saved to localStorage

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run locally
```bash
npm run dev
```
Visit `http://localhost:5173`

### 3. Build for production
```bash
npm run build
```
Output goes to `/dist`.

---

## Customizing Topics

All content lives in **`src/topics.js`** — no need to touch the UI.

To add a new topic to an existing section:
```js
// In src/topics.js, add to the items array of any section:
{
  id: "h7",               // must be unique
  title: "CSS Animations",
  desc: "keyframes, transition, animation shorthand, timing functions.",
  difficulty: "Intermediate",  // "Beginner" | "Intermediate" | "Advanced"
},
```

To add a new section:
```js
my_section: {
  label: "My Section",
  icon: "◆",
  accent: "#a855f7",   // any hex color
  items: [ /* topics here */ ],
},
```

---

## Deploy to Vercel (free, recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import repo
3. Leave all settings as default — Vite is auto-detected
4. Click **Deploy**

Live at a `*.vercel.app` URL in under a minute. Every push to `main` auto-deploys.

## Deploy to Netlify (also free)

1. Push to GitHub
2. [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy

---

## Project Structure

```
webdev-roadmap/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx        # Main UI component
│   ├── topics.js      # ← Edit your content here
│   ├── index.css      # Global reset
│   └── main.jsx       # React entry point
├── index.html
├── vite.config.js
├── package.json
└── .gitignore
```

---

## Upgrading Storage

Progress is currently stored in `localStorage` (per-browser). To share progress across devices, replace the `loadProgress` / `saveProgress` functions in `App.jsx` with calls to Supabase, Firebase, or any REST API.
