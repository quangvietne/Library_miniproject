import React from "react";
import { useNavigate } from "react-router-dom";
import { createBorrow } from "../../services/api.js";

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  const handleBorrow = async () => {
    if (book.quantity === 0) {
      alert("No copies available to borrow!");
      return;
    }
    const borrowData = {
      user_id: 1, // Replace with dynamic user ID from auth (e.g., localStorage or context)
      book_id: book.id,
      borrow_date: new Date().toISOString().split("T")[0],
      due_date: new Date(new Date().setDate(new Date().getDate() + 14))
        .toISOString()
        .split("T")[0],
    };
    try {
      await createBorrow(borrowData);
      alert("Book borrowed successfully!");
      navigate("/borrows");
    } catch (err) {
      alert("Borrow failed: " + err.response?.data?.error || err.message);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        margin: "10px",
        width: "200px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h3>{book.title}</h3>
      <p>
        <strong>Author:</strong> {book.author}
      </p>
      <p>
        <strong>Quantity:</strong> {book.quantity}
      </p>
      <button
        onClick={handleBorrow}
        style={{
          padding: "8px",
          background: "#28A745",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
        disabled={book.quantity === 0}
      >
        Borrow
      </button>
    </div>
  );
};

export default BookCard;
