import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login.jsx";
import Register from "./components/Auth/Register.jsx";
import BookList from "./components/Books/BookList.jsx";
import BorrowRecordTable from "./components/Borrow/BorrowRecordTable.jsx";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/borrows" element={<BorrowRecordTable />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

console.log("App.jsx loaded");
