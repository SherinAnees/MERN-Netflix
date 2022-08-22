const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
//Register user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  //   const newUser = new User({
  //     username: req.body.username,
  //     email: req.body.email,
  //     password: req.body.password,
  //   });

  //   try {
  //     const user = await newUser.save();
  //     res.status(201).json(user);
  //   } catch (error) {
  //     res.status(400);
  //     throw new Error("Invalid user data");
  //   }

  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  //to check whether the user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  //to encrypt password
  const encryptedPasswprd = CryptoJS.AES.encrypt(
    password,
    process.env.SECRET_KEY
  ).toString();

  //Create new user
  const user = await User.create({
    username,
    email,
    password: encryptedPasswprd,
  });
  if (user) {
    res.status(201).json(user);
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});
//Login user
// @route   POST /api/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check for user email
  const user = await User.findOne({ email });
  !user && res.status(401).json("Wrong password or username!");

  //check for password match
  const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
  const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

  if (user && originalPassword === password) {
    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id, user.isAdmin),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Username or Password");
  }
});
const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_KEY, {
    expiresIn: "30d",
  });
};
module.exports = { registerUser, loginUser };
