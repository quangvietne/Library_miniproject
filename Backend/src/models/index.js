const sequelize = require("../config/database");
const User = require("./User");
const Book = require("./Book");
const BorrowRecord = require("./BorrowRecord");
const ActivityLog = require("./ActivityLog");

User.hasMany(BorrowRecord, { foreignKey: "user_id" });
User.hasMany(ActivityLog, { foreignKey: "user_id" });
Book.hasMany(BorrowRecord, { foreignKey: "book_id" });
BorrowRecord.belongsTo(User, { foreignKey: "user_id" });
BorrowRecord.belongsTo(Book, { foreignKey: "book_id" });
ActivityLog.belongsTo(User, { foreignKey: "user_id" });

sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Sync error:", err));

module.exports = { sequelize, User, Book, BorrowRecord, ActivityLog };
