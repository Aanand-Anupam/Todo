# Do2Done AI — Frontend

React + Vite + Tailwind client for the Todo backend.

## Setup

```bash
cd client
npm install
```

Ensure the backend is running (default `http://localhost:8000`). The Vite dev server proxies `/api` to the backend.

If your server uses a different port, update `vite.config.ts`:

```ts
proxy: {
  '/api': {
    target: 'http://localhost:YOUR_PORT',
    ...
  },
}
```

## Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Pages

- `/` — Landing page
- `/signup` — Register with optional avatar
- `/login` — Sign in
- `/dashboard` — Todo lists overview
- `/dashboard/lists/:todoId` — Single todo document
- `/dashboard/ai` — AI productivity insights

## API integration

- Auth tokens: access token in `localStorage`, refresh token in httpOnly cookie
- Todo CRUD via `/api/todo/*` endpoints
- AI insights via `/api/ai/insights`
- Text and audio tasks (record in-browser or upload audio files)
- All authenticated requests send `Authorization: <accessToken>`
