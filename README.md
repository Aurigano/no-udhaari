# No Udhaari – Split & Settle

A React 19 + Vite app to split session expenses among multiple people and see who owes whom.

## Features

1. **Candidates** – Add people with name and avatar (choose from 6 static avatar images).
2. **Session entries** – Add expenses: description, amount, who paid, and who it’s split between (checkboxes).
3. **Report** – Settlement report showing minimal “who pays whom” transfers and net balance per person.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Tech

- **Vite** + **React 19**
- Static avatars in `public/avatars/` (SVG)
- Currency symbol configurable in `src/constants.js` (`CURRENCY`)
