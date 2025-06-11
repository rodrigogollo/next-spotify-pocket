import { useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useAuthStore } from "../../stores/authStore";
import { useSpotifyStore } from "../../stores/spotifyStore";

const useSetSong = () => {
  const token = useAuthStore((state) => state.token)

  const setSong = useCallback(async (uri: string, songs: any[]) => {
    if (!token) {
      console.log("setSong has no valid token available");
      return false;
    }
    const uris = songs.map(song => song.track.uri)
    const offset = uris.indexOf(uri);

    try {
      const isChanged = await invoke<string>("set_playback", {
        accessToken: token, 
        uris: uris,
        offset: offset,
      });

      if (isChanged) {
        console.log("song changed");
        useSpotifyStore.setState({ currentUri: uri });
        return true;
      } else {
        console.log("Failed to change song");
        return false;
      }
    } catch (err) {
      console.log("error changing song", err);
    }
  }, [token]);

  return { setSong };
};

export default useSetSong;
