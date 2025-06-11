import "./SongList.css";
import Song from "../Song/Song";
import { useSpotifyStore } from "../../stores/spotifyStore";

const SongList = ({ page, pageIndex, query }) => {
  const currentUri = useSpotifyStore((state) => state.currentUri)

  return (
    <div className="song-list" key={`${pageIndex}-${1 + page.nextPage - 150}`}>
      {
        page.items.flatMap((song: Song, idx: number) => {
          return <Song
            className={currentUri == song?.track?.uri || currentUri == song?.uri ? "active" : ""}
            idx={1 + page.nextPage + idx - 150}
            key={`${pageIndex}-${song?.track?.id || song?.id}`}
            song={song}
            songs={page.items}
            query={query}
          />
        })
      }
    </div>
  );
}

export default SongList;
