/**
 * API Service
 *
 * NOTE: This project now uses Supabase directly for all data operations.
 * This file is kept for backwards compatibility and potential future
 * external API integrations.
 *
 * For Supabase operations, import from '../lib/supabase' instead.
 */

import axios from 'axios';

// Create axios instance for any external API calls (not Supabase)
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for logging (development only)
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;

