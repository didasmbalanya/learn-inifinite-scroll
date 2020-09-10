import React, { useState, useCallback, useRef } from "react";
import { useBookSearch } from "./customHooks/useBookSearch";

function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const { books, error, hasMore, loading } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <>
      <input
        value={query}
        type="text"
        onChange={handleSearch}
        // onKeyDown={(e) => {
        //   if (e.key === "Enter") {
        //     console.log(">>>>>", query);
        //   }
        // }}
      />
      {!error && !loading && books.length === 0 && <p>No books found </p>}
      {books.map((book, index) => {
        // console.log("book", book);

        if (books.length === index + 1) {
          return (
            <div key={index} ref={lastBookElementRef}>
              {index + 1}: {book}
            </div>
          );
        }

        return (
          <div key={index}>
            {index + 1}: {book}
          </div>
        );
      })}
      <div className="">{loading && <p>loading...</p>}</div>
      <div className="">{error && <p>Something went wrong</p>}</div>
    </>
  );
}

export default App;
