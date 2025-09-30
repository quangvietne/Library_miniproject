const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ActivityLog = sequelize.define(
  "ActivityLog",
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
    action: {
      type: DataTypes.ENUM(
        "login",
        "logout",
        "borrow",
        "return",
        "add_book",
        "update_book",
        "delete_book"
      ),
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
    },
    related_id: {
      type: DataTypes.INTEGER,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "activity_logs",
    timestamps: false,
  }
);

module.exports = ActivityLog;
