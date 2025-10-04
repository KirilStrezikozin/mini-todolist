import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: false,
  timeout: 10000,
});

/* Automatically attach access token for requests to API routes. */
api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.user.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }
  return config;
});

export default api;