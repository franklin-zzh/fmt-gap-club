// Simple app params - reads from environment variables only
export const appParams = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
};
