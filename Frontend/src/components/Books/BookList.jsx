import React, { useState, useEffect } from "react";
import { getBooks } from "../../services/api.js";
import BookCard from "./BookCard.jsx";

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    getBooks()
      .then((response) => setBooks(response.data))
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Book List</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {books.length > 0 ? (
          books.map((book) => <BookCard key={book.id} book={book} />)
        ) : (
          <p>No books available.</p>
        )}
      </div>
    </div>
  );
};

export default BookList;
