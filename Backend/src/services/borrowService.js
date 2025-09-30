const { BorrowRecord, Book, User, sequelize } = require("../models");

exports.createBorrow = async (data) => {
  return await sequelize.transaction(async (t) => {
    const book = await Book.findByPk(data.book_id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!book) {
      throw new Error("Book not found");
    }
    if (book.quantity <= 0) {
      throw new Error("Book out of stock");
    }

    const borrow = await BorrowRecord.create(
      {
        user_id: data.user_id,
        book_id: data.book_id,
        borrow_date: data.borrow_date,
        due_date: data.due_date,
        status: "borrowed",
      },
      { transaction: t }
    );

    await book.update({ quantity: book.quantity - 1 }, { transaction: t });

    return borrow;
  });
};

exports.getBorrowRecords = async (query, options = {}) => {
  if (options.includeNames) {
    return await BorrowRecord.findAll({
      where: query,
      include: [
        { model: User, attributes: ["id", "username", "email"] },
        { model: Book, attributes: ["id", "title", "author"] },
      ],
    });
  }
  return await BorrowRecord.findAll({ where: query });
};

exports.updateBorrow = async (id, data) => {
  const borrow = await BorrowRecord.findByPk(id);
  if (borrow) await borrow.update(data);
  return borrow;
};

exports.deleteBorrow = async (id) => {
  const borrow = await BorrowRecord.findByPk(id);
  if (borrow) await borrow.destroy();
  return borrow;
};

exports.returnBorrow = async (id) => {
  return await sequelize.transaction(async (t) => {
    const borrow = await BorrowRecord.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!borrow) {
      return null;
    }
    if (borrow.status === "returned") {
      return borrow;
    }
    const book = await Book.findByPk(borrow.book_id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!book) {
      throw new Error("Book not found");
    }
    await borrow.update(
      { return_date: new Date(), status: "returned" },
      { transaction: t }
    );
    await book.update({ quantity: book.quantity + 1 }, { transaction: t });
    return borrow;
  });
};
