import { useEffect } from "react";

/// THE EVENT LISTENER WILL KEEP LISTENING ONCE THE COMPONENT MOUNTS BEACUSE ONCE A LISTNER IS RESGITERED FOR AN EVENT IT KEEPS LISTNEING UNTIL IT IS EXPILICITILY REMOVED

function useKeyPress(eventType, keyName, action) {
  useEffect(
    function () {
      const handleKeyPress = (e) => {
        const normalizeKeyName =
          keyName.slice(0, 1).toUpperCase() + keyName.slice(1);

        if (e.code === normalizeKeyName) {
          action?.();
        }
      };
      document.addEventListener(eventType, handleKeyPress);

      return () => document.removeEventListener(eventType, handleKeyPress);
    },
    [action, eventType, keyName]
  );
}

export { useKeyPress };
