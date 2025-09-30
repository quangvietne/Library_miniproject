const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

router.get("/", auth, bookController.getAllBooks);
router.get("/:id", auth, bookController.getBookById);
router.post("/", auth, isAdmin, bookController.createBook);
router.put("/:id", auth, isAdmin, bookController.updateBook);
router.delete("/:id", auth, isAdmin, bookController.deleteBook);

module.exports = router;
