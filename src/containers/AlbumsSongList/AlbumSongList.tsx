import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import "./AlbumSongList.css";
import { useEffect } from "react";
import Loading from "../../components/Loading/Loading";
import { useAuthStore } from "../../stores/authStore";
import SongListContainer from "../../components/SongListContainer/SongListContainer";
import { useNavigate, useParams } from "react-router";
import fetchAlbumSongs from "./fetchAlbumSongs";
import { useSpotifyStore } from "../../stores/spotifyStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const AlbumSongList = () => {
  const params = useParams();
  const id = params.albumId;
  const token = useAuthStore((state) => state.token)
  const navigate = useNavigate();
  const album = useSpotifyStore((state) => state.currentAlbum);
  const getAlbum = useSpotifyStore((state) => state.getAlbum);

  const { isLoading, isFetchingNextPage, data, error, fetchNextPage } = useInfiniteQuery({
    queryKey: [`albums-songs-${id}`, token, id],
    queryFn: fetchAlbumSongs,
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.nextPage : undefined,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  useEffect(() => {
    getAlbum(id)
  }, [])

  if (error) {
    return <>{error.message}</>
  }

  console.log("album songs", data)

  return (
    <div className="album-songs">
      {album &&
        <div className="album-header">
          <FontAwesomeIcon className="icon" onClick={() => navigate(-1)} icon={faArrowLeft} size="lg" />
          <h3>{album.name}</h3>
          <img src={album.images[0].url} />
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

export default AlbumSongList;
