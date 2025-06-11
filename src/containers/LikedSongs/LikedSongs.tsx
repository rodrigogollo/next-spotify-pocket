"use client"
import "./LikedSongs.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import fetchPage from "./fetchSongs";
import SongList from "../../components/SongList/SongList";
import Loading from "../../components/Loading/Loading";
import { useAuthStore } from "../../stores/authStore";

const LikedSongs = () => {
  const token = useAuthStore((state) => state.token)

  const { isLoading, isFetchingNextPage, data, error, fetchNextPage } = useInfiniteQuery({
    queryKey: ["liked-songs", token],
    queryFn: fetchPage,
    //getNextPageParam: (lastPage) => lastPage.next,
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.nextPage : undefined,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  if (error) {
    return <>{error.message}</>
  }

  return (
    <div className="liked-songs">
      {isLoading || !data || !data.pages ?
        <Loading /> :
        data.pages.map((page, pageIndex) => {
          return <SongList
            key={`${pageIndex}-${1 + page.nextPage - 50}`}
            page={page}
            pageIndex={pageIndex}
          />
        })
      }
      <div ref={ref}></div>
      {isFetchingNextPage ? <Loading /> : null}
    </div>
  );
};

export default LikedSongs;
