import "./Controller.css";
import { invoke } from "@tauri-apps/api/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlay, faCirclePause, faForwardStep, faBackwardStep, faShuffle, faRepeat } from '@fortawesome/free-solid-svg-icons'
import { useSpotifyStore } from "../../stores/spotifyStore";
import { useAuthStore } from "../../stores/authStore";

const Controller = () => {
  const player = useSpotifyStore((state) => state.player)
  const isPlaying = useSpotifyStore((state) => state.isPlaying)
  const shuffle = useSpotifyStore((state) => state.shuffle)
  const repeat = useSpotifyStore((state) => state.repeat)

  const token = useAuthStore.getState().token

  const handleToggle = async () => {
    try {
      if (player) {
        await player.togglePlay();
      }
    } catch (err) {
      console.log("erro toggle", err);
    }
  };

  const handleNext = async () => {
    if (player) {
      try {
        await player.nextTrack();
      } catch (err) {
        console.log("error next", err);
      }
    }
  };

  const handlePrev = async () => {
    if (player) {
      try {
        await player.previousTrack();
        useSpotifyStore.setState({ seek: 0 });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleShuffle = async () => {
    const isShuffle = await invoke<string>("toggle_shuffle", { accessToken: token, state: !shuffle });
    console.log(isShuffle);
  };

  const handleRepeat = async () => {
    const state = repeat == 0 ? 1 : repeat == 1 ? 2 : 0;
    await invoke<string>("toggle_repeat", { accessToken: token, state: state });
  };

  return (
    <div className="controls">
      <button onMouseDown={handleShuffle}>
        <FontAwesomeIcon icon={faShuffle} className={shuffle ? "active" : ""} size="lg" />
      </button>
      <button id="next" onMouseDown={handlePrev}>
        <FontAwesomeIcon icon={faBackwardStep} size="xl" />
      </button>
      <button id="play" onMouseDown={handleToggle}>
        <FontAwesomeIcon icon={isPlaying ? faCirclePause : faCirclePlay} size="2xl" />
      </button>
      <button id="next" onMouseDown={handleNext}>
        <FontAwesomeIcon icon={faForwardStep} size="xl" />
      </button>
      <button onMouseDown={handleRepeat}>
        <FontAwesomeIcon icon={faRepeat} className={repeat == 1 ? "active" : repeat == 2 ? "active2" : ""} size="lg" />
      </button>
    </div>
  )
}

export default Controller; 
