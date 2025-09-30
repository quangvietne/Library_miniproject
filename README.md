## Mini Library Management System

Ứng dụng web quản lý thư viện nhỏ gồm Backend (Node.js/Express + Sequelize + MySQL) và Frontend (React + Vite).

### Cấu trúc thư mục

```
Library_miniproject/
  Backend/
    src/
      config/        # Kết nối DB
      controllers/   # Xử lý request/response
      middleware/    # JWT auth, isAdmin
      models/        # Sequelize models
      routes/        # Định nghĩa REST endpoints
      services/      # Nghiệp vụ
      server.js      # App Express
  Frontend/
    src/
      components/    # UI
      services/      # Axios client
      App.jsx, main.jsx
    vite.config.js   # Dev proxy /api -> :5000
```

## 1) Kiến trúc 3 lớp

- Presentation (Frontend)

  - React + Vite, điều hướng tại `Frontend/src/App.jsx`.
  - Giao tiếp API qua `Frontend/src/services/api.js` (axios, Bearer JWT).

- Business Logic (Backend)

  - Controllers: `src/controllers/*.js` gọi services, chuẩn hóa response, ghi `ActivityLog`.
  - Services: `src/services/*.js` hiện thực nghiệp vụ (tìm kiếm, CRUD, mượn/trả trong transaction).
  - Middleware: `auth.js` (xác thực JWT), `isAdmin.js` (phân quyền admin).

- Data Access
  - Sequelize Models: `User`, `Book`, `BorrowRecord`, `ActivityLog` trong `src/models/`.
  - Kết nối MySQL qua `src/config/database.js` (biến môi trường).

## 2) Mô tả lớp (class/model)

- User(id, username, passwordHash, email, role)
- Book(id, title, author, category, isbn, quantity)
- BorrowRecord(id, user_id, book_id, borrow_date, due_date, return_date, status)
- ActivityLog(id, user_id, action, details, related_id, timestamp)

Quan hệ

- User 1–n BorrowRecord (FK `borrow_records.user_id`).
- Book 1–n BorrowRecord (FK `borrow_records.book_id`).
- User 1–n ActivityLog (FK `activity_logs.user_id`).

## 3) Sơ đồ CSDL

-- Database: library_db
CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;

-- Bảng users
DROP TABLE IF EXISTS users;
CREATE TABLE users (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
username VARCHAR(50) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
role ENUM('user','admin') DEFAULT 'user',
created_at DATETIME DEFAULT NULL,
updated_at DATETIME DEFAULT NULL,
PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Bảng books
DROP TABLE IF EXISTS books;
CREATE TABLE books (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
title VARCHAR(255) NOT NULL,
author VARCHAR(255) NOT NULL,
category VARCHAR(100) DEFAULT NULL,
isbn VARCHAR(20) UNIQUE,
quantity INT DEFAULT 0,
description TEXT,
created_at DATETIME DEFAULT NULL,
PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Bảng borrow_records
DROP TABLE IF EXISTS borrow_records;
CREATE TABLE borrow_records (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
user_id INT DEFAULT NULL,
book_id INT DEFAULT NULL,
borrow_date DATE NOT NULL,
due_date DATE NOT NULL,
return_date DATE DEFAULT NULL,
status ENUM('borrowed','returned','overdue') DEFAULT 'borrowed',
created_at DATETIME DEFAULT NULL,
updated_at DATETIME DEFAULT NULL,
PRIMARY KEY (id),
KEY idx_borrow_user (user_id),
KEY idx_borrow_book (book_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Bảng activity_logs
DROP TABLE IF EXISTS activity_logs;
CREATE TABLE activity_logs (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
user_id INT DEFAULT NULL,
action ENUM('login','logout','borrow','return','add_book','update_book','delete_book') NOT NULL,
details TEXT,
related_id INT DEFAULT NULL,
timestamp DATETIME DEFAULT NULL,
PRIMARY KEY (id),
KEY idx_log_user (user_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

## 4) REST API chính

- Auth

  - POST `/api/auth/register` — đăng ký user
  - POST `/api/auth/register-admin` — đăng ký admin
  - POST `/api/auth/login` — đăng nhập, trả `{ token }`

- Books (cần JWT; các thao tác ghi yêu cầu admin)

  - GET `/api/books?title=&author=&category=` — tìm kiếm
  - GET `/api/books/:id` — xem chi tiết
  - POST `/api/books` — tạo sách (admin)
  - PUT `/api/books/:id` — cập nhật (admin)
  - DELETE `/api/books/:id` — xóa (admin)

- Borrows (cần JWT)
  - GET `/api/borrows` — user xem của mình; admin xem tất cả
  - POST `/api/borrows` — mượn sách
  - PUT `/api/borrows/:id/return` — trả sách
  - PUT `/api/borrows/:id` — cập nhật record
  - DELETE `/api/borrows/:id` — xóa record

## 5) Hướng dẫn chạy

### Backend

1. Cấu hình MySQL và tạo DB ( giống mục 3).
2. Tạo file `.env` trong `Backend/`:

```
PORT=5000
MYSQL_HOST=localhost
MYSQL_DATABASE=library_db
MYSQL_USER=<your_mysql_user>
MYSQL_PASSWORD=<your_mysql_password>
JWT_SECRET=<a_strong_secret>
```

3. Cài đặt & chạy:

```
npm install
npm start
```

Mặc định chạy tại `http://localhost:5000`.

Ghi chú: Dự án sử dụng Sequelize Models, giả định bảng đã tồn tại theo sơ đồ trên. Có thể bổ sung sync/migration nếu muốn tự tạo bảng.

### Frontend

1. Cài đặt & chạy:

```
npm install
npm run dev
```

2. Mở `http://localhost:5173`. Vite đã cấu hình proxy `/api` → `http://localhost:5000`.

## 6) Kiểm thử nhanh

- Đăng ký user tại http://localhost:5173/register .
- Đăng ký admin tại `http://localhost:5173/admin/register`.
- Đăng nhập tại `http://localhost:5173/login`, xác thực bằng JWT lưu trong `localStorage`.
- Tìm kiếm sách theo `title/author/category` tại trang Books.
- Admin thêm/sửa/xóa sách ở trang Books
- Mượn/Trả: tạo borrow và trả bằng các nút tương ứng , quantity tự động giảm/tăng qua transaction.
- Xem log hoạt động (ai mượn, mượn khi nào, trả khi nào) trong phần borrow
