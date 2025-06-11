import { useEffect, useState } from "react"

function useLocalStorageState(key: string, initialValue: any) {
  const [state, setState] = useState(
    () => window.localStorage.getItem(key) || initialValue
  );

  useEffect(() => {
    window.localStorage.setItem(key, state);
  }, [key, state])
  
  return [state, setState];
}

export default useLocalStorageState
