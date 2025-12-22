import { useState, useEffect } from "react";

/**
 * useFetchData
 * @param {string[]} urls - Array of URLs to fetch
 * @returns {Object} { loading, data, error }
 */
export function useFetchData(urls) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]); 
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!urls || urls.length === 0) {
      setLoading(false);
      setData([]);
      return;
    }

    let canceled = false;

    async function fetchAll() {
      setLoading(true);
      setError(null);

      try {
        const results = await Promise.all(
          urls.map(async (url) => {
            const res = await fetch(url);
            if (!res.ok) {
              throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
            }
            return res; // or res.json() if expecting JSON
          })
        );

        if (!canceled) {
          setData(results);
          setLoading(false);
        }
      } catch (err) {
        if (!canceled) {
          setError(err);
          setLoading(false);
        }
      }
    }

    fetchAll();

    return () => {
      canceled = true; // cancel state updates if unmounted
    };
  }, [urls]);

  return { loading, data, error };
}
