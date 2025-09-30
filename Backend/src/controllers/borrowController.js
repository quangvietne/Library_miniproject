const borrowService = require("../services/borrowService");

exports.createBorrow = async (req, res) => {
  try {
    const borrow = await borrowService.createBorrow(req.body);
    res.status(201).json(borrow);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getBorrowRecords = async (req, res) => {
  try {
    const borrows = await borrowService.getBorrowRecords(req.query);
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
