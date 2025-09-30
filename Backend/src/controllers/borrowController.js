const borrowService = require("../services/borrowService");
const { ActivityLog, User, Book } = require("../models");

exports.createBorrow = async (req, res) => {
  try {
    const payload = {
      user_id: req.user.id,
      book_id: req.body.book_id,
      borrow_date: req.body.borrow_date,
      due_date: req.body.due_date,
    };
    const borrow = await borrowService.createBorrow(payload);
    try {
      await ActivityLog.create({
        user_id: req.user.id,
        action: "borrow",
        details: JSON.stringify({ borrow_id: borrow.id, book_id: borrow.book_id }),
        related_id: borrow.id,
      });
    } catch (e) {}
    res.status(201).json(borrow);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getBorrowRecords = async (req, res) => {
  try {
    const query = req.user.role === "admin" ? req.query : { user_id: req.user.id };
    const borrows = await borrowService.getBorrowRecords(query, { includeNames: true });
    res.json(borrows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBorrow = async (req, res) => {
  try {
    const borrow = await borrowService.updateBorrow(req.params.id, req.body);
    if (!borrow)
      return res.status(404).json({ error: "Borrow record not found" });
    res.json(borrow);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.returnBorrow = async (req, res) => {
  try {
    const borrow = await borrowService.returnBorrow(req.params.id);
    if (!borrow)
      return res.status(404).json({ error: "Borrow record not found" });
    try {
      await ActivityLog.create({
        user_id: req.user.id,
        action: "return",
        details: JSON.stringify({ borrow_id: borrow.id, book_id: borrow.book_id }),
        related_id: borrow.id,
      });
    } catch (e) {}
    res.json(borrow);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteBorrow = async (req, res) => {
  try {
    const borrow = await borrowService.deleteBorrow(req.params.id);
    if (!borrow)
      return res.status(404).json({ error: "Borrow record not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
