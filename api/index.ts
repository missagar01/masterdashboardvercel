const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  process.env.VITE_API_URL ??
  '';

if (!apiUrl && typeof window === 'undefined') {
  // eslint-disable-next-line no-console
  console.warn(
    '[api] API_URL is not defined. Vendor rate API calls will fail until the environment variable is set.'
  );
}

export const API_URL = apiUrl;

