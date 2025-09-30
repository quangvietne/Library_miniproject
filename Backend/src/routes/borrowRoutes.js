const express = require("express");
const router = express.Router();
const borrowController = require("../controllers/borrowController");
const auth = require("../middleware/auth");

router.post("/", auth, borrowController.createBorrow);
router.get("/", auth, borrowController.getBorrowRecords);
router.put("/:id", auth, borrowController.updateBorrow);
router.put("/:id/return", auth, borrowController.returnBorrow);
router.delete("/:id", auth, borrowController.deleteBorrow);

module.exports = router;
