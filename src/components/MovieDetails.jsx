import { useState, useEffect } from "react";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import StarRating from "./StarRating";

export default function MovieDetails({
  selectedID,
  onCloseMovie,
  onAddWatched,
  onUpdateRating,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(() => {
    const watchedMovie = watched.find((movie) => movie?.imdbID === selectedID);

    return watchedMovie?.userRating || 0;
  });

  const [isEditAllowed, setIsEditAllowed] = useState(false);

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
      async function fetchMovieDetails() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${
              import.meta.env.VITE_API_KEY
            }&i=${selectedID}`
          );

          if (!res.ok) throw new Error("500 series error");
          const data = await res.json();

          if (data.Response === "False")
            throw new Error("Movie Details not available");

          setMovie(data);
          console.log(data);
        } catch (err) {
          console.log(err.message);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      fetchMovieDetails();
    },
    [selectedID]
  );

  useEffect(
    function () {
      document.title = `Movie: ${title}`;

      return () => (document.title = "Watchlist");
    },
    [title]
  );

  if (isLoading) return <Loader />;
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
