import { useEffect, useRef, useState } from "react";

function useMovies(BASE_URL, KEY, query, parameter, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const timerRef = useRef(null);

  useEffect(
    function () {
      callback?.(null);
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `${BASE_URL}/?apikey=${KEY}&${parameter}=${query}`
          );

          if (!res.ok) throw new Error("Failed to load data");

          const data = await res.json();

          if (data.Response === "False") throw new Error(data.Error);

          setMovies(data.Search);
          setError("");
        } catch (err) {
          console.log(err.message);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setIsLoading(false);
        setError("");
        callback();
        return;
      }

      timerRef.current = setTimeout(fetchMovies, 500);

      return () => clearTimeout(timerRef.current);
    },
    [BASE_URL, KEY, query, callback, parameter]
  );

  return [movies, isLoading, error];
}

export { useMovies };
