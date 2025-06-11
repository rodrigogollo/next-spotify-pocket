"use client"
import { useEffect } from "react";
import { useSpotifyStore } from "../../stores/spotifyStore";
import { useAuthStore } from "../../stores/authStore";

export const Spotify = () => {
  const handleRefreshToken = useAuthStore((state) => state.handleRefreshToken);
  const player = useSpotifyStore((state) => state.player);
  const isPlaying = useSpotifyStore((state) => state.isPlaying);
  const seek = useSpotifyStore((state) => state.seek);
  const maxSeek = useSpotifyStore((state) => state.maxSeek);
  const volume = useSpotifyStore((state) => state.volume);
  const updateState = useSpotifyStore((state) => state.updateState);
  const transferDevice = useSpotifyStore((state) => state.transferDevice);

  useEffect(() => {
    let interval: any;
    let isFinished = Number(seek) >= Number(maxSeek);

    if (isPlaying && !isFinished) {
      interval = setInterval(() => {
        useSpotifyStore.setState((store) => ({ seek: store.seek + 1000 }));
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);

  }, [isPlaying, seek, maxSeek]);

  useEffect(() => {
    const setupPlayer = async () => {

      const scriptTag = document.createElement('script');
      scriptTag.src = 'https://sdk.scdn.co/spotify-player.js';
      scriptTag.async = true;

      scriptTag.onerror = () => console.error('Failed to load Spotify SDK script');
      document.head!.appendChild(scriptTag);

      window.onSpotifyWebPlaybackSDKReady = async () => {
        const player = new window.Spotify.Player({
          name: "Spotify Pocket",
          getOAuthToken: async (cb) => {
            const newToken = await handleRefreshToken();
            console.log("TOKEEEEEEEEN", newToken)
            cb(newToken);
          },
          volume: volume,
        });

        player.addListener("ready", ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          transferDevice(device_id);
        });

        player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID is not ready for playback', device_id);
        });

        player.addListener('authentication_error', ({ message }) => {
          console.error('Failed to authenticate', message);
          // player.getOAuthToken()
        });

        player.addListener('initialization_error', ({ message }) => {
          console.error('Failed to initialize', message);
        });

        player.addListener('account_error', ({ message }) => {
          console.error('Failed to validate Spotify account', message);
        });

        player.addListener('playback_error', ({ message }) => {
          console.error('Failed to perform playback', message);
          useSpotifyStore.setState({ isDeviceConnected: false });
        });

        player.addListener('player_state_changed', (state) => {
          updateState(state)
        });

        const success = await player.connect();
        if (success) {
          useSpotifyStore.setState({ player: player });
          console.log('The Web Playback SDK successfully connected to Spotify!');
        }
      };
    }

    setupPlayer();

    const cleanupSpotifyElements = () => {
      console.log("cleanup spotify");
      const iframes = document.querySelectorAll('iframe[src*="sdk.scdn"]');
      iframes.forEach(iframe => iframe.remove());

      const scripts = document.querySelectorAll('script[src*="spotify-player"]');
      scripts.forEach(script => script.remove());
    };

    return function cleanup() {
      if (player) {
        player.disconnect();
      }
      cleanupSpotifyElements();
    }
  }, []);

  return null;
}
