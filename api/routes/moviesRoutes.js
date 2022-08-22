const express = require("express");
const {
  createMovie,
  updateMovie,
  deleteMovie,
  getAllMovies,
  getMovie,
  getRandomMovie,
} = require("../controllers/movieController");
const { verify } = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/", verify, createMovie);
router.put("/:id", verify, updateMovie);
router.delete("/:id", verify, deleteMovie);
router.get("/find/:id", verify, getMovie);
router.get("/random", verify, getRandomMovie);
router.get("/", verify, getAllMovies);
module.exports = router;
