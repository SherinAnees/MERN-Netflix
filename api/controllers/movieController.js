const asyncHandler = require("express-async-handler");
const Movie = require("../models/Movie");

//CREATE
// @route   POST /api/movies
// @access  private

const createMovie = asyncHandler(async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = new Movie(req.body);
    try {
      const savedMovie = await newMovie.save();
      res.status(201).json(savedMovie);
    } catch (err) {
      res.status(500);
      throw new Error(err);
    }
  } else {
    res.status(403);
    throw new Error("You are not allowed!");
  }
});

//UPDATE
// @route   PUT/api/movies/:id
// @access  Private
const updateMovie = asyncHandler(async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedMovie);
    } catch (err) {
      res.status(500);
      throw new Error(err);
    }
  } else {
    res.status(403);
    throw new Error("You are not allowed!");
  }
});

//DELETE
// @route   DELETE/api/movies/:id
// @access  Private
const deleteMovie = asyncHandler(async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await Movie.findByIdAndDelete(req.params.id);
      res.status(200).json("The movie has been deleted...");
    } catch (err) {
      res.status(500);
      throw new Error(err);
    }
  } else {
    res.status(403);
    throw new Error("You are not allowed!");
  }
});

//GET
// @route   GET/api/movies/find/:id
// @access  Private

const getMovie = asyncHandler(async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.status(200).json(movie);
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
});

//GET RANDOM
// @route   GET/api/movies/random
// @access  Private
const getRandomMovie = asyncHandler(async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }
    res.status(200).json(movie);
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
});

//GET ALL
// @route   GET/api/movies/
// @access  Private
const getAllMovies = asyncHandler(async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const movies = await Movie.find();
      res.status(200).json(movies.reverse());
    } catch (err) {
      res.status(500);
      throw new Error(err);
    }
  } else {
    res.status(403);
    throw new Error("You are not allowed!");
  }
});

module.exports = {
  createMovie,
  updateMovie,
  deleteMovie,
  getMovie,
  getRandomMovie,
  getAllMovies,
};
