import { useEffect, useRef } from "react";
import { useKeyPress } from "../hooks/useKeyPress";

export default function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useEffect(function () {
    inputEl.current.focus();
  }, []);

  // useKeyPress("keydown", "Enter", () => {
  //   if (document.activeElement === inputEl.current) return;
  //   inputEl.current.focus();
  //   setQuery("");
  // });

  useEffect(
    function () {
      const handleKeyPress = (e) => {
        if (e.key === "Enter") {
          if (document.activeElement === inputEl.current) return;
          inputEl.current.focus();
          setQuery("");
        }
      };
      document.addEventListener("keydown", handleKeyPress);

      return () => document.removeEventListener("keydown", handleKeyPress);
    },
    [setQuery]
  );

  return (
    <input
      ref={inputEl}
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
