import "./Song.css";
import { useState } from "react";
import { msToTime } from "../../utils/utils";
import ScrollingText from "../ScrollingText/ScrollingText";
import { useSpotifyStore } from "../../stores/spotifyStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
//import { Alert, Button } from "@mui/material";
import { useQueryClient, useMutation } from '@tanstack/react-query'

type SongProps = {
  className: string;
  idx: number;
  song: Song;
  songs: Song[];
  query: string;
}

const Song = ({ className, song, songs, query }: SongProps) => {
  const queryClient = useQueryClient();
  const setSong = useSpotifyStore((state) => state.setSong);
  const likeSongs = useSpotifyStore((state) => state.likeSongs);
  const unlikeSongs = useSpotifyStore((state) => state.unlikeSongs);
  const [isLiked, setIsLiked] = useState(song.isLiked);

  const isPlayable = !song?.track?.is_playable || !song?.is_playable;
  const artist = song?.track?.artists[0]?.name;
  const track = song?.track?.name || song?.name;
  const uri = song?.track?.uri || song?.uri;
  const duration = song?.track?.duration_ms || song?.duration_ms;
  const fullname = artist ? artist + " - " + track : track;

  let classname = `song ${className} ${!isPlayable && !track ? "invalid" : ""}`

  const handleClick = (uri: string) => {
    setSong(uri, songs);
  }

  //let artists = song.track.artists.map((artist) => artist.name).join(", ");

  //<Alert
  //  severity="success"
  //  action={
  //    <Button color="inherit" size="small">
  //      UNDO
  //    </Button>
  //  }
  //>
  //  This Alert uses a Button component for its action.
  //</Alert>
  //

  //const likeUnlikeMutation = useMutation(
  //  async (song: Song) => {
  //    if (song.isLiked) {
  //      await unlikeSongs([song.track.id]);
  //    } else {
  //      await likeSongs([song.track.id]);
  //    }
  //  },
  //  {
  //    onMutate: async (song) => {
  //      queryClient.setQueryData([query], (oldSongs: Song[] | undefined) => {
  //        if (!oldSongs) return oldSongs;
  //          return oldSongs.map((s) =>
  //            s.track.id === song.track.id ? { ...s, isLiked: !s.isLiked } : s
  //          );
  //      });
  //    }
  //  }
  //)

  const handleLikeClick = async (song: Song) => {
    let change;
    let id = song?.track?.id || song?.id
    if (song.isLiked) {
      //  console.log("unlike")
      //  change = await unlikeSongs([song.track.id]);
    } else {
      console.log("like");
      change = await likeSongs([id]);
    }
    setIsLiked(change);
  }

  return (
    <div className={classname} >
      <span className="song-index" title={isLiked ? "Unlike" : "Like"} onClick={() => handleLikeClick(song)}>
        <FontAwesomeIcon className={song.isLiked ? "active" : ""} icon={song.isLiked ? faCircleCheck : faPlus} size="sm" />
      </span>
      <div onMouseDown={() => handleClick(uri)} className="text-container">
        <ScrollingText className="song-text" text={fullname} />
      </div>
      <span onMouseDown={() => handleClick(uri)} className="song-duration">{msToTime(duration)}</span>
    </div>
  )
}

export default Song;
