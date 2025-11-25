const clean = (url?: string) => {
  if (!url) return ''
  return url.endsWith('/') ? url.slice(0, -1) : url
}

const env = (key: string) => clean(process.env[key] || '')

const buildBase = (envKey: string, fallback: string) => env(envKey) || clean(fallback)

export const SUBSCRIPTION_API_BASE = buildBase(
  'NEXT_PUBLIC_SUBSCRIPTION_API_BASE',
  'http://15.206.75.247:5050'
)

export const REPAIR_API_BASE = buildBase(
  'NEXT_PUBLIC_REPAIR_API_BASE',
  'http://13.233.229.119:5050'
)

export const MAINTENANCE_API_BASE = buildBase(
  'NEXT_PUBLIC_MAINTENANCE_API_BASE',
  'http://18.60.212.185:5050'
)

export const STORE_API_BASE = buildBase(
  'NEXT_PUBLIC_STORE_API_BASE',
  'http://3.6.126.4:3004'
)

export const DEFAULT_API_BASE = buildBase('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:5050')
