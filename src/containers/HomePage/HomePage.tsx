import "./HomePage.css";
import Loading from "../../components/Loading/Loading";
import { useSpotifyStore } from "../../stores/spotifyStore";
import LikedSongs from "../LikedSongs/LikedSongs";

const HomePage = () => {
  const isPlayerReady = useSpotifyStore((state) => state.isPlayerReady);

  return (
    <>
      {!isPlayerReady ?
        <Loading /> :
        <div className="home">
          {/* <LikedSongs /> */}
        </div>
      }
    </>
  )
}

export default HomePage;
