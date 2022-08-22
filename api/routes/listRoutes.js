const express = require("express");
const {
  createList,
  deleteList,
  getList,
} = require("../controllers/listController");
const { verify } = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/", verify, createList);
router.delete("/:id", verify, deleteList);
router.get("/", verify, getList);

module.exports = router;
