import { create } from "zustand";
import { useAuthStore } from "./authStore";
import { invoke } from "@tauri-apps/api/core";
import { persist } from "zustand/middleware";
import axios from "axios";

type SpotifyStore = {
  player: Spotify.Player | null;
  currentTrack: string;
  maxSeek: number;
  seek: number;
  volume: number;
  isPlayerReady: boolean;
  device: string;
  shuffle: boolean;
  currentUri: string;
  repeat: number;
  isDeviceConnected: boolean;
  isPlaying: boolean;
  currentPlaylist: any | null;
  currentAlbum: any | null;
  search: string;
  searchData: any[] | null;
  backgroundImage: File | null;
  filter: string;
  setSearch: (query: string) => void;
  transferDevice: (device_id: { device_id: string }) => Promise<void>;
  updateState: (state: any) => void;
  setSong: (uri: string, songs: any[]) => Promise<boolean>;
  likeSongs: (uris: string[]) => Promise<boolean>;
  unlikeSongs: (uris: string[]) => Promise<boolean>;
  getPlaylist: (playlistId: string | undefined) => void;
  getAlbum: (albumId: string | undefined) => void;
  reset: () => void;
}

const initialState = {
  player: null,
  currentTrack: "",
  maxSeek: 0,
  seek: 0,
  volume: 0.5,
  isPlayerReady: false,
  device: "",
  shuffle: false,
  currentUri: "",
  repeat: 0,
  isDeviceConnected: false,
  isPlaying: false,
  currentPlaylist: null,
  currentAlbum: null,
  search: "",
  searchData: null,
  backgroundImage: null,
  filter: "track",
}

export const useSpotifyStore = create<SpotifyStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setSearch: (query) => {
        set(() => ({ search: query }));
      },
      getPlaylist: async (playlistId) => {
        if (playlistId) {
          const token = useAuthStore.getState().token;
          const response = await invoke<string>("get_playlist", {
            accessToken: token,
            playlistId: playlistId
          });
          const playlist = JSON.parse(response);

          set(() => ({ currentPlaylist: playlist }));
        } else {
          set(() => ({ currentPlaylist: null }));
        }
      },
      getAlbum: async (albumId) => {
        if (albumId) {
          const token = useAuthStore.getState().token;
          const response = await invoke<string>("get_album", {
            accessToken: token,
            albumId: albumId
          });
          const album = JSON.parse(response);

          set(() => ({ currentAlbum: album }));
        } else {
          set(() => ({ currentAlbum: null }));
        }
      },
      setSong: async (uri, songs) => {
        const token = useAuthStore.getState().token;
        const uris = songs.flatMap(song => song?.track?.uri || song?.uri)
        const offset = uris.indexOf(uri);

        try {
          const isChanged = await invoke<string>("set_playback", {
            accessToken: token,
            uris: uris,
            offset: offset,
          });

          if (isChanged) {
            console.log("song changed");
            return true;
          } else {
            console.log("Failed to change song");
            return false;
          }
        } catch (err) {
          console.log("error changing song", err);
          return false;
        }
      },
      likeSongs: async (ids) => {
        const token = useAuthStore.getState().token;

        try {
          const isLiked = await invoke<boolean>("like_songs", {
            accessToken: token,
            ids: ids,
          });

          if (isLiked) {
            console.log("tracks saved");
            return true;
          } else {
            console.log("tracks not saved");
            return false;
          }

        } catch (err) {
          console.log("error liking the song", err);
          return false;
        }
      },
      unlikeSongs: async (ids) => {
        const token = useAuthStore.getState().token;

        try {
          const isUnliked = await invoke<boolean>("unlike_songs", {
            accessToken: token,
            ids: ids,
          });

          if (isUnliked) {
            console.log("tracks removed");
            return true;
          } else {
            console.log("tracks not removed");
            return false;
          }

        } catch (err) {
          console.log("error unliking the song", err);
          return false;
        }
      },
      transferDevice: async (device_id) => {
        const token = useAuthStore.getState().token;
        try {
          console.log("transferDevice", device_id);
          if (!get().isDeviceConnected) {
            // let isDeviceTransfered: boolean = await invoke('transfer_playback', { accessToken: token, deviceId: device_id });

            let isDeviceTransfered: boolean = await axios.post('http://localhost:9876/spotify/transfer-playback', 
              { 
                accessToken: token, 
                deviceId: device_id 
              })

            set(() => ({ isDeviceConnected: isDeviceTransfered, isPlayerReady: true }));
            // useSetSong(!get().currentUri);
            console.log("Device successfully transfered");
          } else {
            console.log("Device already transfered");
          }
        } catch (err) {
          console.log("Error transfering device", err);
          set(() => ({ isDeviceConnected: false }));
        }
      },
      updateState: (state) => {
        console.log("updating state", state);
        if (!state) return;

        if (state.position) {
          set(() => ({ seek: state.position }));
        }

        set(() => ({ isPlaying: !state.paused }));

        if (get().isPlayerReady != !state.loading) {
          set(() => ({ isPlayerReady: !state.loading }));
        }

        if (get().shuffle != state.shuffle) {
          set(() => ({ shuffle: state.shuffle }));
        }

        if (get().repeat != state.repeat_mode) {
          set(() => ({ repeat: state.repeat_mode }));
        }

        const stateTrack = state?.track_window?.current_track;
        const stateUri = stateTrack?.uri;

        if (stateTrack && get().currentUri !== stateUri) {
          const uri = stateTrack.linked_from.uri != null ? stateTrack.linked_from.uri : stateTrack.uri;
          set({
            maxSeek: stateTrack.duration_ms,
            currentUri: uri,
            currentTrack: `${stateTrack.artists[0].name} - ${stateTrack.name}`,
            seek: 0,
          });
        }
      },
      reset: () => {
        set(initialState)
      },
    }),
    {
      name: 'spotify-store',
      partialize: (state) => ({
        volume: state.volume,
        shuffle: state.shuffle,
        repeat: state.repeat,
        backgroundImage: state.backgroundImage,
      }),
    }
  )
);
