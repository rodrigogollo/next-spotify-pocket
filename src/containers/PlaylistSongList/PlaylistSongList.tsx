import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import "./PlaylistSongList.css";
import { useEffect } from "react";
import Loading from "../../components/Loading/Loading";
import { useAuthStore } from "../../stores/authStore";
import SongListContainer from "../../components/SongListContainer/SongListContainer";
import { useNavigate, useParams } from "react-router";
import fetchPlaylistSongs from "./fetchPlaylistSongs";
import { useSpotifyStore } from "../../stores/spotifyStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const PlaylistSongList = () => {
  const params = useParams();
  const id = params.playlistId;
  const token = useAuthStore((state) => state.token)
  const navigate = useNavigate();
  const playlist = useSpotifyStore((state) => state.currentPlaylist);
  const getPlaylist = useSpotifyStore((state) => state.getPlaylist);

  const { isLoading, isFetchingNextPage, data, error, fetchNextPage } = useInfiniteQuery({
    queryKey: [`playlist-songs-${id}`, token, id],
    queryFn: fetchPlaylistSongs,
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.nextPage : undefined,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  useEffect(() => {
    getPlaylist(id)
  }, [])

  if (error) {
    return <>{error.message}</>
  }

  return (
    <div className="playlist-songs">
      {playlist &&
        <div className="playlist-header">
          <FontAwesomeIcon className="icon" onClick={() => navigate(-1)} icon={faArrowLeft} size="lg" />
          <h3>{playlist.name}</h3>
          <img src={playlist.images[0].url} />
        </div>
      }
      {isLoading || !data || !data.pages ?
        <Loading /> :
        <SongListContainer
          isLoading={isLoading}
          data={data}
        />
      }
      <div ref={ref}></div>
      {isFetchingNextPage ? <Loading /> : null}
    </div>
  );
};

export default PlaylistSongList;
