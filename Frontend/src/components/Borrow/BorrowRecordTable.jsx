import React, { useState, useEffect } from "react";
import { getBorrows, returnBorrow } from "../../services/api.js";

const BorrowRecordTable = () => {
  const [borrows, setBorrows] = useState([]);

  useEffect(() => {
    getBorrows()
      .then((response) => setBorrows(response.data))
      .catch((err) => console.error("Error fetching borrows:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Borrow Records</h1>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ddd",
        }}
      >
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              User ID
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Book ID</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Book Title</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              Borrow Date
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              Due Date
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              Return Date
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>
              Status
            </th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {borrows.length > 0 ? (
            borrows.map((borrow) => (
              <tr key={borrow.id} style={{ border: "1px solid #ddd" }}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {borrow.user_id}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{borrow.book_id}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{borrow.Book?.title || borrow.book?.title || ""}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {borrow.borrow_date}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {borrow.due_date}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {borrow.return_date || "N/A"}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {borrow.status}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {borrow.status !== "returned" && (
                    <button
                      onClick={async () => {
                        try {
                          await returnBorrow(borrow.id);
                          setBorrows((prev) =>
                            prev.map((b) =>
                              b.id === borrow.id
                                ? { ...b, status: "returned", return_date: new Date().toISOString().split("T")[0] }
                                : b
                            )
                          );
                        } catch (err) {
                          alert("Return failed: " + (err.response?.data?.error || err.message));
                        }
                      }}
                      style={{ padding: "6px 10px", background: "#007BFF", color: "#fff", border: "none", cursor: "pointer" }}
                    >
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ padding: "10px", textAlign: "center" }}>
                No borrow records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowRecordTable;
