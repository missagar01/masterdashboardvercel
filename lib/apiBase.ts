export function getApiBase() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  if (base) {
    return base.endsWith('/') ? base.slice(0, -1) : base
  }
  return 'http://localhost:5050'
}

export const API_BASE = getApiBase()
