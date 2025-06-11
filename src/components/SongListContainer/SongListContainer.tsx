import SongList from "../SongList/SongList";
import "./SongListContainer.css";
import Loading from "../Loading/Loading";

const SongListContainer = ({ isLoading, data }) => {
  return (
    <div className="song-list-container">
      {isLoading || !data || !data.pages ?
        <Loading /> :
        data.pages.map((page, pageIndex) => (
          <SongList
            key={`song-list-${pageIndex}`}
            page={page}
            pageIndex={pageIndex}
          />
        ))
      }
    </div>
  );
}

export default SongListContainer;
