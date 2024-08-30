export function WatchedMoviesList({ watched, onDeleteWatch }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovies
          key={movie.imdbID}
          movie={movie}
          onDeleteWatch={onDeleteWatch}
        />
      ))}
    </ul>
  );
}

function WatchedMovies({ movie, onDeleteWatch }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <button
        onClick={() => onDeleteWatch(movie.imdbID)}
        className="btn-delete"
      >
        x
      </button>

      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}
