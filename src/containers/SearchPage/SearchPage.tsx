import "./SearchPage.css";
import { useAuthStore } from "../../stores/authStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faX } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import Loading from "../../components/Loading/Loading";
import SongList from "../../components/SongList/SongList";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import fetchPage from "./fetchSearch";
import { useSpotifyStore } from "../../stores/spotifyStore";
import Tags from "../../components/Tags/Tags";
import PlaylistList from "../PlaylistList/PlaylistList";
import AlbumsList from "../AlbumsList/AlbumsList";


const SearchPage = () => {
  const token = useAuthStore((state) => state.token);
  const search = useSpotifyStore((state) => state.search);
  const [query, setQuery] = useState(search);
  const searchData = useSpotifyStore((state) => state.searchData);
  const setSearch = useSpotifyStore((state) => state.setSearch);
  const filter = useSpotifyStore((state) => state.filter);

  const { isLoading, isFetchingNextPage, data, error, fetchNextPage } = useInfiniteQuery({
    queryKey: ["searched-songs", token, search, filter],
    queryFn: fetchPage,
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.nextPage : undefined,
    enabled: !!search,
    keepPreviousData: true,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, search]);

  if (data?.error) {
    return <>No songs found.</>
  }

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    if (query != "" && query != undefined) {
      setSearch(query);
    }
  }

  const handleSearchChange = (event) => {
    event.preventDefault();
    setQuery(event.target.value);
  }

  return (
    <form onSubmit={handleSearchSubmit} className="search-page">
      <div className="search-nav">
        <input type="text" placeholder="search" value={query} onChange={handleSearchChange} />
        <FontAwesomeIcon className="delete" icon={faX} onClick={() => setQuery("")} size={"sm"} />
        <button type="submit">
          <FontAwesomeIcon icon={faSearch} size="sm" />
        </button>
      </div>
      <Tags />
      <div className="searched-songs">
        {
          isLoading ? (
            <Loading />
          ) : (
            data?.pages && data.pages.length > 0 ? (
              data.pages.map((page, pageIndex) => {
                if (page.type == "tracks") {
                  return <SongList
                    key={`${page.id}-${pageIndex}`}
                    page={page}
                    pageIndex={pageIndex}
                  />
                } else if (page.type == "playlists") {
                  return <PlaylistList
                    key={`${page.id}-${pageIndex}`}
                    data={page}
                  />
                } else if (page.type == "albums") {
                  return <AlbumsList
                    key={`${page.id}-${pageIndex}`}
                    data={page}
                  />

                }
              })
            ) : error ? (
              <p>Error: {error.message}</p>
            ) : search === '' ? (
              <p>Start searching for songs</p>
            ) : data && data.pages.length === 0 ? (
              <p>No songs found.</p>
            ) : null
          )
        }
        {search ? <div ref={ref}></div> : null}
        {isFetchingNextPage ? <Loading /> : null}
      </div>
    </form>
  )
}

export default SearchPage;
