import { useEffect, useState } from "react";

function useLocalStorageState(initialState, keyProp) {
  const [data, setData] = useState(() => {
    const storedVal = localStorage.getItem(keyProp);
    // This works for any data type because localStorage.getItem(keyProp) returns "null" if the key does not exist.
    // Otherwise, we would have to explicitly check for arrays or objects, as an empty object ({}) or array ([]) is not a falsy value.
    return storedVal ? JSON.parse(storedVal) : initialState;
  });

  useEffect(
    function () {
      localStorage.setItem(keyProp, JSON.stringify(data));
    },
    [data, keyProp]
  );

  return [data, setData];
}

export { useLocalStorageState };
