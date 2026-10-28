# SnapLedger Web

React + TypeScript frontend for **SnapLedger**, an AI-powered document scanner for ERP workflows. Upload a photo of a receipt or invoice, review what the model extracted, correct it, and save it.

 **Backend API (FastAPI):** [DikshyaPaudel/snapledger](https://github.com/DikshyaPaudel/snapledger)

<!-- Add a screenshot or GIF of the full flow here -->

## How it works

1. Choose the document type: Receipt, Sales invoice, or Purchase invoice.
2. Drop in a photo. The API returns a job ID immediately and extracts the data in the background (about 15 to 20 seconds).
3. The app polls the job until it finishes.
4. Review the extracted fields next to the original image, fix anything the model got wrong, and check the line items total against the document total.
5. Confirm to save. Nothing is stored before this step.

## Features

- Required document type selection, with the vendor label changing to Customer or Supplier by type
- Drag-and-drop upload with image preview and client-side validation (image only, up to 10 MB)
- Async job polling with TanStack Query, including the case where a finished job contains an extraction error
- Editable review form with a confidence badge and highlighting for fields the model could not find
- Editable line items with a warning when they do not add up to the total
- Typed API client and response types that match the FastAPI backend

## Roadmap

- [ ] Push confirmed documents to ERPNext as draft Sales or Purchase Invoices
- [ ] Documents list with filters by type, date, and vendor
- [ ] Summary view (totals by document type, possible duplicates)

## Tech stack

React 19, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS.

## Run locally

You need the backend running first (see its README):

```bash
# in the backend repo
docker compose up --build        # API on http://localhost:8000

# in this repo
npm install
cp .env.example .env             # set VITE_API_URL if the API is elsewhere
npm run dev                      # http://localhost:5173
```

## Project structure

```
src/
  api/          typed fetch client and TanStack Query hooks
  components/   Layout, DocumentTypePicker, DropZone, ReviewForm, LineItemsTable, ConfidenceBadge
  lib/          validation, number and money formatting, review form logic
  pages/        UploadPage, ReviewPage, DocumentsPage
  types/        API response types, router state types
```

## Design decisions

- **Extraction and saving are separate.** The model proposes, a human confirms. A blurry image can produce wrong data, and financial data should not be written silently.
- **Document type is a required user choice, not an LLM guess.** Sales and purchase invoices sit on opposite sides of a ledger, so a wrong guess would corrupt reporting.
- **A completed job is not always a successful one.** The backend reports extraction errors inside a completed job result, so the UI checks for them explicitly.
- **The image stays in the browser.** The backend does not store uploads, so the preview exists only during the review step.