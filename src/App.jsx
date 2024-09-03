import { useCallback, useEffect, useState } from "react";
import MovieDetails from "./components/MovieDetails";
import ErrorMessage from "./components/ErrorMessage";
import Loader from "./components/Loader";
import NavBar from "./components/NavBar";
import Search from "./components/Search";
import { NumResults } from "./components/NumResults";
import { Box } from "./components/Box";
import { MovieList } from "./components/MovieList";
import { WatchedSummary } from "./components/WatchedSummary";
import { WatchedMoviesList } from "./components/WatchedMoviesList";
import { useMovies } from "./hooks/useMovies";
import { useLocalStorageState } from "./hooks/useLocalStorageState";

const KEY = import.meta.env.VITE_API_KEY;

const BASE_URL = "https://www.omdbapi.com/";

const parameter = "s";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedID, setSelectedID] = useState("");

  const handleCloseMovie = useCallback(() => {
    setSelectedID(null);
  }, []);

  const [movies, isLoading, error] = useMovies(
    BASE_URL,
    KEY,
    query,
    parameter,
    handleCloseMovie
  );

  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSelectedMovie(id) {
    setSelectedID((selectedID) => (selectedID === id ? null : id));
  }

  function handleAddWatch(watchedMovieData) {
    setWatched((watched) => [...watched, watchedMovieData]);

    // console.log(watched);
    // localStorage.setItem(
    //   "watched",
    //   JSON.stringify([...watched, watchedMovieData])
    // );
  }

  function handleDeleteWatch(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));

    // const updatedWatchedList = JSON.parse(
    //   localStorage.getItem("watched")
    // ).filter((movie) => movie.imdbID !== id);

    // localStorage.setItem("watched", JSON.stringify(updatedWatchedList));
  }

  function handleUpdateRating(id, newRating) {
    setWatched((watched) =>
      watched.map((movie) =>
        movie.imdbID === id ? { ...movie, userRating: newRating } : movie
      )
    );

    // const updateRating = JSON.parse(localStorage.getItem("watched")).map(
    //   (movie) =>
    //     movie.imdbID === id ? { ...movie, userRating: newRating } : movie
    // );

    // localStorage.setItem("watched", JSON.stringify(updateRating));
  }

  /// SINCE WE ARE USING AN EFFECT WE DON'T NEED TO SEPARATELY HANDLE THE UPDATED OR DELETE , the useEffect will synchronise the local storage which is a side effect with the "watched" state variable which passed as a dependency

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  // useEffect(
  //   function () {
  //     async function fetchMovies() {
  //       try {
  //         setIsLoading(true);
  //         setError("");

  //         const res = await fetch(
  //           `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
  //         );

  //         if (!res.ok) throw new Error("Failed to load data");

  //         const data = await res.json();
  //         // console.log(data);

  //         if (data.Response === "False") {
  //           throw new Error(data.Error);
  //         }

  //         setMovies(data.Search);
  //         setError("");
  //       } catch (err) {
  //         if (err.name !== "AbortError") {
  //           console.log(err.message);
  //           setError(err.message);
  //         }
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }

  //     if (query.length < 3) {
  //       setMovies([]);
  //       setError("");
  //       handleCloseMovie();
  //       return;
  //     }

  //     handleCloseMovie();

  //     const timerID = setTimeout(fetchMovies, 500);

  //     return () => clearTimeout(timerID);
  //   },
  //   [query]
  // );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        {/* /// COMPOSNENT COMPOSITION */}
        <Box>
          {isLoading && !error && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectedMovie={handleSelectedMovie} />
          )}
          {error && <ErrorMessage errMsg={error} />}
        </Box>

        <Box>
          {selectedID ? (
            <MovieDetails
              selectedID={selectedID}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatch}
              watched={watched}
              onUpdateRating={handleUpdateRating}
              key={crypto.randomUUID()}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatch={handleDeleteWatch}
              />
            </>
          )}
        </Box>

        {/* /// EXPLICIT PROP */}
        {/* <Box element={<MovieList movies={movies} />} />
        <Box
          element={
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} />
            </>
          }
        /> */}
      </Main>
    </>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}
