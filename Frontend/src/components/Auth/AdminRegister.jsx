import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerAdmin } from "../../services/api.js";

const AdminRegister = () => {
  const [formData, setFormData] = useState({ username: "", password: "", email: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerAdmin(formData);
      alert("Admin created successfully");
      navigate("/login");
    } catch (err) {
      alert("Đăng ký admin thất bại: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="page-center">
      <div style={{ width: 420 }}>
        <div className="card">
          <h2 className="title" style={{ textAlign: "center" }}>Đăng Ký Admin</h2>
          <p className="subtitle" style={{ textAlign: "center" }}>Tạo tài khoản quản trị cho hệ thống thư viện</p>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input className="input" type="text" placeholder="Tên đăng nhập" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
            <input className="input" type="password" placeholder="Mật khẩu" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            <input className="input" type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <button className="btn btn-success" type="submit">Tạo Admin</button>
            <button className="btn btn-outline" type="button" onClick={() => navigate("/login")}>Về đăng nhập</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;


