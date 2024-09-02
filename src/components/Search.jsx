import { useEffect, useRef } from "react";

export default function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useEffect(function () {
    inputEl.current.focus();
  }, []);

  /// THE EVENT LISTENER WILL KEEP LISTENING ONCE THE COMPONENT BEACUSE ONCE A LISTNER IS RESGITERED FOR AN EVENT IT KEEPS LISTNEING UNTIL IT IS EXPILICITILY REMOVED
  useEffect(
    function () {
      const handleKeyPress = (e) => {
        if (document.activeElement === inputEl.current) return;

        if (e.key === "Enter") {
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
