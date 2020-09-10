import { useEffect, useState } from "react";
import axios from "axios";

export const useBookSearch = (query, pageNumber) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    // fetch more data
    let cancel;
    setLoading(true);
    setError(false);
    axios({
      method: "GET",
      url: "http://openlibrary.org/search.json",
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        console.log(`\n >>>>>>>> ${query}\n`, res.data, "\n >>>>>>>> \n");
        setLoading(false);
        setBooks((prevBooks) => {
          return [...new Set([...prevBooks, ...res.data.docs.map((b) => b.title)])];
        });

        setHasMore(res.data.docs.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        if (axios.isCancel(e)) return;
        console.log("error \n", e, "\n error");
        setError(true);
      });
    return () => cancel();
  }, [query, pageNumber]);
  return { loading, error, books, hasMore };
};
