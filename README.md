# PulseForge

PulseForge is a public status and update hub for an indie Roblox project. It is focused on practical info: current game status, changelog, roadmap, known issues, links, and dev notes.

## Why I built it

I wanted a simple place to show project status, updates, roadmap items, and links without needing a full backend yet.

## Features

- Status overview with clear green/yellow/red indicators
- Update feed with realistic developer-style entries
- Roadmap split into Planned, In Progress, and Done
- Known issues block for transparency
- Developer notes with personal context
- Important links for players and community
- Owner auth with Supabase signup/login/logout
- Owner customization editor that saves dashboard data to Supabase
- Fallback to `data.json` if Supabase content is not set yet

## Tech stack

- HTML
- CSS
- JavaScript
- Supabase Auth + Database
- GitHub Actions
- GitHub Pages

## How to run locally

1. Clone or download this repository.
2. Open the project folder.
3. Run a local server from the root.
4. Open the local URL in your browser.

Example:

```bash
python -m http.server 8080
```

Then access `http://localhost:8080`.

## Supabase setup

1. Create a table named `pulseforge_content`.
2. Add columns:
   - `id` as `int8` primary key
   - `payload` as `jsonb` not null
3. Insert a starter row with `id = 1` and your initial dashboard JSON in `payload`.
4. Enable Row Level Security for the table.
5. Add a read policy for `select` allowing public access.
6. Add write policy for `insert` and `update` allowing only your owner account(s).
7. In `script.js`, adjust `OWNER_EMAILS` to your real owner emails.

## How to deploy with GitHub Pages

1. Push files to the `main` branch.
2. Open `Settings > Pages` in the repository.
3. Set Source to `GitHub Actions`.
4. Every push to `main` will trigger the deploy workflow.

## Author

CronaDeveloper
