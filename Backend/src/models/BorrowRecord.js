const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BorrowRecord = sequelize.define(
  "BorrowRecord",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    book_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "books",
        key: "id",
      },
    },
    borrow_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    return_date: {
      type: DataTypes.DATEONLY,
    },
    status: {
      type: DataTypes.ENUM("borrowed", "returned", "overdue"),
      defaultValue: "borrowed",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "borrow_records",
    timestamps: false,
  }
);

module.exports = BorrowRecord;
