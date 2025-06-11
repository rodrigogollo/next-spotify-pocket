import { invoke } from '@tauri-apps/api/core';
import checkSongs from '../../utils/checkSongs';

const fetchAlbumSongs = async ({ queryKey, pageParam = 0 }: { queryKey: string, pageParam: number }) => {
  const token = queryKey[1];
  const id = queryKey[2];

  const fetchSongs = async (offset: number) => {
    const apiRes: string = await invoke("get_album_tracks",
      {
        accessToken: token,
        offset: offset,
        limit: 50,
        albumId: id
      });

    const data = JSON.parse(apiRes);

    if (!data) {
      throw new Error(`Liked songs offset : ${offset} not ok`);
    }

    const ids = data.items.map((song) => song.id);
    const arrayOfLiked = await checkSongs(ids, token);

    data.items = data.items.map((item, idx) => ({ ...item, isLiked: arrayOfLiked[idx] }));

    return data;
  }

  const [page1] = await Promise.all([
    fetchSongs(pageParam)
  ]);

  if (page1.items) {
    return {
      items: [...page1.items],
      nextPage: pageParam + 150,
      hasNextPage: page1.items.length > 0,
    }
  }

  return null;
}

export default fetchAlbumSongs;
