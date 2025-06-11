import "./AlbumsList.css";
import { Link } from "react-router-dom";
import ScrollingText from "../../components/ScrollingText/ScrollingText";

const AlbumsList = ({ data }) => {

  return (
    <div className="albums-list">
      {
        data.items.flatMap((albums) => {
          console.log(albums)
          if (albums == null) return null;
          albums?.id == null ? console.log(albums) : null;

          return <Link className="current-album" key={`albums-${albums?.id}`} to={`/album/${albums?.id}`}>
            <ScrollingText text={albums.name + " - " + albums.artists[0].name} className={"current-album-text"} />
            {
              albums.images ?
                <img src={albums?.images[0]?.url} /> :
                <img src="../../../src-tauri/icons/64x64.png" />
            }
          </Link>
        })
      }
    </div>
  )
}

export default AlbumsList;
