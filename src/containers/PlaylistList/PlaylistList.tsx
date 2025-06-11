import "./PlaylistList.css";
import { Link } from "react-router-dom";
import ScrollingText from "../../components/ScrollingText/ScrollingText";

const PlaylistList = ({ data }) => {

  return (
    <div className="playlist-list">
      {
        data.items.flatMap((playlist) => {
          if (playlist == null) return null;
          playlist?.id == null ? console.log(playlist) : null;

          return <Link className="current-playlist" key={`playlist-${playlist?.id}`} to={`/playlist/${playlist?.id}`}>
            <ScrollingText text={playlist.name} className={"current-playlist-text"} />
            {
              playlist.images ?
                <img src={playlist?.images[0]?.url} /> :
                <img src="../../../src-tauri/icons/64x64.png" />
            }
          </Link>
        })
      }
    </div>
  )
}

export default PlaylistList;
