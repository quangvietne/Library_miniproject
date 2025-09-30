import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Login from "./components/Auth/Login.jsx";
import Register from "./components/Auth/Register.jsx";
import AdminRegister from "./components/Auth/AdminRegister.jsx";
import BookList from "./components/Books/BookList.jsx";
import BorrowRecordTable from "./components/Borrow/BorrowRecordTable.jsx";

function App() {
  const TopBar = () => {
    const navigate = useNavigate();
    const [token, setToken] = React.useState(() => localStorage.getItem("token"));
    const [role, setRole] = React.useState(null);

    React.useEffect(() => {
      const decodeRole = (jwt) => {
        try {
          if (!jwt) return null;
          const parts = jwt.split(".");
          if (parts.length < 2) return null;
          const json = atob(parts[1]);
          const payload = JSON.parse(json);
          return payload?.role ?? null;
        } catch {
          return null;
        }
      };
      setRole(decodeRole(token));
      const onStorage = (e) => {
        if (e.key === "token") {
          setToken(e.newValue);
          setRole(decodeRole(e.newValue));
        }
      };
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    }, [token]);
    return (
      <div className="topbar">
        <Link className="nav-link" to="/books">Books</Link>
        <Link className="nav-link" to="/borrows">Borrows</Link>
        <div className="spacer" />
        {token ? (
          <button
            className="btn btn-outline logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            title="Đăng xuất"
          >
            Logout{role ? ` (${role})` : ""}
          </button>
        ) : (
          <>
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/register">Register</Link>
          </>
        )}
      </div>
    );
  };
  const Shell = () => {
    const location = useLocation();
    const hideTopBar = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/admin/register";
    return (
      <div className="container">
        {!hideTopBar && <TopBar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/borrows" element={<BorrowRecordTable />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    );
  };
  return (
    <Router>
      <Shell />
    </Router>
  );
}

export default App;

console.log("App.jsx loaded");
