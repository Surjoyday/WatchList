import { useEffect } from "react";

export function useKey(keyPressed, actionOfKeyPress) {
  useEffect(
    function () {
      function handleKeyPress(e) {
        if (e.code.toLowerCase() === keyPressed.toLowerCase()) {
          actionOfKeyPress();
        }
      }

      document.addEventListener("keydown", handleKeyPress);

      return function () {
        document.removeEventListener("keydown", handleKeyPress);
      };
    },
    [actionOfKeyPress, keyPressed]
  );
}
