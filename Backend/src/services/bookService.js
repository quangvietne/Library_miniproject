const { Book } = require("../models");

exports.getAllBooks = async (query) => {
  const where = {};
  const { Op } = require("sequelize");
  if (query.title) where.title = { [Op.like]: `%${query.title}%` };
  if (query.author) where.author = { [Op.like]: `%${query.author}%` };
  if (query.category) where.category = { [Op.like]: `%${query.category}%` };
  return await Book.findAll({ where });
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
