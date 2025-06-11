import { invoke } from '@tauri-apps/api/core';
import checkSongs from '../../utils/checkSongs';

const fetchPlaylistSongs = async ({ queryKey, pageParam = 0 }: { queryKey: string, pageParam: number }) => {
  const token = queryKey[1];
  const id = queryKey[2];

  const fetchSongs = async (offset: number) => {
    const apiRes: string = await invoke("get_playlist_tracks",
      {
        accessToken: token,
        offset: offset,
        limit: 50,
        playlistId: id
      });

    const data = JSON.parse(apiRes);

    if (!data) {
      throw new Error(`Liked songs offset : ${offset} not ok`);
    }

    const ids = data.items.map((song) => song.track.id);
    const arrayOfLiked = await checkSongs(ids, token);

    data.items = data.items.map((item, idx) => ({ ...item, isLiked: arrayOfLiked[idx] }));

    return data;
  }

  const [page1, page2, page3] = await Promise.all([
    fetchSongs(pageParam),
    fetchSongs(pageParam + 50),
    fetchSongs(pageParam + 100),
  ]);

  if (page1.items) {
    return {
      items: [...page1.items, ...page2.items, ...page3.items],
      nextPage: pageParam + 150,
      hasNextPage: page3.items.length > 0,
    }
  }

  return null;
}

export default fetchPlaylistSongs;
