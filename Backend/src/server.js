const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize } = require("./models");

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(require("./middleware/logger")); // Sử dụng middleware logger

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/borrows", require("./routes/borrowRoutes"));

const PORT = process.env.PORT || 5000;
sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL connected");
    app.listen(PORT, () => console.log(`Server on port ${PORT}`));
  })
  .catch((err) => console.error("DB error:", err));
