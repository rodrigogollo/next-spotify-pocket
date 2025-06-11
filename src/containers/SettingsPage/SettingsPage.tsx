import "./SettingsPage.css"
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../stores/authStore";
import { useSpotifyStore } from "../../stores/spotifyStore";
import { useEffect, useState } from "react";

const SettingsPage = () => {
  const navigate = useNavigate();
  const resetAuthStore = useAuthStore((state) => state.reset);
  const resetSpotifyStore = useSpotifyStore((state) => state.reset);
  const backgroundImage = useSpotifyStore((state) => state.backgroundImage);

  const handleLogOut = async () => {
    await invoke<string>("user_log_out");
    localStorage.clear();
    resetSpotifyStore();
    resetAuthStore();
    navigate("/login");
  }

  //useEffect(() => {
  //  const body = document.querySelector("body");
  //  let value = URL.createObjectURL(backgroundImage);
  //  body.style.backgroundImage = `url(${value})`;
  //}, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      useSpotifyStore.setState({ backgroundImage: e.target.files[0] });
      const body = document.querySelector("body");
      let value = URL.createObjectURL(e.target.files[0]);
      body.style.backgroundImage = `url(${value})`;
    }
  }

  return (
    <div className="settings-container">
      <button onClick={handleLogOut}>Log Out</button>
      <input type="file" id="background-img" accept="image/png, image/jpeg" onChange={handleFileChange} />
    </div>
  )
}

export default SettingsPage;
