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

## Deploy to Netlify

If your `package-lock.json` was created with a **private npm registry** (e.g. JFrog), Netlify will get **E401** or **Rollup Linux binary** errors because it can’t use that registry.

**Fix:** Regenerate the lockfile using the **public** npm registry and commit it:

```bash
rm package-lock.json
npm install --registry https://registry.npmjs.org/
git add package-lock.json
git commit -m "chore: lockfile for public npm (Netlify)"
git push
```

After that, Netlify’s default install will use public npm and the build should pass. If you still see the Rollup error, in Netlify → **Site settings → Environment variables** add:

- **Key:** `NPM_CONFIG_PLATFORM`  
- **Value:** `all`

Then trigger a new deploy.

## Tech

- **Vite** + **React 19**
- Static avatars in `public/avatars/` (SVG)
- Currency symbol configurable in `src/constants.js` (`CURRENCY`)
