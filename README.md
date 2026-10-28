# SnapLedger Web

React + TypeScript frontend for the SnapLedger API (AI document scanner for ERP workflows).

## Run

1. Start the backend: `docker compose up --build` in the SnapLedger repo (API on http://localhost:8000).
2. `npm install`
3. Copy `.env.example` to `.env` and set `VITE_API_URL` if the API is elsewhere.
4. `npm run dev` and open http://localhost:5173

## Structure

- `src/types/api.ts`: TypeScript types matching the FastAPI responses
- `src/api/client.ts`: typed fetch client
- `src/api/hooks.ts`: TanStack Query hooks (including job polling)
- `src/components/`: Layout, DocumentTypePicker, DropZone
- `src/lib/validate.ts`: client-side image validation (type and 10 MB limit)
- `src/types/review.ts`: data passed from Upload to Review via router state
- `src/pages/`: Upload (done), Review (polling + JSON for now), Documents (API smoke test)
