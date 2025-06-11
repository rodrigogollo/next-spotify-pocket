import { invoke } from '@tauri-apps/api/core';
import { QueryFunction } from '@tanstack/react-query';

const fetchPlaylists: QueryFunction<any, ["liked-songs", string]> = async ({ queryKey, pageParam }) => {
  const token = queryKey[1];
  const url = new URL(pageParam);
  const offset = parseInt(url.searchParams.get("offset") || 0);

  const apiRes = await invoke("get_user_playlists",
    {
      accessToken: token,
      offset: offset,
      limit: 50
    });

  const playlists = JSON.parse(apiRes);

  if (!playlists) {
    throw new Error(`Liked songs offset : ${offset} not ok`);
  }

  return playlists;
}

export default fetchPlaylists;
