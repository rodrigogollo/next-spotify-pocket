"use client"
import "./Seek.css";
import { SpotifyPlayerContext, useSpotifyPlayerContext } from "../../../hooks/SpotifyPlayerContext";
import { msToTime } from "../../utils/utils";
import { useSpotifyStore } from "../../stores/spotifyStore";
import { useEffect, useState } from "react";

const Seek = () => {
  const player = useSpotifyStore((state) => state.player)
  const maxSeek = useSpotifyStore((state) => state.maxSeek)
  const seek = useSpotifyStore((state) => state.seek)
  const [color, setColor] = useState("var(--color-light)");

  useEffect(() => {
    setColor(`linear-gradient(90deg, var(--color-green) ${(seek / maxSeek) * 100}%, var(--color-darkest) ${(seek / maxSeek) * 100}%)`);
  }, [seek, maxSeek])

  const handleSeek = async (event) => {
    if (player) {
      try {
        await player?.seek(event.target.value);
        useSpotifyStore.setState({ seek: event.target.value });
        console.log('Changed song position!', msToTime(parseInt(seek)));
      } catch (err) {
        console.log("Error changing seek", err);
      }
    }
  };

  return (
    <div className="seek">
      <p>{msToTime(seek)}</p>
      <input
        style={{ "background": color }}
        type="range"
        min="0"
        max={maxSeek}
        onChange={handleSeek}
        value={seek}
      />
      <p>{msToTime(maxSeek)}</p>
    </div>
  )
}

export default Seek;
