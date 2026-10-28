export const MAX_MB = 10 // matches MAX_FILE_SIZE_MB in main.py

export function validateImage(file: File): string | null {
  if (!file.type.startsWith('image/')) return 'Choose an image file (PNG or JPG).'
  if (file.size > MAX_MB * 1024 * 1024) return `This file is too large. The maximum is ${MAX_MB} MB.`
  return null
}
