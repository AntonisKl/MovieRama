# MovieRama

MovieRama is a lightweight movie discovery web app powered by The Movie Database (TMDB).

## Tech stack

- Vanilla JavaScript frontend
- Cloudflare Pages static hosting
- Cloudflare Pages Function API proxy
- Node.js + Express server for local development

## Main features

- Search movies and browse paginated results.
- Infinite scrolling for seamless discovery.
- Expandable movie cards with trailer embeds, reviews, and similar movies.
- Genre, release year, overview, and rating metadata on each card.
- Lazy loading for poster and icon assets.
- Server-side TMDB credential handling (`API_READ_ACCESS_TOKEN` or `API_KEY`).

## Development

### Prerequisites

- Node.js 18+
- TMDB credential as an environment variable (`API_READ_ACCESS_TOKEN` preferred)

### Run locally with Express

```bash
npm install
npm start
```

Open `http://localhost:4200`.

### Run the Cloudflare Pages Function locally

```bash
copy .dev.vars.example .dev.vars
# edit .dev.vars with your TMDB token
npm run pages:dev
```

For local Pages Function testing, provide `API_READ_ACCESS_TOKEN` through Wrangler's local environment configuration. The Pages Function is available at `/api`, and the frontend uses that same-origin route in production.

## Cloudflare Pages deployment

The repository is configured as one Cloudflare Pages project:

- Static output directory: `public`
- API route: `functions/api/index.js` -> `/api`
- Wrangler config: `wrangler.toml`

Connect the repository directly to Cloudflare Pages using Git integration. In the Pages project settings, use:

- Production branch: `master`
- Build command: leave empty
- Build output directory: `public`

Cloudflare will deploy the root `functions/` directory together with the static `public/` files. Add `API_READ_ACCESS_TOKEN` as an encrypted production variable under Settings -> Variables and Secrets. `API_KEY` is supported as a fallback. Keep TMDB credentials out of frontend files.

No GitHub Actions secrets or Cloudflare API token are required for this setup.

## Scripts

- `npm start` - start the local Express server
- `npm run pages:dev` - run the Pages frontend and Function locally
- `npm test` - run JavaScript syntax checks
