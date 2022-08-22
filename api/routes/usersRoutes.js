const express = require("express");
const {
  updatedUser,
  deleteUser,
  getUser,
  getAllUsers,
} = require("../controllers/usersController");
const { verify } = require("../middleware/authMiddleware");
const router = express.Router();
router.put("/:id", verify, updatedUser);
router.delete("/:id", verify, deleteUser);
router.get("/find/:id", getUser);
router.get("/", verify, getAllUsers);
module.exports = router;
