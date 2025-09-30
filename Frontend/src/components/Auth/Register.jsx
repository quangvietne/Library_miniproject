import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/api.js";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: "user",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate("/login");
    } catch (err) {
      alert("Registration failed: " + err.response?.data?.error || err.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: "300px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
      }}
    >
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#28A745",
            color: "white",
            border: "none",
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
