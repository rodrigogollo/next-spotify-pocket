import "./PlaylistsPage.css";
import Loading from "../../components/Loading/Loading";
import { useSpotifyStore } from "../../stores/spotifyStore";
import Playlists from "../Playlists/Playlists";

const PlaylistsPage = () => {
  const isPlayerReady = useSpotifyStore((state) => state.isPlayerReady);

  return (
    <>
      {!isPlayerReady ?
        <Loading /> :
        <div className="playlists">
          <Playlists />
        </div>
      }
    </>
  )
}

export default PlaylistsPage;
