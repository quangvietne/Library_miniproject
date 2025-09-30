import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);
export const registerAdmin = (data) => api.post("/auth/register-admin", data);
export const getBooks = (query = {}) => api.get("/books", { params: query });
export const createBook = (data) => api.post("/books", data);
export const updateBook = (id, data) => api.put(`/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/books/${id}`);
export const getBorrows = () => api.get("/borrows");
export const createBorrow = (data) => api.post("/borrows", data);
export const returnBorrow = (id) => api.put(`/borrows/${id}/return`);
