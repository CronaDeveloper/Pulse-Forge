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
- Data-driven rendering with `data.json`
- Responsive layout for desktop and mobile

## Tech stack

- HTML
- CSS
- JavaScript
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

## How to deploy with GitHub Pages

1. Push files to the `main` branch.
2. Open `Settings > Pages` in the repository.
3. Set Source to `GitHub Actions`.
4. Every push to `main` will trigger the deploy workflow.

## Author

CronaDeveloper
