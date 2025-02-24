import { useEffect, useState } from "react";

export const useFetch = (url, options = {}, dependencies = []) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {  
      try {
        const res = await fetch(url, options);
        const resData = await res.json();
        if (!res.ok) {
          throw new Error(resData.message || "Something went wrong");
        }
        setData(resData);
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, error, loading };
};