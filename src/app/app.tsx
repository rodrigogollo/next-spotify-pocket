"use client"
// import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "../containers/LoginPage/LoginPage";
import HomePage from "../containers/HomePage/HomePage";
import PlaylistsPage from "../containers/PlaylistsPage/PlaylistsPage";
import Player from "../containers/Player/Player";
import Navbar from "../components/Navbar/Navbar";
import { useAuthStore } from "../stores/authStore";
import { useSpotifyStore } from "../stores/spotifyStore";
import { useEffect } from "react";
import { Spotify as SpotifyPlayer } from "../components/Spotify/Spotify";
import PlaylistSongList from "../containers/PlaylistSongList/PlaylistSongList";
import SearchPage from "../containers/SearchPage/SearchPage";
import ChartPage from "../containers/ChartPage/ChartPage";
import SettingsPage from "../containers/SettingsPage/SettingsPage";
import AlbumSongList from "../containers/AlbumsSongList/AlbumSongList";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  }
})

const App = () => {
  useEffect(() => {
    const unlisten = useAuthStore.getState().initialize();
    // return () => {
    //   unlisten.then(f => f());
    // };
  }, []);

  const isPlayerReady = useSpotifyStore((state) => state.isPlayerReady);
  const isUserLogged = useAuthStore((state) => state.isUserLogged);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {isUserLogged ? (
          <>
            <Navbar />
            <SpotifyPlayer />
          </>
        ) : null}
        <div>
          <Routes>
            <Route path="/" element={!isUserLogged ? <LoginPage /> : <HomePage />} />
            {/* <Route path="/login" element={<LoginPage />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/playlist/:playlistId" element={<PlaylistSongList />} />
            <Route path="/album/:albumId" element={<AlbumSongList />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/chart" element={<ChartPage />} />
            <Route path="/settings" element={<SettingsPage />} /> */}
          </Routes>
          {isPlayerReady && <Player />}
        </div>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
