const asyncHandler = require("express-async-handler");
const List = require("../models/List");

//CREATE
// @route   POST/api/list
// @access  Private
const createList = asyncHandler(async (req, res) => {
  if (req.user.isAdmin) {
    const newList = new List(req.body);
    try {
      const savedList = await newList.save();
      res.status(201).json(savedList);
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
// @route   DELETE/api/list/:id
// @access  Private
const deleteList = asyncHandler(async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await List.findByIdAndDelete(req.params.id);
      res.status(201).json("The list has been delete...");
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
// @route   GET/api/list/
// @access  Private
const getList = asyncHandler(async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;
  let list = [];
  try {
    if (typeQuery) {
      if (genreQuery) {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery, genre: genreQuery } },
        ]);
      } else {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery } },
        ]);
      }
    } else {
      list = await List.aggregate([{ $sample: { size: 10 } }]);
    }
    res.status(200).json(list);
  } catch (err) {
    res.status(500);
    j;
    throw new Error(err);
  }
});

module.exports = { createList, deleteList, getList };
