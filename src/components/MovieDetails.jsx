import { useState, useEffect, useRef } from "react";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import StarRating from "./StarRating";
import { useMovies } from "../hooks/useMovies";
import { useKeyPress } from "../hooks/useKeyPress";

const KEY = import.meta.env.VITE_API_KEY;

const BASE_URL = "https://www.omdbapi.com/";

const parameter = "i";

function MovieDetails({
  selectedID,
  onCloseMovie,
  onAddWatched,
  onUpdateRating,
  watched,
}) {
  // const [movie, setMovie] = useState({});
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");
  const [rating, setRating] = useState(() => {
    const watchedMovie = watched.find((movie) => movie?.imdbID === selectedID);
    return watchedMovie?.userRating || 0;
  });
  const [isEditAllowed, setIsEditAllowed] = useState(false);
  const countRef = useRef(0);

  // CUSTOM hook for fetching movies
  const [movie, isLoading, error] = useMovies(
    BASE_URL,
    KEY,
    selectedID,
    parameter
  );

  let isWatched = watched.some((movie) => movie.imdbID === selectedID);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    // if (rating === 0) {
    //   alert("Plese add a rating to add to the list");
    //   return;
    // }
    const movieToAdd = {
      imdbID: selectedID,
      Title: title,
      Year: year,
      Poster: poster,
      runtime: parseFloat(runtime),
      imdbRating: Number(imdbRating),
      userRating: Number(rating),
      timesUserClickRating: countRef.current,
    };
    if (isEditAllowed) {
      onUpdateRating(selectedID, rating);
      onCloseMovie();
      return;
    }

    onAddWatched(movieToAdd);
    onCloseMovie();
  }

  function handleEdit() {
    setRating(0);
    setIsEditAllowed(true);
  }

  useEffect(
    function () {
      if (rating) countRef.current += 1;
    },
    [rating]
  );

  // CUSTOM hook for "ESCAPE" key press
  useKeyPress("keydown", "escape", onCloseMovie);

  useEffect(
    function () {
      document.title = `Movie: ${title}`;

      return () => (document.title = "Watchlist");
    },
    [title]
  );

  if (isLoading && error !== "") return <Loader />;
  if (!isLoading && error !== "") return <ErrorMessage errMsg={error} />;

  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={onCloseMovie}>
          &larr;
        </button>

        <img src={poster} alt={`Poster of ${movie}`} />

        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            <span>{released}</span> &bull; <span>{runtime}</span>
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐️</span>
            <span>{imdbRating}</span>
            <span>IMDb rating</span>
          </p>
        </div>
      </header>

      <section>
        <div className="rating">
          {isWatched && !isEditAllowed ? (
            <>
              <div className="movie-rated">
                <p>You have rated this movie {rating} ⭐️</p>
                <button onClick={handleEdit}>Edit</button>
              </div>
            </>
          ) : (
            <>
              <StarRating maxRating={10} size={24} onSetRating={setRating} />
              {rating > 0 && (
                <button onClick={handleAdd} className="btn-add">
                  {isEditAllowed ? "Update rating" : "+ Add to List"}
                </button>
              )}
            </>
          )}
        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p>Staring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}

export default MovieDetails;
