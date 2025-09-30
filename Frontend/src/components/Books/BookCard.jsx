import React from "react";
import { useNavigate } from "react-router-dom";
import { createBorrow, deleteBook, updateBook } from "../../services/api.js";

const BookCard = ({ book, isAdmin = false, onDeleted, onUpdated }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = React.useState(false);
  const [edit, setEdit] = React.useState({ title: book.title, author: book.author, category: book.category || "", quantity: String(book.quantity ?? ""), description: book.description || "" });

  const handleBorrow = async () => {
    if (book.quantity === 0) {
      alert("No copies available to borrow!");
      return;
    }
    const borrowData = {
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
    <div className="card" style={{ width: 240 }}>
      {isEditing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <input placeholder="Title" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} />
          <input placeholder="Author" value={edit.author} onChange={(e) => setEdit({ ...edit, author: e.target.value })} />
          <input placeholder="Category" value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })} />
          <input type="number" min={0} step={1} placeholder="Quantity" value={edit.quantity} onChange={(e) => setEdit({ ...edit, quantity: e.target.value })} />
          <input placeholder="Description" value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />
          <div>
            <button
              onClick={async () => {
                try {
                  const payload = { ...edit, quantity: Number(edit.quantity || 0) };
                  const { data } = await updateBook(book.id, payload);
                  setIsEditing(false);
                  onUpdated?.(data);
                } catch (err) {
                  alert("Update failed: " + (err.response?.data?.error || err.message));
                }
              }}
              style={{ padding: "8px", background: "#007BFF", color: "#fff", border: "none", cursor: "pointer" }}
            >
              Save
            </button>
            <button onClick={() => { setIsEditing(false); setEdit({ title: book.title, author: book.author, category: book.category || "", quantity: String(book.quantity ?? ""), description: book.description || "" }); }} style={{ padding: "8px", marginLeft: 8 }}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <h3>{book.title}</h3>
          <p>
            <strong>Author:</strong> {book.author}
          </p>
          <p>
            <strong>Category:</strong> {book.category || "N/A"}
          </p>
          <p>
            <strong>Quantity:</strong> {book.quantity}
          </p>
          {!isAdmin && (
            <button
              onClick={handleBorrow}
              style={{
                padding: "8px",
                background: book.quantity === 0 ? "#999" : "#28A745",
                color: "white",
                border: "none",
                cursor: book.quantity === 0 ? "not-allowed" : "pointer",
              }}
              disabled={book.quantity === 0}
              title={book.quantity === 0 ? "Out of stock" : "Borrow this book"}
            >
              {book.quantity === 0 ? "Out of stock" : "Borrow"}
            </button>
          )}
          {isAdmin && (
            <>
            <button className="btn btn-outline" onClick={() => setIsEditing(true)} style={{ marginLeft: 8 }}>Edit</button>
              <button
                onClick={async () => {
                  if (!confirm("Delete this book?")) return;
                  try {
                    await deleteBook(book.id);
                    onDeleted?.(book.id);
                  } catch (err) {
                    alert("Delete failed: " + (err.response?.data?.error || err.message));
                  }
                }}
              className="btn btn-danger"
              style={{ marginLeft: 8 }}
              >
                Delete
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BookCard;
