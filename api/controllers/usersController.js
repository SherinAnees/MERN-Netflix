const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const CryptoJS = require("crypto-js");
//Update user
// @route   PUT /api/users/:id
// @access  Private

const updatedUser = asyncHandler(async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    //Whether the user want to change the password
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();
    }
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(user);
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized");
    }
  } else {
    res.status(403);
    throw new Error("You can update only your Account");
  }
});
//Delete User
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can delete only your account!");
  }
});
//Get
// @route    GET/api/users/find/:id
// @access  Public
const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get All
// @route   GET /api/users
// @access  Public
const getAllUsers = asyncHandler(async (req, res) => {
  const query = req.query.new;
  if (req.user.isAdmin) {
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(10)
        : await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed to see all users!");
  }
});
//Get User Statics
// @route   GET /api/users
// @access  Public
module.exports = { updatedUser, deleteUser, getUser, getAllUsers };
