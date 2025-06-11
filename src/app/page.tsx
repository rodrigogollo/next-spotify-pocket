"use client"

import { useEffect, useState } from "react";
import { Spotify as SpotifyPlayer } from "../components/Spotify/Spotify";
import { useAuthStore } from "../stores/authStore";
import HomePage from "../containers/HomePage/HomePage";
import LoginPage from "../containers/LoginPage/LoginPage";
import Navbar from "../components/Navbar/Navbar";
import { redirect } from "next/navigation";

const App = () => {
  const [test, setTest] = useState()
  // const handleLoginSpotify = useAuthStore(state => state.handleLoginSpotify)
  // const isPlayerReady = useSpotifyStore((state) => state.isPlayerReady);
  const isUserLogged = useAuthStore((state) => state.isUserLogged);

  return (
    <>
      {isUserLogged ? (
          <>
            {/* <Navbar /> */}
            <SpotifyPlayer />
            <HomePage />
          </>
        ) : redirect("/login")
      }
      <h1>{test}</h1>
    </>    
  );
}

export default App;
