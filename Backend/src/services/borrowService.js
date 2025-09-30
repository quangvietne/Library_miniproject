const { BorrowRecord } = require("../models");

exports.createBorrow = async (data) => {
  return await BorrowRecord.create(data);
};

exports.getBorrowRecords = async (query) => {
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
