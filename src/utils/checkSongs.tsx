import { invoke } from '@tauri-apps/api/core';

const checkSongs = async (ids, token) => {
  const response = await invoke("check_user_saved_tracks", {
    accessToken: token,
    ids: ids,
  });
  return JSON.parse(response);
}
export default checkSongs;
