import React, { useEffect, useState } from "react";
import { Table as BootstrapTable, Spinner, ButtonGroup, ToggleButton } from "react-bootstrap";
import { BookResult, Book_type } from "../../book_type";
import "./Table.css";

interface TableProps {
  searchQuery: string;
}

const Table: React.FC<TableProps> = ({ searchQuery }) => {
  const [books, setBooks] = useState<Book_type[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState<string>(searchQuery);
  const [sortBy, setSortBy] = useState<string>("relevance");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setBooks([]);
      setLoading(false);
      return;
    }

    const formattedQuery = debouncedQuery.trim().replace(/\s+/g, "+");

    setLoading(true);
    fetch(`https://openlibrary.org/search.json?q=${formattedQuery}`)
      .then((res) => res.json())
      .then((data: BookResult) => setBooks(data.docs))
      .catch((err) => console.error("Error fetching books:", err))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

const filteredBooks = books.filter((book) =>
  book.title.toLowerCase().includes(debouncedQuery.toLowerCase())
);

const sortedBooks = [...filteredBooks].sort((a, b) => {
  if (sortBy === "year") {
    return (a.first_publish_year || Infinity) - (b.first_publish_year || Infinity);
  } else if (sortBy === "relevance") {
    return filteredBooks.indexOf(a) - filteredBooks.indexOf(b);
  }
  return 0;
});


  return (
    <div className="container mt-4">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
          <Spinner animation="border" />
        </div>
      ) : sortedBooks.length === 0 ? (
        <div className="text-center" style={{ fontSize: "18px", color: "#6c757d" }}>
          <h3 className="mb-3" style={{ color: "#28a745", fontWeight: "bold" }}>
            No Books Found
          </h3>
          <p>
            {searchQuery
              ? `No results found for "${searchQuery}".`
              : "Please start searching for a book in the above search box so that books appear here."}
          </p>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Sort By:</h5>
            <ButtonGroup>
              <ToggleButton
                id="sort-relevance"
                type="radio"
                variant="outline-primary"
                name="sort"
                value="relevance"
                checked={sortBy === "relevance"}
                onChange={() => setSortBy("relevance")}
              >
                Relevance
              </ToggleButton>
              <ToggleButton
                id="sort-year"
                type="radio"
                variant="outline-primary"
                name="sort"
                value="year"
                checked={sortBy === "year"}
                onChange={() => setSortBy("year")}
              >
                Year
              </ToggleButton>
            </ButtonGroup>
          </div>

          <div className="table-responsive">
            <BootstrapTable striped bordered hover variant="light">
              <thead>
                <tr className="table-header" style={{ backgroundColor: "#16a085", color: "white" }}>
                  <th className="text-center">ISBN</th>
                  <th className="text-center">Title</th>
                  <th className="text-center">Author</th>
                  <th className="text-center">First Published</th>
                  <th className="text-center">Pages</th>
                </tr>
              </thead>
              <tbody>
                {sortedBooks.map((book, index) => (
                  <tr key={book.isbn ? book.isbn[0] : book.title + index} className="table-row">
                    <td>{book.isbn ? book.isbn[0] : "N/A"}</td>
                    <td>{book.title}</td>
                    <td>{book.author_name?.join(", ") || "Unknown"}</td>
                    <td>{book.first_publish_year || "N/A"}</td>
                    <td>{book.number_of_pages_median || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </BootstrapTable>
          </div>
        </>
      )}
    </div>
  );
};

export default Table;
