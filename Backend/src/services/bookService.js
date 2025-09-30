const { Book } = require("../models"); // Import Book từ models/index.js

exports.getAllBooks = async (query) => {
  return await Book.findAll({ where: query });
};

exports.getBookById = async (id) => {
  return await Book.findByPk(id);
};

exports.createBook = async (data) => {
  return await Book.create(data);
};

exports.updateBook = async (id, data) => {
  const book = await Book.findByPk(id);
  if (book) await book.update(data);
  return book;
};

exports.deleteBook = async (id) => {
  const book = await Book.findByPk(id);
  if (book) await book.destroy();
  return book;
};
