import { useState, useEffect } from 'react';

export function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(
    () => localStorage.getItem(key) || initialValue
  );

  useEffect(() => {
    if (value.length < 3) return;

    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
}
