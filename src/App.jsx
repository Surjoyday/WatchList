import { useEffect, useState } from "react";
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

const KEY = import.meta.env.VITE_API_KEY;

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("interstellar");
  const [selectedID, setSelectedID] = useState("");

  const tempQuery = "interstellar";

  /*   
  useEffect(function () {
    console.log("After Initail Render");
  }, []);

  useEffect(function () {
    console.log("After every render");
  });

  useEffect(
    function () {
      console.log("Synchronised with query state variable");
    },
    [query]
  );

  console.log("During render"); 
  */

  function handleSelectedMovie(id) {
    setSelectedID((selectedID) => (selectedID === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedID(null);
  }

  function handleAddWatch(watchedMovieData) {
    setWatched((watched) => [...watched, watchedMovieData]);
  }

  function handleDeleteWatch(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  function handleUpdateRating(id, newRating) {
    setWatched((watched) =>
      watched.map((movie) =>
        movie.imdbID === id ? { ...movie, userRating: newRating } : movie
      )
    );
  }

  useEffect(
    function () {
      async function fetchMovies(params) {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );

          if (!res.ok) throw new Error("Failed to load data");

          const data = await res.json();

          if (data.Response === "False") {
            throw new Error(data.Error);
          }

          setMovies(data.Search);
          // console.log(data);
        } catch (err) {
          // console.error(err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();
    },
    [query]
  );

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
