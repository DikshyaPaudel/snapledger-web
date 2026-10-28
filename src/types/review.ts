import type { DocumentType } from './api'

// Passed from the upload page to the review page through router state.
// The backend never stores the image, so the browser keeps it for the review step.
export interface ReviewState {
  docType: DocumentType
  file: File
}
