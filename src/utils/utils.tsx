  export const msToTime = (duration: number) => {
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    let hours_str = hours < 10 ? "0" + hours : String(hours);
    let minutes_str = minutes < 10 ? "0" + minutes : minutes;
    let seconds_str = seconds < 10 ? "0" + seconds : seconds;

    return hours_str === "00" ? `${minutes_str}:${seconds_str}` : `${hours}:${minutes_str}:${seconds_str}`;
  }
