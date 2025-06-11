import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";
import { listen } from '@tauri-apps/api/event';
import { persist } from "zustand/middleware";
import { useNavigate } from "react-router";

type AuthStore = {
  token: string | null,
  isUserLogged: boolean,
  tokenExpiry: number,
  setToken: (newValue: string | null, expiration: number) => void;
  handleLoginSpotify: () => Promise<void>,
  handleRefreshToken: () => Promise<string>,
  reset: () => void,
}

interface LoadedPayload {
  logged: boolean,
  accessToken: string,
  expiresIn: number,
}

const initialState = {
  token: null,
  isUserLogged: false
}


export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setToken: (newValue, tokenExpiry) => {
        set({ 
          token: newValue, 
          tokenExpiry: tokenExpiry, 
          isUserLogged: true 
        })
      },
      handleLoginSpotify: async () => {
        try {
          const response = await fetch('http://localhost:9876/auth/login')
          const data = await response.json()

          return data.authUrl

        } catch (err) {
          console.log('Failed to initiate Spotify login', err);
        }
      },
      handleRefreshToken: async () => {
        try {
          const { token, tokenExpiry } = get()

          console.log("access", token, tokenExpiry)

          if (token && tokenExpiry && Date.now() < new Date(tokenExpiry)) {
            console.log("Using cached token");
            return token;
          }

          const response = await fetch('http://localhost:9876/auth/refresh');
          const data = await response.json()

          console.log("data", data)

          const newToken = data.token;
          set({ token: newToken });
          return newToken;
        } catch (err) {
          console.log('Failed to refresh token', err);
          return '';
        }
      },
      reset: () => {
        set(initialState)
      },
    }),
    {
      name: 'token',
      partialize: (state) => ({ token: state.token, tokenExpiry: state.tokenExpiry, isUserLogged: !!state.token }),
    }
  )
);
