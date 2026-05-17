import { useEffect } from "react";

function useDelayedImport(importFn, delay = 1000) {
  useEffect(() => {
    const id = setTimeout(() => {
      importFn();
    }, delay);

    return () => clearTimeout(id);
  }, [importFn, delay]);
}

export default useDelayedImport;