const express = require("express");
const User = require("../models/user");
const { validateUserRegister } = require("../utils/validate");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

const authRouter = express.Router();

// POST - save the data of user in database
authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, contactNumber } = req.body;

    // Validate the data
    validateUserRegister(req.body);

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 8);

    //Create a new User instance
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      contactNumber,
    });
    await newUser.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(404).send("User creation failed" + err.message);
  }
});

// POST - login the user
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!validator.isEmail(email)) {
      throw new Error("Invalid credentials");
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user?.password);
    if (isPasswordValid) {
      // create JWT Token
      const token = jwt.sign({ _id: user._id.toString() }, "dev@connect1802");
      res.cookie("Token", token);
      res.send({
        message: "Login successful",
        user: user,
      });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(404).send("ERROR:" + err);
  }
});

// POST - logout the user
authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("Token");
    res.send("Logout successful");
  } catch (err) {
    res.status(404).send("ERROR:" + err);
  }
});

module.exports = authRouter;
