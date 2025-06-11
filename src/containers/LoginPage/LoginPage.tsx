"use client"
import "./LoginPage.css";
import { useAuthStore } from "../../stores/authStore";
import { useState } from "react";
import Loading from "../../components/Loading/Loading";
import { useEffect } from "react";
// import { useNavigate } from "react-router";
import { redirect } from "next/navigation";

const LoginPage = () => {
  const isUserLogged = useAuthStore((state) => state.isUserLogged);
  const handleLoginSpotify = useAuthStore.getState().handleLoginSpotify
  const [isLoading, setIsLoading] = useState(isUserLogged);
  // const navigate = useNavigate();

  const handleLoginClick = () => {
    const login = async () => {
      const authUrl = await handleLoginSpotify();
      // const newTab = window.open(authUrl, '_blank');
      redirect(authUrl)
    }
    login()

    setIsLoading(true);
  }

  useEffect(() => {
    if (isUserLogged) {
      setIsLoading(true)
      redirect("/");
    }
  }, [isUserLogged])

  return (
    <div className="login">
      {
        isLoading ? <Loading /> :
          <button id="login" onClick={handleLoginClick}>Log In</button>
      }
    </div>
  )
}

export default LoginPage;
