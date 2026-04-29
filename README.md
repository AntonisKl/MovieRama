# MovieRama

MovieRama is a lightweight movie discovery web app powered by The Movie Database (TMDB).

## Tech stack

- Vanilla JavaScript frontend
- Node.js + Express backend proxy

## Main features

- Search movies and browse paginated results.
- Infinite scrolling for seamless discovery.
- Expandable movie cards with:
  - trailer embeds (YouTube/Vimeo when available)
  - user reviews with “read more” expansion
  - similar movie recommendations
- Genre, release year, overview, and rating metadata on each card.
- Lazy loading for poster and icon assets.
- Backend TMDB proxy with server-side credential handling (`API_READ_ACCESS_TOKEN` or `API_KEY`).

## Development

### Prerequisites

- Node.js 18+
- TMDB credential as environment variable (`API_READ_ACCESS_TOKEN` preferred, `API_KEY` supported)

### Run locally

```bash
npm install
npm start
```

Open `http://localhost:4200`.

## Scripts

- `npm start` — start server
- `npm test` — syntax checks
