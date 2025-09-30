import React, { useState, useEffect } from "react";
import { getBooks, createBook } from "../../services/api.js";
import BookCard from "./BookCard.jsx";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState({ title: "", author: "", category: "" });
  const [newBook, setNewBook] = useState({ title: "", author: "", category: "", quantity: "" });
  const [role, setRole] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role);
      }
    } catch {}
  }, []);

  useEffect(() => {
    getBooks({
      title: query.title || undefined,
      author: query.author || undefined,
      category: query.category || undefined,
    })
      .then((response) => setBooks(response.data))
      .catch((err) => console.error("Error fetching books:", err));
  }, [query.title, query.author, query.category]);

  return (
    <div>
      <h1>Book List</h1>
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        <input className="input" placeholder="Search title" value={query.title} onChange={(e) => setQuery({ ...query, title: e.target.value })} />
        <input className="input" placeholder="Search author" value={query.author} onChange={(e) => setQuery({ ...query, author: e.target.value })} />
        <input className="input" placeholder="Search category" value={query.category} onChange={(e) => setQuery({ ...query, category: e.target.value })} />
      </div>

      {role === "admin" && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ marginTop: 0 }}>Add Book</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 8 }}>
            <input className="input" placeholder="Title" value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} />
            <input className="input" placeholder="Author" value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} />
            <input className="input" placeholder="Category" value={newBook.category} onChange={(e) => setNewBook({ ...newBook, category: e.target.value })} />
            <input className="input" type="number" min={0} step={1} placeholder="Quantity" value={newBook.quantity} onChange={(e) => setNewBook({ ...newBook, quantity: e.target.value })} />
            
          </div>
          <button
            className="btn btn-primary"
            onClick={async () => {
              try {
                const payload = { ...newBook, quantity: Number(newBook.quantity || 0) };
                const { data } = await createBook(payload);
                setBooks((prev) => [...prev, data]);
                setNewBook({ title: "", author: "", category: "", quantity: ""});
              } catch (err) {
                alert("Create book failed: " + (err.response?.data?.error || err.message));
              }
            }}
            style={{ marginTop: 12 }}
          >
            Add Book
          </button>
        </div>
      )}
      <div className="grid">
        {books.length > 0 ? (
          books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isAdmin={role === "admin"}
              onDeleted={(id) => setBooks((prev) => prev.filter((b) => b.id !== id))}
              onUpdated={(updated) => setBooks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))}
            />
          ))
        ) : (
          <p>No books available.</p>
        )}
      </div>
    </div>
  );
};

export default BookList;
