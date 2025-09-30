const bookService = require("../services/bookService");
const { ActivityLog } = require("../models");

exports.getAllBooks = async (req, res) => {
  try {
    const books = await bookService.getAllBooks(req.query);
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createBook = async (req, res) => {
  try {
    const book = await bookService.createBook(req.body);
    try {
      await ActivityLog.create({
        user_id: req.user.id,
        action: "add_book",
        details: JSON.stringify({ id: book.id }),
        related_id: book.id,
      });
    } catch (e) {}
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await bookService.updateBook(req.params.id, req.body);
    if (!book) return res.status(404).json({ error: "Book not found" });
    try {
      await ActivityLog.create({
        user_id: req.user.id,
        action: "update_book",
        details: JSON.stringify({ id: book.id }),
        related_id: book.id,
      });
    } catch (e) {}
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await bookService.deleteBook(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    try {
      await ActivityLog.create({
        user_id: req.user.id,
        action: "delete_book",
        details: JSON.stringify({ id: req.params.id }),
        related_id: Number(req.params.id),
      });
    } catch (e) {}
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
