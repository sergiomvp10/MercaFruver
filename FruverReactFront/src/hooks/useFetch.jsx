import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:4000/api";

const useFetch = ({ endpoint, method, body }) => {

console.log({ endpoint, method, body });

  const [data, setData] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const refetching = () => {
    setLoading(true);
    axios({
        url:`${API}/${endpoint}`,
      method: method,
      body: JSON.stringify(body),
    })
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => setError(error))
      .finally((res) => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    axios({
      url: `${API}/${endpoint}`,
      method: method,
      body: JSON.stringify(body),
    })
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => setError(error)).finally(()=>setLoading(false))
  }, []);

  return { data, refetching, error, loading };
};

export default useFetch;
