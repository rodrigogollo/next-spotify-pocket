"use client"
import "./Volume.css";
import { ChangeEvent, CSSProperties, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeLow, faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import { useSpotifyStore } from "../../stores/spotifyStore";
import { useEffect } from "react";

const Volume = () => {
  const player = useSpotifyStore((state) => state.player);
  const volume = useSpotifyStore((state) => state.volume);
  const [bubblePosition, setBubblePosition] = useState(0);
  const [lastVolume, setLastVolume] = useState(volume);
  const [color, setColor] = useState("var(--color-light)");

  useEffect(() => {
    setColor(`linear-gradient(90deg, var(--color-green) ${volume * 100}%, var(--color-darkest) ${volume * 100}%)`);
  }, [volume])

  const handleVolumeChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (player) {
      try {
        let vol = Number(event.target.value) / 10;
        await player?.setVolume(vol / 10);
        useSpotifyStore.setState({ volume: vol / 10 });
        setLastVolume(vol / 10);

        // Update bubble position based on slider value
        const newValue = Number(event.target.value);
        const sliderWidth = Number(event.target.getBoundingClientRect().width);
        const min = Number(event.target.min) || 0;
        const max = Number(event.target.max) || 100;
        const percentage = (newValue - min) / (max - min);
        setBubblePosition(480 - (130 - percentage * sliderWidth));

      } catch (err) {
        console.log("error changing volume", err);
      }
    }
  };

  const bubble: CSSProperties = {
    position: "absolute",
    top: "65px",
    left: `${bubblePosition}px`,
    width: "30px",
    padding: "2px",
    backgroundColor: "var(--color-light)",
    borderRadius: "4px",
    textAlign: "center",
    pointerEvents: "none",
    transform: "translateX(-50%)",
    color: "var(--color-darkest)",
    fontSize: "10px"
  }

  const handleToggleVolume = async () => {
    if (volume != 0) {
      await player?.setVolume(0);
      useSpotifyStore.setState({ volume: 0 });
    } else {
      await player?.setVolume(lastVolume);
      useSpotifyStore.setState({ volume: lastVolume });
    }
  }

  return (
    <div className="volume">
      <FontAwesomeIcon icon={
        volume == 0 ? faVolumeXmark :
          volume <= 0.5 ? faVolumeLow :
            faVolumeHigh
      }
        onClick={handleToggleVolume}
        className="icon"
        size="lg"
      />
      <input
        style={{ "background": color }}
        type="range"
        min="0"
        max="100"
        value={volume * 100}
        onChange={handleVolumeChange}
        name="volume"
        orient="vertical"
      />
      <div id="bubble" style={bubble}>{Math.floor(Number(volume * 100))}%</div>
    </div>
  )
}

export default Volume;
